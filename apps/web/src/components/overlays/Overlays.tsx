import { useEffect, useId, useRef, type ReactNode } from 'react';

import { Button } from '../ui/Button';
import { IconButton } from '../ui/Button';
import { cn } from '../ui/cn';

interface OverlayProps { open: boolean; onClose(): void; title: string; children: ReactNode; footer?: ReactNode }

export function Modal({ open, onClose, title, children, footer }: OverlayProps) {
  const titleId = useId(); const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!open) return; const previous = document.activeElement as HTMLElement | null; dialogRef.current?.focus(); const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); }; document.addEventListener('keydown', onKeyDown); return () => { document.removeEventListener('keydown', onKeyDown); previous?.focus(); }; }, [onClose, open]);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral-950/50 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-modal bg-white p-5 shadow-overlay outline-none motion-safe:animate-overlay-in sm:p-6"><div className="flex items-start gap-4"><h2 id={titleId} className="min-w-0 flex-1 text-lg font-bold text-neutral-950">{title}</h2><IconButton label="Đóng hộp thoại" size="sm" onClick={onClose}>×</IconButton></div><div className="mt-4 text-sm leading-6 text-neutral-700">{children}</div>{footer ? <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div> : null}</div></div>;
}

export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = 'Xác nhận', pending = false, danger = false }: { open: boolean; onClose(): void; onConfirm(): void; title: string; description: ReactNode; confirmLabel?: string; pending?: boolean; danger?: boolean }) {
  return <Modal open={open} onClose={onClose} title={title} footer={<><Button variant="ghost" onClick={onClose}>Hủy</Button><Button variant={danger ? 'danger' : 'primary'} loading={pending} onClick={onConfirm}>{confirmLabel}</Button></>}>{description}</Modal>;
}

export function Drawer({ open, onClose, title, children, side = 'right' }: Omit<OverlayProps, 'footer'> & { side?: 'left' | 'right' }) {
  const titleId = useId();
  useEffect(() => { if (!open) return; const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); }; document.addEventListener('keydown', onKeyDown); return () => document.removeEventListener('keydown', onKeyDown); }, [onClose, open]);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 bg-neutral-950/50" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside role="dialog" aria-modal="true" aria-labelledby={titleId} className={cn('absolute inset-y-0 w-[min(400px,calc(100vw-2rem))] overflow-y-auto bg-white p-5 shadow-overlay motion-safe:animate-drawer-in', side === 'right' ? 'right-0' : 'left-0')}><div className="flex items-center gap-4"><h2 id={titleId} className="flex-1 text-lg font-bold">{title}</h2><IconButton label="Đóng ngăn kéo" onClick={onClose}>×</IconButton></div><div className="mt-5">{children}</div></aside></div>;
}
