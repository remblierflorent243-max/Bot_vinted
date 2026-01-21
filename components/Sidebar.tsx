import React from 'react';
import { LayoutDashboard, Zap, Search, Settings, ShoppingBag, LogOut, User } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  username: string | null;
  onConnect: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, username, onConnect }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'live', label: 'Live Sniper', icon: Zap },
    { id: 'analyzer', label: 'AI Analyzer', icon: Search },
    { id: 'settings', label: 'Configuration', icon: Settings },
  ];

  return (
    <div className="w-20 md:w-64 bg-vinted-card border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300">
      <div className="p-6 flex items-center justify-center md:justify-start gap-3">
        <div className="w-8 h-8 bg-vinted-teal rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(9,177,186,0.5)]">
          <span className="font-bold text-white text-lg">V</span>
        </div>
        <span className="hidden md:block font-bold text-xl tracking-tight text-white">
          Sniper<span className="text-vinted-teal">AI</span>
        </span>
      </div>

      <nav className="flex-1 mt-8 px-2 md:px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 md:px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-vinted-teal/10 text-vinted-teal border border-vinted-teal/20 shadow-sm' 
                  : 'text-gray-400 hover:bg-vinted-hover hover:text-white'
                }`}
            >
              <Icon size={22} className={isActive ? "animate-pulse" : ""} />
              <span className="hidden md:block font-medium">{item.label}</span>
              {item.id === 'live' && (
                <span className="hidden md:flex ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse-fast"></span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className={`rounded-xl p-4 bg-vinted-dark border border-gray-800 transition-all ${username ? 'border-green-500/30 bg-green-900/10' : ''}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 ${username ? 'border-green-500/50 bg-green-500/10 text-green-500' : 'border-gray-700 bg-gray-800 text-gray-400'}`}>
              {username ? (
                <img src={`https://ui-avatars.com/api/?name=${username}&background=09b1ba&color=fff`} alt={username} className="w-full h-full" />
              ) : (
                <User size={20} />
              )}
            </div>
            <div className="hidden md:block overflow-hidden">
              <p className="text-sm font-medium text-white truncate max-w-[120px]">
                {username || 'Guest User'}
              </p>
              <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                {username ? (
                  <span className="flex items-center gap-1 text-green-500">● Connected</span>
                ) : (
                  'Not connected'
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onConnect}
            className={`w-full py-2 px-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2
              ${username 
                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                : 'bg-vinted-teal text-black hover:bg-cyan-400'
              }`}
          >
            {username ? (
              <>
                <LogOut size={16} /> <span className="hidden md:inline">Disconnect</span>
              </>
            ) : (
              <>
                <ShoppingBag size={16} /> <span className="hidden md:inline">Connect Vinted</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
