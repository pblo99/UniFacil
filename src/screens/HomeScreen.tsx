import { useState } from 'react';
import { Bell, ChevronRight, RefreshCw, Sparkles, X } from 'lucide-react';
import { exams as mockExams, notices as mockNotices } from '../data/mockData';
import type { EventItem, ExamItem, Notice, UserProfile } from '../types/app';
import type { WeeklyPlan } from '../types/intelligence';
import { formatDateTimeLabel } from '../utils/format';
import { AppIcon } from '../utils/icons';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { Card, CardButton } from '../components/Card';
import Modal from '../components/Modal';
import SectionTitle from '../components/SectionTitle';
import TopBar from '../components/TopBar';

interface HomeScreenProps {
  user: UserProfile;
  nextEvent: EventItem | undefined;
  nextExam: ExamItem | undefined;
  importantNotice: Notice | undefined;
  weeklyPlan: WeeklyPlan | null;
  onGenerateWeeklyPlan: () => Promise<WeeklyPlan>;
  onClearWeeklyPlan: () => void;
  onOpenDisciplines: () => void;
  onOpenGroups: () => void;
  onOpenMaterials: () => void;
  onOpenEvents: () => void;
}

const shortcutCards = [
  { label: 'Disciplinas', icon: 'book-open', action: 'disciplines' },
  { label: 'Provas', icon: 'clipboard', action: 'exams' },
  { label: 'Materiais', icon: 'folder', action: 'materials' },
  { label: 'Grupos', icon: 'users', action: 'groups' },
  { label: 'Eventos', icon: 'calendar', action: 'events' },
  { label: 'Avisos', icon: 'megaphone', action: 'notices' }
] as const;

