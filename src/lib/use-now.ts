import { useSyncExternalStore } from "react";

let now = 0;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  timer ??= setInterval(() => {
    now = Date.now();
    listeners.forEach((l) => l());
  }, 30_000);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

/** Trenutno vreme (ms) koje se osvežava svakih 30 s. Na serveru je 0. */
export function useNow() {
  return useSyncExternalStore(
    subscribe,
    () => (now ||= Date.now()),
    () => 0,
  );
}
