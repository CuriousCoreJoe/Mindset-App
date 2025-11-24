import React from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { useAppLogic } from './hooks/useAppLogic';
import { Layout } from './components/Layout';
import { Onboarding } from './components/Onboarding';
import { Home } from './views/Home';
import { Explore } from './views/Explore';
import { Journey } from './views/Journey';
import { Favorites } from './views/Favorites';

export default function App() {
  const {
    currentView,
    setCurrentView,
    hierarchyLevel,
    handleSetLevel,
    selectedGenres,
    handleToggleGenre,
    favorites,
    handleToggleFavorite,
    hasOnboarded,
    handleCompleteOnboarding,
    userProgress,
    handleRewardClaimed,
    handleEntrySaved,
    journalQuote,
    setJournalQuote,
    handleJournalAboutQuote,
    isLoading
  } = useAppLogic();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#020d08', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#bfef00" />
      </View>
    );
  }

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
    <>
      <StatusBar barStyle="light-content" backgroundColor="#020d08" />
      <Layout currentView={currentView} setView={setCurrentView}>
        {renderView()}
      </Layout>
    </>
  );
}
