import { Spinner } from '../feedback/Feedback';

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = 'Đang tải dữ liệu...' }: LoadingStateProps) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 text-sm text-slate-600">
      <Spinner size="sm" />
      <span>{label}</span>
    </div>
  );
}
