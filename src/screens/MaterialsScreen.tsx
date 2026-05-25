import { useMemo, useState } from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { Card, CardButton } from '../components/Card';
import EmptyState from '../components/EmptyState';
import Input from '../components/Input';
import Modal from '../components/Modal';
import SectionTitle from '../components/SectionTitle';
import TopBar from '../components/TopBar';
import type { MaterialCategory, MaterialFolder, MaterialItem } from '../types/app';
import { formatRelativeLabel } from '../utils/format';
import { AppIcon } from '../utils/icons';

interface MaterialsScreenProps {
  folders: MaterialFolder[];
  materials: MaterialItem[];
  onBack: () => void;
  onAddMaterial: (title: string, category: MaterialCategory, typeLabel: string) => void;
}

export default function MaterialsScreen({ folders, materials, onBack, onAddMaterial }: MaterialsScreenProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MaterialCategory>('Resumos');
  const [typeLabel, setTypeLabel] = useState('PDF');
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const filteredMaterials = useMemo(
    () => materials.filter((material) => material.category === selectedCategory),
    [materials, selectedCategory]
  );

  const handleAddMaterial = () => {
    if (!title.trim()) {
      setError('Informe um nome para o material.');
      return;
    }

    onAddMaterial(title.trim(), category, typeLabel.trim() || 'PDF');
    setTitle('');
    setCategory('Resumos');
    setTypeLabel('PDF');
    setError('');
    setFeedback('Material adicionado ao protótipo com sucesso.');
    setShowModal(false);
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <TopBar title="Materiais" subtitle="Conteúdos organizados por pasta" onBack={onBack} />
      <main className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 pb-4">
        <section className="space-y-3">
          <SectionTitle title="Pastas" subtitle="Acesse rapidamente os principais conteúdos" />
          <div className="space-y-3">
            {folders.map((folder) => (
              <CardButton
                key={folder.id}
                className="flex items-center justify-between gap-3"
                onClick={() => setSelectedCategory(folder.name)}
              >
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
              </CardButton>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <SectionTitle title="Materiais recentes" subtitle="Últimos itens adicionados" />
          <div className="space-y-3">
            {materials.slice(0, 6).map((material) => (
              <Card key={material.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{material.title}</p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {material.category} · {formatRelativeLabel(material.addedAt)}
                  </p>
                </div>
                <Badge variant={material.addedByUser ? 'success' : 'neutral'}>{material.typeLabel}</Badge>
              </Card>
            ))}
          </div>
          {feedback ? <p className="text-sm font-medium text-success">{feedback}</p> : null}
        </section>
      </main>

      <div className="shrink-0 px-5 pb-5">
        <Button fullWidth onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4" />
          Enviar material
        </Button>
      </div>

      <Modal
        open={showModal}
        title="Adicionar material"
        onClose={() => {
          setShowModal(false);
          setError('');
        }}
        footer={
          <>
            {error ? <p className="text-sm font-medium text-danger">{error}</p> : null}
            <Button fullWidth onClick={handleAddMaterial}>
              Salvar material
            </Button>
          </>
        }
      >
        <Input
          id="material-title"
          label="Título"
          placeholder="Ex.: Resumo da aula 4"
          value={title}
          maxLength={90}
          onChange={(event) => setTitle(event.target.value)}
        />
        <label className="flex flex-col gap-2 text-sm font-medium text-text-primary" htmlFor="material-category">
          <span>Pasta</span>
          <select
            id="material-category"
            className="min-h-[52px] rounded-input border border-border bg-white px-4 text-sm text-text-primary outline-none transition focus:border-primary/60"
            value={category}
            onChange={(event) => setCategory(event.target.value as MaterialCategory)}
          >
            {folders.map((folder) => (
              <option key={folder.id} value={folder.name}>
                {folder.name}
              </option>
            ))}
          </select>
        </label>
        <Input
          id="material-type"
          label="Tipo"
          placeholder="PDF"
          value={typeLabel}
          maxLength={12}
          onChange={(event) => setTypeLabel(event.target.value)}
        />
      </Modal>

      <Modal
        open={Boolean(selectedCategory)}
        title={selectedCategory ?? 'Materiais'}
        onClose={() => setSelectedCategory(null)}
        footer={
          <Button variant="secondary" onClick={() => setSelectedCategory(null)}>
            Fechar
          </Button>
        }
      >
        <div className="space-y-3">
          {selectedCategory && filteredMaterials.length > 0 ? (
            filteredMaterials.map((material) => (
              <Card key={material.id} className="space-y-1 p-4">
                <p className="text-sm font-semibold text-text-primary">{material.title}</p>
                <p className="text-xs text-text-secondary">
                  {material.typeLabel} · {formatRelativeLabel(material.addedAt)}
                </p>
              </Card>
            ))
          ) : (
            <EmptyState
              icon={<AppIcon icon="folder" className="h-6 w-6" />}
              title="Nenhum material nesta pasta"
              description="Adicione um novo item para começar a organizar os conteúdos."
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
