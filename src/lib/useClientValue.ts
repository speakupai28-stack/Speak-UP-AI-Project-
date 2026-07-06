"use client";

import { useEffect, useState } from "react";

/**
 * Reads a client-only value (localStorage-backed progress/profile data)
 * without causing an SSR hydration mismatch. Renders `fallback` on the
 * server and on the client's first paint (matching the server output),
 * then swaps to the real value in an effect once mounted.
 */
export function useClientValue<T>(getValue: () => T, fallback: T): T {
  const [value, setValue] = useState<T>(fallback);

  // Must run post-mount: the value legitimately differs from the SSR
  // fallback, so a lazy useState initializer would desync server/client
  // output. Runs once on mount only (empty deps is intentional).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(getValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
}
