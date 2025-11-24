import React, { useRef, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, LayoutChangeEvent, Dimensions } from 'react-native';
import { HIERARCHY_ORDER, HierarchyLevel } from '../types';
import { ChevronRight, ChevronLeft } from 'lucide-react-native';

interface Props {
  currentLevel: HierarchyLevel;
  onSelect: (level: HierarchyLevel) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export const HierarchySelector: React.FC<Props> = ({ currentLevel, onSelect }) => {
  const scrollRef = useRef<ScrollView>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [itemLayouts, setItemLayouts] = useState<{ [key: string]: { x: number, width: number } }>({});

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    setShowLeft(contentOffset.x > 0);
    setShowRight(contentOffset.x < contentSize.width - layoutMeasurement.width - 5);
  };

  const handleItemLayout = (level: string, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setItemLayouts(prev => ({
      ...prev,
      [level]: { x, width }
    }));
  };

  useEffect(() => {
    // Center the active element
    if (itemLayouts[currentLevel] && scrollRef.current) {
      const { x, width } = itemLayouts[currentLevel];
      const offset = x - SCREEN_WIDTH / 2 + width / 2;
      scrollRef.current.scrollTo({ x: offset, animated: true });
    }
  }, [currentLevel, itemLayouts]);

  return (
    <View style={styles.container}>
      {/* Scroll Indicators */}
      {showLeft && (
        <View style={[styles.indicator, styles.indicatorLeft]}>
          <ChevronLeft color="#94a3b8" size={20} />
        </View>
      )}
      {showRight && (
        <View style={[styles.indicator, styles.indicatorRight]}>
          <ChevronRight color="#94a3b8" size={20} />
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {HIERARCHY_ORDER.map((level) => {
          const isActive = level === currentLevel;
          return (
            <TouchableOpacity
              key={level}
              onPress={() => onSelect(level)}
              onLayout={(e) => handleItemLayout(level, e)}
              style={[
                styles.button,
                isActive ? styles.buttonActive : styles.buttonInactive
              ]}
            >
              <Text style={[
                styles.text,
                isActive ? styles.textActive : styles.textInactive
              ]}>
                {level}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 60,
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    gap: 12,
    alignItems: 'center',
  },
  indicator: {
    position: 'absolute',
    top: '50%',
    marginTop: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1a2e26',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  indicatorLeft: {
    left: 4,
  },
  indicatorRight: {
    right: 4,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
    borderWidth: 1,
    marginRight: 12,
  },
  buttonActive: {
    backgroundColor: '#bfef00', // mindset-accent
    borderColor: '#bfef00',
    // shadow-[0_0_15px_rgba(191,255,0,0.3)]
    shadowColor: '#bfef00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
    transform: [{ scale: 1.05 }],
  },
  buttonInactive: {
    backgroundColor: '#1a2e26', // mindset-card
    borderColor: '#1a2e26',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  textActive: {
    color: '#020d08', // mindset-bg
  },
  textInactive: {
    color: '#94a3b8', // mindset-muted
  },
});
