import { EmptyState as SharedEmptyState } from '../feedback/Feedback';

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return <SharedEmptyState title={title} description={description} />;
}
