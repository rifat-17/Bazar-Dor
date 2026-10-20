import { db } from "./db";
import { sanitizeItems } from "./bazar";
import type { BazarItem } from "./utils";

const COLLECTION = "bazars";

interface BazarDoc {
  userId: string;
  items: BazarItem[];
  updatedAt: Date;
}

function collection() {
  return db.collection<BazarDoc>(COLLECTION);
}

export async function getBazar(userId: string): Promise<BazarItem[]> {
  const doc = await collection().findOne(
    { userId },
    { projection: { items: 1 } }
  );

  return sanitizeItems(doc?.items);
}

export async function saveBazar(
  userId: string,
  items: BazarItem[]
): Promise<BazarItem[]> {
  const clean = sanitizeItems(items);

  await collection().updateOne(
    { userId },
    { $set: { userId, items: clean, updatedAt: new Date() } },
    { upsert: true }
  );

  return clean;
}

/** সাইন-ইনের সময় লোকাল ও সার্ভার তালিকা একত্র করে (বেশি পরিমাণ জেতে)। */
export function mergeItems(
  local: BazarItem[],
  server: BazarItem[]
): BazarItem[] {
  const merged = new Map<string, number>();

  for (const item of [...server, ...local]) {
    const current = merged.get(item.slug);
    merged.set(item.slug, current === undefined ? item.qty : Math.max(current, item.qty));
  }

  return sanitizeItems(
    Array.from(merged, ([slug, qty]) => ({ slug, qty }))
  );
}