export default function HomeScreen({
  user,
  nextEvent,
  nextExam,
  importantNotice,
  weeklyPlan,
  onGenerateWeeklyPlan,
  onClearWeeklyPlan,
  onOpenDisciplines,
  onOpenGroups,
  onOpenMaterials,
  onOpenEvents
}: HomeScreenProps) {
  const [showExamsModal, setShowExamsModal] = useState(false);
  const [showNoticesModal, setShowNoticesModal] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const handleShortcutClick = (action: (typeof shortcutCards)[number]['action']) => {
    if (action === 'disciplines') {
      onOpenDisciplines();
      return;
    }

    if (action === 'groups') {
      onOpenGroups();
      return;
    }

    if (action === 'materials') {
      onOpenMaterials();
      return;
    }

    if (action === 'events') {
      onOpenEvents();
      return;
    }

    if (action === 'exams') {
      setShowExamsModal(true);
      return;
    }

    setShowNoticesModal(true);
  };

  const handleGenerateWeeklyPlan = async () => {
    setIsGeneratingPlan(true);
    const startTime = Date.now();
    await onGenerateWeeklyPlan();
    const remainingTime = Math.max(0, 650 - (Date.now() - startTime));
    window.setTimeout(() => setIsGeneratingPlan(false), remainingTime);
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <TopBar
        title={`Olá, ${user.name.split(' ')[0]}!`}
        subtitle="O que você quer fazer hoje?"
        action={
          <button
            type="button"
            onClick={() => setShowNoticesModal(true)}
            aria-label="Abrir avisos"
            className="rounded-full bg-white p-3 text-text-secondary shadow-card transition hover:text-primary"
          >
            <Bell className="h-5 w-5" />
          </button>
        }
      />

      <main className="flex-1 space-y-6 overflow-y-auto px-5 pb-6">
        <section className="space-y-3">
          <Card className="border-primary/20 bg-white">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold text-text-primary">Resumo inteligente</p>
                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Organize sua semana com base nos seus compromissos acadêmicos.
                </p>
              </div>
            </div>

            {weeklyPlan ? (
              <div className="mt-4 space-y-3 rounded-2xl bg-primary-light/35 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{weeklyPlan.title}</p>
                    <p className="mt-1 text-xs leading-5 text-text-secondary">{weeklyPlan.intro}</p>
                  </div>
                  <button
                    type="button"
                    onClick={onClearWeeklyPlan}
                    className="rounded-full p-1.5 text-text-secondary transition hover:bg-white hover:text-danger"
                    aria-label="Limpar resumo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <ol className="space-y-2">
                  {weeklyPlan.priorities.map((priority, index) => (
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

                <p className="text-xs leading-5 text-text-secondary">{weeklyPlan.closingMessage}</p>
              </div>
            ) : null}

            <div className="mt-4 grid grid-cols-1 gap-3">
              <Button fullWidth onClick={handleGenerateWeeklyPlan} disabled={isGeneratingPlan}>
                {isGeneratingPlan ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Organizando prioridades
                  </>
                ) : weeklyPlan ? (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Atualizar resumo
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Gerar resumo da semana
                  </>
                )}
              </Button>
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-2 gap-3">
          {shortcutCards.map(({ label, icon, action }) => (
            <CardButton key={label} className="space-y-3 p-4" onClick={() => handleShortcutClick(action)}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <AppIcon icon={icon} className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{label}</p>
                <p className="mt-1 text-xs leading-5 text-text-secondary">Acesso rápido</p>
              </div>
            </CardButton>
          ))}
        </section>

        <section className="space-y-3">
          <SectionTitle title="Próximo evento" subtitle="Destaque para o calendário acadêmico" />
          {nextEvent ? (
            <CardButton className="space-y-3" onClick={onOpenEvents}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                    <AppIcon icon={nextEvent.icon} className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{nextEvent.title}</p>
                    <p className="mt-1 text-xs text-text-secondary">{formatDateTimeLabel(nextEvent.startsAt)}</p>
                    <p className="mt-1 text-xs text-text-secondary">{nextEvent.location}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-text-secondary" />
              </div>
            </CardButton>
          ) : null}
        </section>

        <section className="space-y-3">
          <SectionTitle title="Próxima prova" subtitle="Planeje sua revisão com antecedência" />
          {nextExam ? (
            <Card className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                  <AppIcon icon="clipboard" className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{nextExam.title}</p>
                  <p className="mt-1 text-xs text-text-secondary">{formatDateTimeLabel(nextExam.scheduledAt)}</p>
                  <p className="mt-1 text-xs text-text-secondary">{nextExam.location}</p>
                </div>
              </div>
              <Button variant="secondary" onClick={() => setShowExamsModal(true)}>
                Ver provas
              </Button>
            </Card>
          ) : null}
        </section>

        <section className="space-y-3">
          <SectionTitle title="Aviso importante" subtitle="Fique por dentro dos prazos" />
          {importantNotice ? (
            <Card className="space-y-3">
              <Badge variant={importantNotice.tone === 'danger' ? 'danger' : 'warning'}>
                {importantNotice.tone === 'danger' ? 'Urgente' : 'Atenção'}
              </Badge>
              <div>
                <p className="text-sm font-semibold text-text-primary">{importantNotice.title}</p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{importantNotice.message}</p>
              </div>
              <Button variant="outline" onClick={() => setShowNoticesModal(true)}>
                Ver todos os avisos
              </Button>
            </Card>
          ) : null}
        </section>

        <button
          type="button"
          onClick={onOpenEvents}
          className="pb-2 text-sm font-semibold text-primary transition hover:text-primary-dark"
        >
          Ver todos os eventos
        </button>
      </main>

      <Modal
        open={showExamsModal}
        title="Próximas provas"
        onClose={() => setShowExamsModal(false)}
        footer={
          <Button variant="secondary" onClick={() => setShowExamsModal(false)}>
            Fechar
          </Button>
        }
      >
        <div className="space-y-3">
          {mockExams.map((exam) => (
            <Card key={exam.id} className="space-y-1 p-4">
              <p className="text-sm font-semibold text-text-primary">{exam.title}</p>
              <p className="text-xs text-text-secondary">{formatDateTimeLabel(exam.scheduledAt)}</p>
              <p className="text-xs text-text-secondary">{exam.location}</p>
            </Card>
          ))}
        </div>
      </Modal>

      <Modal
        open={showNoticesModal}
        title="Avisos"
        onClose={() => setShowNoticesModal(false)}
        footer={
          <Button variant="secondary" onClick={() => setShowNoticesModal(false)}>
            Fechar
          </Button>
        }
      >
        <div className="space-y-3">
          {mockNotices.map((notice) => (
            <Card key={notice.id} className="space-y-2 p-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    notice.tone === 'danger'
                      ? 'danger'
                      : notice.tone === 'warning'
                        ? 'warning'
                        : notice.tone === 'success'
                          ? 'success'
                          : 'primary'
                  }
                >
                  {notice.tone === 'danger' ? 'Urgente' : notice.tone === 'warning' ? 'Atenção' : 'Informativo'}
                </Badge>
              </div>
              <p className="text-sm font-semibold text-text-primary">{notice.title}</p>
              <p className="text-sm leading-6 text-text-secondary">{notice.message}</p>
            </Card>
          ))}
        </div>
      </Modal>
    </div>
  );
}
