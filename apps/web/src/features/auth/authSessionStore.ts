import type { CurrentSessionResult } from '@healthyhub/shared-types';

export interface AuthSnapshot {
  accessToken: string | null;
  current: CurrentSessionResult | null;
}

type Listener = (snapshot: AuthSnapshot) => void;

let snapshot: AuthSnapshot = { accessToken: null, current: null };
const listeners = new Set<Listener>();

export const authSessionStore = {
  getSnapshot: () => snapshot,
  setAccessToken(accessToken: string | null) {
    snapshot = { ...snapshot, accessToken };
    notify();
  },
  setCurrent(current: CurrentSessionResult | null) {
    snapshot = { ...snapshot, current };
    notify();
  },
  clear() {
    snapshot = { accessToken: null, current: null };
    notify();
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

function notify(): void {
  listeners.forEach((listener) => listener(snapshot));
}
