import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AppShell from './components/AppShell';
import {
  chatMessages,
  disciplines,
  events,
  exams,
  forumAnswers,
  forumQuestions,
  groups,
  materialFolders,
  materials,
  notices,
  professors,
  userProfile
} from './data/mockData';
import {
  buildIntelligenceContext,
  createExternalIntelligenceContext,
  generateWeeklyPlan,
  isForumDiscussionSummary,
  isMaterialRecommendationResult,
  isWeeklyPlan,
  maybeUseExternalIntelligence,
  recommendMaterials,
  summarizeForumDiscussion
} from './services/academicIntelligence';
import ChatScreen from './screens/ChatScreen';
import DisciplineDetailScreen from './screens/DisciplineDetailScreen';
import DisciplinesScreen from './screens/DisciplinesScreen';
import EventsScreen from './screens/EventsScreen';
import ForumScreen from './screens/ForumScreen';
import GroupsScreen from './screens/GroupsScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import MaterialsScreen from './screens/MaterialsScreen';
import MoreScreen from './screens/MoreScreen';
import RatingScreen from './screens/RatingScreen';
import SplashScreen from './screens/SplashScreen';
import type { AppScreen, MainScreen, Rating, StorageState } from './types/app';
import type {
  CategorySuggestion,
  ForumDiscussionSummary,
  MaterialRecommendationResult,
  QuestionCategory,
  WeeklyPlan
} from './types/intelligence';
import { loadStorageState, resetStorageState, saveStorageState } from './utils/storage';

function sortDescendingByDate<T extends { createdAt?: string; addedAt?: string }>(items: T[]): T[] {
  return [...items].sort((first, second) => {
    const firstDate = new Date(first.createdAt ?? first.addedAt ?? '').getTime();
    const secondDate = new Date(second.createdAt ?? second.addedAt ?? '').getTime();
    return secondDate - firstDate;
  });
}

