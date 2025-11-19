import React, { useState } from 'react';
import { HierarchyLevel, HIERARCHY_ORDER } from '../types';
import { HIERARCHY_DESCRIPTIONS } from '../constants';
import { ArrowRight, Check } from 'lucide-react';

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

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState<HierarchyLevel | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // Simplified genre list for onboarding
  const ONBOARDING_GENRES = [
    "Wisdom", "Motivation", "Peace", "Love", "Success", 
    "Happiness", "Strength", "Creativity", "Mindfulness", "Nature"
  ];

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
    <div className="fixed inset-0 z-50 bg-mindset-bg text-white p-6 flex flex-col items-center justify-center overflow-y-auto">
      <div className="max-w-md w-full space-y-8 pb-20">
        
        {/* Progress */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1 w-12 rounded-full transition-colors ${step >= i ? 'bg-mindset-accent' : 'bg-white/10'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-center mb-2">Where is your focus?</h1>
            <p className="text-center text-mindset-muted mb-8">Select the area that matters most to you right now.</p>
            <div className="space-y-3">
              {NEEDS_QUESTIONS.map((q) => (
                <button
                  key={q.level}
                  onClick={() => setSelectedLevel(q.level)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    selectedLevel === q.level 
                      ? 'border-mindset-accent bg-mindset-accent/10 shadow-[0_0_15px_rgba(191,255,0,0.1)]' 
                      : 'border-white/10 bg-mindset-card hover:border-white/30'
                  }`}
                >
                  <h3 className="font-bold text-lg">{q.label}</h3>
                  <p className="text-sm text-mindset-text/70">{q.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-center mb-2">What inspires you?</h1>
            <p className="text-center text-mindset-muted mb-8">Pick a few themes to get started.</p>
            <div className="grid grid-cols-2 gap-3">
              {ONBOARDING_GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`p-3 rounded-lg border transition-all text-sm font-medium ${
                    selectedGenres.includes(genre)
                      ? 'bg-mindset-accent text-mindset-bg border-mindset-accent'
                      : 'bg-mindset-card text-white border-white/5 hover:border-white/20'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in text-center flex flex-col items-center justify-center h-[60vh]">
            <div className="w-20 h-20 bg-mindset-card rounded-full flex items-center justify-center mb-6 text-mindset-accent">
              <Check size={40} />
            </div>
            <h1 className="text-3xl font-bold mb-4">You're all set.</h1>
            <p className="text-mindset-muted text-lg leading-relaxed max-w-xs mx-auto">
              Mindset is designed to grow with you. 
              <br/><br/>
              Check in daily for quotes, explore new ideas, and use the Journal to reflect on your journey.
            </p>
          </div>
        )}

        <div className="fixed bottom-8 left-0 right-0 px-6 max-w-md mx-auto">
          <button
            onClick={handleNext}
            disabled={step === 1 && !selectedLevel}
            className="w-full py-4 bg-mindset-accent text-mindset-bg font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 3 ? "Start Journey" : "Continue"}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
