import React, { useState } from 'react';
import { X, ShieldCheck, Cookie, User, Server, Globe, Settings2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [cookie, setCookie] = useState('');
  const [proxy, setProxy] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setIsLoading(true);
    // Simulate complex handshake and verification
    setTimeout(() => {
      setIsLoading(false);
      onLogin(username);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#121415] border border-gray-700 w-full max-w-lg rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-0 relative animate-slide-in overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#181a1b] p-6 border-b border-gray-800 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="text-vinted-teal" /> Vinted API Bridge
            </h2>
            <p className="text-sm text-gray-400 mt-1">Establish a secure connection for sniping.</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Main Credentials */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Account Credentials</label>
              <div className="space-y-3">
                <div className="relative group">
                  <User size={16} className="absolute left-3 top-3 text-gray-500 group-focus-within:text-vinted-teal transition-colors" />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Vinted Username"
                    className="w-full bg-[#0e1111] border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:border-vinted-teal focus:ring-1 focus:ring-vinted-teal outline-none transition-all"
                    required
                  />
                </div>
                <div className="relative group">
                  <Cookie size={16} className="absolute left-3 top-3 text-gray-500 group-focus-within:text-vinted-teal transition-colors" />
                  <input 
                    type="password" 
                    value={cookie}
                    onChange={(e) => setCookie(e.target.value)}
                    placeholder="Session Cookie (_vinted_fr_session)"
                    className="w-full bg-[#0e1111] border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:border-vinted-teal focus:ring-1 focus:ring-vinted-teal outline-none transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Toggle */}
            <div>
              <button 
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-vinted-teal transition-colors"
              >
                <Settings2 size={14} /> {showAdvanced ? 'Hide Advanced Config' : 'Show Advanced Config (Proxies)'}
              </button>

              {showAdvanced && (
                <div className="mt-3 space-y-3 p-4 bg-black/20 rounded-xl border border-gray-800 animate-in slide-in-from-top-2">
                   <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Residential Proxy</label>
                      <div className="relative">
                        <Server size={14} className="absolute left-3 top-2.5 text-gray-600" />
                        <input 
                          type="text" 
                          value={proxy}
                          onChange={(e) => setProxy(e.target.value)}
                          placeholder="ip:port:user:pass"
                          className="w-full bg-[#0e1111] border border-gray-700 rounded-lg py-2 pl-9 pr-4 text-gray-300 text-xs focus:border-vinted-teal outline-none font-mono"
                        />
                      </div>
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">User Agent Spoofing</label>
                      <div className="relative">
                        <Globe size={14} className="absolute left-3 top-2.5 text-gray-600" />
                        <select className="w-full bg-[#0e1111] border border-gray-700 rounded-lg py-2 pl-9 pr-4 text-gray-300 text-xs focus:border-vinted-teal outline-none appearance-none">
                           <option>Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)...</option>
                           <option>Mozilla/5.0 (Windows NT 10.0; Win64; x64)...</option>
                           <option>Vinted/22.4 (Android; Pixel 7 Pro)</option>
                        </select>
                      </div>
                   </div>
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-vinted-teal text-black font-bold py-3.5 rounded-xl hover:bg-cyan-400 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(9,177,186,0.2)] hover:shadow-[0_0_30px_rgba(9,177,186,0.4)]"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Verifying Credentials...
                </>
              ) : (
                'CONNECT ACCOUNT'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};