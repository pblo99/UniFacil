import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Heart,
  Home,
  KeyRound,
  Layers3,
  Loader2,
  Mail,
  MessageCircleMore,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  Star,
  ThumbsUp,
  UserRound,
  Users,
  X
} from 'lucide-react';
import type { ReactNode } from 'react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { Card } from '../components/Card';
import EmptyState from '../components/EmptyState';
import Input from '../components/Input';
import RatingStars from '../components/RatingStars';
import SectionTitle from '../components/SectionTitle';
import TopBar from '../components/TopBar';
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
} from '../data/mockData';
import {
  buildIntelligenceContext,
  generateWeeklyPlan,
  recommendMaterials,
  summarizeForumDiscussion,
  suggestQuestionCategory
} from '../services/academicIntelligence';
import type { ChatMessage, Discipline, EventItem, ForumAnswer, ForumQuestion, Group, MaterialItem } from '../types/app';
import type { ForumDiscussionSummary, MaterialRecommendationResult, WeeklyPriority } from '../types/intelligence';
import { formatAverage, formatDateLabel, formatDateTimeLabel, formatRelativeLabel, formatTimeLabel } from '../utils/format';
import { AppIcon } from '../utils/icons';
import logo from '../assets/logo.svg';

const figmaCreatedAt = '2026-05-25T19:20:00.000Z';

const createdGroup: Group = {
  id: 'figma-grupo-bd',
  name: 'Estudos para Banco de Dados',
  members: 18,
  description: 'Revisão de SQL, JOIN e normalização antes da próxima avaliação.',
  icon: 'database',
  createdByUser: true
};

const createdQuestion: ForumQuestion = {
  id: 'figma-question-bd',
  title: 'Dúvida sobre SQL, JOIN e normalização',
  author: userProfile.name,
  tag: 'Banco de Dados',
  body: 'Estou revisando normalização e consultas SQL com JOIN. Quando uso chave estrangeira, ainda fico em dúvida sobre relacionamento entre tabelas.',
  helpfulCount: 4,
  createdAt: figmaCreatedAt,
  createdByUser: true
};

const createdAnswer: ForumAnswer = {
  id: 'figma-answer-bd',
  questionId: createdQuestion.id,
  author: 'Marina Lopes',
  message: 'Monte duas tabelas simples e teste o JOIN depois de identificar a chave estrangeira. Isso ajuda a separar modelagem e consulta.',
  createdAt: '2026-05-25T19:28:00.000Z',
  createdByUser: true
};

const secondAnswer: ForumAnswer = {
  id: 'figma-answer-bd-2',
  questionId: createdQuestion.id,
  author: 'Rafael Costa',
  message: 'O resumo de Banco de Dados e os exercícios de JOIN ajudam bastante para enxergar a diferença entre relacionamento e consulta.',
  createdAt: '2026-05-25T19:38:00.000Z',
  createdByUser: true
};

const createdMaterial: MaterialItem = {
  id: 'figma-material-join',
  title: 'Exercícios de JOIN.pdf',
  category: 'Resumos',
  typeLabel: 'PDF',
  addedAt: '2026-05-25T18:40:00.000Z',
  disciplineId: 'bd',
  addedByUser: true
};

const ownChatMessage: ChatMessage = {
  id: 'figma-message-own',
  author: 'Aluno',
  message: 'Vou revisar Banco de Dados antes do encontro de estudos.',
  createdAt: '2026-05-25T19:34:00.000Z',
  isOwn: true
};

const figmaContext = buildIntelligenceContext({
  user: userProfile,
  disciplines,
  professors,
  groups: [createdGroup, ...groups],
  forumQuestions: [createdQuestion, ...forumQuestions],
  forumAnswers: [...forumAnswers, createdAnswer, secondAnswer],
  chatMessages: [...chatMessages, ownChatMessage],
  materials: [createdMaterial, ...materials],
  events,
  notices,
  exams: [
    {
      id: 'figma-exam-bd',
      disciplineId: 'bd',
      title: 'Revisão avaliativa de Banco de Dados',
      scheduledAt: '2026-06-02T19:00:00.000Z',
      location: 'Sala 204'
    },
    ...exams
  ],
  ratings: [
    {
      disciplineId: 'bd',
      difficulty: 4,
      teaching: 5,
      workload: 4,
      organization: 5,
      recommend: true,
      submittedAt: figmaCreatedAt
    }
  ],
  joinedGroupIds: [createdGroup.id, 'estudos-bd'],
  interestedEventIds: ['event-2', 'event-4'],
  likedQuestionIds: [createdQuestion.id]
});

const weeklyPlan = generateWeeklyPlan(figmaContext);
const materialRecommendation = recommendMaterials(figmaContext, 'bd');
const discussionSummary = summarizeForumDiscussion(figmaContext, createdQuestion.id);
const fewAnswersSummary = summarizeForumDiscussion(figmaContext, 'q-5');
const categorySuggestion = suggestQuestionCategory(createdQuestion.title, createdQuestion.body);
const bancoDeDados = disciplines.find((discipline) => discipline.id === 'bd') ?? disciplines[0];
const estruturaDados = disciplines.find((discipline) => discipline.id === 'ed') ?? disciplines[2];
const bancoProfessor = professors.find((professor) => professor.id === bancoDeDados.professorId) ?? professors[0];

type MainNavLabel = 'Início' | 'Disciplinas' | 'Grupos' | 'Chat' | 'Mais';

interface FrameProps {
  label: string;
  children: ReactNode;
}

interface FrameItem {
  label: string;
  content: ReactNode;
}

interface FrameSection {
  title: string;
  description: string;
  frames: FrameItem[];
}

function PreviewFrame({ label, children }: FrameProps) {
  return (
    <section className="w-[414px] max-w-full">
      <p className="mb-3 break-words text-sm font-semibold text-text-secondary">{label}</p>
      <div className="h-[844px] w-[414px] max-w-full overflow-hidden rounded-[34px] border border-slate-200 bg-background shadow-card">
        <div className="relative flex h-full min-h-0 flex-col overflow-hidden">{children}</div>
      </div>
    </section>
  );
}

