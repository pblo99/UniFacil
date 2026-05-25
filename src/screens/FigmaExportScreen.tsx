import {
  Bell,
  ChevronRight,
  Heart,
  Home,
  KeyRound,
  Layers3,
  Mail,
  MessageCircleMore,
  MoreHorizontal,
  Send,
  Sparkles,
  Star,
  ThumbsUp,
  UserRound,
  Users
} from 'lucide-react';
import type { ReactNode } from 'react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { Card } from '../components/Card';
import Input from '../components/Input';
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
import type { ChatMessage, EventItem, ForumAnswer, ForumQuestion, Group, MaterialItem } from '../types/app';
import type { WeeklyPriority } from '../types/intelligence';
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
  forumAnswers: [...forumAnswers, createdAnswer],
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
const categorySuggestion = suggestQuestionCategory(createdQuestion.title, createdQuestion.body);
const bancoDeDados = disciplines.find((discipline) => discipline.id === 'bd') ?? disciplines[0];
const bancoProfessor = professors.find((professor) => professor.id === bancoDeDados.professorId) ?? professors[0];

interface FrameProps {
  label: string;
  children: ReactNode;
}

function PreviewFrame({ label, children }: FrameProps) {
  return (
    <section className="w-[414px] max-w-full">
      <p className="mb-3 text-sm font-semibold text-text-secondary">{label}</p>
      <div className="h-[844px] w-[414px] max-w-full overflow-hidden rounded-[34px] border border-slate-200 bg-background shadow-card">
        <div className="flex h-full min-h-0 flex-col overflow-hidden">{children}</div>
      </div>
    </section>
  );
}

