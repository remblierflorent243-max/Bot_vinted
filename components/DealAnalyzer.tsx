import React, { useState } from 'react';
import { Upload, Sparkles, AlertCircle, CheckCircle, XCircle, ExternalLink, Search } from 'lucide-react';
import { analyzeItemDeal } from '../services/geminiService';
import { AnalysisResult } from '../types';

const DealAnalyzer: React.FC = () => {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!description && !image) return;
    setLoading(true);
    setResult(null);

    const base64Data = image ? image.split(',')[1] : undefined;

    const analysis = await analyzeItemDeal(
      description,
      parseFloat(price) || 0,
      base64Data
    );

    setResult(analysis);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Sparkles className="text-vinted-teal" /> Pro Market Analyzer
        </h1>
        <p className="text-gray-400">
          Uses <span className="text-white font-bold">Google Search Grounding</span> to find real market comps and validate resale value.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-vinted-card border border-gray-800 rounded-xl p-6 shadow-lg h-fit">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Item Screenshot</label>
              <div className="relative border-2 border-dashed border-gray-700 rounded-lg p-6 hover:border-vinted-teal transition-colors group text-center cursor-pointer bg-vinted-dark/50">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {image ? (
                  <img src={image} alt="Preview" className="h-48 mx-auto object-contain rounded shadow-md" />
                ) : (
                  <div className="flex flex-col items-center py-4">
                    <Upload className="text-gray-500 group-hover:text-vinted-teal mb-2 transition-colors" size={32} />
                    <span className="text-sm text-gray-500">Drop image here</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Keywords / Title</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Arc'teryx Beta LT Jacket Black Size M..."
                className="w-full bg-vinted-dark border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-vinted-teal h-20 resize-none placeholder-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Listing Price (€)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full bg-vinted-dark border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-vinted-teal placeholder-gray-600"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || (!image && !description)}
              className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg
                ${loading 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-vinted-teal hover:bg-cyan-400 text-black'
                }`}
            >
              {loading ? (
                <>Searching Market <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div></>
              ) : (
                <>Check Market Value <Search size={18} /></>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex flex-col gap-4">
          {!result && !loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-600 border border-gray-800 border-dashed rounded-xl p-8 bg-vinted-card/30">
              <Sparkles size={48} className="mb-4 opacity-20" />
              <p className="text-lg">Waiting for input...</p>
              <p className="text-sm mt-2 max-w-xs text-center">Upload an item to see real-time price comparisons from the web.</p>
            </div>
          )}

          {result && (
            <div className="space-y-4 animate-slide-in">
              {/* Score Card */}
              <div className={`p-6 rounded-xl border flex items-center justify-between relative overflow-hidden
                ${result.score > 70 
                  ? 'bg-gradient-to-br from-green-900/40 to-black border-green-500/50' 
                  : result.score > 40 ? 'bg-gradient-to-br from-yellow-900/40 to-black border-yellow-500/50' : 'bg-gradient-to-br from-red-900/40 to-black border-red-500/50'
                }`}>
                <div className="relative z-10">
                  <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider mb-1">Flip Potential</h3>
                  <div className={`text-5xl font-black tracking-tighter ${result.score > 70 ? 'text-green-400' : result.score > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {result.score}<span className="text-2xl opacity-60">/100</span>
                  </div>
                </div>
                {result.isGoodDeal 
                  ? <CheckCircle size={64} className="text-green-500 opacity-20 absolute right-4 top-1/2 -translate-y-1/2" /> 
                  : <XCircle size={64} className="text-red-500 opacity-20 absolute right-4 top-1/2 -translate-y-1/2" />
                }
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-vinted-card border border-gray-800 rounded-xl p-5">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Estimated Market Value</p>
                    <p className="text-2xl font-bold text-white">€{result.estimatedValue}</p>
                 </div>
                 <div className="bg-vinted-card border border-gray-800 rounded-xl p-5">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Projected Profit</p>
                    <p className={`text-2xl font-bold ${result.estimatedValue - (parseFloat(price) || 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {result.estimatedValue - (parseFloat(price) || 0) > 0 ? '+' : ''}
                      €{(result.estimatedValue - (parseFloat(price) || 0)).toFixed(2)}
                    </p>
                 </div>
              </div>

              {/* Reasoning */}
              <div className="bg-vinted-card border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <AlertCircle size={18} className="text-vinted-teal" /> 
                  AI Analysis
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {result.reasoning}
                </p>
              </div>

              {/* Real Market Links (Grounding) */}
              {result.searchLinks && result.searchLinks.length > 0 && (
                <div className="bg-vinted-card border border-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                     <Search size={16} className="text-blue-400" /> Comparable Items Found
                  </h3>
                  <div className="space-y-2">
                    {result.searchLinks.slice(0, 3).map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg bg-vinted-dark hover:bg-gray-800 border border-gray-800 hover:border-gray-600 transition-all group"
                      >
                        <span className="text-sm text-gray-300 truncate w-[90%] group-hover:text-vinted-teal transition-colors">
                          {link.title}
                        </span>
                        <ExternalLink size={14} className="text-gray-500 group-hover:text-white" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealAnalyzer;