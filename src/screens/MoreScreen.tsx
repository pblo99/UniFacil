import { useState } from 'react';
import {
  CalendarRange,
  CircleHelp,
  FileStack,
  Info,
  LogOut,
  RefreshCcw,
  Star,
  UserRound
} from 'lucide-react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { Card, CardButton } from '../components/Card';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import TopBar from '../components/TopBar';
import type { Discipline, EventItem, MaterialItem, Rating, UserProfile } from '../types/app';
import { formatAverage, formatRelativeLabel } from '../utils/format';

interface MoreScreenProps {
  user: UserProfile;
  disciplines: Discipline[];
  ratings: Rating[];
  materials: MaterialItem[];
  interestedEvents: EventItem[];
  onLogout: () => void;
  onResetPrototype: () => void;
}

type InfoModal =
  | 'profile'
  | 'ratings'
  | 'materials'
  | 'events'
  | 'help'
  | 'about'
  | null;

export default function MoreScreen({
  user,
  disciplines,
  ratings,
  materials,
  interestedEvents,
  onLogout,
  onResetPrototype
}: MoreScreenProps) {
  const [activeModal, setActiveModal] = useState<InfoModal>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const getDisciplineName = (disciplineId: string) =>
    disciplines.find((discipline) => discipline.id === disciplineId)?.name ?? 'Disciplina';

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <TopBar title="Mais" subtitle="Perfil e atalhos do protótipo" />
      <main className="flex-1 space-y-4 overflow-y-auto px-5 pb-6">
        <Card className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary-light text-primary">
              <UserRound className="h-8 w-8" />
            </div>
            <div>
              <p className="text-lg font-semibold text-text-primary">{user.name}</p>
              <p className="mt-1 text-sm text-text-secondary">{user.course}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-text-secondary">
            <p>
              <span className="font-semibold text-text-primary">RA:</span> {user.ra}
            </p>
            <p>
              <span className="font-semibold text-text-primary">Instituição:</span> {user.institution}
            </p>
            <p>
              <span className="font-semibold text-text-primary">E-mail:</span> {user.email}
            </p>
          </div>
        </Card>

        <div className="space-y-3">
          <CardButton className="flex items-center justify-between" onClick={() => setActiveModal('profile')}>
            <div className="flex items-center gap-3">
              <UserRound className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-text-primary">Meus dados</span>
            </div>
            <Badge variant="primary">Perfil</Badge>
          </CardButton>

          <CardButton className="flex items-center justify-between" onClick={() => setActiveModal('ratings')}>
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-text-primary">Minhas avaliações</span>
            </div>
            <Badge variant="neutral">{ratings.length}</Badge>
          </CardButton>

          <CardButton className="flex items-center justify-between" onClick={() => setActiveModal('materials')}>
            <div className="flex items-center gap-3">
              <FileStack className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-text-primary">Materiais salvos</span>
            </div>
            <Badge variant="neutral">{materials.length}</Badge>
          </CardButton>

          <CardButton className="flex items-center justify-between" onClick={() => setActiveModal('events')}>
            <div className="flex items-center gap-3">
              <CalendarRange className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold text-text-primary">Eventos de interesse</span>
            </div>
            <Badge variant="neutral">{interestedEvents.length}</Badge>
          </CardButton>

          <CardButton className="flex items-center gap-3" onClick={() => setActiveModal('help')}>
            <CircleHelp className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-text-primary">Ajuda</span>
          </CardButton>

          <CardButton className="flex items-center gap-3" onClick={() => setActiveModal('about')}>
            <Info className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-text-primary">Sobre o UniFácil</span>
          </CardButton>

          <CardButton className="flex items-center gap-3" onClick={() => setShowResetConfirm(true)}>
            <RefreshCcw className="h-5 w-5 text-danger" />
            <span className="text-sm font-semibold text-text-primary">Resetar protótipo</span>
          </CardButton>

          <CardButton className="flex items-center gap-3" onClick={onLogout}>
            <LogOut className="h-5 w-5 text-text-secondary" />
            <span className="text-sm font-semibold text-text-primary">Sair</span>
          </CardButton>
        </div>
      </main>

      <Modal
        open={activeModal !== null}
        title={
          activeModal === 'profile'
            ? 'Meus dados'
            : activeModal === 'ratings'
              ? 'Minhas avaliações'
              : activeModal === 'materials'
                ? 'Materiais salvos'
                : activeModal === 'events'
                  ? 'Eventos de interesse'
                  : activeModal === 'help'
                    ? 'Ajuda'
                    : 'Sobre o UniFácil'
        }
        onClose={() => setActiveModal(null)}
        footer={
          <Button variant="secondary" onClick={() => setActiveModal(null)}>
            Fechar
          </Button>
        }
      >
        {activeModal === 'profile' ? (
          <Card className="space-y-2 p-4">
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">Nome:</span> {user.name}
            </p>
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">RA:</span> {user.ra}
            </p>
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">Curso:</span> {user.course}
            </p>
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">Instituição:</span> {user.institution}
            </p>
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">E-mail:</span> {user.email}
            </p>
          </Card>
        ) : null}

        {activeModal === 'ratings' ? (
          ratings.length > 0 ? (
            <div className="space-y-3">
              {ratings.map((rating) => (
                <Card key={rating.disciplineId} className="space-y-2 p-4">
                  <p className="text-sm font-semibold text-text-primary">{getDisciplineName(rating.disciplineId)}</p>
                  <p className="text-sm text-text-secondary">
                    Média registrada: {formatAverage((rating.difficulty + rating.teaching + rating.workload + rating.organization) / 4)}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {rating.recommend ? 'Recomenda a disciplina' : 'Não recomenda a disciplina'}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Star className="h-6 w-6" />}
              title="Nenhuma avaliação registrada"
              description="Assim que você avaliar uma disciplina, ela aparecerá aqui."
            />
          )
        ) : null}

        {activeModal === 'materials' ? (
          materials.length > 0 ? (
            <div className="space-y-3">
              {materials.slice(0, 8).map((material) => (
                <Card key={material.id} className="space-y-1 p-4">
                  <p className="text-sm font-semibold text-text-primary">{material.title}</p>
                  <p className="text-xs text-text-secondary">
                    {material.category} · {formatRelativeLabel(material.addedAt)}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FileStack className="h-6 w-6" />}
              title="Nenhum material salvo"
              description="Adicione um material na tela de Materiais para vê-lo listado aqui."
            />
          )
        ) : null}

        {activeModal === 'events' ? (
          interestedEvents.length > 0 ? (
            <div className="space-y-3">
              {interestedEvents.map((event) => (
                <Card key={event.id} className="space-y-1 p-4">
                  <p className="text-sm font-semibold text-text-primary">{event.title}</p>
                  <p className="text-xs text-text-secondary">{event.location}</p>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<CalendarRange className="h-6 w-6" />}
              title="Nenhum evento marcado"
              description="Marque interesse em um evento para acompanhar depois."
            />
          )
        ) : null}

        {activeModal === 'help' ? (
          <Card className="space-y-2 p-4">
            <p className="text-sm leading-6 text-text-secondary">
              Use a navegação inferior para voltar às áreas principais. Nas telas internas, o botão de voltar leva você
              para o fluxo anterior sem perder os dados locais.
            </p>
          </Card>
        ) : null}

        {activeModal === 'about' ? (
          <Card className="space-y-2 p-4">
            <p className="text-sm leading-6 text-text-secondary">
              O UniFácil reúne disciplinas, materiais, grupos, avaliações, chat, eventos e fórum em um único ambiente
              acadêmico pensado para apresentação web com experiência mobile.
            </p>
          </Card>
        ) : null}
      </Modal>

      <Modal
        open={showResetConfirm}
        title="Resetar protótipo"
        onClose={() => setShowResetConfirm(false)}
        footer={
          <>
            <Button variant="outline" fullWidth onClick={() => setShowResetConfirm(false)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={() => {
                setShowResetConfirm(false);
                onResetPrototype();
              }}
            >
              Confirmar reset
            </Button>
          </>
        }
      >
        <p className="text-sm leading-6 text-text-secondary">
          Esta ação limpa a sessão atual e restaura o estado inicial do protótipo.
        </p>
      </Modal>
    </div>
  );
}
