interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = 'Đang tải dữ liệu...' }: LoadingStateProps) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 text-sm text-slate-600">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-leaf-600 border-t-transparent" />
      <span>{label}</span>
    </div>
  );
}
