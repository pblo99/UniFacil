import {
  Bell,
  BookOpen,
  Boxes,
  CalendarDays,
  ClipboardList,
  Code2,
  Database,
  Files,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  type LucideIcon,
  MapPin,
  Megaphone,
  MessagesSquare,
  Network,
  Smartphone,
  Sparkles,
  Users
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { IconKey } from '../types/app';

const iconMap: Record<IconKey, LucideIcon> = {
  'graduation-cap': GraduationCap,
  database: Database,
  layout: LayoutDashboard,
  blocks: Boxes,
  code: Code2,
  smartphone: Smartphone,
  network: Network,
  'book-open': BookOpen,
  clipboard: ClipboardList,
  folder: FolderOpen,
  users: Users,
  calendar: CalendarDays,
  megaphone: Megaphone,
  messages: MessagesSquare,
  bell: Bell,
  'file-stack': Files,
  sparkles: Sparkles,
  'map-pin': MapPin
};

interface AppIconProps extends LucideProps {
  icon: IconKey;
}

export function AppIcon({ icon, ...props }: AppIconProps) {
  const IconComponent = iconMap[icon];

  return <IconComponent {...props} />;
}
