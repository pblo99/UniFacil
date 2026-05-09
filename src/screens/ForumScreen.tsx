import { useState } from 'react';
import { MessageSquareText, Plus, ThumbsUp } from 'lucide-react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { Card, CardButton } from '../components/Card';
import EmptyState from '../components/EmptyState';
import Input from '../components/Input';
import Modal from '../components/Modal';
import TopBar from '../components/TopBar';
import type { ForumAnswer, ForumQuestion } from '../types/app';
import { formatRelativeLabel, pluralize } from '../utils/format';

interface ForumScreenProps {
  questions: ForumQuestion[];
  answers: ForumAnswer[];
  likedQuestionIds: string[];
  onBack: () => void;
  onCreateQuestion: (title: string, tag: string, body: string) => void;
  onCreateAnswer: (questionId: string, message: string) => void;
  onToggleUseful: (questionId: string) => void;
}

export default function ForumScreen({
  questions,
  answers,
  likedQuestionIds,
  onBack,
  onCreateQuestion,
  onCreateAnswer,
  onToggleUseful
}: ForumScreenProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [body, setBody] = useState('');
  const [answerMessage, setAnswerMessage] = useState('');
  const [formError, setFormError] = useState('');

  const selectedQuestion = questions.find((question) => question.id === selectedQuestionId) ?? null;
  const selectedAnswers = answers.filter((answer) => answer.questionId === selectedQuestionId);

  const getAnswerCount = (questionId: string) => answers.filter((answer) => answer.questionId === questionId).length;

  const handleCreateQuestion = () => {
    if (!title.trim() || !tag.trim() || !body.trim()) {
      setFormError('Preencha título, assunto e descrição para publicar a pergunta.');
      return;
    }

    onCreateQuestion(title.trim(), tag.trim(), body.trim());
    setTitle('');
    setTag('');
    setBody('');
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

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
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
      <main className="flex-1 space-y-3 overflow-y-auto px-5 pb-6">
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
              <CardButton key={question.id} onClick={() => setSelectedQuestionId(question.id)} className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <Badge variant="primary">{question.tag}</Badge>
                    <p className="text-sm font-semibold text-text-primary">{question.title}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleUseful(question.id);
                    }}
                    className={`rounded-full p-2 transition ${liked ? 'bg-primary-light text-primary' : 'bg-slate-100 text-text-secondary'}`}
                    aria-label={liked ? 'Remover útil' : 'Marcar como útil'}
                  >
                    <ThumbsUp className={`h-4 w-4 ${liked ? 'fill-primary text-primary' : ''}`} />
                  </button>
                </div>
                <p className="line-clamp-2 text-sm leading-6 text-text-secondary">{question.body}</p>
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span>
                    {question.author} · {formatRelativeLabel(question.createdAt)}
                  </span>
                  <span>
                    {pluralize(answersCount, 'resposta', 'respostas')} · {question.helpfulCount + (liked ? 1 : 0)} útil
                  </span>
                </div>
              </CardButton>
            );
          })
        )}
      </main>

      <div className="px-5 pb-6">
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
          onChange={(event) => setTitle(event.target.value)}
        />
        <Input
          id="forum-question-tag"
          label="Assunto"
          placeholder="Ex.: Banco de Dados"
          value={tag}
          onChange={(event) => setTag(event.target.value)}
        />
        <label className="flex flex-col gap-2 text-sm font-medium text-text-primary" htmlFor="forum-question-body">
          <span>Detalhes</span>
          <textarea
            id="forum-question-body"
            className="min-h-[120px] rounded-input border border-border bg-white px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-primary/60"
            placeholder="Explique o contexto da sua pergunta"
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        </label>
      </Modal>

      <Modal
        open={Boolean(selectedQuestion)}
        title={selectedQuestion?.title ?? 'Pergunta'}
        onClose={() => {
          setSelectedQuestionId(null);
          setAnswerMessage('');
        }}
        footer={
          <>
            <label className="flex flex-col gap-2 text-sm font-medium text-text-primary" htmlFor="forum-answer-message">
              <span>Adicionar resposta</span>
              <textarea
                id="forum-answer-message"
                className="min-h-[90px] rounded-input border border-border bg-white px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-primary/60"
                placeholder="Escreva sua resposta"
                value={answerMessage}
                onChange={(event) => setAnswerMessage(event.target.value)}
              />
            </label>
            <Button fullWidth onClick={handleCreateAnswer}>
              Responder
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
