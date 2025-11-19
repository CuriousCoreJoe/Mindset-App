import React, { useState } from 'react';
import { Quote } from '../types';
import { QuoteCard } from '../components/QuoteCard';
import { HeartOff, Download, ArrowUpDown } from 'lucide-react';

interface Props {
  favorites: Quote[];
  onToggleFavorite: (quote: Quote) => void;
  onJournal: (quote: Quote) => void;
}

export const Favorites: React.FC<Props> = ({ favorites, onToggleFavorite, onJournal }) => {
  const [sortDesc, setSortDesc] = useState(true);

  const sortedFavorites = [...favorites].sort((a, b) => {
     return sortDesc ? b.timestamp - a.timestamp : a.timestamp - b.timestamp;
  });

  const handleExport = () => {
    if (favorites.length === 0) return;
    
    const textContent = favorites.map(f => 
      `"${f.text}"\n— ${f.author}\n(Category: ${f.category})\nSaved: ${new Date(f.timestamp).toLocaleDateString()}`
    ).join('\n\n-------------------\n\n');

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindset-favorites-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 pb-24">
       <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Favorites</h2>
          <p className="text-mindset-muted text-sm mt-1">Your collection of wisdom.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setSortDesc(!sortDesc)}
            className="p-2 bg-mindset-card rounded-full text-mindset-muted hover:text-white transition-colors"
            title="Sort"
          >
            <ArrowUpDown size={20} />
          </button>
          <button 
            onClick={handleExport}
            className="p-2 bg-mindset-card rounded-full text-mindset-muted hover:text-white transition-colors"
            title="Export to Text File"
            disabled={favorites.length === 0}
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-mindset-muted/40 space-y-4">
          <HeartOff size={48} />
          <p>No favorites saved yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedFavorites.map((quote, idx) => (
            <QuoteCard 
              key={`${quote.id}-${idx}`} 
              quote={quote} 
              onToggleFavorite={onToggleFavorite}
              onJournal={onJournal}
              isFavorite={true} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