export default function App() {
  const [storageState, setStorageState] = useState<StorageState>(() => loadStorageState());
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(() => (loadStorageState().isLoggedIn ? 'home' : 'splash'));
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string>(disciplines[0].id);
  const [returnScreen, setReturnScreen] = useState<AppScreen>('home');

  useEffect(() => {
    saveStorageState(storageState);
  }, [storageState]);

  const allGroups = [...groups, ...storageState.customGroups];
  const allQuestions = sortDescendingByDate([...forumQuestions, ...storageState.forumQuestions]);
  const allAnswers = [...forumAnswers, ...storageState.forumAnswers].sort(
    (first, second) => new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
  );
  const allMessages = [...chatMessages, ...storageState.chatMessages].sort(
    (first, second) => new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
  );
  const allMaterials = sortDescendingByDate([...materials, ...storageState.customMaterials]);
  const sortedEvents = [...events].sort((first, second) => new Date(first.startsAt).getTime() - new Date(second.startsAt).getTime());
  const sortedExams = [...exams].sort(
    (first, second) => new Date(first.scheduledAt).getTime() - new Date(second.scheduledAt).getTime()
  );
  const sortedNotices = [...notices].sort(
    (first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
  );

  const selectedDiscipline = disciplines.find((discipline) => discipline.id === selectedDisciplineId) ?? disciplines[0];
  const selectedProfessor =
    professors.find((professor) => professor.id === selectedDiscipline.professorId) ?? professors[0];
  const selectedRating = storageState.ratings.find((rating) => rating.disciplineId === selectedDiscipline.id);
  const relatedMaterials = allMaterials
    .filter((material) => material.disciplineId === selectedDiscipline.id)
    .slice(0, 3);
  const relatedQuestions = (() => {
    const matches = allQuestions.filter(
      (question) =>
        question.tag === selectedDiscipline.name ||
        question.title.includes(selectedDiscipline.name) ||
        question.body.includes(selectedDiscipline.name)
    );

    return (matches.length > 0 ? matches : allQuestions).slice(0, 3);
  })();

  const showBottomNav =
    storageState.isLoggedIn &&
    (currentScreen === 'home' ||
      currentScreen === 'disciplines' ||
      currentScreen === 'groups' ||
      currentScreen === 'chat' ||
      currentScreen === 'more');

  const setMainScreen = (screen: MainScreen) => {
    setCurrentScreen(screen);
  };

  const openMaterials = (from: AppScreen) => {
    setReturnScreen(from);
    setCurrentScreen('materials');
  };

  const openForum = (from: AppScreen) => {
    setReturnScreen(from);
    setCurrentScreen('forum');
  };

  const openEvents = (from: AppScreen) => {
    setReturnScreen(from);
    setCurrentScreen('events');
  };

  const handleLogin = (identifier: string) => {
    setStorageState((current) => ({
      ...current,
      isLoggedIn: true,
      sessionIdentifier: identifier
    }));
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setStorageState((current) => ({
      ...current,
      isLoggedIn: false,
      sessionIdentifier: ''
    }));
    setCurrentScreen('login');
  };

  const handleResetPrototype = () => {
    setStorageState(resetStorageState());
    setCurrentScreen('login');
    setReturnScreen('home');
    setSelectedDisciplineId(disciplines[0].id);
  };

  const handleSaveRating = (rating: Rating) => {
    setStorageState((current) => ({
      ...current,
      ratings: [...current.ratings.filter((item) => item.disciplineId !== rating.disciplineId), rating]
    }));
  };

  const handleToggleGroup = (groupId: string) => {
    setStorageState((current) => {
      const joinedGroupIds = current.joinedGroupIds.includes(groupId)
        ? current.joinedGroupIds.filter((item) => item !== groupId)
        : [...current.joinedGroupIds, groupId];

      return {
        ...current,
        joinedGroupIds
      };
    });
  };

  const handleCreateGroup = (name: string, description: string) => {
    const groupId = `group-${Date.now()}`;

    setStorageState((current) => ({
      ...current,
      customGroups: [
        {
          id: groupId,
          name,
          description,
          members: 1,
          icon: 'users',
          createdByUser: true
        },
        ...current.customGroups
      ],
      joinedGroupIds: [...current.joinedGroupIds, groupId]
    }));
  };

  const handleCreateQuestion = (title: string, tag: QuestionCategory, body: string, suggestion: CategorySuggestion) => {
    const questionId = `question-${Date.now()}`;

    setStorageState((current) => ({
      ...current,
      forumQuestions: [
        {
          id: questionId,
          title,
          author: userProfile.name,
          tag,
          body,
          helpfulCount: 0,
          createdAt: new Date().toISOString(),
          createdByUser: true
        },
        ...current.forumQuestions
      ],
      questionCategoryDecisions: [
        ...current.questionCategoryDecisions,
        {
          questionId,
          suggestedCategory: suggestion.category,
          finalCategory: tag,
          acceptedSuggestion: tag === suggestion.category,
          confidence: suggestion.confidence,
          reason: suggestion.reason,
          createdAt: new Date().toISOString()
        }
      ]
    }));
  };

  const handleCreateAnswer = (questionId: string, message: string) => {
    setStorageState((current) => ({
      ...current,
      forumAnswers: [
        ...current.forumAnswers,
        {
          id: `answer-${Date.now()}`,
          questionId,
          author: userProfile.name,
          message,
          createdAt: new Date().toISOString(),
          createdByUser: true
        }
      ],
      forumSummaries: Object.fromEntries(
        Object.entries(current.forumSummaries).filter(([summaryQuestionId]) => summaryQuestionId !== questionId)
      )
    }));
  };

  const handleToggleUseful = (questionId: string) => {
    setStorageState((current) => ({
      ...current,
      likedQuestionIds: current.likedQuestionIds.includes(questionId)
        ? current.likedQuestionIds.filter((item) => item !== questionId)
        : [...current.likedQuestionIds, questionId]
    }));
  };

  const handleSendMessage = (message: string) => {
    setStorageState((current) => ({
      ...current,
      chatMessages: [
        ...current.chatMessages,
        {
          id: `message-${Date.now()}`,
          author: userProfile.name.split(' ')[0],
          message,
          createdAt: new Date().toISOString(),
          isOwn: true
        }
      ]
    }));
  };

  const handleAddMaterial = (title: string, category: (typeof materialFolders)[number]['name'], typeLabel: string) => {
    setStorageState((current) => ({
      ...current,
      customMaterials: [
        {
          id: `material-${Date.now()}`,
          title,
          category,
          typeLabel,
          addedAt: new Date().toISOString(),
          addedByUser: true
        },
        ...current.customMaterials
      ]
    }));
  };

  const handleToggleEventInterest = (eventId: string) => {
    setStorageState((current) => ({
      ...current,
      interestedEventIds: current.interestedEventIds.includes(eventId)
        ? current.interestedEventIds.filter((item) => item !== eventId)
        : [...current.interestedEventIds, eventId]
    }));
  };

  const getAverageForDiscipline = (disciplineId: string) => {
    const discipline = disciplines.find((item) => item.id === disciplineId);

    if (!discipline) {
      return 0;
    }

    const ratings = storageState.ratings.filter((item) => item.disciplineId === disciplineId);

    if (ratings.length === 0) {
      return discipline.averageRating;
    }

    const customTotal = ratings.reduce(
      (total, rating) => total + (rating.difficulty + rating.teaching + rating.workload + rating.organization) / 4,
      0
    );

    return Number(
      (
        (discipline.averageRating * discipline.reviewCount + customTotal) /
        (discipline.reviewCount + ratings.length)
      ).toFixed(1)
    );
  };

  const interestedEvents = sortedEvents.filter((event) => storageState.interestedEventIds.includes(event.id));
  const intelligenceContext = buildIntelligenceContext({
    user: userProfile,
    disciplines,
    professors,
    groups: allGroups,
    forumQuestions: allQuestions,
    forumAnswers: allAnswers,
    chatMessages: allMessages,
    materials: allMaterials,
    events: sortedEvents,
    notices: sortedNotices,
    exams: sortedExams,
    ratings: storageState.ratings,
    joinedGroupIds: storageState.joinedGroupIds,
    interestedEventIds: storageState.interestedEventIds,
    likedQuestionIds: storageState.likedQuestionIds
  });

  const handleGenerateWeeklyPlan = async (): Promise<WeeklyPlan> => {
    const plan = await maybeUseExternalIntelligence(
      {
        kind: 'weekly-plan',
        context: createExternalIntelligenceContext(intelligenceContext)
      },
      () => generateWeeklyPlan(intelligenceContext),
      isWeeklyPlan
    );

    setStorageState((current) => ({
      ...current,
      lastWeeklyPlan: plan
    }));

    return plan;
  };

  const handleClearWeeklyPlan = () => {
    setStorageState((current) => ({
      ...current,
      lastWeeklyPlan: null
    }));
  };

  const handleGenerateMaterialRecommendations = async (
    disciplineId: string
  ): Promise<MaterialRecommendationResult> => {
    const result = await maybeUseExternalIntelligence(
      {
        kind: 'material-recommendation',
        context: createExternalIntelligenceContext(intelligenceContext),
        disciplineId
      },
      () => recommendMaterials(intelligenceContext, disciplineId),
      isMaterialRecommendationResult
    );

    setStorageState((current) => ({
      ...current,
      materialRecommendations: {
        ...current.materialRecommendations,
        [disciplineId]: result
      }
    }));

    return result;
  };

  const handleGenerateForumSummary = async (questionId: string): Promise<ForumDiscussionSummary> => {
    const summary = await maybeUseExternalIntelligence(
      {
        kind: 'forum-summary',
        context: createExternalIntelligenceContext(intelligenceContext),
        questionId
      },
      () => summarizeForumDiscussion(intelligenceContext, questionId),
      isForumDiscussionSummary
    );

    setStorageState((current) => ({
      ...current,
      forumSummaries: {
        ...current.forumSummaries,
        [questionId]: summary
      }
    }));

    return summary;
  };

  const screenContent = (() => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onStart={() => setCurrentScreen('login')} />;
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'home':
        return (
          <HomeScreen
            user={userProfile}
            nextEvent={sortedEvents[0]}
            nextExam={sortedExams[0]}
            importantNotice={sortedNotices[0]}
            weeklyPlan={storageState.lastWeeklyPlan}
            onGenerateWeeklyPlan={handleGenerateWeeklyPlan}
            onClearWeeklyPlan={handleClearWeeklyPlan}
            onOpenDisciplines={() => setCurrentScreen('disciplines')}
            onOpenGroups={() => setCurrentScreen('groups')}
            onOpenMaterials={() => openMaterials('home')}
            onOpenEvents={() => openEvents('home')}
          />
        );
      case 'disciplines':
        return (
          <DisciplinesScreen
            disciplines={disciplines}
            professors={professors}
            getAverageForDiscipline={getAverageForDiscipline}
            onSelectDiscipline={(disciplineId) => {
              setSelectedDisciplineId(disciplineId);
              setCurrentScreen('discipline-detail');
            }}
          />
        );
      case 'discipline-detail':
        return (
          <DisciplineDetailScreen
            discipline={selectedDiscipline}
            professor={selectedProfessor}
            average={getAverageForDiscipline(selectedDiscipline.id)}
            recentMaterials={relatedMaterials}
            recentQuestions={relatedQuestions}
            recommendation={storageState.materialRecommendations[selectedDiscipline.id]}
            onBack={() => setCurrentScreen('disciplines')}
            onOpenRating={() => setCurrentScreen('rating')}
            onOpenMaterials={() => openMaterials('discipline-detail')}
            onOpenForum={() => openForum('discipline-detail')}
            onGenerateRecommendations={handleGenerateMaterialRecommendations}
          />
        );
      case 'rating':
        return (
          <RatingScreen
            discipline={selectedDiscipline}
            initialRating={selectedRating}
            onBack={() => setCurrentScreen('discipline-detail')}
            onSave={handleSaveRating}
          />
        );
      case 'groups':
        return (
          <GroupsScreen
            groups={allGroups}
            joinedGroupIds={storageState.joinedGroupIds}
            onToggleGroup={handleToggleGroup}
            onCreateGroup={handleCreateGroup}
          />
        );
      case 'forum':
        return (
          <ForumScreen
            questions={allQuestions}
            answers={allAnswers}
            likedQuestionIds={storageState.likedQuestionIds}
            summaries={storageState.forumSummaries}
            onBack={() => setCurrentScreen(returnScreen)}
            onCreateQuestion={handleCreateQuestion}
            onCreateAnswer={handleCreateAnswer}
            onToggleUseful={handleToggleUseful}
            onGenerateSummary={handleGenerateForumSummary}
          />
        );
      case 'chat':
        return <ChatScreen messages={allMessages} onSend={handleSendMessage} />;
      case 'materials':
        return (
          <MaterialsScreen
            folders={materialFolders}
            materials={allMaterials}
            onBack={() => setCurrentScreen(returnScreen)}
            onAddMaterial={handleAddMaterial}
          />
        );
      case 'events':
        return (
          <EventsScreen
            events={sortedEvents}
            interestedEventIds={storageState.interestedEventIds}
            onBack={() => setCurrentScreen(returnScreen)}
            onToggleInterest={handleToggleEventInterest}
          />
        );
      case 'more':
        return (
          <MoreScreen
            user={userProfile}
            disciplines={disciplines}
            ratings={storageState.ratings}
            materials={storageState.customMaterials}
            interestedEvents={interestedEvents}
            onLogout={handleLogout}
            onResetPrototype={handleResetPrototype}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <AppShell showBottomNav={showBottomNav} currentScreen={currentScreen} onNavigate={setMainScreen}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentScreen}-${selectedDisciplineId}`}
          className="flex h-full flex-1 flex-col"
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -14 }}
          transition={{ duration: 0.2 }}
        >
          {screenContent}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}
