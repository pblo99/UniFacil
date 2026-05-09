import { useEffect, useState } from 'react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import RatingStars from '../components/RatingStars';
import TopBar from '../components/TopBar';
import type { Discipline, Rating } from '../types/app';

interface RatingScreenProps {
  discipline: Discipline;
  initialRating?: Rating;
  onBack: () => void;
  onSave: (rating: Rating) => void;
}

export default function RatingScreen({ discipline, initialRating, onBack, onSave }: RatingScreenProps) {
  const [difficulty, setDifficulty] = useState(initialRating?.difficulty ?? 0);
  const [teaching, setTeaching] = useState(initialRating?.teaching ?? 0);
  const [workload, setWorkload] = useState(initialRating?.workload ?? 0);
  const [organization, setOrganization] = useState(initialRating?.organization ?? 0);
  const [recommend, setRecommend] = useState<boolean | null>(initialRating?.recommend ?? null);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setDifficulty(initialRating?.difficulty ?? 0);
    setTeaching(initialRating?.teaching ?? 0);
    setWorkload(initialRating?.workload ?? 0);
    setOrganization(initialRating?.organization ?? 0);
    setRecommend(initialRating?.recommend ?? null);
    setFeedback('');
    setError('');
  }, [discipline.id, initialRating]);

  const handleSubmit = () => {
    if (![difficulty, teaching, workload, organization].every((value) => value > 0) || recommend === null) {
      setError('Preencha todas as avaliações antes de enviar.');
      setFeedback('');
      return;
    }

    onSave({
      disciplineId: discipline.id,
      difficulty,
      teaching,
      workload,
      organization,
      recommend,
      submittedAt: new Date().toISOString()
    });

    setError('');
    setFeedback('Avaliação enviada com sucesso.');
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar title="Avaliar disciplina" subtitle={discipline.name} onBack={onBack} />
      <main className="flex-1 space-y-4 overflow-y-auto px-5 pb-6">
        <div className="space-y-2 rounded-card bg-white p-5 shadow-card">
          <Badge variant="primary">Disciplina selecionada</Badge>
          <h2 className="text-xl font-semibold text-text-primary">{discipline.name}</h2>
          <p className="text-sm text-text-secondary">{discipline.schedule}</p>
        </div>

        <RatingStars label="Dificuldade" value={difficulty} onChange={setDifficulty} />
        <RatingStars label="Didática do professor" value={teaching} onChange={setTeaching} />
        <RatingStars label="Carga de trabalho" value={workload} onChange={setWorkload} />
        <RatingStars label="Organização dos materiais" value={organization} onChange={setOrganization} />

        <div className="rounded-card border border-border/80 bg-white p-4">
          <p className="mb-3 text-sm font-semibold text-text-primary">Recomenda esta disciplina?</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant={recommend === true ? 'primary' : 'outline'} onClick={() => setRecommend(true)}>
              Sim
            </Button>
            <Button variant={recommend === false ? 'primary' : 'outline'} onClick={() => setRecommend(false)}>
              Não
            </Button>
          </div>
        </div>

        {error ? <p className="text-sm font-medium text-danger">{error}</p> : null}
        {feedback ? <p className="text-sm font-medium text-success">{feedback}</p> : null}

        <Button fullWidth onClick={handleSubmit}>
          Enviar avaliação
        </Button>
      </main>
    </div>
  );
}
