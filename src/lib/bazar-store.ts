import { sanitizeItems } from "./bazar";
import type { BazarItem } from "./utils";

const KEY = "bazar-dor:basket";

const EMPTY: BazarItem[] = [];

let cache: BazarItem[] | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

/**
 * localStorage-ভিত্তিক বাস্কেট স্টোর। `useSyncExternalStore` দিয়ে পড়া হয়,
 * তাই SSR-এ খালি আর ক্লায়েন্টে আসল তালিকা — কোনো hydration mismatch নেই।
 */
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) {
      cache = null;
      emit();
    }
  };

  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getSnapshot(): BazarItem[] {
  if (cache) return cache;

  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? sanitizeItems(JSON.parse(raw)) : EMPTY;
  } catch {
    cache = EMPTY;
  }

  return cache;
}

export function getServerSnapshot(): BazarItem[] {
  return EMPTY;
}

export function setBasket(items: BazarItem[]): void {
  const clean = sanitizeItems(items);
  cache = clean;

  try {
    window.localStorage.setItem(KEY, JSON.stringify(clean));
  } catch {
    // কুইকা-ব্লক হলে চুপচাপ এড়িয়ে যাও
  }

  emit();
}

export function subscribeNoop(): () => void {
  return () => {};
}
