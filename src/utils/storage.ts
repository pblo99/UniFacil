import type {
  ChatMessage,
  ForumAnswer,
  ForumQuestion,
  Group,
  MaterialItem,
  Rating,
  StorageState
} from '../types/app';
import type {
  ForumDiscussionSummary,
  MaterialRecommendationResult,
  QuestionCategoryDecision,
  WeeklyPlan
} from '../types/intelligence';

export const STORAGE_KEY = 'unifacil_prototype_state';

function createInitialStorageState(): StorageState {
  return {
    isLoggedIn: false,
    sessionIdentifier: '',
    ratings: [],
    joinedGroupIds: [],
    customGroups: [],
    forumQuestions: [],
    forumAnswers: [],
    likedQuestionIds: [],
    chatMessages: [],
    customMaterials: [],
    interestedEventIds: [],
    lastWeeklyPlan: null,
    materialRecommendations: {},
    forumSummaries: {},
    questionCategoryDecisions: []
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function asRatings(value: unknown): Rating[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is Rating => {
    if (!isRecord(item)) {
      return false;
    }

    return (
      typeof item.disciplineId === 'string' &&
      typeof item.difficulty === 'number' &&
      typeof item.teaching === 'number' &&
      typeof item.workload === 'number' &&
      typeof item.organization === 'number' &&
      typeof item.recommend === 'boolean' &&
      typeof item.submittedAt === 'string'
    );
  });
}

function asGroups(value: unknown): Group[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is Group => {
    if (!isRecord(item)) {
      return false;
    }

    return (
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      typeof item.members === 'number' &&
      typeof item.description === 'string' &&
      typeof item.icon === 'string'
    );
  });
}

function asQuestions(value: unknown): ForumQuestion[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is ForumQuestion => {
    if (!isRecord(item)) {
      return false;
    }

    return (
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      typeof item.author === 'string' &&
      typeof item.tag === 'string' &&
      typeof item.body === 'string' &&
      typeof item.helpfulCount === 'number' &&
      typeof item.createdAt === 'string'
    );
  });
}

function asAnswers(value: unknown): ForumAnswer[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is ForumAnswer => {
    if (!isRecord(item)) {
      return false;
    }

    return (
      typeof item.id === 'string' &&
      typeof item.questionId === 'string' &&
      typeof item.author === 'string' &&
      typeof item.message === 'string' &&
      typeof item.createdAt === 'string'
    );
  });
}

function asChatMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is ChatMessage => {
    if (!isRecord(item)) {
      return false;
    }

    return (
      typeof item.id === 'string' &&
      typeof item.author === 'string' &&
      typeof item.message === 'string' &&
      typeof item.createdAt === 'string' &&
      typeof item.isOwn === 'boolean'
    );
  });
}

function asMaterials(value: unknown): MaterialItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is MaterialItem => {
    if (!isRecord(item)) {
      return false;
    }

    return (
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      typeof item.category === 'string' &&
      typeof item.typeLabel === 'string' &&
      typeof item.addedAt === 'string'
    );
  });
}

function asWeeklyPlan(value: unknown): WeeklyPlan | null {
  if (!isRecord(value) || !Array.isArray(value.priorities)) {
    return null;
  }

  if (
    typeof value.id !== 'string' ||
    typeof value.title !== 'string' ||
    typeof value.intro !== 'string' ||
    typeof value.closingMessage !== 'string' ||
    typeof value.generatedAt !== 'string' ||
    typeof value.sourceFingerprint !== 'string'
  ) {
    return null;
  }

  const priorities = value.priorities.filter((item): item is WeeklyPlan['priorities'][number] => {
    if (!isRecord(item)) {
      return false;
    }

    return (
      typeof item.id === 'string' &&
      typeof item.badge === 'string' &&
      typeof item.title === 'string' &&
      typeof item.description === 'string'
    );
  });

  return {
    id: value.id,
    title: value.title,
    intro: value.intro,
    priorities,
    closingMessage: value.closingMessage,
    generatedAt: value.generatedAt,
    sourceFingerprint: value.sourceFingerprint
  };
}

