import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ExternalLink, Clock, Zap, Loader, Bell, BellRing, Terminal, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { MOCK_BRANDS, MOCK_SIZES } from '../constants';
import { searchVintedDeals } from '../services/geminiService';
import { MultiSelect } from './MultiSelect';

interface LiveFeedProps {
  isSniperActive: boolean;
  setIsSniperActive: (active: boolean) => void;
  onBuy: (product: Product) => void;
}

// Simulated Console Line Interface
const ConsoleLog: React.FC<{ logs: string[] }> = ({ logs }) => (
  <div className="absolute inset-0 bg-black/90 z-20 p-4 font-mono text-xs flex flex-col justify-end pointer-events-none">
    {logs.map((log, i) => (
      <div key={i} className={`mb-1 ${log.includes('SUCCESS') ? 'text-green-400' : log.includes('ERROR') ? 'text-red-400' : 'text-gray-300'}`}>
        <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span> {log}
      </div>
    ))}
    <div className="animate-pulse text-vinted-teal">_</div>
  </div>
);

const LiveFeed: React.FC<LiveFeedProps> = ({ isSniperActive, setIsSniperActive, onBuy }) => {
  const [items, setItems] = useState<Product[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Buying State
  const [buyingItem, setBuyingItem] = useState<string | null>(null);
  const [buyLogs, setBuyLogs] = useState<string[]>([]);

  // Notification State
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  // Multi-Select Monitor Settings
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['Nike']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Hoodie']);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['L']);
  const [maxPrice, setMaxPrice] = useState('30');

  const availableCategories = ['Hoodie', 'T-Shirt', 'Jacket', 'Pants', 'Shoes', 'Cap', 'Bag', 'Accessory'];

  // Request Notification Permissions
  const enableNotifications = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications");
      return;
    }
    
    if (Notification.permission === "granted") {
      setNotificationsEnabled(true);
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        new Notification("SniperAI", { body: "Notifications enabled for new deals!" });
      }
    }
  };

  const handleBuyClick = (item: Product) => {
      setBuyingItem(item.id);
      setBuyLogs(['Initializing checkout sequence...']);
      
      const sequence = [
          `Target acquired: ${item.title.substring(0, 20)}...`,
          `Checking availability for item ID: ${item.id.split('-')[1]}...`,
          `Availability confirmed. Status: OK`,
          `Generating checkout token...`,
          `Applying session cookies...`,
          `Sending add_to_cart request...`,
          `SUCCESS: Item added to cart.`,
          `Redirecting to payment gateway...`
      ];

      let i = 0;
      const interval = setInterval(() => {
          setBuyLogs(prev => [...prev, sequence[i]]);
          i++;
          if (i >= sequence.length) {
              clearInterval(interval);
              setTimeout(() => {
                  setBuyingItem(null);
                  setBuyLogs([]);
                  onBuy(item);
              }, 800);
          }
      }, 300); // 300ms per step for effect
  };

  const performScan = async () => {
    if (isScanning) return;
    setIsScanning(true);
    
    try {
      const newItems = await searchVintedDeals(selectedBrands, selectedCategories, selectedSizes, maxPrice);
      
      if (newItems.length > 0) {
        setItems(prev => {
          const existingLinks = new Set(prev.map(i => i.link));
          const uniqueNewItems = newItems.filter(i => i.link && !existingLinks.has(i.link));
          
          if (uniqueNewItems.length > 0 && notificationsEnabled && isSniperActive) {
             const item = uniqueNewItems[0];
             new Notification("New Deal Found! 🎯", {
               body: `${item.title} - ${item.price}€`,
               icon: '/vite.svg'
             });
          }

          return [...uniqueNewItems, ...prev].slice(0, 50);
        });
      }
    } catch (error) {
      console.error("Scan failed", error);
    } finally {
      setIsScanning(false);
    }
  };

  // Auto-Scan Loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isSniperActive) {
      performScan();
      // Reduced interval to 6s for "Turbo" feel
      interval = setInterval(() => {
        performScan();
      }, 6000); 
    }

    return () => clearInterval(interval);
  }, [isSniperActive, selectedBrands, selectedCategories, selectedSizes, maxPrice, notificationsEnabled]);

  return (
    <div className="h-full flex flex-col p-6 max-w-7xl mx-auto w-full gap-6">
      
      {/* Control Panel */}
      <div className="bg-vinted-card border border-gray-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
           
           {/* Header & Status */}
           <div className="flex-shrink-0">
             <h2 className="text-white font-bold text-lg flex items-center gap-2">
               <Zap size={18} className={isSniperActive ? "text-vinted-teal animate-pulse" : "text-gray-500"} /> 
               {isSniperActive ? 'Turbo Scanner Active' : 'Scanner Standby'}
               {isSniperActive && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-mono animate-pulse">LIVE</span>}
             </h2>
             <div className="flex items-center gap-2 mt-2">
                <button 
                  onClick={enableNotifications}
                  className={`text-xs flex items-center gap-1 px-2 py-1 rounded border transition-colors
                    ${notificationsEnabled 
                      ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}`}
                >
                  {notificationsEnabled ? <BellRing size={12} /> : <Bell size={12} />}
                  {notificationsEnabled ? 'Notify On' : 'Enable Notify'}
                </button>
             </div>
           </div>
           
           {/* Filters */}
           <div className="flex flex-wrap items-end gap-3 w-full lg:w-auto">
              <MultiSelect 
                label="Brands" 
                options={MOCK_BRANDS} 
                selected={selectedBrands} 
                onChange={setSelectedBrands} 
              />

              <MultiSelect 
                label="Categories" 
                options={availableCategories} 
                selected={selectedCategories} 
                onChange={setSelectedCategories} 
              />
              
              <MultiSelect 
                label="Sizes" 
                options={MOCK_SIZES} 
                selected={selectedSizes} 
                onChange={setSelectedSizes} 
              />
              
              <div className="min-w-[80px]">
                <label className="text-xs text-gray-500 block mb-1">Max €</label>
                <input 
                  type="number" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-vinted-dark border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-vinted-teal outline-none min-h-[38px]"
                />
              </div>

              <button 
                onClick={() => setIsSniperActive(!isSniperActive)}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-lg min-w-[140px] justify-center min-h-[38px]
                  ${isSniperActive 
                    ? 'bg-red-500/10 text-red-500 border border-red-500/50' 
                    : 'bg-vinted-teal text-black hover:bg-cyan-300'
                  }`}
              >
                {isSniperActive ? <><Pause size={16} /> Stop</> : <><Play size={16} /> Turbo Scan</>}
              </button>
           </div>
        </div>
      </div>

      {/* Feed Grid */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-2"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
          
          {isSniperActive && isScanning && items.length === 0 && (
            <div className="col-span-full h-64 flex flex-col items-center justify-center text-vinted-teal">
              <Loader size={48} className="animate-spin mb-4" />
              <p className="font-bold">Turbo Scanning...</p>
              <p className="text-sm text-gray-500 max-w-md text-center">
                 Accessing Vinted Index via Gemini Flash...
              </p>
            </div>
          )}

          {!isSniperActive && items.length === 0 && (
            <div className="col-span-full h-64 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-800 rounded-2xl">
              <Zap size={48} className="mb-4 opacity-20" />
              <p className="font-medium">Bot Ready</p>
              <p className="text-sm">Filters applied. Waiting for start command.</p>
            </div>
          )}

          {items.map((item) => (
            <div 
              key={item.id} 
              className={`relative bg-vinted-card border rounded-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl group
                ${item.isSnipe ? 'border-vinted-teal/50 shadow-[0_0_10px_rgba(9,177,186,0.15)]' : 'border-gray-800'}
              `}
            >
              {buyingItem === item.id && <ConsoleLog logs={buyLogs} />}

              {item.isSnipe && (
                <div className="absolute top-2 left-2 bg-vinted-teal text-black text-xs font-bold px-2 py-1 rounded shadow-lg z-10 flex items-center gap-1">
                   <Zap size={10} fill="black" /> SNIPE
                </div>
              )}
              
              <div className="h-48 overflow-hidden relative bg-gray-900 group">
                 <img 
                    src={`https://source.unsplash.com/random/400x400/?fashion,${item.title.split(' ')[0]}&sig=${item.id}`} 
                    alt="Generic Placeholder" 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" 
                 />
                 
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <p className="text-gray-400 text-[10px] text-center mb-2 px-2 bg-black/60 rounded backdrop-blur-sm">
                      {item.title}
                    </p>
                    <button 
                      onClick={() => handleBuyClick(item)}
                      className="bg-vinted-teal text-black font-bold py-2 px-6 rounded-lg flex items-center gap-2 hover:bg-white transition-all transform scale-95 group-hover:scale-100 text-sm shadow-lg shadow-cyan-900/50"
                    >
                      <Terminal size={14} /> AUTO-BUY
                    </button>
                 </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="overflow-hidden">
                    <h3 className="text-white font-medium truncate pr-2" title={item.title}>{item.title}</h3>
                    <p className="text-gray-400 text-xs truncate uppercase tracking-wider font-bold text-gray-500">{item.brand} • {item.size}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xl font-black text-white block">{item.price} €</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mt-3 border-t border-gray-800 pt-3">
                  <span className="flex items-center gap-1 text-gray-600"><Clock size={12} /> {new Date(item.timestamp).toLocaleTimeString()}</span>
                  <a href={item.link} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white flex items-center gap-1">
                     View <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;