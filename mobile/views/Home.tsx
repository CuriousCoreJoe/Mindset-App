import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { HierarchyLevel, Quote, QuoteType, UserProgress } from '../types';
import { HIERARCHY_DESCRIPTIONS, HOLIDAYS } from '../constants';
import { generateDailyQuote, generateCustomReward } from '../services/geminiService';
import { QuoteCard } from '../components/QuoteCard';
import { HierarchySelector } from '../components/HierarchySelector';
import { RewardModal } from '../components/RewardModal';
import { Loader2, RefreshCw, Gift } from 'lucide-react-native';

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
        <View style={styles.container}>
            {/* Reward Modal */}
            <RewardModal
                visible={showRewardModal}
                onClose={() => setShowRewardModal(false)}
                onSelectMode={handleRewardSelection}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>{greeting}.</Text>
                        <Text style={styles.subGreeting}>
                            Focusing on <Text style={styles.levelHighlight}>{currentLevel}</Text>
                        </Text>
                    </View>

                    {/* Reward Button */}
                    {userProgress.rewardsAvailable > 0 && (
                        <TouchableOpacity
                            onPress={() => setShowRewardModal(true)}
                            style={styles.rewardButton}
                        >
                            <Gift size={24} color="#facc15" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Hierarchy Selector */}
                <View style={styles.selectorContainer}>
                    <View style={styles.selectorHeader}>
                        <Text style={styles.selectorTitle}>Current Need</Text>
                        <Text style={styles.selectorHint}>Swipe to change</Text>
                    </View>
                    <HierarchySelector currentLevel={currentLevel} onSelect={setLevel} />
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.description}>
                            {HIERARCHY_DESCRIPTIONS[currentLevel]}
                        </Text>
                    </View>
                </View>

                {/* Daily Quote */}
                <View style={styles.quoteContainer}>
                    <View style={styles.quoteHeader}>
                        <Text style={styles.quoteTitle}>
                            {dailyQuote?.type === QuoteType.Custom ? "Your Reward" : "Quote of the Moment"}
                        </Text>
                        <TouchableOpacity onPress={fetchQuote} disabled={loading} style={styles.refreshButton}>
                            <RefreshCw size={16} color={loading ? "#bfef00" : "#94a3b8"} />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.loadingCard}>
                            <ActivityIndicator size="large" color="#bfef00" />
                            <Text style={styles.loadingText}>Consulting the universe...</Text>
                        </View>
                    ) : dailyQuote ? (
                        <QuoteCard
                            quote={dailyQuote}
                            onToggleFavorite={onToggleFavorite}
                            onJournal={onJournal}
                            isFavorite={isFav}
                        />
                    ) : null}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020d08',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100, // Space for bottom nav
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    greeting: {
        fontSize: 32,
        fontWeight: '300',
        color: '#bfef00', // mindset-accent
        letterSpacing: -0.5,
    },
    subGreeting: {
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 4,
        fontSize: 18,
    },
    levelHighlight: {
        fontWeight: '600',
        color: '#94a3b8',
    },
    rewardButton: {
        backgroundColor: 'rgba(234, 179, 8, 0.2)',
        borderColor: 'rgba(234, 179, 8, 0.5)',
        borderWidth: 1,
        padding: 8,
        borderRadius: 9999,
        shadowColor: '#eab308',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 5,
    },
    selectorContainer: {
        marginBottom: 24,
    },
    selectorHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    selectorTitle: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: 'rgba(148, 163, 184, 0.6)',
        fontWeight: 'bold',
    },
    selectorHint: {
        fontSize: 10,
        color: 'rgba(148, 163, 184, 0.5)',
    },
    descriptionContainer: {
        marginTop: 12,
        paddingLeft: 8,
        borderLeftWidth: 2,
        borderLeftColor: 'rgba(191, 255, 0, 0.3)',
    },
    description: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        fontStyle: 'italic',
    },
    quoteContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    quoteHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    quoteTitle: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: 'rgba(148, 163, 184, 0.6)',
        fontWeight: 'bold',
    },
    refreshButton: {
        padding: 4,
    },
    loadingCard: {
        backgroundColor: '#1a2e26',
        height: 256,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
        color: 'rgba(148, 163, 184, 0.5)',
    },
});
