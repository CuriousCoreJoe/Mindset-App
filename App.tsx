import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './views/Home';
import { Explore } from './views/Explore';
import { Journey } from './views/Journey';
import { Favorites } from './views/Favorites';
import { Onboarding } from './components/Onboarding';
import { HierarchyLevel, Quote } from './types';

type View = 'home' | 'explore' | 'journey' | 'favorites';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [hierarchyLevel, setHierarchyLevel] = useState<HierarchyLevel>(HierarchyLevel.Physiological);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  
  // State for handling "Journal about this quote"
  const [journalQuote, setJournalQuote] = useState<Quote | null>(null);

  // Load initial state
  useEffect(() => {
    const savedLevel = localStorage.getItem('mindset_level');
    if (savedLevel) setHierarchyLevel(savedLevel as HierarchyLevel);

    const savedGenres = localStorage.getItem('mindset_genres');
    if (savedGenres) setSelectedGenres(JSON.parse(savedGenres));

    const savedFavs = localStorage.getItem('mindset_favorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    const onboarded = localStorage.getItem('mindset_onboarded');
    setHasOnboarded(!!onboarded);
  }, []);

  // Persistence Handlers
  const handleSetLevel = (level: HierarchyLevel) => {
    setHierarchyLevel(level);
    localStorage.setItem('mindset_level', level);
  };

  const handleToggleGenre = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    
    setSelectedGenres(newGenres);
    localStorage.setItem('mindset_genres', JSON.stringify(newGenres));
  };

  const handleToggleFavorite = (quote: Quote) => {
    const exists = favorites.some(f => f.text === quote.text);
    let newFavs;
    if (exists) {
      newFavs = favorites.filter(f => f.text !== quote.text);
    } else {
      newFavs = [...favorites, quote];
    }
    setFavorites(newFavs);
    localStorage.setItem('mindset_favorites', JSON.stringify(newFavs));
  };

  const handleCompleteOnboarding = (level: HierarchyLevel, genres: string[]) => {
    handleSetLevel(level);
    setSelectedGenres(genres);
    localStorage.setItem('mindset_genres', JSON.stringify(genres)); // Ensure saved
    setHasOnboarded(true);
    localStorage.setItem('mindset_onboarded', 'true');
  };

  const handleJournalAboutQuote = (quote: Quote) => {
    setJournalQuote(quote);
    setCurrentView('journey');
    // If user isn't already favorite, maybe auto-favorite? 
    // User requirement didn't specify, but let's just open the journal.
    if (!favorites.some(f => f.text === quote.text)) {
      handleToggleFavorite(quote); // Auto-favorite for convenience when journaling
    }
  };

  if (!hasOnboarded) {
    return <Onboarding onComplete={handleCompleteOnboarding} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <Home 
            currentLevel={hierarchyLevel} 
            setLevel={handleSetLevel}
            selectedGenres={selectedGenres}
            onToggleFavorite={handleToggleFavorite}
            onJournal={handleJournalAboutQuote}
            favorites={favorites}
          />
        );
      case 'explore':
        return (
          <Explore 
            selectedGenres={selectedGenres} 
            toggleGenre={handleToggleGenre} 
            currentLevel={hierarchyLevel}
          />
        );
      case 'journey':
        return (
          <Journey 
            initialQuote={journalQuote}
            onClearInitialQuote={() => setJournalQuote(null)}
          />
        );
      case 'favorites':
        return (
          <Favorites 
            favorites={favorites} 
            onToggleFavorite={handleToggleFavorite} 
            onJournal={handleJournalAboutQuote}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;
