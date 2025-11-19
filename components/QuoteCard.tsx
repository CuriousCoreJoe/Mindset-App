import React from 'react';
import { Quote } from '../types';
import { Heart, BookOpen, Share2 } from 'lucide-react';

interface Props {
  quote: Quote;
  onToggleFavorite: (quote: Quote) => void;
  onJournal?: (quote: Quote) => void;
  isFavorite: boolean;
}

export const QuoteCard: React.FC<Props> = ({ quote, onToggleFavorite, onJournal, isFavorite }) => {
  return (
    <div className="bg-mindset-card rounded-2xl p-6 shadow-lg border border-white/5 relative overflow-hidden group transition-all hover:shadow-[0_0_20px_rgba(10,47,31,0.8)]">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl font-serif text-mindset-accent leading-none pointer-events-none">
        "
      </div>
      
      <div className="relative z-10">
        <div className="mb-2">
          <span className="text-xs font-bold tracking-widest text-mindset-accent uppercase bg-mindset-bg/50 px-2 py-1 rounded border border-mindset-accent/20">
            {quote.category || 'Wisdom'}
          </span>
        </div>
        
        <p className="text-xl md:text-2xl font-light leading-relaxed text-white mb-6 italic">
          "{quote.text}"
        </p>
        
        <div className="flex items-center justify-between mt-4">
          <p className="text-mindset-muted font-medium text-sm">
            — {quote.author}
          </p>
          
          <div className="flex gap-2">
            <button 
              onClick={() => onToggleFavorite(quote)}
              title="Save to Favorites"
              className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-red-500 bg-red-500/10' : 'text-mindset-muted hover:text-white hover:bg-white/10'}`}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            
            {onJournal && (
              <button 
                onClick={() => onJournal(quote)}
                title="Journal about this"
                className="p-2 rounded-full text-mindset-muted hover:text-mindset-accent hover:bg-white/10 transition-colors"
              >
                <BookOpen size={20} />
              </button>
            )}

            <button 
              title="Share"
              className="p-2 rounded-full text-mindset-muted hover:text-white hover:bg-white/10 transition-colors"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
