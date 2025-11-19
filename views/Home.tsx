
import React, { useEffect, useState, useCallback } from 'react';
import { HierarchyLevel, Quote, QuoteType, UserProgress } from '../types';
import { HIERARCHY_DESCRIPTIONS, HOLIDAYS } from '../constants';
import { generateDailyQuote, generateCustomReward } from '../services/geminiService';
import { QuoteCard } from '../components/QuoteCard';
import { HierarchySelector } from '../components/HierarchySelector';
import { RewardModal } from '../components/RewardModal';
import { Loader2, RefreshCw, Gift } from 'lucide-react';

interface Props {
  currentLevel: HierarchyLevel;
  setLevel: (l: HierarchyLevel) => void;
  selectedGenres: string[];
  onToggleFavorite: (q: Quote) => void;
  onJournal: (q: Quote) => void;
  favorites: Quote[];
  userProgress: UserProgress;
  onRewardClaimed: () => void;
}

export const Home: React.FC<Props> = ({ 
  currentLevel, 
  setLevel, 
  selectedGenres, 
  onToggleFavorite, 
  onJournal, 
  favorites,
  userProgress,
  onRewardClaimed
}) => {
  const [greeting, setGreeting] = useState("");
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Reward State
  const [showRewardModal, setShowRewardModal] = useState(false);

  // Date Context
  const getTodayContext = () => {
    const now = new Date();
    const isSunday = now.getDay() === 0;
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const dateKey = `${month}-${day}`;
    const holiday = HOLIDAYS[dateKey];
    
    return { isSunday, holiday };
  };

  // Greeting logic
  useEffect(() => {
    const hour = new Date().getHours();
    let greet = "Good Morning";
    if (hour >= 12 && hour < 17) greet = "Good Afternoon";
    else if (hour >= 17) greet = "Good Evening";

    const { holiday } = getTodayContext();
    if (holiday) greet = `Happy ${holiday}`;
    
    setGreeting(greet);
  }, []);

  const fetchQuote = useCallback(async () => {
    setLoading(true);
    const { isSunday, holiday } = getTodayContext();
    
    try {
      const data = await generateDailyQuote(currentLevel, selectedGenres, { isSunday, holiday });
      
      let type = QuoteType.Daily;
      if (holiday) type = QuoteType.Holiday;
      else if (isSunday) type = QuoteType.Weekly;

      setDailyQuote({
        id: Date.now().toString(),
        ...data,
        timestamp: Date.now(),
        type,
        holidayName: holiday
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

  const handleRewardSelection = async (mode: 'kind' | 'helpful') => {
    setLoading(true);
    setShowRewardModal(false);
    onRewardClaimed(); // Decrement reward count

    try {
      // In a real app, pass actual journal history here. Passing empty for now or read from LS if needed
      // For simplicity in this view, we'll fetch generic journals or pass empty to service
      // The service handles empty data gracefully.
      
      // Identify ignored hierarchies (simple logic: hierarchies not currently selected)
      const ignored = [HierarchyLevel.SelfActualization, HierarchyLevel.Transcendence]; 
      
      const rewardData = await generateCustomReward([], ignored, selectedGenres, mode);
      
      setDailyQuote({
        id: Date.now().toString(),
        ...rewardData,
        timestamp: Date.now(),
        type: QuoteType.Custom
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const isFav = dailyQuote ? favorites.some(f => f.text === dailyQuote.text) : false;

  return (
    <div className="flex flex-col h-full p-4 pb-24 space-y-6">
      {/* Reward Modal */}
      {showRewardModal && (
        <RewardModal 
          onClose={() => setShowRewardModal(false)} 
          onSelectMode={handleRewardSelection} 
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-light text-mindset-accent tracking-tight">{greeting}.</h1>
          <p className="text-white/80 mt-1 text-lg">Focusing on <span className="font-semibold text-mindset-muted">{currentLevel}</span></p>
        </div>
        
        {/* Reward Button */}
        {userProgress.rewardsAvailable > 0 && (
          <button 
            onClick={() => setShowRewardModal(true)}
            className="animate-bounce bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 p-2 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:bg-yellow-500/30 transition-all"
            title="Claim your reward"
          >
            <Gift size={24} />
          </button>
        )}
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
           <p className="text-xs uppercase tracking-wider text-mindset-muted/60 font-bold">
             {dailyQuote?.type === QuoteType.Custom ? "Your Reward" : "Quote of the Moment"}
           </p>
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
