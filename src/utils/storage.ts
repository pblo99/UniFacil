import type {
  ChatMessage,
  ForumAnswer,
  ForumQuestion,
  Group,
  MaterialItem,
  Rating,
  StorageState
} from '../types/app';

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
    interestedEventIds: []
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
    interestedEventIds: asStringArray(savedState.interestedEventIds)
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
