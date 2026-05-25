import { useEffect, useMemo, useState } from 'react';
import { MessageSquareText, Plus, RefreshCw, Sparkles, ThumbsUp } from 'lucide-react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { Card } from '../components/Card';
import EmptyState from '../components/EmptyState';
import Input from '../components/Input';
import Modal from '../components/Modal';
import TopBar from '../components/TopBar';
import { suggestQuestionCategory } from '../services/academicIntelligence';
import type { ForumAnswer, ForumQuestion } from '../types/app';
import type {
  CategorySuggestion,
  ForumDiscussionSummary,
  QuestionCategory
} from '../types/intelligence';
import { formatRelativeLabel, pluralize } from '../utils/format';

interface ForumScreenProps {
  questions: ForumQuestion[];
  answers: ForumAnswer[];
  likedQuestionIds: string[];
  summaries: Record<string, ForumDiscussionSummary>;
  onBack: () => void;
  onCreateQuestion: (title: string, tag: QuestionCategory, body: string, suggestion: CategorySuggestion) => void;
  onCreateAnswer: (questionId: string, message: string) => void;
  onToggleUseful: (questionId: string) => void;
  onGenerateSummary: (questionId: string) => Promise<ForumDiscussionSummary>;
}

const categories: QuestionCategory[] = [
  'Banco de Dados',
  'Estrutura de Dados',
  'Engenharia de Software',
  'Linguagem de Programação',
  'Usabilidade',
  'Acadêmico',
  'Eventos',
  'Materiais',
  'Geral'
];

