import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Quote, QuoteType } from '../types';
import { Heart, BookOpen, Share2, Calendar, Sparkles, PartyPopper, Gift } from 'lucide-react-native';

interface Props {
    quote: Quote;
    onToggleFavorite: (quote: Quote) => void;
    onJournal?: (quote: Quote) => void;
    isFavorite: boolean;
}

export const QuoteCard: React.FC<Props> = ({ quote, onToggleFavorite, onJournal, isFavorite }) => {

    const getTypeIcon = () => {
        switch (quote.type) {
            case QuoteType.Weekly: return <Calendar size={14} color="currentColor" style={styles.badgeIcon} />;
            case QuoteType.Holiday: return <Sparkles size={14} color="currentColor" style={styles.badgeIcon} />;
            case QuoteType.Birthday: return <PartyPopper size={14} color="currentColor" style={styles.badgeIcon} />;
            case QuoteType.Custom: return <Gift size={14} color="currentColor" style={styles.badgeIcon} />;
            default: return null;
        }
    };

    const getBadgeStyle = () => {
        switch (quote.type) {
            case QuoteType.Weekly: return styles.badgeWeekly;
            case QuoteType.Holiday: return styles.badgeHoliday;
            case QuoteType.Birthday: return styles.badgeBirthday;
            case QuoteType.Custom: return styles.badgeCustom;
            default: return styles.badgeDefault;
        }
    };

    const getBadgeTextStyle = () => {
        switch (quote.type) {
            case QuoteType.Weekly: return styles.badgeTextWeekly;
            case QuoteType.Holiday: return styles.badgeTextHoliday;
            case QuoteType.Birthday: return styles.badgeTextBirthday;
            case QuoteType.Custom: return styles.badgeTextCustom;
            default: return styles.badgeTextDefault;
        }
    };

    const getIconColor = (type: QuoteType) => {
        switch (type) {
            case QuoteType.Weekly: return '#93c5fd'; // blue-300
            case QuoteType.Holiday: return '#d8b4fe'; // purple-300
            case QuoteType.Birthday: return '#f9a8d4'; // pink-300
            case QuoteType.Custom: return '#fde047'; // yellow-300
            default: return '#bfef00'; // mindset-accent
        }
    }

    return (
        <View style={[
            styles.card,
            quote.type === QuoteType.Custom ? styles.cardCustom : styles.cardDefault
        ]}>
            <Text style={styles.quoteMark}>"</Text>

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={[styles.badge, getBadgeStyle()]}>
                        {/* We need to pass color explicitly to icons in RN usually or use style color inheritance if supported by library, 
                 but lucide-react-native usually takes color prop. 
                 For simplicity, I'll clone the element or just render conditionally with correct color.
             */}
                        {quote.type === QuoteType.Weekly && <Calendar size={14} color="#93c5fd" style={styles.badgeIcon} />}
                        {quote.type === QuoteType.Holiday && <Sparkles size={14} color="#d8b4fe" style={styles.badgeIcon} />}
                        {quote.type === QuoteType.Birthday && <PartyPopper size={14} color="#f9a8d4" style={styles.badgeIcon} />}
                        {quote.type === QuoteType.Custom && <Gift size={14} color="#fde047" style={styles.badgeIcon} />}

                        <Text style={[styles.badgeText, getBadgeTextStyle()]}>
                            {quote.type === QuoteType.Weekly ? "Quote of the Week" :
                                quote.type === QuoteType.Holiday ? quote.holidayName :
                                    quote.type === QuoteType.Custom ? "Reward for You" :
                                        quote.category || 'Wisdom'}
                        </Text>
                    </View>
                </View>

                <Text style={styles.quoteText}>
                    "{quote.text}"
                </Text>

                <View style={styles.footer}>
                    <Text style={styles.author}>
                        — {quote.author}
                    </Text>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            onPress={() => onToggleFavorite(quote)}
                            style={[styles.actionButton, isFavorite && styles.actionButtonFavorite]}
                        >
                            <Heart size={20} color={isFavorite ? "#ef4444" : "#94a3b8"} fill={isFavorite ? "#ef4444" : "none"} />
                        </TouchableOpacity>

                        {onJournal && (
                            <TouchableOpacity
                                onPress={() => onJournal(quote)}
                                style={styles.actionButton}
                            >
                                <BookOpen size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.actionButton}
                        >
                            <Share2 size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1a2e26', // mindset-card
        borderRadius: 16,
        padding: 24,
        marginBottom: 16,
        borderWidth: 1,
        position: 'relative',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    cardDefault: {
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    cardCustom: {
        borderColor: 'rgba(234, 179, 8, 0.3)', // yellow-500/30
    },
    quoteMark: {
        position: 'absolute',
        top: 0,
        right: 16,
        fontSize: 80,
        fontFamily: 'serif',
        color: '#bfef00',
        opacity: 0.1,
        lineHeight: 80,
    },
    content: {
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
    },
    badgeIcon: {
        marginRight: 4,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    // Weekly
    badgeWeekly: { backgroundColor: 'rgba(59, 130, 246, 0.2)', borderColor: 'rgba(59, 130, 246, 0.3)' },
    badgeTextWeekly: { color: '#93c5fd' },
    // Holiday
    badgeHoliday: { backgroundColor: 'rgba(168, 85, 247, 0.2)', borderColor: 'rgba(168, 85, 247, 0.3)' },
    badgeTextHoliday: { color: '#d8b4fe' },
    // Birthday
    badgeBirthday: { backgroundColor: 'rgba(236, 72, 153, 0.2)', borderColor: 'rgba(236, 72, 153, 0.3)' },
    badgeTextBirthday: { color: '#f9a8d4' },
    // Custom
    badgeCustom: { backgroundColor: 'rgba(234, 179, 8, 0.2)', borderColor: 'rgba(234, 179, 8, 0.3)' },
    badgeTextCustom: { color: '#fde047' },
    // Default
    badgeDefault: { backgroundColor: 'rgba(2, 13, 8, 0.5)', borderColor: 'rgba(191, 255, 0, 0.2)' },
    badgeTextDefault: { color: '#bfef00' },

    quoteText: {
        fontSize: 22, // roughly xl/2xl
        fontWeight: '300', // light
        color: '#ffffff',
        marginBottom: 24,
        fontStyle: 'italic',
        lineHeight: 32,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    author: {
        color: '#94a3b8',
        fontWeight: '500',
        fontSize: 14,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 8,
        borderRadius: 9999,
    },
    actionButtonFavorite: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
});
