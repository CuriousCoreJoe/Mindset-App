import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import { Gift, Leaf, Shield } from 'lucide-react-native';

interface Props {
    onSelectMode: (mode: 'kind' | 'helpful') => void;
    onClose: () => void;
    visible: boolean; // Added visible prop for RN Modal
}

export const RewardModal: React.FC<Props> = ({ onSelectMode, onClose, visible }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.gradientBar} />

                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Gift size={32} color="#facc15" />
                        </View>
                        <Text style={styles.title}>You've Earned a Reward!</Text>
                        <Text style={styles.description}>
                            You've been consistent with your mindfulness journey.
                            How would you like your custom insight today?
                        </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => onSelectMode('kind')}
                            style={styles.optionButton}
                        >
                            <View style={styles.optionIconKind}>
                                <Shield size={20} color="#4ade80" />
                            </View>
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionTitle}>Kind & Comforting</Text>
                                <Text style={styles.optionDesc}>Reinforce your strengths and find peace.</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => onSelectMode('helpful')}
                            style={styles.optionButton}
                        >
                            <View style={styles.optionIconHelpful}>
                                <Leaf size={20} color="#60a5fa" />
                            </View>
                            <View style={styles.optionTextContainer}>
                                <Text style={styles.optionTitle}>Helpful & Challenging</Text>
                                <Text style={styles.optionDesc}>Explore new perspectives and grow.</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeButton}
                    >
                        <Text style={styles.closeButtonText}>Save for later</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContainer: {
        backgroundColor: '#1a2e26', // mindset-card
        borderColor: 'rgba(234, 179, 8, 0.3)',
        borderWidth: 1,
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 380,
        position: 'relative',
        overflow: 'hidden',
        shadowColor: 'rgba(234, 179, 8, 0.1)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 30,
        elevation: 10,
    },
    gradientBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: '#eab308', // yellow-500 simplified
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    iconContainer: {
        width: 64,
        height: 64,
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
        textAlign: 'center',
    },
    description: {
        color: '#94a3b8',
        fontSize: 14,
        textAlign: 'center',
    },
    buttonContainer: {
        gap: 12,
    },
    optionButton: {
        width: '100%',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    optionIconKind: {
        padding: 8,
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderRadius: 8,
    },
    optionIconHelpful: {
        padding: 8,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderRadius: 8,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 2,
    },
    optionDesc: {
        fontSize: 12,
        color: '#94a3b8',
    },
    closeButton: {
        marginTop: 24,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 12,
        color: '#94a3b8',
        textDecorationLine: 'underline',
    },
});
