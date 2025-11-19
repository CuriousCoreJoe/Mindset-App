import React, { useState } from 'react';
import { QUOTE_GENRES, HIERARCHY_GENRE_MAP } from '../constants';
import { HierarchyLevel } from '../types';

interface Props {
  selectedGenres: string[];
  toggleGenre: (genre: string) => void;
  currentLevel: HierarchyLevel;
}

type Tab = 'suggestions' | 'saved' | 'all';

export const Explore: React.FC<Props> = ({ selectedGenres, toggleGenre, currentLevel }) => {
  const [activeTab, setActiveTab] = useState<Tab>('suggestions');

  const suggestions = HIERARCHY_GENRE_MAP[currentLevel] || [];
  
  // Filter logic
  let displayedGenres = QUOTE_GENRES;
  if (activeTab === 'suggestions') {
    displayedGenres = QUOTE_GENRES.filter(g => suggestions.includes(g));
  } else if (activeTab === 'saved') {
    displayedGenres = QUOTE_GENRES.filter(g => selectedGenres.includes(g));
  }

  return (
    <div className="p-4 pb-24 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Explore</h2>
        <p className="text-mindset-muted text-sm mt-1">Customize your daily inspiration.</p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-mindset-card rounded-xl mb-6 border border-white/5">
        {(['suggestions', 'saved', 'all'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
              activeTab === tab 
                ? 'bg-mindset-bg text-mindset-accent shadow-sm' 
                : 'text-mindset-muted hover:text-white'
            }`}
          >
            {tab === 'suggestions' ? 'For You' : tab}
          </button>
        ))}
      </div>
      
      {activeTab === 'suggestions' && (
        <div className="mb-4 p-3 bg-mindset-accent/10 border border-mindset-accent/20 rounded-lg text-xs text-mindset-accent">
           Based on your focus: <b>{currentLevel}</b>
        </div>
      )}

      {displayedGenres.length === 0 && activeTab === 'saved' && (
         <div className="text-center py-10 text-mindset-muted">
           No genres saved yet. Go to 'All' to pick some.
         </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto pb-4 no-scrollbar">
        {displayedGenres.map((genre) => {
          const isSelected = selectedGenres.includes(genre);
          const isSuggested = suggestions.includes(genre);
          
          return (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`
                p-4 rounded-xl text-left transition-all duration-200 border relative overflow-hidden group
                ${isSelected 
                  ? 'bg-mindset-accent text-mindset-bg border-mindset-accent shadow-lg transform scale-[1.02]' 
                  : 'bg-mindset-card text-mindset-muted border-transparent hover:border-mindset-muted/50'}
                ${isSuggested && !isSelected ? 'border-mindset-accent/30 bg-gradient-to-br from-mindset-card to-mindset-accent/5' : ''}
              `}
            >
              <span className={`block text-sm font-bold relative z-10 ${isSelected ? 'text-mindset-bg' : 'text-white'}`}>
                {genre}
              </span>
              
              {isSuggested && !isSelected && (
                <span className="text-[10px] text-mindset-accent/70 uppercase tracking-wider mt-1 block">Suggested</span>
              )}
              
              <div className={`h-1 w-8 mt-2 rounded-full transition-all ${isSelected ? 'bg-mindset-bg/40 w-12' : 'bg-mindset-muted/20 group-hover:bg-mindset-muted/40'}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
