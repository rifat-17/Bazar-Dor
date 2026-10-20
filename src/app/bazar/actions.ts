"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getBazar, mergeItems, saveBazar } from "@/lib/bazar-server";
import { sanitizeItems } from "@/lib/bazar";
import type { BazarItem } from "@/lib/utils";

async function currentUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? null;
}

/** সাইন-ইন করা ইউজারের সেভ করা তালিকা আনো। */
export async function fetchBazar(): Promise<BazarItem[]> {
  const userId = await currentUserId();
  if (!userId) return [];
  return getBazar(userId);
}

/** লোকাল তালিকা সার্ভারের সাথে মিলিয়ে সেভ করো। */
export async function syncBazar(items: BazarItem[]): Promise<BazarItem[]> {
  const userId = await currentUserId();
  if (!userId) return sanitizeItems(items);

  const merged = mergeItems(sanitizeItems(items), await getBazar(userId));
  return saveBazar(userId, merged);
}

/** সরাসরি তালিকা সেভ করো (সাইন-ইন করা থাকলে)। */
export async function persistBazar(items: BazarItem[]): Promise<boolean> {
  const userId = await currentUserId();
  if (!userId) return false;

  await saveBazar(userId, items);
  return true;
}
