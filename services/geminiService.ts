import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to determine condition based on text
const getCondition = (text: string): 'New' | 'Very Good' | 'Good' | 'Fair' => {
  const lower = text.toLowerCase();
  if (lower.includes('neuf') || lower.includes('new') || lower.includes('tag')) return 'New';
  if (lower.includes('très bon') || lower.includes('very good')) return 'Very Good';
  if (lower.includes('bon') || lower.includes('good')) return 'Good';
  return 'Fair';
};

export const searchVintedDeals = async (
  brands: string[],
  categories: string[],
  sizes: string[],
  maxPrice: string
): Promise<Product[]> => {
  try {
    // Optimized prompt for Flash model speed
    const brandStr = brands.length > 0 ? brands.join(" OR ") : "popular brands";
    const catStr = categories.length > 0 ? categories.join(" OR ") : "clothes";
    
    const prompt = `
      Find 4 recent Vinted listings (vinted.fr/com).
      Query: "${brandStr} ${catStr} ${sizes.join(" ")} under ${maxPrice} eur"
      
      Return JSON array:
      [{"title": "Item Name", "price": 20, "link": "https://vinted...", "description": "cond..."}]
      
      Strict JSON. No markdown.
    `;

    // Use Flash model for speed (approx 3x faster than Pro)
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { role: 'user', parts: [{ text: prompt }] },
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });

    let text = response.text;
    if (!text) return [];
    
    // Fast cleanup
    if (text.startsWith('```')) {
        text = text.replace(/```json|```/g, '').trim();
    }
    
    const data = JSON.parse(text);
    
    if (!Array.isArray(data)) return [];

    return data.map((item: any, index: number) => ({
      id: `real-${Date.now()}-${index}`,
      title: item.title || `Item ${index}`,
      brand: brands.length === 1 ? brands[0] : (item.title?.split(' ')[0] || 'Unknown'),
      size: sizes.length === 1 ? sizes[0] : 'See Listing',
      price: item.price || 0,
      currency: 'EUR',
      // High-performance placeholder since we can't scrape images client-side
      imageUrl: `https://source.unsplash.com/random/400x400/?fashion,${item.title?.split(' ')[0] || 'clothing'}&sig=${index}${Date.now()}`, 
      condition: getCondition(item.description || ''),
      timestamp: Date.now(),
      viewCount: Math.floor(Math.random() * 50) + 5,
      isSnipe: (item.price || 0) < (parseInt(maxPrice) * 0.8),
      link: item.link
    }));

  } catch (error) {
    console.error("Fast Scan Error:", error);
    return [];
  }
};

export const analyzeItemDeal = async (
  description: string, 
  price: number,
  imageBase64?: string,
  mimeType: string = 'image/jpeg'
): Promise<AnalysisResult> => {
  try {
    const prompt = `
      Analyze resale value for: "${description}" at ${price} EUR.
      Search current markets.
      Return JSON: { "score": 0-100, "estimatedValue": number, "reasoning": "string", "isGoodDeal": boolean }
    `;

    const parts: any[] = [{ text: prompt }];

    if (imageBase64) {
      parts.unshift({
        inlineData: {
          data: imageBase64,
          mimeType: mimeType
        }
      });
    }

    // Use Flash for text-only analysis, Pro for image analysis
    const model = imageBase64 ? 'gemini-3-pro-image-preview' : 'gemini-3-flash-preview';

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });

    let text = response.text;
    if (!text) throw new Error("No response");
    
    text = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(text) as AnalysisResult;

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      result.searchLinks = chunks
        .map((c: any) => c.web ? { title: c.web.title, url: c.web.uri } : null)
        .filter((l: any) => l !== null) as Array<{title: string, url: string}>;
    }

    return result;

  } catch (error) {
    console.error("Analysis Error", error);
    return {
      score: 0,
      estimatedValue: 0,
      reasoning: "Analysis failed. Try again.",
      isGoodDeal: false
    };
  }
};