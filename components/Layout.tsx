import React from 'react';
import { Home, Compass, BookHeart, Book } from 'lucide-react';

type View = 'home' | 'explore' | 'journey' | 'favorites';

interface Props {
  currentView: View;
  setView: (v: View) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ currentView, setView, children }) => {
  const navItems: { id: View; icon: React.ElementType; label: string }[] = [
    { id: 'home', icon: Home, label: 'Daily' },
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'journey', icon: Book, label: 'Journey' },
    { id: 'favorites', icon: BookHeart, label: 'Favorites' },
  ];

  return (
    <div className="min-h-screen bg-mindset-bg text-mindset-text font-sans flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden">
      <main className="flex-1 overflow-y-auto no-scrollbar bg-gradient-to-b from-mindset-bg to-[#020d08]">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 max-w-md w-full bg-mindset-bg/90 backdrop-blur-md border-t border-white/5 pb-safe pt-2 px-6 z-50">
        <div className="flex justify-between items-center py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                  isActive ? 'text-mindset-accent -translate-y-1' : 'text-mindset-muted/50 hover:text-mindset-muted'
                }`}
              >
                <Icon size={isActive ? 26 : 22} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};