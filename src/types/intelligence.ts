import type {
  ChatMessage,
  Discipline,
  EventItem,
  ExamItem,
  ForumAnswer,
  ForumQuestion,
  Group,
  MaterialItem,
  Notice,
  Professor,
  Rating,
  UserProfile
} from './app';

export type IntelligenceBadge = 'Prova' | 'Material' | 'Evento' | 'Grupo' | 'Fórum' | 'Aviso' | 'Avaliação';

export type QuestionCategory =
  | 'Banco de Dados'
  | 'Estrutura de Dados'
  | 'Engenharia de Software'
  | 'Linguagem de Programação'
  | 'Usabilidade'
  | 'Acadêmico'
  | 'Eventos'
  | 'Materiais'
  | 'Geral';

export type SuggestionConfidence = 'alta' | 'média' | 'baixa';

export interface IntelligenceContext {
  user: UserProfile;
  disciplines: Discipline[];
  professors: Professor[];
  groups: Group[];
  forumQuestions: ForumQuestion[];
  forumAnswers: ForumAnswer[];
  chatMessages: ChatMessage[];
  materials: MaterialItem[];
  events: EventItem[];
  notices: Notice[];
  exams: ExamItem[];
  ratings: Rating[];
  joinedGroupIds: string[];
  interestedEventIds: string[];
  likedQuestionIds: string[];
  generatedAt: string;
}

export interface IntelligenceStateInput {
  user: UserProfile;
  disciplines: Discipline[];
  professors: Professor[];
  groups: Group[];
  forumQuestions: ForumQuestion[];
  forumAnswers: ForumAnswer[];
  chatMessages: ChatMessage[];
  materials: MaterialItem[];
  events: EventItem[];
  notices: Notice[];
  exams: ExamItem[];
  ratings: Rating[];
  joinedGroupIds: string[];
  interestedEventIds: string[];
  likedQuestionIds: string[];
}

export interface WeeklyPriority {
  id: string;
  badge: IntelligenceBadge;
  title: string;
  description: string;
  disciplineId?: string;
  sourceId?: string;
}

export interface WeeklyPlan {
  id: string;
  title: string;
  intro: string;
  priorities: WeeklyPriority[];
  closingMessage: string;
  generatedAt: string;
  sourceFingerprint: string;
}

export interface MaterialRecommendation {
  materialId: string;
  title: string;
  category: string;
  typeLabel: string;
  reason: string;
  score: number;
}

export interface MaterialRecommendationResult {
  disciplineId: string;
  headline: string;
  reason: string;
  items: MaterialRecommendation[];
  generatedAt: string;
  sourceFingerprint: string;
}

export interface ForumDiscussionSummary {
  questionId: string;
  problem: string;
  guidance: string;
  nextStep: string;
  category: QuestionCategory;
  fewAnswersNotice?: string;
  answerCount: number;
  usefulCount: number;
  generatedAt: string;
  sourceFingerprint: string;
}

export interface CategorySuggestion {
  category: QuestionCategory;
  confidence: SuggestionConfidence;
  reason: string;
  matchedTerms: string[];
}

export interface QuestionCategoryDecision {
  questionId: string;
  suggestedCategory: QuestionCategory;
  finalCategory: QuestionCategory;
  acceptedSuggestion: boolean;
  confidence: SuggestionConfidence;
  reason: string;
  createdAt: string;
}

export type IntelligencePayloadKind = 'weekly-plan' | 'material-recommendation' | 'forum-summary';

export interface ExternalIntelligencePayload {
  kind: IntelligencePayloadKind;
  context: IntelligenceContext;
  disciplineId?: string;
  questionId?: string;
}
