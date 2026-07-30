import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Icon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
      <p className="font-medium text-heading">{title}</p>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
  );
}
