
import React from 'react';
import { Quote, QuoteType } from '../types';
import { Heart, BookOpen, Share2, Calendar, Sparkles, PartyPopper, Gift } from 'lucide-react';

interface Props {
  quote: Quote;
  onToggleFavorite: (quote: Quote) => void;
  onJournal?: (quote: Quote) => void;
  isFavorite: boolean;
}

export const QuoteCard: React.FC<Props> = ({ quote, onToggleFavorite, onJournal, isFavorite }) => {
  
  const getTypeIcon = () => {
    switch (quote.type) {
      case QuoteType.Weekly: return <Calendar size={14} className="mr-1" />;
      case QuoteType.Holiday: return <Sparkles size={14} className="mr-1" />;
      case QuoteType.Birthday: return <PartyPopper size={14} className="mr-1" />;
      case QuoteType.Custom: return <Gift size={14} className="mr-1" />;
      default: return null;
    }
  };

  const getBadgeColor = () => {
    switch (quote.type) {
      case QuoteType.Weekly: return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case QuoteType.Holiday: return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case QuoteType.Birthday: return "bg-pink-500/20 text-pink-300 border-pink-500/30";
      case QuoteType.Custom: return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default: return "bg-mindset-bg/50 text-mindset-accent border-mindset-accent/20";
    }
  };

  return (
    <div className={`
      bg-mindset-card rounded-2xl p-6 shadow-lg border relative overflow-hidden group transition-all hover:shadow-[0_0_20px_rgba(10,47,31,0.8)]
      ${quote.type === QuoteType.Custom ? 'border-yellow-500/30' : 'border-white/5'}
    `}>
      <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl font-serif text-mindset-accent leading-none pointer-events-none">
        "
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
             <span className={`text-xs font-bold tracking-widest uppercase px-2 py-1 rounded border flex items-center ${getBadgeColor()}`}>
              {getTypeIcon()}
              {quote.type === QuoteType.Weekly ? "Quote of the Week" : 
               quote.type === QuoteType.Holiday ? quote.holidayName : 
               quote.type === QuoteType.Custom ? "Reward for You" :
               quote.category || 'Wisdom'}
            </span>
          </div>
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
