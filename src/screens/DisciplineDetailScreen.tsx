import { useEffect, useState } from 'react';
import { CircleHelp, FileText, RefreshCw, Sparkles, Star } from 'lucide-react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { Card } from '../components/Card';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import SectionTitle from '../components/SectionTitle';
import TopBar from '../components/TopBar';
import type { Discipline, ForumQuestion, MaterialItem, Professor } from '../types/app';
import type { MaterialRecommendationResult } from '../types/intelligence';
import { formatAverage, formatRelativeLabel } from '../utils/format';
import { AppIcon } from '../utils/icons';

interface DisciplineDetailScreenProps {
  discipline: Discipline;
  professor: Professor;
  average: number;
  recentMaterials: MaterialItem[];
  recentQuestions: ForumQuestion[];
  recommendation: MaterialRecommendationResult | undefined;
  onBack: () => void;
  onOpenRating: () => void;
  onOpenMaterials: () => void;
  onOpenForum: () => void;
  onGenerateRecommendations: (disciplineId: string) => Promise<MaterialRecommendationResult>;
}

export default function DisciplineDetailScreen({
  discipline,
  professor,
  average,
  recentMaterials,
  recentQuestions,
  recommendation,
  onBack,
  onOpenRating,
  onOpenMaterials,
  onOpenForum,
  onGenerateRecommendations
}: DisciplineDetailScreenProps) {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [visibleRecommendation, setVisibleRecommendation] = useState<MaterialRecommendationResult | undefined>(
    recommendation
  );

  useEffect(() => {
    setVisibleRecommendation(recommendation);
  }, [discipline.id, recommendation]);

  const handleGenerateRecommendations = async () => {
    setShowRecommendations(true);
    setIsLoadingRecommendations(true);
    const startTime = Date.now();
    const result = await onGenerateRecommendations(discipline.id);
    const remainingTime = Math.max(0, 650 - (Date.now() - startTime));

    window.setTimeout(() => {
      setVisibleRecommendation(result);
      setIsLoadingRecommendations(false);
    }, remainingTime);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <TopBar title={discipline.name} subtitle="Detalhes da disciplina" onBack={onBack} />
      <main className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 pb-8">
        <Card className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
              <AppIcon icon={discipline.icon} className="h-7 w-7" />
            </div>
            <div className="flex-1">
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
            <span className="text-sm font-semibold">Média da disciplina: {formatAverage(average)}</span>
          </div>
          <div className="grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-text-secondary">
            <div>
              <p className="font-semibold text-text-primary">Professor</p>
              <p className="mt-1">{professor.name}</p>
            </div>
            <div>
              <p className="font-semibold text-text-primary">Atendimento</p>
              <p className="mt-1">{professor.officeHours}</p>
            </div>
            <div>
              <p className="font-semibold text-text-primary">Contato</p>
              <p className="mt-1">{professor.email}</p>
            </div>
          </div>
        </Card>

        <section className="space-y-3">
          <SectionTitle title="Próximos conteúdos" subtitle="O que vem nas próximas aulas" />
          <div className="space-y-3">
            {discipline.nextTopics.map((topic) => (
              <Card key={topic} className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-light text-primary">
                  <AppIcon icon="book-open" className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-text-primary">{topic}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <SectionTitle title="Materiais recentes" actionLabel="Ver materiais" onAction={onOpenMaterials} />
          <div className="space-y-3">
            {recentMaterials.map((material) => (
              <Card key={material.id} className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-light text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{material.title}</p>
                  <p className="mt-1 text-xs text-text-secondary">{material.typeLabel}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <SectionTitle title="Perguntas recentes" actionLabel="Abrir fórum" onAction={onOpenForum} />
          <div className="space-y-3">
            {recentQuestions.map((question) => (
              <Card key={question.id} className="flex items-start gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-light text-primary">
                  <CircleHelp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{question.title}</p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {question.author} · {formatRelativeLabel(question.createdAt)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-3 pb-2">
          <Button fullWidth onClick={onOpenRating}>
            Avaliar disciplina
          </Button>
          <Button variant="secondary" fullWidth onClick={handleGenerateRecommendations}>
            <Sparkles className="h-4 w-4" />
            Recomendar materiais
          </Button>
          <Button variant="outline" fullWidth onClick={onOpenMaterials}>
            Ver materiais
          </Button>
          <Button variant="secondary" fullWidth onClick={onOpenForum}>
            Abrir fórum
          </Button>
        </div>
      </main>

      <Modal
        open={showRecommendations}
        title="Recomendações inteligentes"
        onClose={() => setShowRecommendations(false)}
        footer={
          <Button variant="secondary" onClick={() => setShowRecommendations(false)}>
            Fechar
          </Button>
        }
      >
        {isLoadingRecommendations ? (
          <Card className="flex items-center gap-3 p-4">
            <RefreshCw className="h-5 w-5 animate-spin text-primary" />
            <p className="text-sm font-medium text-text-secondary">Analisando materiais da disciplina...</p>
          </Card>
        ) : visibleRecommendation && visibleRecommendation.items.length > 0 ? (
          <div className="space-y-4">
            <Card className="space-y-2 border-primary/20 p-4">
              <p className="text-sm font-semibold text-text-primary">{visibleRecommendation.headline}</p>
              <p className="text-sm leading-6 text-text-secondary">{visibleRecommendation.reason}</p>
            </Card>
            <ol className="space-y-3">
              {visibleRecommendation.items.map((item, index) => (
                <li key={item.materialId} className="rounded-2xl border border-border/80 bg-white p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <Badge variant="primary">{item.typeLabel}</Badge>
                  </div>
                  <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-text-secondary">{item.reason}</p>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <EmptyState
            icon={<FileText className="h-6 w-6" />}
            title="Sem recomendação disponível"
            description="Adicione materiais ou perguntas relacionadas para receber sugestões mais precisas."
          />
        )}
      </Modal>
    </div>
  );
}
