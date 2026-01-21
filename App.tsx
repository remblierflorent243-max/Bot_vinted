import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LiveFeed from './components/LiveFeed';
import DealAnalyzer from './components/DealAnalyzer';
import { LoginModal } from './components/LoginModal';
import { WithdrawModal } from './components/WithdrawModal';
import { Product } from './types';
import { Settings, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSniperActive, setIsSniperActive] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(450.20);
  
  // Fake Stats
  const [stats, setStats] = useState({
    totalProfit: 1240.50,
    itemsSniped: 24,
    activeMonitors: 3
  });

  // Load auth state from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('vinted_username');
    if (savedUser) {
      setUsername(savedUser);
    }
  }, []);

  const handleLogin = (name: string) => {
    setUsername(name);
    localStorage.setItem('vinted_username', name);
    // In a real app, you would also securely store the session cookie here
  };

  const handleLogout = () => {
    setUsername(null);
    localStorage.removeItem('vinted_username');
  };

  const toggleConnect = () => {
    if (username) {
      const confirmLogout = window.confirm("Disconnect from Vinted account?");
      if (confirmLogout) handleLogout();
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleWithdraw = (amount: number, email: string) => {
    setWalletBalance(prev => prev - amount);
    // Here you would typically notify the user via a toast notification
    console.log(`Withdrawn ${amount} to ${email}`);
  };

  const handleBuy = (product: Product) => {
    if (!username) {
      setIsLoginModalOpen(true);
      return;
    }
    
    // The "Buy Console" animation in LiveFeed handles the delay. 
    // This function is called AFTER the console animation finishes.
    
    if (product.link) {
        window.open(product.link, '_blank');
        setStats(prev => ({
            ...prev,
            itemsSniped: prev.itemsSniped + 1,
            totalProfit: prev.totalProfit + (Math.random() * 15)
        }));
    } else {
        alert(`Simulated purchase for ${product.title} initiated!`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0e1111]">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        username={username}
        onConnect={toggleConnect}
      />
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        balance={walletBalance}
        onConfirm={handleWithdraw}
      />

      <main className="flex-1 md:ml-64 transition-all duration-300">
        {/* Top Disclaimer */}
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 p-2 text-center text-xs text-yellow-500 flex items-center justify-center gap-2">
            <AlertTriangle size={14} /> 
            <span>PROTOTYPE MODE: No actual purchases are executed automatically. Automation violates Vinted Terms of Service.</span>
        </div>

        <div className="h-[calc(100vh-40px)] overflow-y-auto">
          {activeTab === 'dashboard' && (
             <Dashboard 
                stats={stats} 
                username={username} 
                walletBalance={walletBalance} 
                onWithdraw={() => setIsWithdrawModalOpen(true)}
             />
          )}
          
          {activeTab === 'live' && (
            <LiveFeed 
              isSniperActive={isSniperActive} 
              setIsSniperActive={setIsSniperActive}
              onBuy={handleBuy}
            />
          )}

          {activeTab === 'analyzer' && <DealAnalyzer />}

          {activeTab === 'settings' && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
               <Settings size={64} className="mb-4 opacity-20" />
               <h2 className="text-xl font-medium text-white">Configuration</h2>
               <p className="mt-2 text-sm max-w-md text-center">
                 Adjust webhook URLs, max price filters, and preferred brands here.
                 (Settings module disabled in demo)
               </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;