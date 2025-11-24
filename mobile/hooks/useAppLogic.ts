import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HierarchyLevel, Quote, UserProgress } from '../types';
import { MILESTONES } from '../constants';

export type ViewType = 'home' | 'explore' | 'journey' | 'favorites';

export const useAppLogic = () => {
    const [currentView, setCurrentView] = useState<ViewType>('home');
    const [hierarchyLevel, setHierarchyLevel] = useState<HierarchyLevel>(HierarchyLevel.Physiological);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [favorites, setFavorites] = useState<Quote[]>([]);
    const [hasOnboarded, setHasOnboarded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
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
        const loadState = async () => {
            try {
                const savedLevel = await AsyncStorage.getItem('mindset_level');
                if (savedLevel) setHierarchyLevel(savedLevel as HierarchyLevel);

                const savedGenres = await AsyncStorage.getItem('mindset_genres');
                if (savedGenres) setSelectedGenres(JSON.parse(savedGenres));

                const savedFavs = await AsyncStorage.getItem('mindset_favorites');
                if (savedFavs) setFavorites(JSON.parse(savedFavs));

                const onboarded = await AsyncStorage.getItem('mindset_onboarded');
                setHasOnboarded(!!onboarded);

                const savedProgress = await AsyncStorage.getItem('mindset_progress');
                if (savedProgress) setUserProgress(JSON.parse(savedProgress));
            } catch (e) {
                console.error("Failed to load state", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadState();
    }, []);

    // Persistence Handlers
    const handleSetLevel = async (level: HierarchyLevel) => {
        setHierarchyLevel(level);
        await AsyncStorage.setItem('mindset_level', level);
    };

    const handleToggleGenre = async (genre: string) => {
        const newGenres = selectedGenres.includes(genre)
            ? selectedGenres.filter(g => g !== genre)
            : [...selectedGenres, genre];

        setSelectedGenres(newGenres);
        await AsyncStorage.setItem('mindset_genres', JSON.stringify(newGenres));
    };

    // Gamification Logic
    const checkMilestones = async (updatedProgress: UserProgress) => {
        let rewardsToAdd = 0;

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
            await AsyncStorage.setItem('mindset_progress', JSON.stringify(newProgress));
            console.log("Reward Unlocked!");
        }
    };

    const handleToggleFavorite = async (quote: Quote) => {
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
            await AsyncStorage.setItem('mindset_progress', JSON.stringify(updatedProgress));
            checkMilestones(updatedProgress);
        }
        setFavorites(newFavs);
        await AsyncStorage.setItem('mindset_favorites', JSON.stringify(newFavs));
    };

    const handleEntrySaved = async () => {
        const updatedProgress = {
            ...userProgress,
            journalsWritten: userProgress.journalsWritten + 1
        };
        setUserProgress(updatedProgress);
        await AsyncStorage.setItem('mindset_progress', JSON.stringify(updatedProgress));
        checkMilestones(updatedProgress);
    };

    const handleRewardClaimed = async () => {
        if (userProgress.rewardsAvailable > 0) {
            const updated = {
                ...userProgress,
                rewardsAvailable: userProgress.rewardsAvailable - 1,
                totalRewardsClaimed: userProgress.totalRewardsClaimed + 1
            };
            setUserProgress(updated);
            await AsyncStorage.setItem('mindset_progress', JSON.stringify(updated));
        }
    };

    const handleCompleteOnboarding = async (level: HierarchyLevel, genres: string[]) => {
        handleSetLevel(level);
        setSelectedGenres(genres);
        await AsyncStorage.setItem('mindset_genres', JSON.stringify(genres));
        setHasOnboarded(true);
        await AsyncStorage.setItem('mindset_onboarded', 'true');
    };

    const handleJournalAboutQuote = (quote: Quote) => {
        setJournalQuote(quote);
        setCurrentView('journey');
        if (!favorites.some(f => f.text === quote.text)) {
            handleToggleFavorite(quote);
        }
    };

    return {
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
    };
};
