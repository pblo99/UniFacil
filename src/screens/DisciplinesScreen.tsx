import { ChevronRight, Star } from 'lucide-react';
import { CardButton } from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import TopBar from '../components/TopBar';
import type { Discipline, Professor } from '../types/app';
import { formatAverage } from '../utils/format';
import { AppIcon } from '../utils/icons';

interface DisciplinesScreenProps {
  disciplines: Discipline[];
  professors: Professor[];
  getAverageForDiscipline: (disciplineId: string) => number;
  onSelectDiscipline: (disciplineId: string) => void;
}

export default function DisciplinesScreen({
  disciplines,
  professors,
  getAverageForDiscipline,
  onSelectDiscipline
}: DisciplinesScreenProps) {
  const findProfessorName = (professorId: string) =>
    professors.find((professor) => professor.id === professorId)?.name ?? 'Professor não informado';

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar title="Minhas disciplinas" subtitle="Acompanhe horários, conteúdos e avaliações" />
      <main className="flex-1 space-y-4 overflow-y-auto px-5 pb-6">
        <SectionTitle title="Grade atual" subtitle="6 disciplinas ativas neste semestre" />
        <div className="space-y-3">
          {disciplines.map((discipline) => (
            <CardButton
              key={discipline.id}
              onClick={() => onSelectDiscipline(discipline.id)}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
                  <AppIcon icon={discipline.icon} className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-text-primary">{discipline.name}</p>
                  <p className="text-xs text-text-secondary">{findProfessorName(discipline.professorId)}</p>
                  <p className="text-xs text-text-secondary">{discipline.schedule}</p>
                  <div className="flex items-center gap-1 text-xs text-warning">
                    <Star className="h-3.5 w-3.5 fill-warning" />
                    <span className="font-semibold">{formatAverage(getAverageForDiscipline(discipline.id))}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-text-secondary" />
            </CardButton>
          ))}
        </div>
      </main>
    </div>
  );
}
