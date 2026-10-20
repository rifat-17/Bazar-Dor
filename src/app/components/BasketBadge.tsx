"use client";

import Link from "next/link";
import { useBazar } from "./BazarProvider";
import { toBengaliNumber } from "@/lib/utils";

export default function BasketBadge({ compact = false }: { compact?: boolean }) {
  const { count, hydrated } = useBazar();

  return (
    <Link
      href="/bazar"
      className={`btn btn-sm gap-2 rounded-lg border-green-200 bg-white text-green-800 hover:border-green-300 hover:bg-green-50 ${
        compact ? "btn-square" : ""
      }`}
      aria-label="আমার বাজারের তালিকা"
    >
      <span aria-hidden="true" className="text-base leading-none">
        🧺
      </span>

      {!compact && <span className="font-semibold">আমার বাজার</span>}

      {hydrated && count > 0 && (
        <span className="badge badge-success badge-sm text-white">
          {toBengaliNumber(count)}
        </span>
      )}
    </Link>
  );
}
