import React, { useEffect, useState, useCallback } from 'react';
import { HierarchyLevel, Quote } from '../types';
import { HIERARCHY_DESCRIPTIONS } from '../constants';
import { generateDailyQuote } from '../services/geminiService';
import { QuoteCard } from '../components/QuoteCard';
import { HierarchySelector } from '../components/HierarchySelector';
import { Loader2, RefreshCw } from 'lucide-react';

interface Props {
  currentLevel: HierarchyLevel;
  setLevel: (l: HierarchyLevel) => void;
  selectedGenres: string[];
  onToggleFavorite: (q: Quote) => void;
  onJournal: (q: Quote) => void;
  favorites: Quote[];
}

export const Home: React.FC<Props> = ({ currentLevel, setLevel, selectedGenres, onToggleFavorite, onJournal, favorites }) => {
  const [greeting, setGreeting] = useState("");
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);

  // Greeting logic
  useEffect(() => {
    const hour = new Date().getHours();
    const month = new Date().getMonth();
    const day = new Date().getDate();

    let greet = "Good Morning";
    if (hour >= 12 && hour < 17) greet = "Good Afternoon";
    else if (hour >= 17) greet = "Good Evening";

    if (month === 0 && day === 1) greet = "Happy New Year";
    
    setGreeting(greet);
  }, []);

  const fetchQuote = useCallback(async () => {
    setLoading(true);
    try {
      const data = await generateDailyQuote(currentLevel, selectedGenres);
      setDailyQuote({
        id: Date.now().toString(),
        ...data,
        timestamp: Date.now()
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentLevel, selectedGenres]);

  // Fetch quote when currentLevel changes
  useEffect(() => {
    fetchQuote();
  }, [currentLevel, fetchQuote]); 

  const isFav = dailyQuote ? favorites.some(f => f.text === dailyQuote.text) : false;

  return (
    <div className="flex flex-col h-full p-4 pb-24 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-light text-mindset-accent tracking-tight">{greeting}.</h1>
        <p className="text-white/80 mt-1 text-lg">Focusing on <span className="font-semibold text-mindset-muted">{currentLevel}</span></p>
      </div>

      {/* Hierarchy Selector */}
      <div>
        <p className="text-xs uppercase tracking-wider text-mindset-muted/60 mb-2 font-bold flex items-center justify-between">
           <span>Current Need</span>
           <span className="text-[10px] font-normal normal-case opacity-50">Swipe to change</span>
        </p>
        <HierarchySelector currentLevel={currentLevel} onSelect={setLevel} />
        <p className="text-sm text-mindset-text/70 mt-3 italic px-2 border-l-2 border-mindset-accent/30">
          {HIERARCHY_DESCRIPTIONS[currentLevel]}
        </p>
      </div>

      {/* Daily Quote */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-between items-center mb-4">
           <p className="text-xs uppercase tracking-wider text-mindset-muted/60 font-bold">Quote of the Moment</p>
           <button onClick={fetchQuote} disabled={loading} className="text-mindset-muted hover:text-mindset-accent transition-colors p-1" title="New Quote">
             <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
           </button>
        </div>
       
        {loading ? (
          <div className="bg-mindset-card h-64 rounded-2xl flex items-center justify-center border border-white/5 animate-pulse">
             <div className="flex flex-col items-center gap-3 text-mindset-muted/50">
                <Loader2 className="animate-spin" size={32}/>
                <span className="text-sm">Consulting the universe...</span>
             </div>
          </div>
        ) : dailyQuote ? (
          <QuoteCard 
            quote={dailyQuote} 
            onToggleFavorite={onToggleFavorite} 
            onJournal={onJournal}
            isFavorite={isFav} 
          />
        ) : null}
      </div>
    </div>
  );
};
