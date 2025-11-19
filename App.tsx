
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Home } from './views/Home';
import { Explore } from './views/Explore';
import { Journey } from './views/Journey';
import { Favorites } from './views/Favorites';
import { Onboarding } from './components/Onboarding';
import { HierarchyLevel, Quote, UserProgress } from './types';
import { MILESTONES } from './constants';

type View = 'home' | 'explore' | 'journey' | 'favorites';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [hierarchyLevel, setHierarchyLevel] = useState<HierarchyLevel>(HierarchyLevel.Physiological);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    quotesSaved: 0,
    journalsWritten: 0,
    rewardsAvailable: 0,
    totalRewardsClaimed: 0
  });
  
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

    const savedProgress = localStorage.getItem('mindset_progress');
    if (savedProgress) setUserProgress(JSON.parse(savedProgress));
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

  // Gamification Logic
  const checkMilestones = (updatedProgress: UserProgress) => {
    let rewardsToAdd = 0;

    // Logic: Every X journals = 1 reward
    // This is a simple counter check. A more robust system would track "progress towards next" explicitly.
    // Here we just check if current count % threshold == 0.
    
    if (updatedProgress.journalsWritten > 0 && updatedProgress.journalsWritten % MILESTONES.JOURNALS_REQUIRED_FOR_REWARD === 0) {
       rewardsToAdd++;
    }

    if (updatedProgress.quotesSaved > 0 && updatedProgress.quotesSaved % MILESTONES.SAVES_REQUIRED_FOR_REWARD === 0) {
      rewardsToAdd++;
    }

    if (rewardsToAdd > 0) {
      const newProgress = {
        ...updatedProgress,
        rewardsAvailable: updatedProgress.rewardsAvailable + rewardsToAdd
      };
      setUserProgress(newProgress);
      localStorage.setItem('mindset_progress', JSON.stringify(newProgress));
      // Could trigger a toast notification here
      console.log("Reward Unlocked!");
    }
  };

  const handleToggleFavorite = (quote: Quote) => {
    const exists = favorites.some(f => f.text === quote.text);
    let newFavs;
    let updatedProgress = { ...userProgress };

    if (exists) {
      newFavs = favorites.filter(f => f.text !== quote.text);
    } else {
      newFavs = [...favorites, quote];
      // Increment progress for saving
      updatedProgress.quotesSaved += 1;
      setUserProgress(updatedProgress);
      localStorage.setItem('mindset_progress', JSON.stringify(updatedProgress));
      checkMilestones(updatedProgress);
    }
    setFavorites(newFavs);
    localStorage.setItem('mindset_favorites', JSON.stringify(newFavs));
  };

  const handleEntrySaved = () => {
    const updatedProgress = {
      ...userProgress,
      journalsWritten: userProgress.journalsWritten + 1
    };
    setUserProgress(updatedProgress);
    localStorage.setItem('mindset_progress', JSON.stringify(updatedProgress));
    checkMilestones(updatedProgress);
  };

  const handleRewardClaimed = () => {
    if (userProgress.rewardsAvailable > 0) {
      const updated = {
        ...userProgress,
        rewardsAvailable: userProgress.rewardsAvailable - 1,
        totalRewardsClaimed: userProgress.totalRewardsClaimed + 1
      };
      setUserProgress(updated);
      localStorage.setItem('mindset_progress', JSON.stringify(updated));
    }
  };

  const handleCompleteOnboarding = (level: HierarchyLevel, genres: string[]) => {
    handleSetLevel(level);
    setSelectedGenres(genres);
    localStorage.setItem('mindset_genres', JSON.stringify(genres)); 
    setHasOnboarded(true);
    localStorage.setItem('mindset_onboarded', 'true');
  };

  const handleJournalAboutQuote = (quote: Quote) => {
    setJournalQuote(quote);
    setCurrentView('journey');
    if (!favorites.some(f => f.text === quote.text)) {
      handleToggleFavorite(quote); 
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
            userProgress={userProgress}
            onRewardClaimed={handleRewardClaimed}
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
            onEntrySaved={handleEntrySaved}
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
