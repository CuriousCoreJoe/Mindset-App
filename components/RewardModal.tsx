
import React from 'react';
import { Gift, Leaf, Shield } from 'lucide-react';

interface Props {
  onSelectMode: (mode: 'kind' | 'helpful') => void;
  onClose: () => void;
}

export const RewardModal: React.FC<Props> = ({ onSelectMode, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-mindset-card border border-yellow-500/30 rounded-2xl p-6 w-full max-w-sm shadow-[0_0_30px_rgba(234,179,8,0.1)] relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-mindset-accent to-yellow-500" />
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-400">
            <Gift size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">You've Earned a Reward!</h2>
          <p className="text-mindset-muted text-sm">
            You've been consistent with your mindfulness journey. 
            How would you like your custom insight today?
          </p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => onSelectMode('kind')}
            className="w-full p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-mindset-accent/50 transition-all flex items-center gap-4 group"
          >
            <div className="p-2 bg-green-500/20 text-green-400 rounded-lg group-hover:scale-110 transition-transform">
               <Shield size={20} />
            </div>
            <div className="text-left">
              <div className="font-bold text-white">Kind & Comforting</div>
              <div className="text-xs text-mindset-muted">Reinforce your strengths and find peace.</div>
            </div>
          </button>

          <button 
            onClick={() => onSelectMode('helpful')}
            className="w-full p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-500/50 transition-all flex items-center gap-4 group"
          >
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
               <Leaf size={20} />
            </div>
            <div className="text-left">
              <div className="font-bold text-white">Helpful & Challenging</div>
              <div className="text-xs text-mindset-muted">Explore new perspectives and grow.</div>
            </div>
          </button>
        </div>

        <button 
          onClick={onClose}
          className="mt-6 text-xs text-mindset-muted hover:text-white underline w-full text-center"
        >
          Save for later
        </button>
      </div>
    </div>
  );
};
