import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
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
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Explore</Text>
                <Text style={styles.subtitle}>Customize your daily inspiration.</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                {(['suggestions', 'saved', 'all'] as Tab[]).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        style={[
                            styles.tab,
                            activeTab === tab ? styles.tabActive : styles.tabInactive
                        ]}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === tab ? styles.tabTextActive : styles.tabTextInactive
                        ]}>
                            {tab === 'suggestions' ? 'For You' : tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {activeTab === 'suggestions' && (
                <View style={styles.suggestionBanner}>
                    <Text style={styles.suggestionText}>
                        Based on your focus: <Text style={{ fontWeight: 'bold' }}>{currentLevel}</Text>
                    </Text>
                </View>
            )}

            {displayedGenres.length === 0 && activeTab === 'saved' && (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No genres saved yet. Go to 'All' to pick some.</Text>
                </View>
            )}

            <ScrollView contentContainerStyle={styles.grid}>
                {displayedGenres.map((genre) => {
                    const isSelected = selectedGenres.includes(genre);
                    const isSuggested = suggestions.includes(genre);

                    return (
                        <TouchableOpacity
                            key={genre}
                            onPress={() => toggleGenre(genre)}
                            style={[
                                styles.card,
                                isSelected ? styles.cardSelected : styles.cardDefault,
                                (isSuggested && !isSelected) ? styles.cardSuggested : {}
                            ]}
                        >
                            <Text style={[
                                styles.cardTitle,
                                isSelected ? styles.cardTitleSelected : styles.cardTitleDefault
                            ]}>
                                {genre}
                            </Text>

                            {isSuggested && !isSelected && (
                                <Text style={styles.suggestedLabel}>Suggested</Text>
                            )}

                            <View style={[
                                styles.indicator,
                                isSelected ? styles.indicatorSelected : styles.indicatorDefault
                            ]} />
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020d08',
        padding: 16,
        paddingBottom: 100,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: 14,
        marginTop: 4,
    },
    tabContainer: {
        flexDirection: 'row',
        padding: 4,
        backgroundColor: '#1a2e26',
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    tabActive: {
        backgroundColor: '#020d08', // mindset-bg
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    tabInactive: {
        // transparent
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    tabTextActive: {
        color: '#bfef00', // mindset-accent
    },
    tabTextInactive: {
        color: '#94a3b8',
    },
    suggestionBanner: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: 'rgba(191, 255, 0, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(191, 255, 0, 0.2)',
        borderRadius: 8,
    },
    suggestionText: {
        fontSize: 12,
        color: '#bfef00',
    },
    emptyState: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyStateText: {
        color: '#94a3b8',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        paddingBottom: 24,
    },
    card: {
        width: '48%', // roughly half minus gap
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        position: 'relative',
        overflow: 'hidden',
        minHeight: 100,
        justifyContent: 'space-between',
    },
    cardSelected: {
        backgroundColor: '#bfef00',
        borderColor: '#bfef00',
        shadowColor: '#bfef00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        transform: [{ scale: 1.02 }],
    },
    cardDefault: {
        backgroundColor: '#1a2e26',
        borderColor: 'transparent',
    },
    cardSuggested: {
        borderColor: 'rgba(191, 255, 0, 0.3)',
        backgroundColor: 'rgba(191, 255, 0, 0.05)',
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        zIndex: 10,
    },
    cardTitleSelected: {
        color: '#020d08',
    },
    cardTitleDefault: {
        color: '#ffffff',
    },
    suggestedLabel: {
        fontSize: 10,
        color: 'rgba(191, 255, 0, 0.7)',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 4,
    },
    indicator: {
        height: 4,
        borderRadius: 9999,
        marginTop: 8,
    },
    indicatorSelected: {
        backgroundColor: 'rgba(2, 13, 8, 0.4)',
        width: 48,
    },
    indicatorDefault: {
        backgroundColor: 'rgba(148, 163, 184, 0.2)',
        width: 32,
    },
});
