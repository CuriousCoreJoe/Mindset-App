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

export interface Quote {
  id: string;
  text: string;
  author: string;
  category?: string;
  isFavorite?: boolean;
  timestamp: number;
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

export interface UserSettings {
  currentLevel: HierarchyLevel;
  selectedGenres: string[];
  favorites: Quote[];
  hasOnboarded: boolean;
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
