interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-start gap-2 rounded-md border border-slate-200 bg-white p-6 shadow-soft">
      <p className="text-base font-semibold text-slate-950">{title}</p>
      <p className="text-sm leading-6 text-slate-600">{description}</p>
    </section>
  );
}