function PreviewMain({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <main className={`min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-6 ${className}`}>{children}</main>;
}

function PreviewBottomNav({ active }: { active: MainNavLabel }) {
  const items = [
    { label: 'Início', icon: Home },
    { label: 'Disciplinas', icon: Layers3 },
    { label: 'Grupos', icon: Users },
    { label: 'Chat', icon: MessageCircleMore },
    { label: 'Mais', icon: MoreHorizontal }
  ] as const;

  return (
    <nav className="shrink-0 border-t border-border/80 bg-white/95 px-2 pb-3 pt-2">
      <div className="grid grid-cols-5 gap-1">
        {items.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className={`flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold ${
              active === label ? 'bg-primary-light text-primary' : 'text-text-secondary'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </nav>
  );
}

function PreviewModal({ title, children, footer }: { title: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="absolute inset-0 z-20 flex items-end justify-center bg-slate-950/30 p-3">
      <div className="flex max-h-[790px] w-full flex-col overflow-hidden rounded-[28px] bg-white p-5 shadow-2xl">
        <div className="mb-4 flex shrink-0 items-start justify-between gap-3">
          <h2 className="break-words text-lg font-semibold text-text-primary">{title}</h2>
          <button
            type="button"
            aria-label="Fechar modal"
            className="rounded-full p-2 text-text-secondary transition hover:bg-slate-100 hover:text-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 space-y-4 overflow-y-auto pr-1">{children}</div>
        {footer ? <div className="mt-5 flex shrink-0 flex-col gap-3">{footer}</div> : null}
      </div>
    </div>
  );
}

function ShortcutGrid() {
  const shortcuts = [
    { label: 'Disciplinas', icon: 'book-open' },
    { label: 'Provas', icon: 'clipboard' },
    { label: 'Materiais', icon: 'folder' },
    { label: 'Grupos', icon: 'users' },
    { label: 'Eventos', icon: 'calendar' },
    { label: 'Avisos', icon: 'megaphone' }
  ] as const;

  return (
    <section className="grid grid-cols-2 gap-3">
      {shortcuts.map((item) => (
        <Card key={item.label} className="space-y-3 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
            <AppIcon icon={item.icon} className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{item.label}</p>
            <p className="mt-1 text-xs leading-5 text-text-secondary">Acesso rápido</p>
          </div>
        </Card>
      ))}
    </section>
  );
}

function PriorityList({ priorities }: { priorities: WeeklyPriority[] }) {
  return (
    <ol className="space-y-2">
      {priorities.slice(0, 5).map((priority, index) => (
        <li key={priority.id} className="rounded-2xl bg-white p-3 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
              {index + 1}
            </span>
            <Badge variant="primary">{priority.badge}</Badge>
          </div>
          <p className="text-sm font-semibold text-text-primary">{priority.title}</p>
          <p className="mt-1 text-xs leading-5 text-text-secondary">{priority.description}</p>
        </li>
      ))}
    </ol>
  );
}

function WeeklySummaryCard({ state }: { state: 'before' | 'loading' | 'generated' }) {
  if (state === 'loading') {
    return (
      <Card className="border-primary/20">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
          <div>
            <p className="text-base font-semibold text-text-primary">Resumo inteligente</p>
            <p className="mt-1 text-sm leading-6 text-text-secondary">Analisando compromissos, materiais, eventos e dúvidas recentes.</p>
          </div>
        </div>
        <div className="rounded-2xl bg-primary-light/40 p-4">
          <div className="h-3 w-3/4 rounded-full bg-primary/20" />
          <div className="mt-3 h-3 w-11/12 rounded-full bg-primary/20" />
          <div className="mt-3 h-3 w-2/3 rounded-full bg-primary/20" />
        </div>
      </Card>
    );
  }

  if (state === 'generated') {
    return (
      <Card className="border-primary/20">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-semibold text-text-primary">{weeklyPlan.title}</p>
            <p className="mt-1 text-sm leading-6 text-text-secondary">{weeklyPlan.intro}</p>
          </div>
        </div>
        <div className="space-y-3 rounded-2xl bg-primary-light/35 p-3">
          <PriorityList priorities={weeklyPlan.priorities} />
          <p className="text-xs leading-5 text-text-secondary">{weeklyPlan.closingMessage}</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button variant="secondary">Atualizar resumo</Button>
          <Button variant="outline">Limpar resumo</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-base font-semibold text-text-primary">Resumo inteligente</p>
          <p className="mt-1 text-sm leading-6 text-text-secondary">Organize sua semana com base nos seus compromissos acadêmicos.</p>
        </div>
      </div>
      <Button fullWidth>Gerar resumo da semana</Button>
    </Card>
  );
}

function CommitmentCards() {
  const nextExam = exams[0];
  const nextEvent = events[1];
  const importantNotice = notices[0];

  return (
    <div className="space-y-4">
      <Card className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
            <AppIcon icon="calendar" className="h-6 w-6" />
          </div>
          <div>
            <Badge variant="primary">Próximo evento</Badge>
            <p className="mt-2 text-sm font-semibold text-text-primary">{nextEvent.title}</p>
            <p className="mt-1 text-xs text-text-secondary">{formatDateTimeLabel(nextEvent.startsAt)}</p>
            <p className="mt-1 text-xs text-text-secondary">{nextEvent.location}</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-text-secondary" />
      </Card>
      <Card className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-warning">
            <AppIcon icon="clipboard" className="h-6 w-6" />
          </div>
          <div>
            <Badge variant="warning">Próxima prova</Badge>
            <p className="mt-2 text-sm font-semibold text-text-primary">{nextExam.title}</p>
            <p className="mt-1 text-xs text-text-secondary">{formatDateTimeLabel(nextExam.scheduledAt)}</p>
            <p className="mt-1 text-xs text-text-secondary">{nextExam.location}</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-text-secondary" />
      </Card>
      <Card className="border-amber-100 bg-amber-50/70">
        <Badge variant="warning">Aviso importante</Badge>
        <p className="mt-2 text-sm font-semibold text-text-primary">{importantNotice.title}</p>
        <p className="mt-1 text-sm leading-6 text-text-secondary">{importantNotice.message}</p>
      </Card>
      <Button variant="outline" fullWidth>Ver todos os eventos</Button>
    </div>
  );
}

function SplashFrame() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-6 py-10 text-center">
      <div className="absolute left-8 top-20 rounded-full bg-white p-4 text-primary shadow-card">
        <AppIcon icon="book-open" className="h-6 w-6" />
      </div>
      <div className="absolute right-8 top-28 rounded-full bg-primary-light p-4 text-primary shadow-card">
        <AppIcon icon="calendar" className="h-6 w-6" />
      </div>
      <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[30px] bg-white shadow-soft">
        <img src={logo} alt="Logo UniFácil" className="h-20 w-20" />
      </div>
      <h1 className="mt-8 text-[2.5rem] font-semibold tracking-tight text-text-primary">UniFácil</h1>
      <p className="mx-auto mt-4 max-w-xs text-base leading-7 text-text-secondary">
        Sua vida acadêmica em um só lugar.
      </p>
      <div className="mt-12 w-full">
        <Button fullWidth>Começar</Button>
      </div>
    </div>
  );
}

function LoginFrame({ validation = false }: { validation?: boolean }) {
  return (
    <div className="flex h-full items-center px-6 py-8">
      <div className="w-full rounded-[28px] bg-white p-6 shadow-card">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary-light">
            <img src={logo} alt="Logo UniFácil" className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">UniFácil</h1>
            <p className="mt-1 text-sm text-text-secondary">Faça login para continuar</p>
          </div>
        </div>
        <div className="space-y-4">
          <Input
            id={`figma-login-email-${validation ? 'error' : 'filled'}`}
            label="RA ou e-mail"
            value={validation ? '' : '2026001234'}
            readOnly
            error={validation ? 'Informe seu RA ou e-mail.' : undefined}
            icon={<Mail className="h-4 w-4" />}
          />
          <Input
            id={`figma-login-password-${validation ? 'error' : 'filled'}`}
            label="Senha"
            type="password"
            value={validation ? '' : 'unifacil'}
            readOnly
            error={validation ? 'Informe sua senha.' : undefined}
            icon={<KeyRound className="h-4 w-4" />}
          />
          {validation ? (
            <Card className="flex items-start gap-3 border-red-100 bg-red-50 p-3 text-danger">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-xs leading-5">Preencha RA ou e-mail e senha para continuar.</p>
            </Card>
          ) : null}
          <Button fullWidth>Entrar</Button>
          <p className="text-center text-sm font-semibold text-primary">Esqueci minha senha</p>
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <span className="h-px flex-1 bg-border" />
            <span>ou</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <Button variant="outline" fullWidth>Criar conta</Button>
        </div>
      </div>
    </div>
  );
}

function HomeFrame({ summaryState = 'before', commitmentsOnly = false }: { summaryState?: 'before' | 'loading' | 'generated'; commitmentsOnly?: boolean }) {
  return (
    <>
      <TopBar
        title="Olá, Aluno!"
        subtitle="O que você quer fazer hoje?"
        action={<Bell className="h-5 w-5 text-text-secondary" />}
      />
      <PreviewMain className="space-y-5">
        {commitmentsOnly ? null : <WeeklySummaryCard state={summaryState} />}
        <ShortcutGrid />
        <CommitmentCards />
      </PreviewMain>
      <PreviewBottomNav active="Início" />
    </>
  );
}

function DisciplinesFrame() {
  return (
    <>
      <TopBar title="Minhas disciplinas" subtitle="Acompanhe horários, conteúdos e avaliações" />
      <PreviewMain>
        <SectionTitle title="Grade atual" subtitle="6 disciplinas ativas neste semestre" />
        {disciplines.map((discipline) => (
          <Card key={discipline.id} className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <AppIcon icon={discipline.icon} className="h-7 w-7" />
              </div>
              <div className="min-w-0 space-y-1">
                <p className="break-words text-sm font-semibold text-text-primary">{discipline.name}</p>
                <p className="text-xs text-text-secondary">{professors.find((professor) => professor.id === discipline.professorId)?.name}</p>
                <p className="text-xs text-text-secondary">{discipline.schedule}</p>
                <div className="flex items-center gap-1 text-xs text-warning">
                  <Star className="h-3.5 w-3.5 fill-warning" />
                  <span className="font-semibold">{formatAverage(discipline.averageRating)}</span>
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-text-secondary" />
          </Card>
        ))}
      </PreviewMain>
      <PreviewBottomNav active="Disciplinas" />
    </>
  );
}

function RecommendationPanel({ state, result }: { state: 'before' | 'loading' | 'generated'; result: MaterialRecommendationResult }) {
  if (state === 'before') {
    return (
      <Card className="space-y-4 border-primary/20">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Recomendações inteligentes</p>
            <p className="mt-1 text-sm leading-6 text-text-secondary">Encontre materiais alinhados aos próximos conteúdos e dúvidas recentes.</p>
          </div>
        </div>
        <Button fullWidth>Recomendar materiais</Button>
      </Card>
    );
  }

  if (state === 'loading') {
    return (
      <Card className="space-y-4 border-primary/20">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Recomendações inteligentes</p>
            <p className="mt-1 text-sm leading-6 text-text-secondary">Cruzando materiais, perguntas e próximas avaliações.</p>
          </div>
        </div>
        <div className="space-y-2 rounded-2xl bg-primary-light/35 p-3">
          <div className="h-3 w-10/12 rounded-full bg-primary/20" />
          <div className="h-3 w-7/12 rounded-full bg-primary/20" />
          <div className="h-3 w-9/12 rounded-full bg-primary/20" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="space-y-4 border-primary/20">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">Recomendações inteligentes</p>
          <p className="mt-1 text-sm leading-6 text-text-secondary">{result.headline}</p>
        </div>
      </div>
      <div className="space-y-3 rounded-2xl bg-primary-light/35 p-3">
        {result.items.slice(0, 4).map((item, index) => (
          <div key={item.materialId} className="rounded-2xl bg-white p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                {index + 1}
              </span>
              <Badge variant="primary">{item.typeLabel}</Badge>
            </div>
            <p className="text-sm font-semibold text-text-primary">{item.title}</p>
            <p className="mt-1 text-xs leading-5 text-text-secondary">{item.reason}</p>
          </div>
        ))}
      </div>
      <p className="text-xs leading-5 text-text-secondary">{result.reason}</p>
    </Card>
  );
}

function DisciplineHeader({ discipline }: { discipline: Discipline }) {
  const professor = professors.find((item) => item.id === discipline.professorId) ?? professors[0];

  return (
    <Card className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
          <AppIcon icon={discipline.icon} className="h-7 w-7" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-semibold text-text-primary">{discipline.name}</p>
            <Badge variant="primary">{discipline.location}</Badge>
          </div>
          <p className="mt-1 text-sm text-text-secondary">{professor.name}</p>
          <p className="mt-1 text-sm text-text-secondary">{discipline.schedule}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-2xl bg-primary-light/70 px-4 py-3 text-primary">
        <Star className="h-4 w-4 fill-warning text-warning" />
        <span className="text-sm font-semibold">Média da disciplina: {formatAverage(discipline.averageRating)}</span>
      </div>
    </Card>
  );
}

function DisciplineDetailFrame({ discipline = bancoDeDados, recommendationState }: { discipline?: Discipline; recommendationState?: 'before' | 'loading' | 'generated' }) {
  const relatedMaterials = [createdMaterial, ...materials].filter((material) => material.disciplineId === discipline.id).slice(0, 3);
  const relatedQuestions = [createdQuestion, ...forumQuestions].filter((question) => question.tag === discipline.name).slice(0, 2);

  return (
    <>
      <TopBar title={discipline.name} subtitle="Detalhes da disciplina" onBack={() => undefined} />
      <PreviewMain>
        <DisciplineHeader discipline={discipline} />
        {recommendationState ? <RecommendationPanel state={recommendationState} result={materialRecommendation} /> : null}
        <SectionTitle title="Próximos conteúdos" subtitle="O que vem nas próximas aulas" />
        {discipline.nextTopics.map((topic) => (
          <Card key={topic} className="flex items-center gap-3 p-4">
            <AppIcon icon="book-open" className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-text-primary">{topic}</p>
          </Card>
        ))}
        {relatedMaterials.length > 0 ? (
          <>
            <SectionTitle title="Materiais recentes" subtitle="Arquivos úteis para revisar" />
            {relatedMaterials.map((material) => (
              <Card key={material.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{material.title}</p>
                  <p className="mt-1 text-xs text-text-secondary">{material.category}</p>
                </div>
                <Badge variant={material.addedByUser ? 'success' : 'neutral'}>{material.typeLabel}</Badge>
              </Card>
            ))}
          </>
        ) : null}
        {relatedQuestions.length > 0 ? (
          <>
            <SectionTitle title="Perguntas recentes" subtitle="Dúvidas ligadas à disciplina" />
            {relatedQuestions.map((question) => (
              <Card key={question.id} className="p-4">
                <Badge variant="primary">{question.tag}</Badge>
                <p className="mt-2 text-sm font-semibold text-text-primary">{question.title}</p>
              </Card>
            ))}
          </>
        ) : null}
        <Button fullWidth>Avaliar disciplina</Button>
        <Button variant="secondary" fullWidth>
          <Sparkles className="h-4 w-4" />
          Recomendar materiais
        </Button>
        <Button variant="outline" fullWidth>Abrir fórum</Button>
      </PreviewMain>
    </>
  );
}

function RatingFrame({ success = false }: { success?: boolean }) {
  return (
    <>
      <TopBar title="Avaliar disciplina" subtitle={bancoDeDados.name} onBack={() => undefined} />
      <PreviewMain>
        <Card className="space-y-2">
          <Badge variant="primary">Disciplina selecionada</Badge>
          <h2 className="text-xl font-semibold text-text-primary">{bancoDeDados.name}</h2>
          <p className="text-sm text-text-secondary">{bancoProfessor.name}</p>
        </Card>
        <RatingStars label="Dificuldade" value={success ? 4 : 0} onChange={() => undefined} />
        <RatingStars label="Didática do professor" value={success ? 5 : 0} onChange={() => undefined} />
        <RatingStars label="Carga de trabalho" value={success ? 3 : 0} onChange={() => undefined} />
        <RatingStars label="Organização dos materiais" value={success ? 4 : 0} onChange={() => undefined} />
        <Card>
          <p className="mb-3 text-sm font-semibold text-text-primary">Recomenda esta disciplina?</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant={success ? 'primary' : 'outline'}>Sim</Button>
            <Button variant="outline">Não</Button>
          </div>
        </Card>
        {success ? (
          <Card className="flex items-start gap-3 border-emerald-100 bg-emerald-50">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            <div>
              <p className="text-sm font-semibold text-text-primary">Avaliação enviada com sucesso</p>
              <p className="mt-1 text-xs leading-5 text-text-secondary">Sua experiência foi salva localmente e passa a influenciar os recursos inteligentes.</p>
            </div>
          </Card>
        ) : (
          <Card className="border-amber-100 bg-amber-50/70">
            <p className="text-sm font-semibold text-text-primary">Preencha pelo menos uma avaliação</p>
            <p className="mt-1 text-xs leading-5 text-text-secondary">As estrelas ajudam a organizar recomendações futuras.</p>
          </Card>
        )}
        <Button fullWidth>Enviar avaliação</Button>
      </PreviewMain>
    </>
  );
}

function GroupsFrame({ created = false }: { created?: boolean }) {
  const groupList = created ? [createdGroup, ...groups] : groups;

  return (
    <>
      <TopBar title="Grupos" subtitle="Conecte-se com colegas e organize estudos" />
      <PreviewMain>
        {groupList.slice(0, 6).map((group) => {
          const joined = created && (group.id === createdGroup.id || group.id === 'estudos-bd');

          return (
            <Card key={group.id} className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
                  <AppIcon icon={group.icon} className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{group.name}</p>
                  <p className="mt-1 text-xs text-text-secondary">{group.members} membros</p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{group.description}</p>
                </div>
              </div>
              <Button variant={joined ? 'secondary' : 'primary'}>{joined ? 'Entrou' : 'Entrar'}</Button>
            </Card>
          );
        })}
      </PreviewMain>
      <PreviewBottomNav active="Grupos" />
    </>
  );
}

function GroupCreateModalFrame() {
  return (
    <>
      <GroupsFrame />
      <PreviewModal
        title="Criar grupo"
        footer={
          <>
            <Button>Criar grupo</Button>
            <Button variant="outline">Cancelar</Button>
          </>
        }
      >
        <Input id="figma-group-name" label="Nome do grupo" value="Estudos para Banco de Dados" readOnly />
        <label className="flex flex-col gap-2 text-sm font-medium text-text-primary" htmlFor="figma-group-description">
          <span>Descrição</span>
          <textarea
            id="figma-group-description"
            className="min-h-[120px] rounded-input border border-border bg-white px-4 py-3 text-sm text-text-primary"
            value="Grupo para revisar SQL, JOIN e normalização antes da próxima avaliação."
            readOnly
          />
        </label>
      </PreviewModal>
    </>
  );
}

function QuestionCard({ question, open = false }: { question: ForumQuestion; open?: boolean }) {
  const answerCount = [createdAnswer, secondAnswer, ...forumAnswers].filter((answer) => answer.questionId === question.id).length;

  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge variant="primary">{question.tag}</Badge>
          <p className="mt-2 text-sm font-semibold text-text-primary">{question.title}</p>
        </div>
        {open ? null : <ChevronRight className="h-5 w-5 shrink-0 text-text-secondary" />}
      </div>
      <p className="line-clamp-3 text-sm leading-6 text-text-secondary">{question.body}</p>
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span>{question.author} · {formatRelativeLabel(question.createdAt)}</span>
        <span>{answerCount} respostas</span>
      </div>
    </Card>
  );
}

function ForumListFrame() {
  const questionList = [createdQuestion, ...forumQuestions];

  return (
    <>
      <TopBar
        title="Fórum / Q&A"
        subtitle="Perguntas recentes da comunidade acadêmica"
        action={<Button className="min-h-10 rounded-2xl px-3"><Plus className="h-4 w-4" /></Button>}
      />
      <PreviewMain>
        {questionList.slice(0, 6).map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </PreviewMain>
      <PreviewBottomNav active="Mais" />
    </>
  );
}

function CategorySuggestionCard({ accepted = false }: { accepted?: boolean }) {
  return (
    <Card className="space-y-3 border-primary/20">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
          {accepted ? <CheckCircle2 className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">Categoria sugerida: {categorySuggestion.category}</p>
          <p className="mt-1 text-xs text-text-secondary">Confiança: {categorySuggestion.confidence}</p>
          <p className="mt-1 text-xs leading-5 text-text-secondary">Motivo: {categorySuggestion.reason}</p>
        </div>
      </div>
      {accepted ? (
        <Badge variant="success">Categoria aceita pelo usuário</Badge>
      ) : (
        <Button variant="secondary" fullWidth>Usar categoria sugerida</Button>
      )}
    </Card>
  );
}

function ForumCreateModalFrame({ filled = false, accepted = false }: { filled?: boolean; accepted?: boolean }) {
  return (
    <>
      <ForumListFrame />
      <PreviewModal
        title="Nova pergunta"
        footer={
          <>
            <Button>Publicar pergunta</Button>
            <Button variant="outline">Cancelar</Button>
          </>
        }
      >
        <Input id={`figma-question-title-${filled ? 'filled' : 'empty'}`} label="Título" value={filled ? createdQuestion.title : ''} readOnly />
        <label className="flex flex-col gap-2 text-sm font-medium text-text-primary" htmlFor={`figma-question-body-${filled ? 'filled' : 'empty'}`}>
          <span>Detalhes</span>
          <textarea
            id={`figma-question-body-${filled ? 'filled' : 'empty'}`}
            className="min-h-[130px] rounded-input border border-border bg-white px-4 py-3 text-sm text-text-primary"
            value={filled ? createdQuestion.body : ''}
            placeholder="Descreva sua dúvida para receber ajuda da turma."
            readOnly
          />
        </label>
        {filled ? <CategorySuggestionCard accepted={accepted} /> : null}
        <Card>
          <p className="text-sm font-semibold text-text-primary">Categoria final</p>
          <div className="mt-3 rounded-input border border-border bg-white px-4 py-3 text-sm text-text-secondary">
            {filled ? 'Banco de Dados' : 'Geral'}
          </div>
        </Card>
      </PreviewModal>
    </>
  );
}

function SummaryCard({ summary }: { summary: ForumDiscussionSummary }) {
  return (
    <Card className="space-y-3 border-primary/20">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">Síntese da discussão</p>
          <p className="mt-1 text-xs text-text-secondary">Categoria relacionada: {summary.category}</p>
        </div>
      </div>
      <div className="space-y-3 rounded-2xl bg-primary-light/35 p-3">
        <div>
          <p className="text-xs font-semibold uppercase text-primary">Problema principal</p>
          <p className="mt-1 text-sm leading-6 text-text-secondary">{summary.problem}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-primary">Orientações</p>
          <p className="mt-1 text-sm leading-6 text-text-secondary">{summary.guidance}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-primary">Próximo passo</p>
          <p className="mt-1 text-sm leading-6 text-text-secondary">{summary.nextStep}</p>
        </div>
      </div>
      {summary.fewAnswersNotice ? (
        <Card className="border-amber-100 bg-amber-50/80 p-3">
          <p className="text-xs leading-5 text-text-secondary">{summary.fewAnswersNotice}</p>
        </Card>
      ) : null}
    </Card>
  );
}

function AnswerList({ compact = false }: { compact?: boolean }) {
  const answers = [createdAnswer, secondAnswer, ...forumAnswers.filter((answer) => answer.questionId === 'q-3')];

  return (
    <div className="space-y-3">
      {answers.slice(0, compact ? 2 : 4).map((answer) => (
        <Card key={answer.id} className="space-y-2 p-4">
          <p className="text-sm font-semibold text-text-primary">{answer.author}</p>
          <p className="text-sm leading-6 text-text-secondary">{answer.message}</p>
          <p className="text-xs text-text-secondary">{formatRelativeLabel(answer.createdAt)}</p>
        </Card>
      ))}
    </div>
  );
}

function ForumQuestionFrame({
  withAnswers = false,
  withSummary = false,
  withReplyModal = false,
  fewAnswers = false
}: {
  withAnswers?: boolean;
  withSummary?: boolean;
  withReplyModal?: boolean;
  fewAnswers?: boolean;
}) {
  const question = fewAnswers ? forumQuestions.find((item) => item.id === 'q-5') ?? forumQuestions[4] : createdQuestion;
  const summary = fewAnswers ? fewAnswersSummary : discussionSummary;

  return (
    <>
      <TopBar title="Fórum / Q&A" subtitle="Pergunta aberta" onBack={() => undefined} />
      <PreviewMain>
        <QuestionCard question={question} open />
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary">
            <ThumbsUp className="h-4 w-4" />
            Útil
          </Button>
          <Button variant="outline">Responder</Button>
        </div>
        {withSummary ? <SummaryCard summary={summary} /> : null}
        {withAnswers || withSummary ? (
          <>
            <SectionTitle title="Respostas" subtitle="Orientações compartilhadas pela turma" />
            {fewAnswers ? (
              <Card className="space-y-2 p-4">
                <p className="text-sm font-semibold text-text-primary">Juliana Nunes</p>
                <p className="text-sm leading-6 text-text-secondary">A professora comentou que vai subir os slides ainda hoje à noite.</p>
                <p className="text-xs text-text-secondary">há algumas horas</p>
              </Card>
            ) : (
              <AnswerList compact={!withSummary} />
            )}
          </>
        ) : null}
      </PreviewMain>
      {withReplyModal ? (
        <PreviewModal
          title="Responder pergunta"
          footer={
            <>
              <Button>Enviar resposta</Button>
              <Button variant="outline">Cancelar</Button>
            </>
          }
        >
          <Card className="bg-primary-light/35">
            <p className="text-sm font-semibold text-text-primary">{createdQuestion.title}</p>
            <p className="mt-1 text-xs leading-5 text-text-secondary">Compartilhe uma orientação clara para ajudar outros colegas.</p>
          </Card>
          <label className="flex flex-col gap-2 text-sm font-medium text-text-primary" htmlFor="figma-answer-message">
            <span>Resposta</span>
            <textarea
              id="figma-answer-message"
              className="min-h-[150px] rounded-input border border-border bg-white px-4 py-3 text-sm text-text-primary"
              value="Revise primeiro a modelagem e depois teste as consultas com exemplos pequenos."
              readOnly
            />
          </label>
        </PreviewModal>
      ) : null}
    </>
  );
}

function ChatFrame({ withOwnMessage = false }: { withOwnMessage?: boolean }) {
  const messageList = withOwnMessage ? [...chatMessages, ownChatMessage] : chatMessages;

  return (
    <>
      <TopBar title="Chat Geral" subtitle="45 participantes" action={<Users className="h-5 w-5 text-text-secondary" />} />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-5">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pb-4">
          {messageList.map((message) => (
            <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[82%] rounded-[22px] px-4 py-3 shadow-card ${message.isOwn ? 'rounded-br-md bg-primary text-white' : 'rounded-bl-md bg-white text-text-primary'}`}>
                <p className={`text-xs font-semibold ${message.isOwn ? 'text-white/80' : 'text-text-secondary'}`}>{message.author}</p>
                <p className="mt-1 text-sm leading-6">{message.message}</p>
                <p className={`mt-2 text-[11px] ${message.isOwn ? 'text-white/80' : 'text-text-secondary'}`}>
                  {formatTimeLabel(message.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-3 border-t border-border/80 pt-4">
          <div className="min-h-[52px] flex-1 rounded-input border border-border bg-white px-4 py-4 text-sm text-text-secondary">
            Digite uma mensagem...
          </div>
          <Button className="min-h-[52px] min-w-[52px] rounded-full px-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <PreviewBottomNav active="Chat" />
    </>
  );
}

function MaterialsFrame({ added = false }: { added?: boolean }) {
  const materialList = added ? [createdMaterial, ...materials] : materials;

  return (
    <>
      <TopBar title="Materiais" subtitle="Conteúdos organizados por pasta" onBack={() => undefined} />
      <PreviewMain>
        <SectionTitle title="Pastas" subtitle="Acesse rapidamente os principais conteúdos" />
        {materialFolders.map((folder) => (
          <Card key={folder.id} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <AppIcon icon={folder.icon} className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{folder.name}</p>
                <p className="mt-1 text-xs text-text-secondary">{folder.itemsCount + (added && folder.name === 'Resumos' ? 1 : 0)} itens</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-text-secondary" />
          </Card>
        ))}
        <SectionTitle title="Materiais recentes" subtitle="Últimos itens adicionados" />
        {materialList.slice(0, 5).map((material) => (
          <Card key={material.id} className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className="text-sm font-semibold text-text-primary">{material.title}</p>
              <p className="mt-1 text-xs text-text-secondary">{material.category}</p>
            </div>
            <Badge variant={material.addedByUser ? 'success' : 'neutral'}>{material.typeLabel}</Badge>
          </Card>
        ))}
        <Button fullWidth>
          <Plus className="h-4 w-4" />
          Enviar material
        </Button>
      </PreviewMain>
    </>
  );
}

function MaterialAddModalFrame() {
  return (
    <>
      <MaterialsFrame />
      <PreviewModal
        title="Adicionar material"
        footer={
          <>
            <Button>Adicionar material</Button>
            <Button variant="outline">Cancelar</Button>
          </>
        }
      >
        <Input id="figma-material-title" label="Nome do material" value={createdMaterial.title} readOnly />
        <Input id="figma-material-category" label="Categoria" value="Resumos" readOnly />
        <Input id="figma-material-discipline" label="Disciplina relacionada" value="Banco de Dados" readOnly />
        <Card className="border-primary/20 bg-primary-light/35 p-3">
          <p className="text-xs leading-5 text-text-secondary">O material será adicionado à lista para demonstração e poderá aparecer nas recomendações inteligentes.</p>
        </Card>
      </PreviewModal>
    </>
  );
}

function EventsFrame({ interested = false }: { interested?: boolean }) {
  return (
    <>
      <TopBar title="Eventos" subtitle="Agenda acadêmica do semestre" onBack={() => undefined} />
      <PreviewMain>
        <Card className="space-y-3">
          <SectionTitle title="Seu interesse" subtitle={interested ? '2 eventos marcados' : 'Escolha eventos para acompanhar'} />
          <Button variant="outline">Ver todos</Button>
        </Card>
        {events.map((event: EventItem) => {
          const isInterested = interested && (event.id === 'event-2' || event.id === 'event-4');

          return (
            <Card key={event.id} className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
                  <AppIcon icon={event.icon} className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-text-primary">{event.title}</p>
                    <Badge variant="primary">{event.category}</Badge>
                  </div>
                  <p className="mt-2 text-xs text-text-secondary">
                    {formatDateLabel(event.startsAt)} · {formatTimeLabel(event.startsAt)}
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">{event.location}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant={isInterested ? 'secondary' : 'primary'}>
                  <Heart className={`h-4 w-4 ${isInterested ? 'fill-primary text-primary' : ''}`} />
                  {isInterested ? 'Interessado' : 'Tenho interesse'}
                </Button>
                <Button variant="outline">Ver mapa</Button>
              </div>
            </Card>
          );
        })}
      </PreviewMain>
    </>
  );
}

function MoreFrame() {
  const options = ['Meus dados', 'Minhas avaliações', 'Materiais salvos', 'Eventos de interesse', 'Ajuda', 'Sobre o UniFácil', 'Resetar protótipo', 'Sair'];

  return (
    <>
      <TopBar title="Mais" subtitle="Perfil e atalhos do protótipo" />
      <PreviewMain>
        <Card className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-primary-light text-primary">
              <UserRound className="h-8 w-8" />
            </div>
            <div>
              <p className="text-lg font-semibold text-text-primary">{userProfile.name}</p>
              <p className="mt-1 text-sm text-text-secondary">{userProfile.course}</p>
            </div>
          </div>
          <div className="grid gap-2 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-text-secondary">
            <p><span className="font-semibold text-text-primary">RA:</span> {userProfile.ra}</p>
            <p><span className="font-semibold text-text-primary">Instituição:</span> {userProfile.institution}</p>
            <p><span className="font-semibold text-text-primary">E-mail:</span> {userProfile.email}</p>
          </div>
        </Card>
        {options.map((option) => (
          <Card key={option} className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-text-primary">{option}</span>
            <ChevronRight className="h-5 w-5 text-text-secondary" />
          </Card>
        ))}
      </PreviewMain>
      <PreviewBottomNav active="Mais" />
    </>
  );
}

function AboutModalFrame() {
  return (
    <>
      <MoreFrame />
      <PreviewModal
        title="Sobre o UniFácil"
        footer={<Button>Entendi</Button>}
      >
        <Card className="space-y-3 border-primary/20 bg-primary-light/35">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo UniFácil" className="h-12 w-12" />
            <div>
              <p className="text-sm font-semibold text-text-primary">UniFácil</p>
              <p className="text-xs text-text-secondary">Sua vida acadêmica em um só lugar.</p>
            </div>
          </div>
          <p className="text-sm leading-6 text-text-secondary">
            Plataforma acadêmica para centralizar disciplinas, materiais, eventos, grupos, fórum e organização semanal do aluno.
          </p>
        </Card>
      </PreviewModal>
    </>
  );
}

function ResetModalFrame() {
  return (
    <>
      <MoreFrame />
      <PreviewModal
        title="Resetar protótipo"
        footer={
          <>
            <Button variant="danger">Resetar dados</Button>
            <Button variant="outline">Cancelar</Button>
          </>
        }
      >
        <Card className="border-red-100 bg-red-50">
          <p className="text-sm font-semibold text-text-primary">Confirmar restauração</p>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Essa ação limpa as interações locais e restaura o estado inicial de grupos, perguntas, materiais, mensagens e interesses.
          </p>
        </Card>
      </PreviewModal>
    </>
  );
}

function PostResetFrame() {
  return (
    <>
      <TopBar title="Mais" subtitle="Protótipo restaurado" />
      <PreviewMain>
        <Card className="space-y-4 border-emerald-100 bg-emerald-50">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-success">
            <RotateCcw className="h-7 w-7" />
          </div>
          <div>
            <p className="text-lg font-semibold text-text-primary">Dados restaurados</p>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              O app voltou ao estado inicial, mantendo apenas os dados acadêmicos principais.
            </p>
          </div>
        </Card>
        <Card className="space-y-3">
          <p className="text-sm font-semibold text-text-primary">Estado atual</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">Sessão limpa</Badge>
            <Badge variant="neutral">Grupos iniciais</Badge>
            <Badge variant="neutral">Materiais iniciais</Badge>
          </div>
        </Card>
        <Button fullWidth>Voltar para o início</Button>
      </PreviewMain>
      <PreviewBottomNav active="Mais" />
    </>
  );
}

function EmptyStateFrame() {
  return (
    <>
      <TopBar title="Materiais salvos" subtitle="Estado vazio" onBack={() => undefined} />
      <PreviewMain className="flex justify-center">
        <EmptyState
          icon={<AppIcon icon="folder" className="h-7 w-7" />}
          title="Nenhum material salvo"
          description="Quando você salvar um material importante, ele aparecerá aqui para consulta rápida."
          actionLabel="Explorar materiais"
          onAction={() => undefined}
        />
      </PreviewMain>
    </>
  );
}

const sections: FrameSection[] = [
  {
    title: 'Acesso',
    description: 'Entrada do produto e validação simples de formulário.',
    frames: [
      { label: 'Splash', content: <SplashFrame /> },
      { label: 'Login', content: <LoginFrame /> },
      { label: 'Login — validação de campos', content: <LoginFrame validation /> }
    ]
  },
  {
    title: 'Início e inteligência',
    description: 'Home em estados sem resumo, carregando, com plano gerado e compromissos destacados.',
    frames: [
      { label: 'Home — antes do resumo inteligente', content: <HomeFrame summaryState="before" /> },
      { label: 'Home — resumo inteligente carregando', content: <HomeFrame summaryState="loading" /> },
      { label: 'Home — resumo inteligente gerado', content: <HomeFrame summaryState="generated" /> },
      { label: 'Home — avisos e próximos compromissos', content: <HomeFrame commitmentsOnly /> }
    ]
  },
  {
    title: 'Disciplinas',
    description: 'Lista, detalhes, recomendações de materiais e avaliação de disciplina.',
    frames: [
      { label: 'Disciplinas', content: <DisciplinesFrame /> },
      { label: 'Banco de Dados — detalhe sem recomendação aberta', content: <DisciplineDetailFrame /> },
      { label: 'Recomendação de materiais — antes de gerar', content: <DisciplineDetailFrame recommendationState="before" /> },
      { label: 'Recomendação de materiais — carregando', content: <DisciplineDetailFrame recommendationState="loading" /> },
      { label: 'Banco de Dados — recomendações inteligentes abertas', content: <DisciplineDetailFrame recommendationState="generated" /> },
      { label: 'Estrutura de Dados — conteúdo diferente', content: <DisciplineDetailFrame discipline={estruturaDados} /> },
      { label: 'Avaliação — vazia', content: <RatingFrame /> },
      { label: 'Avaliação — preenchida com sucesso', content: <RatingFrame success /> }
    ]
  },
  {
    title: 'Grupos',
    description: 'Lista de grupos, criação e estado após entrada em grupo.',
    frames: [
      { label: 'Grupos', content: <GroupsFrame /> },
      { label: 'Grupos — modal de criar grupo', content: <GroupCreateModalFrame /> },
      { label: 'Grupos — novo grupo criado e entrou', content: <GroupsFrame created /> }
    ]
  },
  {
    title: 'Fórum',
    description: 'Perguntas, criação, categoria sugerida, respostas e sínteses inteligentes.',
    frames: [
      { label: 'Fórum — lista padrão', content: <ForumListFrame /> },
      { label: 'Fórum — modal de criar pergunta', content: <ForumCreateModalFrame /> },
      { label: 'Fórum — categoria sugerida automaticamente', content: <ForumCreateModalFrame filled /> },
      { label: 'Fórum — categoria aceita pelo usuário', content: <ForumCreateModalFrame filled accepted /> },
      { label: 'Fórum — pergunta aberta', content: <ForumQuestionFrame /> },
      { label: 'Fórum — respostas visíveis', content: <ForumQuestionFrame withAnswers /> },
      { label: 'Fórum — síntese inteligente gerada', content: <ForumQuestionFrame withAnswers withSummary /> },
      { label: 'Fórum — painel de responder pergunta', content: <ForumQuestionFrame withAnswers withReplyModal /> },
      { label: 'Fórum — síntese com poucas respostas', content: <ForumQuestionFrame withAnswers withSummary fewAnswers /> }
    ]
  },
  {
    title: 'Chat',
    description: 'Conversa geral em estado padrão e com mensagem enviada pelo aluno.',
    frames: [
      { label: 'Chat — padrão', content: <ChatFrame /> },
      { label: 'Chat — nova mensagem enviada', content: <ChatFrame withOwnMessage /> }
    ]
  },
  {
    title: 'Materiais',
    description: 'Pastas, envio visual de material e impacto de material recém-adicionado.',
    frames: [
      { label: 'Materiais', content: <MaterialsFrame /> },
      { label: 'Materiais — modal de adicionar material', content: <MaterialAddModalFrame /> },
      { label: 'Materiais — material recém-adicionado', content: <MaterialsFrame added /> }
    ]
  },
  {
    title: 'Eventos',
    description: 'Agenda acadêmica com e sem marcação de interesse.',
    frames: [
      { label: 'Eventos', content: <EventsFrame /> },
      { label: 'Eventos — interesse marcado', content: <EventsFrame interested /> }
    ]
  },
  {
    title: 'Perfil e configurações',
    description: 'Perfil, informações do produto, confirmação de restauração e estados auxiliares.',
    frames: [
      { label: 'Perfil / Mais', content: <MoreFrame /> },
      { label: 'Mais — modal Sobre o UniFácil', content: <AboutModalFrame /> },
      { label: 'Mais — confirmação de resetar protótipo', content: <ResetModalFrame /> },
      { label: 'Mais — dados restaurados', content: <PostResetFrame /> },
      { label: 'Estado vazio amigável', content: <EmptyStateFrame /> }
    ]
  }
];

export default function FigmaExportScreen() {
  return (
    <div className="h-dvh overflow-y-auto bg-[#EEF2F7] px-6 py-8 text-text-primary md:px-10">
      <header className="mx-auto mb-10 max-w-[1360px]">
        <h1 className="text-3xl font-semibold tracking-normal text-text-primary">UniFácil — Telas do Protótipo</h1>
        <p className="mt-2 text-base text-text-secondary">Galeria visual para documentação e apresentação.</p>
      </header>
      <main className="mx-auto max-w-[1360px] space-y-12">
        {sections.map((section) => (
          <section key={section.title} className="space-y-5">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">{section.title}</h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-text-secondary">{section.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-8 min-[900px]:grid-cols-2 min-[1320px]:grid-cols-3">
              {section.frames.map((frame) => (
                <PreviewFrame key={frame.label} label={frame.label}>
                  {frame.content}
                </PreviewFrame>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
