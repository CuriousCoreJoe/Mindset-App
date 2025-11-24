import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { Home, Compass, BookHeart, Book } from 'lucide-react-native';

type ViewType = 'home' | 'explore' | 'journey' | 'favorites';

interface Props {
    currentView: ViewType;
    setView: (v: ViewType) => void;
    children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ currentView, setView, children }) => {
    const navItems: { id: ViewType; icon: React.ElementType; label: string }[] = [
        { id: 'home', icon: Home, label: 'Daily' },
        { id: 'explore', icon: Compass, label: 'Explore' },
        { id: 'journey', icon: Book, label: 'Journey' },
        { id: 'favorites', icon: BookHeart, label: 'Favorites' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {children}
            </View>

            {/* Bottom Navigation */}
            <View style={styles.navBar}>
                <View style={styles.navContent}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => setView(item.id)}
                                style={[
                                    styles.navItem,
                                    isActive && styles.navItemActive
                                ]}
                                activeOpacity={0.7}
                            >
                                <Icon
                                    size={isActive ? 26 : 22}
                                    color={isActive ? '#bfef00' : 'rgba(148, 163, 184, 0.5)'}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <Text style={[
                                    styles.navLabel,
                                    { opacity: isActive ? 1 : 0 }
                                ]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020d08', // mindset-bg
    },
    content: {
        flex: 1,
        backgroundColor: '#020d08',
    },
    navBar: {
        backgroundColor: 'rgba(2, 13, 8, 0.9)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        paddingBottom: Platform.OS === 'ios' ? 0 : 10, // Safe area handled by SafeAreaView wrapper usually, but explicit padding helps
    },
    navContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 24,
    },
    navItem: {
        alignItems: 'center',
        gap: 4,
        padding: 4,
    },
    navItemActive: {
        transform: [{ translateY: -4 }],
    },
    navLabel: {
        fontSize: 10,
        fontWeight: '500',
        color: '#bfef00', // mindset-accent
    },
});