function asMaterialRecommendation(value: unknown): MaterialRecommendationResult | null {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    return null;
  }

  if (
    typeof value.disciplineId !== 'string' ||
    typeof value.headline !== 'string' ||
    typeof value.reason !== 'string' ||
    typeof value.generatedAt !== 'string' ||
    typeof value.sourceFingerprint !== 'string'
  ) {
    return null;
  }

  const items = value.items.filter((item): item is MaterialRecommendationResult['items'][number] => {
    if (!isRecord(item)) {
      return false;
    }

    return (
      typeof item.materialId === 'string' &&
      typeof item.title === 'string' &&
      typeof item.category === 'string' &&
      typeof item.typeLabel === 'string' &&
      typeof item.reason === 'string' &&
      typeof item.score === 'number'
    );
  });

  return {
    disciplineId: value.disciplineId,
    headline: value.headline,
    reason: value.reason,
    items,
    generatedAt: value.generatedAt,
    sourceFingerprint: value.sourceFingerprint
  };
}

function asForumSummary(value: unknown): ForumDiscussionSummary | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.questionId !== 'string' ||
    typeof value.problem !== 'string' ||
    typeof value.guidance !== 'string' ||
    typeof value.nextStep !== 'string' ||
    typeof value.category !== 'string' ||
    typeof value.answerCount !== 'number' ||
    typeof value.usefulCount !== 'number' ||
    typeof value.generatedAt !== 'string' ||
    typeof value.sourceFingerprint !== 'string'
  ) {
    return null;
  }

  return {
    questionId: value.questionId,
    problem: value.problem,
    guidance: value.guidance,
    nextStep: value.nextStep,
    category: value.category as ForumDiscussionSummary['category'],
    fewAnswersNotice: typeof value.fewAnswersNotice === 'string' ? value.fewAnswersNotice : undefined,
    answerCount: value.answerCount,
    usefulCount: value.usefulCount,
    generatedAt: value.generatedAt,
    sourceFingerprint: value.sourceFingerprint
  };
}

function asRecommendationMap(value: unknown): Record<string, MaterialRecommendationResult> {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, item]) => [key, asMaterialRecommendation(item)] as const)
      .filter((entry): entry is readonly [string, MaterialRecommendationResult] => entry[1] !== null)
  );
}

function asForumSummaryMap(value: unknown): Record<string, ForumDiscussionSummary> {
  if (!isRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, item]) => [key, asForumSummary(item)] as const)
      .filter((entry): entry is readonly [string, ForumDiscussionSummary] => entry[1] !== null)
  );
}

function asCategoryDecisions(value: unknown): QuestionCategoryDecision[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is QuestionCategoryDecision => {
    if (!isRecord(item)) {
      return false;
    }

    return (
      typeof item.questionId === 'string' &&
      typeof item.suggestedCategory === 'string' &&
      typeof item.finalCategory === 'string' &&
      typeof item.acceptedSuggestion === 'boolean' &&
      typeof item.confidence === 'string' &&
      typeof item.reason === 'string' &&
      typeof item.createdAt === 'string'
    );
  });
}

export function mergeStorageState(savedState: unknown): StorageState {
  const initialState = createInitialStorageState();

  if (!isRecord(savedState)) {
    return initialState;
  }

  return {
    isLoggedIn: typeof savedState.isLoggedIn === 'boolean' ? savedState.isLoggedIn : initialState.isLoggedIn,
    sessionIdentifier:
      typeof savedState.sessionIdentifier === 'string'
        ? savedState.sessionIdentifier
        : initialState.sessionIdentifier,
    ratings: asRatings(savedState.ratings),
    joinedGroupIds: asStringArray(savedState.joinedGroupIds),
    customGroups: asGroups(savedState.customGroups),
    forumQuestions: asQuestions(savedState.forumQuestions),
    forumAnswers: asAnswers(savedState.forumAnswers),
    likedQuestionIds: asStringArray(savedState.likedQuestionIds),
    chatMessages: asChatMessages(savedState.chatMessages),
    customMaterials: asMaterials(savedState.customMaterials),
    interestedEventIds: asStringArray(savedState.interestedEventIds),
    lastWeeklyPlan: asWeeklyPlan(savedState.lastWeeklyPlan),
    materialRecommendations: asRecommendationMap(savedState.materialRecommendations),
    forumSummaries: asForumSummaryMap(savedState.forumSummaries),
    questionCategoryDecisions: asCategoryDecisions(savedState.questionCategoryDecisions)
  };
}

export function loadStorageState(): StorageState {
  if (typeof window === 'undefined') {
    return createInitialStorageState();
  }

  try {
    const rawState = window.localStorage.getItem(STORAGE_KEY);

    if (!rawState) {
      return createInitialStorageState();
    }

    return mergeStorageState(JSON.parse(rawState));
  } catch {
    return createInitialStorageState();
  }
}

export function saveStorageState(state: StorageState): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetStorageState(): StorageState {
  const initialState = createInitialStorageState();

  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return initialState;
}
