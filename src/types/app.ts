import type {
  ForumDiscussionSummary,
  MaterialRecommendationResult,
  QuestionCategoryDecision,
  WeeklyPlan
} from './intelligence';

export type AppScreen =
  | 'splash'
  | 'login'
  | 'home'
  | 'disciplines'
  | 'discipline-detail'
  | 'rating'
  | 'groups'
  | 'forum'
  | 'chat'
  | 'materials'
  | 'events'
  | 'more';

export type MainScreen = 'home' | 'disciplines' | 'groups' | 'chat' | 'more';

export type IconKey =
  | 'graduation-cap'
  | 'database'
  | 'layout'
  | 'blocks'
  | 'code'
  | 'smartphone'
  | 'network'
  | 'book-open'
  | 'clipboard'
  | 'folder'
  | 'users'
  | 'calendar'
  | 'megaphone'
  | 'messages'
  | 'bell'
  | 'file-stack'
  | 'sparkles'
  | 'map-pin';

export type NoticeTone = 'info' | 'success' | 'warning' | 'danger';

export type MaterialCategory =
  | 'Resumos'
  | 'Provas Antigas'
  | 'Apostilas'
  | 'Slides de Aula'
  | 'Links Úteis'
  | 'Outros';

export interface UserProfile {
  name: string;
  ra: string;
  course: string;
  institution: string;
  email: string;
}

export interface Professor {
  id: string;
  name: string;
  area: string;
  email: string;
  officeHours: string;
}

export interface Discipline {
  id: string;
  name: string;
  professorId: string;
  schedule: string;
  location: string;
  averageRating: number;
  reviewCount: number;
  icon: IconKey;
  nextTopics: string[];
}

export interface Group {
  id: string;
  name: string;
  members: number;
  description: string;
  icon: IconKey;
  createdByUser?: boolean;
}

export interface ForumQuestion {
  id: string;
  title: string;
  author: string;
  tag: string;
  body: string;
  helpfulCount: number;
  createdAt: string;
  createdByUser?: boolean;
}

export interface ForumAnswer {
  id: string;
  questionId: string;
  author: string;
  message: string;
  createdAt: string;
  createdByUser?: boolean;
}

export interface ChatMessage {
  id: string;
  author: string;
  message: string;
  createdAt: string;
  isOwn: boolean;
}

export interface MaterialFolder {
  id: string;
  name: MaterialCategory;
  itemsCount: number;
  icon: IconKey;
}

export interface MaterialItem {
  id: string;
  title: string;
  category: MaterialCategory;
  typeLabel: string;
  addedAt: string;
  disciplineId?: string;
  addedByUser?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  startsAt: string;
  location: string;
  category: string;
  icon: IconKey;
  description: string;
}

export interface Notice {
  id: string;
  title: string;
  message: string;
  tone: NoticeTone;
  createdAt: string;
}

export interface ExamItem {
  id: string;
  disciplineId: string;
  title: string;
  scheduledAt: string;
  location: string;
}

export interface Rating {
  disciplineId: string;
  difficulty: number;
  teaching: number;
  workload: number;
  organization: number;
  recommend: boolean;
  submittedAt: string;
}

export interface StorageState {
  isLoggedIn: boolean;
  sessionIdentifier: string;
  ratings: Rating[];
  joinedGroupIds: string[];
  customGroups: Group[];
  forumQuestions: ForumQuestion[];
  forumAnswers: ForumAnswer[];
  likedQuestionIds: string[];
  chatMessages: ChatMessage[];
  customMaterials: MaterialItem[];
  interestedEventIds: string[];
  lastWeeklyPlan: WeeklyPlan | null;
  materialRecommendations: Record<string, MaterialRecommendationResult>;
  forumSummaries: Record<string, ForumDiscussionSummary>;
  questionCategoryDecisions: QuestionCategoryDecision[];
}
