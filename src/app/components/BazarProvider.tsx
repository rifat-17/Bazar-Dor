"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import { useSession } from "@/lib/auth-client";
import {
  getServerSnapshot,
  getSnapshot,
  setBasket,
  subscribe,
  subscribeNoop,
} from "@/lib/bazar-store";
import type { BazarItem } from "@/lib/utils";
import { persistBazar, syncBazar } from "@/app/bazar/actions";

interface BazarContextValue {
  items: BazarItem[];
  hydrated: boolean;
  count: number;
  qtyOf: (slug: string) => number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const BazarContext = createContext<BazarContextValue | null>(null);

export function BazarProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // SSR/হাইড্রেশনের পর true — এর আগে খালি তালিকা দেখানো নিরাপদ।
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );

  const { data: session } = useSession();
  const sessionActive = Boolean(session?.user);

  const syncedRef = useRef(false);
  const persistReadyRef = useRef(false);

  // সাইন-ইন হলে সার্ভারের সাথে একবার মিলিয়ে নাও
  useEffect(() => {
    if (!hydrated || !sessionActive || syncedRef.current) return;
    syncedRef.current = true;

    let cancelled = false;
    syncBazar(getSnapshot())
      .then((merged) => {
        if (!cancelled) setBasket(merged);
      })
      .catch(() => {
        // নেটওয়ার্ক সমস্যা হলে লোকাল তালিকা অক্ষত থাকে
      });

    return () => {
      cancelled = true;
    };
  }, [hydrated, sessionActive]);

  // পরিবর্তন হলে (লগইন থাকলে) সার্ভারে সেভ করো
  useEffect(() => {
    if (!hydrated || !sessionActive) return;

    if (!persistReadyRef.current) {
      persistReadyRef.current = true;
      return;
    }

    void persistBazar(items);
  }, [items, hydrated, sessionActive]);

  const qtyOf = useCallback(
    (slug: string) => items.find((item) => item.slug === slug)?.qty ?? 0,
    [items]
  );

  const add = useCallback(
    (slug: string, qty = 1) => {
      const current = getSnapshot();
      const exists = current.some((item) => item.slug === slug);
      const next = exists
        ? current.map((item) =>
            item.slug === slug ? { ...item, qty: item.qty + qty } : item
          )
        : [...current, { slug, qty }];
      setBasket(next);
    },
    []
  );

  const setQty = useCallback((slug: string, qty: number) => {
    setBasket(
      getSnapshot().map((item) =>
        item.slug === slug ? { ...item, qty } : item
      )
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setBasket(getSnapshot().filter((item) => item.slug !== slug));
  }, []);

  const clear = useCallback(() => setBasket([]), []);

  const value = useMemo<BazarContextValue>(
    () => ({
      items,
      hydrated,
      count: items.length,
      qtyOf,
      add,
      setQty,
      remove,
      clear,
    }),
    [items, hydrated, qtyOf, add, setQty, remove, clear]
  );

  return <BazarContext.Provider value={value}>{children}</BazarContext.Provider>;
}

export function useBazar(): BazarContextValue {
  const ctx = useContext(BazarContext);
  if (!ctx) {
    throw new Error("useBazar must be used inside <BazarProvider>");
  }
  return ctx;
}