function PreviewMain({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <main className={`min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-6 ${className}`}>{children}</main>;
}

function PreviewBottomNav({ active }: { active: 'Início' | 'Disciplinas' | 'Grupos' | 'Chat' | 'Mais' }) {
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
      {priorities.slice(0, 4).map((priority, index) => (
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

function LoginFrame() {
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
          <Input id="figma-login-email" label="RA ou e-mail" value="2026001234" readOnly icon={<Mail className="h-4 w-4" />} />
          <Input id="figma-login-password" label="Senha" type="password" value="unifacil" readOnly icon={<KeyRound className="h-4 w-4" />} />
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

function HomeFrame() {
  return (
    <>
      <TopBar
        title="Olá, Aluno!"
        subtitle="O que você quer fazer hoje?"
        action={<Bell className="h-5 w-5 text-text-secondary" />}
      />
      <PreviewMain className="space-y-5">
        <Card className="border-primary/20">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold text-text-primary">Resumo inteligente</p>
              <p className="mt-1 text-sm leading-6 text-text-secondary">{weeklyPlan.intro}</p>
            </div>
          </div>
          <div className="space-y-3 rounded-2xl bg-primary-light/35 p-3">
            <p className="text-sm font-semibold text-text-primary">{weeklyPlan.title}</p>
            <PriorityList priorities={weeklyPlan.priorities} />
          </div>
        </Card>
        <ShortcutGrid />
        <Card className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
              <AppIcon icon="sparkles" className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Workshop: Git e GitHub</p>
              <p className="mt-1 text-xs text-text-secondary">{formatDateTimeLabel(events[1].startsAt)}</p>
              <p className="mt-1 text-xs text-text-secondary">{events[1].location}</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-text-secondary" />
        </Card>
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

function DisciplineDetailFrame() {
  return (
    <>
      <TopBar title={bancoDeDados.name} subtitle="Detalhes da disciplina" onBack={() => undefined} />
      <PreviewMain>
        <Card className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
              <AppIcon icon={bancoDeDados.icon} className="h-7 w-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-lg font-semibold text-text-primary">{bancoDeDados.name}</p>
                <Badge variant="primary">{bancoDeDados.location}</Badge>
              </div>
              <p className="mt-1 text-sm text-text-secondary">{bancoProfessor.name}</p>
              <p className="mt-1 text-sm text-text-secondary">{bancoDeDados.schedule}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-primary-light/70 px-4 py-3 text-primary">
            <Star className="h-4 w-4 fill-warning text-warning" />
            <span className="text-sm font-semibold">Média da disciplina: 4,5</span>
          </div>
        </Card>
        <SectionTitle title="Próximos conteúdos" subtitle="O que vem nas próximas aulas" />
        {bancoDeDados.nextTopics.map((topic) => (
          <Card key={topic} className="flex items-center gap-3 p-4">
            <AppIcon icon="book-open" className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-text-primary">{topic}</p>
          </Card>
        ))}
        <Button fullWidth>Avaliar disciplina</Button>
        <Button variant="secondary" fullWidth>
          <Sparkles className="h-4 w-4" />
          Recomendar materiais
        </Button>
      </PreviewMain>
    </>
  );
}

function MaterialRecommendationFrame() {
  return (
    <>
      <TopBar title="Recomendações" subtitle="Banco de Dados" onBack={() => undefined} />
      <PreviewMain>
        <Card className="space-y-2 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-light text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Recomendações inteligentes</p>
              <p className="mt-1 text-sm leading-6 text-text-secondary">{materialRecommendation.headline}</p>
            </div>
          </div>
        </Card>
        {materialRecommendation.items.map((item, index) => (
          <Card key={item.materialId} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                {index + 1}
              </span>
              <Badge variant="primary">{item.typeLabel}</Badge>
            </div>
            <p className="text-sm font-semibold text-text-primary">{item.title}</p>
            <p className="text-xs leading-5 text-text-secondary">{item.reason}</p>
          </Card>
        ))}
        <Card className="space-y-2 bg-primary-light/40">
          <p className="text-sm font-semibold text-text-primary">Motivo</p>
          <p className="text-sm leading-6 text-text-secondary">{materialRecommendation.reason}</p>
        </Card>
      </PreviewMain>
    </>
  );
}

function RatingFrame() {
  const criteria = ['Dificuldade', 'Didática do professor', 'Carga de trabalho', 'Organização dos materiais'];

  return (
    <>
      <TopBar title="Avaliar disciplina" subtitle={bancoDeDados.name} onBack={() => undefined} />
      <PreviewMain>
        <Card className="space-y-2">
          <Badge variant="primary">Disciplina selecionada</Badge>
          <h2 className="text-xl font-semibold text-text-primary">{bancoDeDados.name}</h2>
          <p className="text-sm text-text-secondary">{bancoDeDados.schedule}</p>
        </Card>
        {criteria.map((criterion) => (
          <Card key={criterion}>
            <p className="mb-3 text-sm font-semibold text-text-primary">{criterion}</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <Star key={item} className={`h-7 w-7 ${item <= 4 ? 'fill-warning text-warning' : 'text-slate-300'}`} />
              ))}
            </div>
          </Card>
        ))}
        <Card>
          <p className="mb-3 text-sm font-semibold text-text-primary">Recomenda esta disciplina?</p>
          <div className="grid grid-cols-2 gap-3">
            <Button>Sim</Button>
            <Button variant="outline">Não</Button>
          </div>
        </Card>
        <Button fullWidth>Enviar avaliação</Button>
      </PreviewMain>
    </>
  );
}

function GroupsFrame() {
  return (
    <>
      <TopBar title="Grupos" subtitle="Conecte-se com colegas e organize estudos" />
      <PreviewMain>
        {[createdGroup, ...groups].slice(0, 6).map((group) => (
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
            <Button variant={group.id === createdGroup.id ? 'secondary' : 'primary'}>
              {group.id === createdGroup.id ? 'Entrou' : 'Entrar'}
            </Button>
          </Card>
        ))}
      </PreviewMain>
      <PreviewBottomNav active="Grupos" />
    </>
  );
}

function ForumSuggestionFrame() {
  return (
    <>
      <TopBar title="Nova pergunta" subtitle="Sugestão de categoria" onBack={() => undefined} />
      <PreviewMain>
        <Input id="figma-question-title" label="Título" value={createdQuestion.title} readOnly />
        <label className="flex flex-col gap-2 text-sm font-medium text-text-primary" htmlFor="figma-question-body">
          <span>Detalhes</span>
          <textarea
            id="figma-question-body"
            className="min-h-[140px] rounded-input border border-border bg-white px-4 py-3 text-sm text-text-primary"
            value={createdQuestion.body}
            readOnly
          />
        </label>
        <Card className="space-y-3 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-light text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Categoria sugerida: {categorySuggestion.category}</p>
              <p className="mt-1 text-xs text-text-secondary">Confiança: {categorySuggestion.confidence}</p>
              <p className="mt-1 text-xs leading-5 text-text-secondary">Motivo: {categorySuggestion.reason}</p>
            </div>
          </div>
          <Button variant="secondary">Usar categoria sugerida</Button>
        </Card>
        <Card>
          <p className="text-sm font-semibold text-text-primary">Categoria final</p>
          <div className="mt-3 rounded-input border border-border bg-white px-4 py-3 text-sm text-text-secondary">
            Banco de Dados
          </div>
        </Card>
        <Button fullWidth>Publicar pergunta</Button>
      </PreviewMain>
    </>
  );
}

function ForumDiscussionFrame() {
  return (
    <>
      <TopBar title="Fórum / Q&A" subtitle="Pergunta aberta" onBack={() => undefined} />
      <PreviewMain>
        <Card className="space-y-3">
          <Badge variant="primary">{createdQuestion.tag}</Badge>
          <p className="text-sm font-semibold text-text-primary">{createdQuestion.title}</p>
          <p className="text-sm leading-6 text-text-secondary">{createdQuestion.body}</p>
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>{createdQuestion.author}</span>
            <span className="inline-flex items-center gap-1">
              <ThumbsUp className="h-3.5 w-3.5" /> 5 útil
            </span>
          </div>
        </Card>
        <Card className="space-y-3 border-primary/20">
          <p className="text-sm font-semibold text-text-primary">Síntese da discussão</p>
          <div className="space-y-3 rounded-2xl bg-primary-light/35 p-3">
            <div>
              <p className="text-xs font-semibold uppercase text-primary">Problema principal</p>
              <p className="mt-1 text-sm leading-6 text-text-secondary">{discussionSummary.problem}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-primary">Orientações</p>
              <p className="mt-1 text-sm leading-6 text-text-secondary">{discussionSummary.guidance}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-primary">Próximo passo</p>
              <p className="mt-1 text-sm leading-6 text-text-secondary">{discussionSummary.nextStep}</p>
            </div>
          </div>
        </Card>
        {[createdAnswer, ...forumAnswers.filter((answer) => answer.questionId === 'q-3')].map((answer) => (
          <Card key={answer.id} className="space-y-2 p-4">
            <p className="text-sm font-semibold text-text-primary">{answer.author}</p>
            <p className="text-sm leading-6 text-text-secondary">{answer.message}</p>
            <p className="text-xs text-text-secondary">{formatRelativeLabel(answer.createdAt)}</p>
          </Card>
        ))}
      </PreviewMain>
    </>
  );
}

function ChatFrame() {
  return (
    <>
      <TopBar title="Chat Geral" subtitle="45 participantes" action={<Users className="h-5 w-5 text-text-secondary" />} />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-5">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pb-4">
          {[...chatMessages, ownChatMessage].map((message) => (
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
    </>
  );
}

function MaterialsFrame() {
  return (
    <>
      <TopBar title="Materiais" subtitle="Conteúdos organizados por pasta" onBack={() => undefined} />
      <PreviewMain>
        <SectionTitle title="Pastas" subtitle="Acesse rapidamente os principais conteúdos" />
        {materialFolders.map((folder) => (
          <Card key={folder.id} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <AppIcon icon={folder.icon} className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{folder.name}</p>
                <p className="mt-1 text-xs text-text-secondary">{folder.itemsCount} itens</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-text-secondary" />
          </Card>
        ))}
        <SectionTitle title="Materiais recentes" subtitle="Últimos itens adicionados" />
        {[createdMaterial, ...materials].slice(0, 4).map((material) => (
          <Card key={material.id} className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className="text-sm font-semibold text-text-primary">{material.title}</p>
              <p className="mt-1 text-xs text-text-secondary">{material.category}</p>
            </div>
            <Badge variant={material.addedByUser ? 'success' : 'neutral'}>{material.typeLabel}</Badge>
          </Card>
        ))}
      </PreviewMain>
    </>
  );
}

function EventsFrame() {
  return (
    <>
      <TopBar title="Eventos" subtitle="Agenda acadêmica do semestre" onBack={() => undefined} />
      <PreviewMain>
        <Card className="space-y-3">
          <SectionTitle title="Seu interesse" subtitle="2 eventos marcados" />
          <Button variant="outline">Ver todos</Button>
        </Card>
        {events.map((event: EventItem) => {
          const interested = event.id === 'event-2' || event.id === 'event-4';

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
                <Button variant={interested ? 'secondary' : 'primary'}>
                  <Heart className={`h-4 w-4 ${interested ? 'fill-primary text-primary' : ''}`} />
                  {interested ? 'Interessado' : 'Tenho interesse'}
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
            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary-light text-primary">
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

const frames = [
  { label: '1. Splash', content: <SplashFrame /> },
  { label: '2. Login', content: <LoginFrame /> },
  { label: '3. Home com Resumo Inteligente', content: <HomeFrame /> },
  { label: '4. Disciplinas', content: <DisciplinesFrame /> },
  { label: '5. Detalhe de Banco de Dados', content: <DisciplineDetailFrame /> },
  { label: '6. Recomendações Inteligentes de Materiais', content: <MaterialRecommendationFrame /> },
  { label: '7. Avaliação de Disciplina', content: <RatingFrame /> },
  { label: '8. Grupos', content: <GroupsFrame /> },
  { label: '9. Fórum com Sugestão de Categoria', content: <ForumSuggestionFrame /> },
  { label: '10. Pergunta do Fórum Aberta com Síntese', content: <ForumDiscussionFrame /> },
  { label: '11. Chat', content: <ChatFrame /> },
  { label: '12. Materiais', content: <MaterialsFrame /> },
  { label: '13. Eventos', content: <EventsFrame /> },
  { label: '14. Perfil / Mais', content: <MoreFrame /> }
];

export default function FigmaExportScreen() {
  return (
    <div className="h-dvh overflow-y-auto bg-[#EEF2F7] px-6 py-8 text-text-primary md:px-10">
      <header className="mx-auto mb-8 max-w-[1360px]">
        <h1 className="text-3xl font-semibold tracking-normal text-text-primary">UniFácil — Telas do Protótipo</h1>
        <p className="mt-2 text-base text-text-secondary">Galeria visual para documentação e apresentação.</p>
      </header>
      <main className="mx-auto grid max-w-[1360px] grid-cols-1 gap-8 min-[900px]:grid-cols-2 min-[1320px]:grid-cols-3">
        {frames.map((frame) => (
          <PreviewFrame key={frame.label} label={frame.label}>
            {frame.content}
          </PreviewFrame>
        ))}
      </main>
    </div>
  );
}
