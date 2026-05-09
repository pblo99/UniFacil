export function formatAverage(value: number): string {
  return value.toFixed(1).replace('.', ',');
}

export function formatDateLabel(value: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(value));
}

export function formatTimeLabel(value: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

export function formatDateTimeLabel(value: string): string {
  return `${formatDateLabel(value)} · ${formatTimeLabel(value)}`;
}

export function formatRelativeLabel(value: string): string {
  const now = new Date();
  const target = new Date(value);
  const diffMs = now.getTime() - target.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes <= 1) {
    return 'Agora';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min`;
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  const diffDays = Math.round(diffHours / 24);

  if (diffDays < 7) {
    return `${diffDays}d`;
  }

  return formatDateLabel(value);
}

export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
