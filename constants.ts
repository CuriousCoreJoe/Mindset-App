import { HierarchyLevel } from "./types";

export const QUOTE_GENRES = [
  "Beauty", "Change", "Confidence", "Courage", "Encouraging", 
  "Experience", "Encouragement", "Funny", "Forgiveness", "Happiness", 
  "Inspirational", "Journey", "Knowledge", "Karma", "Life", 
  "Leadership", "Learning", "Loyalty", "Motivational", "Moving On", 
  "Nature", "Optimistic", "Opportunity", "Positive", "Patience", 
  "Peace", "Power", "Quality", "Respect", "Trust", "Thankful", 
  "Uplifting", "Wisdom", "Work", "Yoga", "You're Beautiful",
  "Health", "Sleep", "Family", "Spirituality", "Creativity"
];

export const HIERARCHY_DESCRIPTIONS: Record<HierarchyLevel, string> = {
  [HierarchyLevel.Physiological]: "Focusing on basic survival needs: health, food, sleep.",
  [HierarchyLevel.Safety]: "Building security, stability, and freedom from fear.",
  [HierarchyLevel.BelongingAndLove]: "Cultivating relationships, intimacy, and connection.",
  [HierarchyLevel.Esteem]: "Developing self-respect, status, and recognition.",
  [HierarchyLevel.Cognitive]: "Seeking knowledge, understanding, and meaning.",
  [HierarchyLevel.Aesthetic]: "Appreciating beauty, balance, and form.",
  [HierarchyLevel.SelfActualization]: "Realizing personal potential and self-fulfillment.",
  [HierarchyLevel.Transcendence]: "Helping others to self-actualize and connecting to the universe."
};

export const HIERARCHY_GENRE_MAP: Record<HierarchyLevel, string[]> = {
  [HierarchyLevel.Physiological]: ["Health", "Sleep", "Patience", "Life", "Yoga"],
  [HierarchyLevel.Safety]: ["Peace", "Trust", "Work", "Stability", "Encouragement"],
  [HierarchyLevel.BelongingAndLove]: ["Family", "Loyalty", "Forgiveness", "Friendship", "Thankful"],
  [HierarchyLevel.Esteem]: ["Confidence", "Leadership", "Respect", "Power", "Courage"],
  [HierarchyLevel.Cognitive]: ["Wisdom", "Knowledge", "Learning", "Truth", "Experience"],
  [HierarchyLevel.Aesthetic]: ["Beauty", "Nature", "Art", "You're Beautiful", "Quality"],
  [HierarchyLevel.SelfActualization]: ["Journey", "Growth", "Creativity", "Opportunity", "Optimistic"],
  [HierarchyLevel.Transcendence]: ["Karma", "Spirituality", "Uplifting", "Change", "Moving On"]
};

export const MOCK_QUOTES = [
  {
    id: "1",
    text: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu",
    category: "Journey",
    timestamp: Date.now()
  },
  {
    id: "2",
    text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson",
    category: "Inspirational",
    timestamp: Date.now()
  }
];
