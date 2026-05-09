import { useState } from 'react';
import { Heart, MapPinned } from 'lucide-react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { Card } from '../components/Card';
import Modal from '../components/Modal';
import SectionTitle from '../components/SectionTitle';
import TopBar from '../components/TopBar';
import type { EventItem } from '../types/app';
import { formatDateLabel, formatTimeLabel, pluralize } from '../utils/format';
import { AppIcon } from '../utils/icons';

interface EventsScreenProps {
  events: EventItem[];
  interestedEventIds: string[];
  onBack: () => void;
  onToggleInterest: (eventId: string) => void;
}

export default function EventsScreen({ events, interestedEventIds, onBack, onToggleInterest }: EventsScreenProps) {
  const [mapEvent, setMapEvent] = useState<EventItem | null>(null);
  const [showOverview, setShowOverview] = useState(false);
  const interestedCount = interestedEventIds.length;

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <TopBar title="Eventos" subtitle="Agenda acadêmica do semestre" onBack={onBack} />
      <main className="flex-1 space-y-5 overflow-y-auto px-5 pb-6">
        <Card className="space-y-3">
          <SectionTitle
            title="Seu interesse"
            subtitle={pluralize(interestedCount, 'evento marcado', 'eventos marcados')}
          />
          <Button variant="outline" onClick={() => setShowOverview(true)}>
            Ver todos
          </Button>
        </Card>

        <div className="space-y-3">
          {events.map((event) => {
            const interested = interestedEventIds.includes(event.id);

            return (
              <Card key={event.id} className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                    <AppIcon icon={event.icon} className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-text-primary">{event.title}</p>
                      <Badge variant="primary">{event.category}</Badge>
                    </div>
                    <p className="mt-2 text-xs text-text-secondary">
                      {formatDateLabel(event.startsAt)} · {formatTimeLabel(event.startsAt)}
                    </p>
                    <p className="mt-1 text-xs text-text-secondary">{event.location}</p>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">{event.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant={interested ? 'secondary' : 'primary'} onClick={() => onToggleInterest(event.id)}>
                    <Heart className={`h-4 w-4 ${interested ? 'fill-primary text-primary' : ''}`} />
                    {interested ? 'Interessado' : 'Tenho interesse'}
                  </Button>
                  <Button variant="outline" onClick={() => setMapEvent(event)}>
                    <MapPinned className="h-4 w-4" />
                    Ver mapa
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </main>

      <Modal
        open={Boolean(mapEvent)}
        title="Local do evento"
        onClose={() => setMapEvent(null)}
        footer={
          <Button variant="secondary" onClick={() => setMapEvent(null)}>
            Fechar
          </Button>
        }
      >
        {mapEvent ? (
          <Card className="space-y-2 p-4">
            <p className="text-sm font-semibold text-text-primary">{mapEvent.title}</p>
            <p className="text-sm text-text-secondary">{mapEvent.location}</p>
            <p className="text-sm leading-6 text-text-secondary">
              O mapa é apenas ilustrativo neste protótipo, mas o local já está identificado para a apresentação.
            </p>
          </Card>
        ) : null}
      </Modal>

      <Modal
        open={showOverview}
        title="Todos os eventos"
        onClose={() => setShowOverview(false)}
        footer={
          <Button variant="secondary" onClick={() => setShowOverview(false)}>
            Fechar
          </Button>
        }
      >
        <p className="text-sm leading-6 text-text-secondary">
          Todos os eventos acadêmicos já estão listados nesta tela. Use o botão de interesse para destacar os que você
          quer acompanhar.
        </p>
      </Modal>
    </div>
  );
}
