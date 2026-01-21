export interface Product {
  id: string;
  title: string;
  brand: string;
  size: string;
  price: number;
  currency: string;
  imageUrl: string;
  condition: 'New' | 'Very Good' | 'Good' | 'Fair';
  timestamp: number;
  viewCount: number;
  isSnipe: boolean; // If it's considered a "steal"
  link?: string; // Real URL to the item
}

export interface AnalyticsData {
  name: string;
  profit: number;
  snipes: number;
}

export interface AnalysisResult {
  score: number; // 0-100
  estimatedValue: number;
  reasoning: string;
  isGoodDeal: boolean;
  searchLinks?: Array<{
    title: string;
    url: string;
  }>;
}