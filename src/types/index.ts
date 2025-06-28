export interface HistoricalEvent {
  id: string;
  title: string;
  description: string;
  period: string;
  startYear: number;
  endYear: number;
  category: 'empire' | 'exploration' | 'technology' | 'cultural' | 'military';
  image: string;
  color: string;
  timeline: TimelineEvent[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  learningObjectives?: string[];
  keyFacts?: string[];
  quiz?: QuizQuestion[];
}

export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  type: 'major' | 'minor' | 'milestone' | 'battle' | 'treaty' | 'discovery';
  coordinates?: [number, number];
  significance?: number;
  casualties?: number;
  keyFigures?: string[];
  impact?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserProgress {
  userId: string;
  eventId: string;
  currentYear: number;
  completedQuizzes: string[];
  bookmarks: number[];
  notes: Map<number, string>;
  timeSpent: number;
  lastVisited: string;
  learningStreak: number;
  achievements: string[];
}

export interface LearningStats {
  totalTimeSpent: number;
  eventsCompleted: number;
  quizzesCompleted: number;
  currentStreak: number;
  favoriteCategory: string;
  knowledgeLevel: number;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'event' | 'figure' | 'artifact' | 'location';
  relevance: number;
  year?: number;
  eventId?: string;
  imageUrl?: string;
}

export interface WikipediaResult {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  pageUrl: string;
  coordinates?: [number, number];
}