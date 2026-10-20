import type { BazarItem, Product } from "./utils";

/** localStorage key for the anonymous (logged-out) basket. */
export const BAZAR_STORAGE_KEY = "bazar-dor:basket";

const MAX_ITEMS = 60;

/** A basket item joined with its live product data. */
export interface BasketEntry {
  item: BazarItem;
  product: Product;
  qty: number;
  lineToday: number;
  lineLastWeek: number;
  lineLastMonth: number;
  /** আজকের দাম গত সপ্তাহের তুলনায় কত টাকা বদলেছে (line-level)। */
  weekDelta: number;
}

export interface BazarTotals {
  itemCount: number;
  today: number;
  lastWeek: number;
  lastMonth: number;
  weekDelta: number;
  monthDelta: number;
  weekPct: number;
  monthPct: number;
}

export interface MarketPlan {
  market: string;
  division: string;
  total: number;
  /** যেসব পণ্য এই বাজারে পাওয়া যায়নি, তাদের `today` দাম ধরে হিসাব করা হয়েছে। */
  missing: string[];
}

export interface PerItemPick {
  slug: string;
  nameBn: string;
  market: string;
  division: string;
  unitPrice: number;
  qty: number;
  lineTotal: number;
}

export interface OptimizeResult {
  /** আজকের দামে পুরো বাজারের খরচ (তুলনার ভিত্তি)। */
  baseline: number;
  oneStop: MarketPlan | null;
  oneStopSavings: number;
  perItem: {
    picks: PerItemPick[];
    total: number;
    savings: number;
  } | null;
}

export function sanitizeItems(input: unknown): BazarItem[] {
  if (!Array.isArray(input)) return [];

  const seen = new Map<string, number>();

  for (const raw of input) {
    if (!raw || typeof raw !== "object") continue;

    const slug = String((raw as BazarItem).slug ?? "").trim();
    const qty = Number((raw as BazarItem).qty);

    if (!slug || !Number.isFinite(qty) || qty <= 0) continue;

    const clamped = Math.min(Math.max(qty, 0.5), 100);
    seen.set(slug, clamped);

    if (seen.size >= MAX_ITEMS) break;
  }

  return Array.from(seen, ([slug, qty]) => ({ slug, qty }));
}

export function buildBasket(
  items: BazarItem[],
  products: Product[]
): BasketEntry[] {
  const bySlug = new Map(products.map((product) => [product.slug, product]));

  return items.flatMap((item) => {
    const product = bySlug.get(item.slug);
    if (!product) return [];

    const qty = item.qty;
    const lineToday = product.today * qty;

    return [
      {
        item,
        product,
        qty,
        lineToday,
        lineLastWeek: product.lastWeek * qty,
        lineLastMonth: product.lastMonth * qty,
        weekDelta: lineToday - product.lastWeek * qty,
      },
    ];
  });
}

function pctChange(current: number, past: number): number {
  if (!past) return 0;
  return ((current - past) / past) * 100;
}

export function basketTotals(entries: BasketEntry[]): BazarTotals {
  const today = entries.reduce((sum, e) => sum + e.lineToday, 0);
  const lastWeek = entries.reduce((sum, e) => sum + e.lineLastWeek, 0);
  const lastMonth = entries.reduce((sum, e) => sum + e.lineLastMonth, 0);

  return {
    itemCount: entries.length,
    today,
    lastWeek,
    lastMonth,
    weekDelta: today - lastWeek,
    monthDelta: today - lastMonth,
    weekPct: pctChange(today, lastWeek),
    monthPct: pctChange(today, lastMonth),
  };
}

/** আপনার তালিকার সবচেয়ে বেশি দাম বাড়া/কমা পণ্যগুলো (টাকার হিসেবে)। */
export function topMovers(entries: BasketEntry[], limit = 3): BasketEntry[] {
  return [...entries]
    .sort((a, b) => Math.abs(b.weekDelta) - Math.abs(a.weekDelta))
    .slice(0, limit);
}

/**
 * এক-স্টপ: এমন একটি বাজার খোঁজে যেখানে গোটা তালিকা একসাথে কেনা সবচেয়ে সস্তা।
 * সব পণ্য ধরে রাখা বাজারকে প্রাধান্য দেওয়া হয় (কম missing আগে)।
 */
export function optimizeMarkets(entries: BasketEntry[]): OptimizeResult {
  const baseline = entries.reduce((sum, e) => sum + e.lineToday, 0);

  if (entries.length === 0) {
    return { baseline, oneStop: null, oneStopSavings: 0, perItem: null };
  }

  const candidates = new Map<string, string>(); // market -> division
  for (const entry of entries) {
    for (const market of entry.product.markets ?? []) {
      if (!candidates.has(market.market)) {
        candidates.set(market.market, market.division);
      }
    }
  }

  let oneStop: MarketPlan | null = null;

  for (const [market, division] of candidates) {
    let total = 0;
    const missing: string[] = [];

    for (const entry of entries) {
      const found = (entry.product.markets ?? []).find(
        (m) => m.market === market
      );

      if (found) {
        total += found.min * entry.qty;
      } else {
        total += entry.lineToday;
        missing.push(entry.product.nameBn);
      }
    }

    const better =
      !oneStop ||
      missing.length < oneStop.missing.length ||
      (missing.length === oneStop.missing.length && total < oneStop.total);

    if (better) {
      oneStop = { market, division, total, missing };
    }
  }

  const perItemPicks: PerItemPick[] = [];
  for (const entry of entries) {
    const markets = entry.product.markets ?? [];
    if (markets.length === 0) continue;

    const cheapest = markets.reduce((best, m) =>
      m.min < best.min ? m : best
    );

    perItemPicks.push({
      slug: entry.product.slug,
      nameBn: entry.product.nameBn,
      market: cheapest.market,
      division: cheapest.division,
      unitPrice: cheapest.min,
      qty: entry.qty,
      lineTotal: cheapest.min * entry.qty,
    });
  }

  const perItemTotal = perItemPicks.reduce((sum, p) => sum + p.lineTotal, 0);

  return {
    baseline,
    oneStop,
    oneStopSavings: oneStop ? Math.max(baseline - oneStop.total, 0) : 0,
    perItem:
      perItemPicks.length > 0
        ? {
            picks: perItemPicks,
            total: perItemTotal,
            savings: Math.max(baseline - perItemTotal, 0),
          }
        : null,
  };
}

export function encodeItems(items: BazarItem[]): string {
  return items.map((item) => `${item.slug}:${item.qty}`).join(",");
}

export function decodeItems(value: string | null | undefined): BazarItem[] {
  if (!value) return [];

  return sanitizeItems(
    value.split(",").map((pair) => {
      const [slug, qty] = pair.split(":");
      return { slug, qty };
    })
  );
}
