import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** `false` na serveru i tokom hidratacije, `true` posle. Napredak živi u localStorage-u, pa ga čitamo tek tada. */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
