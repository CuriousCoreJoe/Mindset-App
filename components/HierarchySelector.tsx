import React, { useRef, useState, useEffect } from 'react';
import { HIERARCHY_ORDER, HierarchyLevel } from '../types';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Props {
  currentLevel: HierarchyLevel;
  onSelect: (level: HierarchyLevel) => void;
}

export const HierarchySelector: React.FC<Props> = ({ currentLevel, onSelect }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    handleScroll();
    // Center the active element on mount if needed
    const activeEl = document.getElementById(`level-${currentLevel}`);
    if (activeEl && scrollRef.current) {
      const offset = activeEl.offsetLeft - scrollRef.current.clientWidth / 2 + activeEl.clientWidth / 2;
      scrollRef.current.scrollTo({ left: offset, behavior: 'smooth' });
    }
  }, [currentLevel]);

  return (
    <div className="relative group">
      {/* Scroll Indicators */}
      {showLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-mindset-bg to-transparent z-10 flex items-center">
          <ChevronLeft className="text-mindset-muted animate-pulse" size={20} />
        </div>
      )}
      {showRight && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-mindset-bg to-transparent z-10 flex items-center justify-end">
          <ChevronRight className="text-mindset-muted animate-pulse" size={20} />
        </div>
      )}

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto no-scrollbar gap-3 py-4 px-2 snap-x scroll-smooth"
      >
        {HIERARCHY_ORDER.map((level) => {
          const isActive = level === currentLevel;
          return (
            <button
              key={level}
              id={`level-${level}`}
              onClick={() => onSelect(level)}
              className={`
                snap-center shrink-0 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-300
                ${isActive 
                  ? 'bg-mindset-accent text-mindset-bg border-mindset-accent shadow-[0_0_15px_rgba(191,255,0,0.3)] scale-105' 
                  : 'bg-mindset-card text-mindset-muted border-mindset-card hover:border-mindset-muted hover:text-white'}
              `}
            >
              {level}
            </button>
          );
        })}
      </div>
    </div>
  );
};
