import React, { useState } from 'react';
import { X, Wallet, ArrowRight, CheckCircle2, DollarSign } from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onConfirm: (amount: number, email: string) => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, balance, onConfirm }) => {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0 || val > balance) return;

    setStep('processing');
    
    // Simulate API delay
    setTimeout(() => {
        onConfirm(val, email);
        setStep('success');
        
        // Auto close after success
        setTimeout(() => {
            onClose();
            // Reset form after close animation would finish
            setTimeout(() => {
                setStep('input');
                setAmount('');
                setEmail('');
            }, 300);
        }, 2000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#181a1b] border border-gray-700 w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        {step === 'input' && (
            <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <span className="font-bold italic text-lg">P</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Withdraw Funds</h2>
                        <p className="text-sm text-gray-400">Transfer wallet balance to PayPal.</p>
                    </div>
                </div>

                <div className="bg-[#0e1111] rounded-lg p-4 mb-6 border border-gray-800">
                    <span className="text-xs text-gray-500 block mb-1">Available Balance</span>
                    <span className="text-2xl font-bold text-white flex items-center gap-1">
                        €{balance.toFixed(2)}
                    </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">PayPal Email</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full bg-[#0e1111] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                        />
                    </div>

                    <div>
                         <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Amount (€)</label>
                         <div className="relative">
                             <input 
                                type="number" 
                                required
                                min="1"
                                max={balance}
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-[#0e1111] border border-gray-700 rounded-lg p-3 text-white focus:border-vinted-teal outline-none"
                             />
                             <button 
                                type="button"
                                onClick={() => setAmount(balance.toString())}
                                className="absolute right-3 top-3 text-xs text-vinted-teal font-bold hover:underline"
                             >
                                MAX
                             </button>
                         </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={!amount || parseFloat(amount) > balance}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                        Transfer Funds <ArrowRight size={16} />
                    </button>
                </form>
            </div>
        )}

        {step === 'processing' && (
            <div className="p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-white mb-2">Processing Transfer...</h3>
                <p className="text-gray-400 text-sm">Contacting PayPal Secure Gateway</p>
            </div>
        )}

        {step === 'success' && (
            <div className="p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-6 animate-in zoom-in">
                    <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Transfer Successful!</h3>
                <p className="text-gray-400 text-sm">€{parseFloat(amount).toFixed(2)} has been sent to {email}.</p>
                <p className="text-xs text-gray-500 mt-4">Transaction ID: PP-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
        )}

      </div>
    </div>
  );
};
