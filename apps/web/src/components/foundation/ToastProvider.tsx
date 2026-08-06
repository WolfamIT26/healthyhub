import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type ToastTone = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  tone: ToastTone;
  message: string;
}

interface ToastContextValue {
  notify: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const value = useMemo<ToastContextValue>(
    () => ({
      notify(message, tone = 'info') {
        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        setMessages((current) => [...current, { id, message, tone }]);
        window.setTimeout(() => {
          setMessages((current) => current.filter((item) => item.id !== id));
        }, 3500);
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[min(360px,calc(100vw-32px))] flex-col gap-2">
        {messages.map((item) => (
          <div
            key={item.id}
            className={getToastClassName(item.tone)}
            role="status"
            aria-live="polite"
          >
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast phải được dùng bên trong ToastProvider.');
  }
  return context;
}

function getToastClassName(tone: ToastTone): string {
  const base = 'rounded-md px-4 py-3 text-sm font-medium shadow-soft';
  if (tone === 'success') return `${base} bg-leaf-600 text-white`;
  if (tone === 'error') return `${base} bg-red-600 text-white`;
  return `${base} bg-slate-950 text-white`;
}
