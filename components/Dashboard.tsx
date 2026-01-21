import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, DollarSign, Package, Activity, Star, Wallet, ShoppingCart, MapPin } from 'lucide-react';
import { AnalyticsData } from '../types';

interface DashboardProps {
  stats: {
    totalProfit: number;
    itemsSniped: number;
    activeMonitors: number;
  };
  username: string | null;
  walletBalance: number;
  onWithdraw: () => void;
}

const data: AnalyticsData[] = [
  { name: 'Mon', profit: 40, snipes: 2 },
  { name: 'Tue', profit: 30, snipes: 1 },
  { name: 'Wed', profit: 20, snipes: 3 },
  { name: 'Thu', profit: 65, snipes: 4 },
  { name: 'Fri', profit: 45, snipes: 2 },
  { name: 'Sat', profit: 80, snipes: 6 },
  { name: 'Sun', profit: 55, snipes: 3 },
];

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-vinted-card border border-gray-800 p-6 rounded-xl relative overflow-hidden group hover:border-gray-700 transition">
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition ${color}`}>
      <Icon size={64} />
    </div>
    <div className="flex items-center gap-3 mb-2">
      <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
        <Icon size={20} className={color.replace('bg-', 'text-')} />
      </div>
      <span className="text-gray-400 text-sm font-medium">{title}</span>
    </div>
    <div className="text-3xl font-bold text-white ml-1">{value}</div>
  </div>
);

const UserProfileCard: React.FC<{ username: string; balance: number; onWithdraw: () => void }> = ({ username, balance, onWithdraw }) => (
  <div className="bg-gradient-to-r from-[#181a1b] to-[#0e1111] border border-gray-700 p-6 rounded-xl flex flex-col md:flex-row items-center md:items-start gap-6 shadow-lg mb-6 relative overflow-hidden">
     <div className="absolute top-0 right-0 w-32 h-32 bg-vinted-teal blur-[80px] opacity-20 pointer-events-none"></div>
     
     <div className="relative">
       <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-vinted-teal to-purple-500">
         <img src={`https://ui-avatars.com/api/?name=${username}&background=0e1111&color=fff&size=128`} alt={username} className="w-full h-full rounded-full border-2 border-[#0e1111]" />
       </div>
       <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-4 border-[#0e1111]"></div>
     </div>

     <div className="flex-1 text-center md:text-left">
        <h2 className="text-2xl font-bold text-white mb-1">{username}</h2>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-400 mb-4">
           <span className="flex items-center gap-1"><MapPin size={14} /> Paris, FR</span>
           <span className="flex items-center gap-1 text-yellow-400"><Star size={14} fill="currentColor" /> 4.9 (142 reviews)</span>
           <span className="flex items-center gap-1 text-green-400"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
           <div className="bg-black/30 rounded-lg p-2 border border-gray-800">
              <span className="text-xs text-gray-500 block">Wallet Balance</span>
              <span className="text-white font-mono font-bold flex items-center gap-1 text-xl">
                  <Wallet size={16} className="text-vinted-teal"/> 
                  €{balance.toFixed(2)}
              </span>
           </div>
           <div className="bg-black/30 rounded-lg p-2 border border-gray-800">
              <span className="text-xs text-gray-500 block">Pending Orders</span>
              <span className="text-white font-mono font-bold flex items-center gap-1 text-lg"><ShoppingCart size={16} className="text-purple-400"/> 3 Items</span>
           </div>
           <div className="bg-black/30 rounded-lg p-2 border border-gray-800 hidden md:block">
              <span className="text-xs text-gray-500 block">Account Age</span>
              <span className="text-white font-mono font-bold text-lg">2 Years</span>
           </div>
        </div>
     </div>

     <div className="flex flex-col gap-2 min-w-[140px]">
        <button 
            onClick={onWithdraw}
            className="bg-vinted-teal text-black font-bold py-2 px-4 rounded-lg text-sm hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2"
        >
           <DollarSign size={14} /> Withdraw Funds
        </button>
        <button className="bg-gray-800 text-white font-medium py-2 px-4 rounded-lg text-sm hover:bg-gray-700 transition-colors">
           Settings
        </button>
     </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ stats, username, walletBalance, onWithdraw }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      
      {username ? (
         <UserProfileCard username={username} balance={walletBalance} onWithdraw={onWithdraw} />
      ) : (
        <div className="mb-6 bg-vinted-card border border-gray-800 p-8 rounded-xl text-center">
           <h1 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h1>
           <p className="text-gray-400">Connect your Vinted account to see live wallet statistics and order tracking.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Profit" 
          value={`€${stats.totalProfit.toFixed(2)}`} 
          icon={DollarSign} 
          color="text-green-400 bg-green-400" 
        />
        <StatCard 
          title="Items Sniped" 
          value={stats.itemsSniped.toString()} 
          icon={Package} 
          color="text-vinted-teal bg-vinted-teal" 
        />
        <StatCard 
          title="Avg. Margin" 
          value="42%" 
          icon={TrendingUp} 
          color="text-purple-400 bg-purple-400" 
        />
        <StatCard 
          title="Active Monitors" 
          value={stats.activeMonitors.toString()} 
          icon={Activity} 
          color="text-blue-400 bg-blue-400" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit Chart */}
        <div className="bg-vinted-card border border-gray-800 p-6 rounded-xl">
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
            <DollarSign size={18} className="text-green-400" /> Weekly Profit
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#09b1ba" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#09b1ba" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `€${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#181a1b', borderColor: '#374151', color: '#fff' }}
                  itemStyle={{ color: '#09b1ba' }}
                />
                <Area type="monotone" dataKey="profit" stroke="#09b1ba" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Snipes Chart */}
        <div className="bg-vinted-card border border-gray-800 p-6 rounded-xl">
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
            <Package size={18} className="text-purple-400" /> Snipes Count
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   cursor={{fill: '#222526'}}
                   contentStyle={{ backgroundColor: '#181a1b', borderColor: '#374151', color: '#fff' }}
                />
                <Bar dataKey="snipes" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;