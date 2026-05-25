import { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../components/Button';
import { Card } from '../components/Card';
import EmptyState from '../components/EmptyState';
import Input from '../components/Input';
import Modal from '../components/Modal';
import TopBar from '../components/TopBar';
import type { Group } from '../types/app';
import { pluralize } from '../utils/format';
import { AppIcon } from '../utils/icons';

interface GroupsScreenProps {
  groups: Group[];
  joinedGroupIds: string[];
  onToggleGroup: (groupId: string) => void;
  onCreateGroup: (name: string, description: string) => void;
}

export default function GroupsScreen({
  groups,
  joinedGroupIds,
  onToggleGroup,
  onCreateGroup
}: GroupsScreenProps) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleCreateGroup = () => {
    if (!name.trim() || !description.trim()) {
      setError('Informe nome e descrição para criar o grupo.');
      return;
    }

    onCreateGroup(name.trim(), description.trim());
    setName('');
    setDescription('');
    setError('');
    setShowModal(false);
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <TopBar
        title="Grupos"
        subtitle="Conecte-se com colegas e organize estudos"
        action={
          <button
            type="button"
            onClick={() => setShowModal(true)}
            aria-label="Criar grupo"
            className="rounded-full bg-white p-3 text-primary shadow-card transition hover:bg-primary-light"
          >
            <Plus className="h-5 w-5" />
          </button>
        }
      />
      <main className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 pb-4">
        {groups.length === 0 ? (
          <EmptyState
            icon={<AppIcon icon="users" className="h-6 w-6" />}
            title="Nenhum grupo disponível"
            description="Crie um novo grupo para iniciar as conversas da turma."
            actionLabel="Criar grupo"
            onAction={() => setShowModal(true)}
          />
        ) : (
          groups.map((group) => {
            const joined = joinedGroupIds.includes(group.id);

            return (
              <Card key={group.id} className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                    <AppIcon icon={group.icon} className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text-primary">{group.name}</p>
                    <p className="mt-1 text-xs text-text-secondary">
                      {pluralize(group.members, 'membro', 'membros')}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">{group.description}</p>
                  </div>
                </div>
                <Button variant={joined ? 'secondary' : 'primary'} onClick={() => onToggleGroup(group.id)}>
                  {joined ? 'Entrou' : 'Entrar'}
                </Button>
              </Card>
            );
          })
        )}
      </main>

      <div className="shrink-0 px-5 pb-5">
        <Button fullWidth onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4" />
          Criar grupo
        </Button>
      </div>

      <Modal
        open={showModal}
        title="Criar grupo"
        onClose={() => {
          setShowModal(false);
          setError('');
        }}
        footer={
          <>
            {error ? <p className="text-sm font-medium text-danger">{error}</p> : null}
            <Button fullWidth onClick={handleCreateGroup}>
              Criar grupo
            </Button>
          </>
        }
      >
        <Input
          id="new-group-name"
          label="Nome do grupo"
          placeholder="Ex.: Revisão para a prova"
          value={name}
          maxLength={70}
          onChange={(event) => setName(event.target.value)}
        />
        <label className="flex flex-col gap-2 text-sm font-medium text-text-primary" htmlFor="new-group-description">
          <span>Descrição</span>
          <textarea
            id="new-group-description"
            className="min-h-[110px] rounded-input border border-border bg-white px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-primary/60"
            placeholder="Descreva o objetivo do grupo"
            maxLength={220}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
      </Modal>
    </div>
  );
}