export default function ForumScreen({
  questions,
  answers,
  likedQuestionIds,
  summaries,
  onBack,
  onCreateQuestion,
  onCreateAnswer,
  onToggleUseful,
  onGenerateSummary
}: ForumScreenProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState<QuestionCategory>('Geral');
  const [body, setBody] = useState('');
  const [categoryChanged, setCategoryChanged] = useState(false);
  const [answerMessage, setAnswerMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [visibleSummary, setVisibleSummary] = useState<ForumDiscussionSummary | undefined>();

  const selectedQuestion = questions.find((question) => question.id === selectedQuestionId) ?? null;
  const selectedAnswers = answers.filter((answer) => answer.questionId === selectedQuestionId);
  const suggestion = useMemo(() => suggestQuestionCategory(title, body), [title, body]);
  const storedSummary = selectedQuestionId ? summaries[selectedQuestionId] : undefined;

  useEffect(() => {
    if (!categoryChanged) {
      setTag(suggestion.category);
    }
  }, [categoryChanged, suggestion.category]);

  useEffect(() => {
    setVisibleSummary(storedSummary);
  }, [storedSummary, selectedQuestionId]);

  const getAnswerCount = (questionId: string) => answers.filter((answer) => answer.questionId === questionId).length;

  const handleCreateQuestion = () => {
    if (!title.trim() || !body.trim()) {
      setFormError('Preencha título e descrição para publicar a pergunta.');
      return;
    }

    onCreateQuestion(title.trim(), tag, body.trim(), suggestion);
    setTitle('');
    setTag('Geral');
    setBody('');
    setCategoryChanged(false);
    setFormError('');
    setShowCreateModal(false);
  };

  const handleCreateAnswer = () => {
    if (!selectedQuestionId || !answerMessage.trim()) {
      return;
    }

    onCreateAnswer(selectedQuestionId, answerMessage.trim());
    setAnswerMessage('');
  };

  const handleGenerateSummary = async () => {
    if (!selectedQuestionId) {
      return;
    }

    setIsLoadingSummary(true);
    const startTime = Date.now();
    const summary = await onGenerateSummary(selectedQuestionId);
    const remainingTime = Math.max(0, 650 - (Date.now() - startTime));

    window.setTimeout(() => {
      setVisibleSummary(summary);
      setIsLoadingSummary(false);
    }, remainingTime);
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <TopBar
        title="Fórum / Q&A"
        subtitle="Perguntas, respostas e trocas rápidas da turma"
        onBack={onBack}
        action={
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            aria-label="Nova pergunta"
            className="rounded-full bg-white p-3 text-primary shadow-card transition hover:bg-primary-light"
          >
            <Plus className="h-5 w-5" />
          </button>
        }
      />
      <main className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 pb-4">
        {questions.length === 0 ? (
          <EmptyState
            icon={<MessageSquareText className="h-6 w-6" />}
            title="Nenhuma pergunta por aqui"
            description="Crie a primeira conversa para iniciar a troca entre a turma."
            actionLabel="Nova pergunta"
            onAction={() => setShowCreateModal(true)}
          />
        ) : (
          questions.map((question) => {
            const answersCount = getAnswerCount(question.id);
            const liked = likedQuestionIds.includes(question.id);

            return (
              <Card key={question.id} className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <button type="button" onClick={() => setSelectedQuestionId(question.id)} className="min-w-0 flex-1 text-left">
                    <div className="space-y-2">
                      <Badge variant="primary">{question.tag}</Badge>
                      <p className="line-clamp-2 break-words text-sm font-semibold text-text-primary">{question.title}</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleUseful(question.id)}
                    className={`rounded-full p-2 transition ${liked ? 'bg-primary-light text-primary' : 'bg-slate-100 text-text-secondary'}`}
                    aria-label={liked ? 'Remover útil' : 'Marcar como útil'}
                  >
                    <ThumbsUp className={`h-4 w-4 ${liked ? 'fill-primary text-primary' : ''}`} />
                  </button>
                </div>
                <button type="button" onClick={() => setSelectedQuestionId(question.id)} className="w-full text-left">
                  <p className="line-clamp-2 break-words text-sm leading-6 text-text-secondary">{question.body}</p>
                </button>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-text-secondary">
                  <span>
                    {question.author} · {formatRelativeLabel(question.createdAt)}
                  </span>
                  <span>
                    {pluralize(answersCount, 'resposta', 'respostas')} · {question.helpfulCount + (liked ? 1 : 0)} útil
                  </span>
                </div>
                <Button variant="outline" onClick={() => setSelectedQuestionId(question.id)}>
                  Ver conversa
                </Button>
              </Card>
            );
          })
        )}
      </main>

      <div className="shrink-0 px-5 pb-5">
        <Button fullWidth onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4" />
          Nova pergunta
        </Button>
      </div>

      <Modal
        open={showCreateModal}
        title="Nova pergunta"
        onClose={() => {
          setShowCreateModal(false);
          setFormError('');
        }}
        footer={
          <>
            {formError ? <p className="text-sm font-medium text-danger">{formError}</p> : null}
            <Button fullWidth onClick={handleCreateQuestion}>
              Publicar pergunta
            </Button>
          </>
        }
      >
        <Input
          id="forum-question-title"
          label="Título"
          placeholder="Descreva sua dúvida"
          value={title}
          maxLength={120}
          onChange={(event) => setTitle(event.target.value)}
        />
        <label className="flex flex-col gap-2 text-sm font-medium text-text-primary" htmlFor="forum-question-body">
          <span>Detalhes</span>
          <textarea
            id="forum-question-body"
            className="min-h-[120px] rounded-input border border-border bg-white px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-primary/60"
            placeholder="Explique o contexto da sua pergunta"
            maxLength={700}
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        </label>

        <Card className="space-y-3 border-primary/20 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-light text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Categoria sugerida: {suggestion.category}</p>
              <p className="mt-1 text-xs text-text-secondary">Confiança: {suggestion.confidence}</p>
              <p className="mt-1 text-xs leading-5 text-text-secondary">Motivo: {suggestion.reason}</p>
            </div>
          </div>
          <Button
            variant={tag === suggestion.category ? 'secondary' : 'outline'}
            onClick={() => {
              setTag(suggestion.category);
              setCategoryChanged(true);
            }}
          >
            Usar categoria sugerida
          </Button>
        </Card>

        <label className="flex flex-col gap-2 text-sm font-medium text-text-primary" htmlFor="forum-question-tag">
          <span>Categoria final</span>
          <select
            id="forum-question-tag"
            className="min-h-[52px] rounded-input border border-border bg-white px-4 text-sm text-text-primary outline-none transition focus:border-primary/60"
            value={tag}
            onChange={(event) => {
              setTag(event.target.value as QuestionCategory);
              setCategoryChanged(true);
            }}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </Modal>

      <Modal
        open={Boolean(selectedQuestion)}
        title={selectedQuestion?.title ?? 'Pergunta'}
        onClose={() => {
          setSelectedQuestionId(null);
          setAnswerMessage('');
          setVisibleSummary(undefined);
        }}
        footer={
          <>
            <label className="flex flex-col gap-2 text-sm font-medium text-text-primary" htmlFor="forum-answer-message">
              <span>Adicionar resposta</span>
              <textarea
                id="forum-answer-message"
                className="min-h-[90px] rounded-input border border-border bg-white px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-primary/60"
                placeholder="Escreva sua resposta"
                maxLength={420}
                value={answerMessage}
                onChange={(event) => setAnswerMessage(event.target.value)}
              />
            </label>
            <Button fullWidth onClick={handleCreateAnswer}>
              Responder
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setSelectedQuestionId(null);
                setAnswerMessage('');
                setVisibleSummary(undefined);
              }}
            >
              Fechar pergunta
            </Button>
          </>
        }
      >
        {selectedQuestion ? (
          <div className="space-y-4">
            <Card className="space-y-3">
              <Badge variant="primary">{selectedQuestion.tag}</Badge>
              <p className="text-sm leading-6 text-text-secondary">{selectedQuestion.body}</p>
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>
                  {selectedQuestion.author} · {formatRelativeLabel(selectedQuestion.createdAt)}
                </span>
                <button
                  type="button"
                  onClick={() => onToggleUseful(selectedQuestion.id)}
                  className="font-semibold text-primary"
                >
                  {likedQuestionIds.includes(selectedQuestion.id) ? 'Marcado como útil' : 'Marcar como útil'}
                </button>
              </div>
            </Card>

            <Card className="space-y-3 border-primary/20 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-light text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Síntese da discussão</p>
                  <p className="mt-1 text-xs leading-5 text-text-secondary">
                    Reúne a pergunta, as respostas e as marcações úteis desta conversa.
                  </p>
                </div>
              </div>
              {visibleSummary ? (
                <div className="space-y-3 rounded-2xl bg-primary-light/35 p-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-primary">Problema principal</p>
                    <p className="mt-1 text-sm leading-6 text-text-secondary">{visibleSummary.problem}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-primary">Orientações</p>
                    <p className="mt-1 text-sm leading-6 text-text-secondary">{visibleSummary.guidance}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-primary">Próximo passo</p>
                    <p className="mt-1 text-sm leading-6 text-text-secondary">{visibleSummary.nextStep}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="primary">{visibleSummary.category}</Badge>
                    <Badge variant="neutral">{pluralize(visibleSummary.answerCount, 'resposta', 'respostas')}</Badge>
                    <Badge variant="neutral">{visibleSummary.usefulCount} útil</Badge>
                  </div>
                  {visibleSummary.fewAnswersNotice ? (
                    <p className="text-xs leading-5 text-text-secondary">{visibleSummary.fewAnswersNotice}</p>
                  ) : null}
                </div>
              ) : null}
              <Button fullWidth onClick={handleGenerateSummary} disabled={isLoadingSummary}>
                {isLoadingSummary ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Sintetizando discussão
                  </>
                ) : visibleSummary ? (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Atualizar síntese
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Gerar síntese da discussão
                  </>
                )}
              </Button>
            </Card>

            <div className="space-y-3">
              {selectedAnswers.length === 0 ? (
                <EmptyState
                  icon={<MessageSquareText className="h-6 w-6" />}
                  title="Nenhuma resposta ainda"
                  description="Seja a primeira pessoa a responder esta pergunta."
                />
              ) : (
                selectedAnswers.map((answer) => (
                  <Card key={answer.id} className="space-y-2 p-4">
                    <p className="text-sm font-semibold text-text-primary">{answer.author}</p>
                    <p className="text-sm leading-6 text-text-secondary">{answer.message}</p>
                    <p className="text-xs text-text-secondary">{formatRelativeLabel(answer.createdAt)}</p>
                  </Card>
                ))
              )}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
