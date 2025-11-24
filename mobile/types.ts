
export enum HierarchyLevel {
  Physiological = "Physiological",
  Safety = "Safety",
  BelongingAndLove = "Belonging and Love",
  Esteem = "Esteem",
  Cognitive = "Cognitive",
  Aesthetic = "Aesthetic",
  SelfActualization = "Self-Actualization",
  Transcendence = "Transcendence"
}

export enum QuoteType {
  Daily = "Daily",
  Weekly = "Weekly", // Sunday
  Holiday = "Holiday",
  Birthday = "Birthday",
  Custom = "Custom Reward"
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  category?: string;
  isFavorite?: boolean;
  timestamp: number;
  type?: QuoteType;
  holidayName?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  mood?: string;
  tags?: string[];
  hierarchyLevel?: HierarchyLevel;
  linkedQuote?: Quote;
}

export interface UserProgress {
  quotesSaved: number;
  journalsWritten: number;
  rewardsAvailable: number;
  totalRewardsClaimed: number;
}

export interface UserSettings {
  currentLevel: HierarchyLevel;
  selectedGenres: string[];
  favorites: Quote[];
  hasOnboarded: boolean;
  progress: UserProgress;
  birthday?: string; // MM-DD format
}

export const HIERARCHY_ORDER = [
  HierarchyLevel.Physiological,
  HierarchyLevel.Safety,
  HierarchyLevel.BelongingAndLove,
  HierarchyLevel.Esteem,
  HierarchyLevel.Cognitive,
  HierarchyLevel.Aesthetic,
  HierarchyLevel.SelfActualization,
  HierarchyLevel.Transcendence
];

export type SortOption = 'date_desc' | 'date_asc' | 'genre' | 'level';
export type FilterOption = 'all' | HierarchyLevel | string;

// --- Community Backend Types ---
export interface UserProfile {
  id: string;
  username: string;
  badges: string[]; // e.g. "Journalist", "Collector"
}

export interface CommunityPost {
  id: string;
  userId: string;
  username: string;
  content: string; // Could be a quote or a journal snippet
  type: 'shared_quote' | 'shared_journal';
  likes: number;
  timestamp: number;
  tags: string[];
}
