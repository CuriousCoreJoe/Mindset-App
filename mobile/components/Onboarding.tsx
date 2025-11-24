import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { HierarchyLevel } from '../types';
import { ArrowRight, Check } from 'lucide-react-native';

interface Props {
    onComplete: (level: HierarchyLevel, genres: string[]) => void;
}

const NEEDS_QUESTIONS = [
    { level: HierarchyLevel.Physiological, label: "Health, Sleep, & Stability", desc: "I need to focus on my physical well-being and basic needs." },
    { level: HierarchyLevel.Safety, label: "Security & Peace", desc: "I want to feel safe, secure, and free from worry." },
    { level: HierarchyLevel.BelongingAndLove, label: "Connection & Love", desc: "I'm looking to improve my relationships and sense of belonging." },
    { level: HierarchyLevel.Esteem, label: "Confidence & Respect", desc: "I want to build my self-esteem and achieve my goals." },
    { level: HierarchyLevel.Cognitive, label: "Knowledge & Growth", desc: "I am seeking to learn, understand, and explore new ideas." },
    { level: HierarchyLevel.Aesthetic, label: "Beauty & Balance", desc: "I want to appreciate the beauty in art, nature, and life." },
    { level: HierarchyLevel.SelfActualization, label: "Purpose & Potential", desc: "I am ready to realize my full potential and true self." },
    { level: HierarchyLevel.Transcendence, label: "Spirituality & Service", desc: "I want to connect with something greater and help others." },
];

const ONBOARDING_GENRES = [
    "Wisdom", "Motivation", "Peace", "Love", "Success",
    "Happiness", "Strength", "Creativity", "Mindfulness", "Nature"
];

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [selectedLevel, setSelectedLevel] = useState<HierarchyLevel | null>(null);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    const toggleGenre = (g: string) => {
        if (selectedGenres.includes(g)) {
            setSelectedGenres(selectedGenres.filter(x => x !== g));
        } else {
            setSelectedGenres([...selectedGenres, g]);
        }
    };

    const handleNext = () => {
        if (step === 1 && selectedLevel) setStep(2);
        else if (step === 2) setStep(3);
        else if (step === 3 && selectedLevel) onComplete(selectedLevel, selectedGenres);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Progress */}
                <View style={styles.progressContainer}>
                    {[1, 2, 3].map(i => (
                        <View
                            key={i}
                            style={[
                                styles.progressBar,
                                step >= i ? styles.progressBarActive : styles.progressBarInactive
                            ]}
                        />
                    ))}
                </View>

                {step === 1 && (
                    <View>
                        <Text style={styles.title}>Where is your focus?</Text>
                        <Text style={styles.subtitle}>Select the area that matters most to you right now.</Text>
                        <View style={styles.listContainer}>
                            {NEEDS_QUESTIONS.map((q) => (
                                <TouchableOpacity
                                    key={q.level}
                                    onPress={() => setSelectedLevel(q.level)}
                                    style={[
                                        styles.card,
                                        selectedLevel === q.level ? styles.cardActive : styles.cardInactive
                                    ]}
                                >
                                    <Text style={styles.cardTitle}>{q.label}</Text>
                                    <Text style={styles.cardDesc}>{q.desc}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {step === 2 && (
                    <View>
                        <Text style={styles.title}>What inspires you?</Text>
                        <Text style={styles.subtitle}>Pick a few themes to get started.</Text>
                        <View style={styles.gridContainer}>
                            {ONBOARDING_GENRES.map((genre) => (
                                <TouchableOpacity
                                    key={genre}
                                    onPress={() => toggleGenre(genre)}
                                    style={[
                                        styles.genreButton,
                                        selectedGenres.includes(genre)
                                            ? styles.genreButtonActive
                                            : styles.genreButtonInactive
                                    ]}
                                >
                                    <Text style={[
                                        styles.genreText,
                                        selectedGenres.includes(genre) ? styles.genreTextActive : styles.genreTextInactive
                                    ]}>
                                        {genre}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {step === 3 && (
                    <View style={styles.finalStepContainer}>
                        <View style={styles.checkCircle}>
                            <Check size={40} color="#bfef00" />
                        </View>
                        <Text style={styles.title}>You're all set.</Text>
                        <Text style={styles.finalText}>
                            Mindset is designed to grow with you.
                            {'\n\n'}
                            Check in daily for quotes, explore new ideas, and use the Journal to reflect on your journey.
                        </Text>
                    </View>
                )}

                {/* Spacer for bottom button */}
                <View style={{ height: 100 }} />
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={handleNext}
                    disabled={step === 1 && !selectedLevel}
                    style={[
                        styles.nextButton,
                        (step === 1 && !selectedLevel) && styles.nextButtonDisabled
                    ]}
                >
                    <Text style={styles.nextButtonText}>
                        {step === 3 ? "Start Journey" : "Continue"}
                    </Text>
                    <ArrowRight size={20} color="#020d08" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020d08',
    },
    scrollContent: {
        padding: 24,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 32,
    },
    progressBar: {
        height: 4,
        width: 48,
        borderRadius: 9999,
    },
    progressBarActive: {
        backgroundColor: '#bfef00',
    },
    progressBarInactive: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: 32,
    },
    listContainer: {
        gap: 12,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    cardActive: {
        borderColor: '#bfef00',
        backgroundColor: 'rgba(191, 255, 0, 0.1)',
        shadowColor: '#bfef00',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 2,
    },
    cardInactive: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: '#1a2e26',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    genreButton: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        flexGrow: 1,
        alignItems: 'center',
    },
    genreButtonActive: {
        backgroundColor: '#bfef00',
        borderColor: '#bfef00',
    },
    genreButtonInactive: {
        backgroundColor: '#1a2e26',
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    genreText: {
        fontSize: 14,
        fontWeight: '500',
    },
    genreTextActive: {
        color: '#020d08',
    },
    genreTextInactive: {
        color: '#ffffff',
    },
    finalStepContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: Dimensions.get('window').height * 0.5,
    },
    checkCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#1a2e26',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    finalText: {
        fontSize: 18,
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: 28,
        marginTop: 16,
        maxWidth: 300,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: '#020d08',
    },
    nextButton: {
        width: '100%',
        paddingVertical: 16,
        backgroundColor: '#bfef00',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    nextButtonDisabled: {
        opacity: 0.5,
    },
    nextButtonText: {
        color: '#020d08',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
