import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Share, StyleSheet } from 'react-native';
import { Quote } from '../types';
import { QuoteCard } from '../components/QuoteCard';
import { HeartOff, Download, ArrowUpDown, Share2 } from 'lucide-react-native';

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

    const handleExport = async () => {
        if (favorites.length === 0) return;

        const textContent = favorites.map(f =>
            `"${f.text}"\n— ${f.author}\n(Category: ${f.category})\nSaved: ${new Date(f.timestamp).toLocaleDateString()}`
        ).join('\n\n-------------------\n\n');

        try {
            await Share.share({
                message: textContent,
                title: 'My Mindset Favorites'
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Favorites</Text>
                    <Text style={styles.subtitle}>Your collection of wisdom.</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        onPress={() => setSortDesc(!sortDesc)}
                        style={styles.iconButton}
                    >
                        <ArrowUpDown size={20} color="#94a3b8" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleExport}
                        style={styles.iconButton}
                        disabled={favorites.length === 0}
                    >
                        <Share2 size={20} color={favorites.length === 0 ? "rgba(148, 163, 184, 0.3)" : "#94a3b8"} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {favorites.length === 0 ? (
                    <View style={styles.emptyState}>
                        <HeartOff size={48} color="rgba(148, 163, 184, 0.4)" />
                        <Text style={styles.emptyStateText}>No favorites saved yet.</Text>
                    </View>
                ) : (
                    <View style={styles.list}>
                        {sortedFavorites.map((quote, idx) => (
                            <QuoteCard
                                key={`${quote.id}-${idx}`}
                                quote={quote}
                                onToggleFavorite={onToggleFavorite}
                                onJournal={onJournal}
                                isFavorite={true}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020d08',
        padding: 16,
        paddingBottom: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
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
    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    iconButton: {
        padding: 12,
        borderRadius: 9999,
        backgroundColor: '#1a2e26',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        gap: 16,
    },
    emptyStateText: {
        color: 'rgba(148, 163, 184, 0.4)',
        fontSize: 16,
    },
    list: {
        gap: 16,
    },
});
