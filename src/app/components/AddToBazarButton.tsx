"use client";

import toast from "react-hot-toast";
import { useBazar } from "./BazarProvider";
import { formatQty, getUnitMeta, getUnitShort } from "@/lib/utils";

interface AddToBazarButtonProps {
  slug: string;
  unit: string;
  nameBn?: string;
  compact?: boolean;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export default function AddToBazarButton({
  slug,
  unit,
  nameBn,
  compact = false,
}: AddToBazarButtonProps) {
  const { qtyOf, add, setQty, remove } = useBazar();

  const qty = qtyOf(slug);
  const meta = getUnitMeta(unit);
  const inBasket = qty > 0;

  const handleAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    add(slug, meta.min);
    toast.success(
      nameBn ? `${nameBn} তালিকায় যোগ হয়েছে` : "তালিকায় যোগ হয়েছে"
    );
  };

  const step = (delta: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const next = round(qty + delta);
    if (next < meta.min) {
      remove(slug);
      return;
    }
    setQty(slug, next);
  };

  const handleRemove = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    remove(slug);
  };

  const size = compact ? "btn-xs" : "btn-sm";

  if (!inBasket) {
    return (
      <button
        type="button"
        onClick={handleAdd}
        className={`btn ${size} w-full gap-1 border-green-200 bg-green-50 font-semibold text-green-800 hover:border-green-300 hover:bg-green-100`}
        aria-label={nameBn ? `${nameBn} তালিকায় যোগ করুন` : "তালিকায় যোগ করুন"}
      >
        <span aria-hidden="true">＋</span>
        {compact ? "যোগ করুন" : "বাজারের তালিকায় যোগ করুন"}
      </button>
    );
  }

  return (
    <div className="flex w-full items-center gap-1.5">
      <button
        type="button"
        onClick={step(-meta.step)}
        className={`btn ${size} btn-square border-green-200 bg-white text-green-800 hover:bg-green-50`}
        aria-label="পরিমাণ কমান"
      >
        −
      </button>

      <span className="flex-1 text-center text-sm font-semibold text-gray-800">
        {formatQty(qty)} {getUnitShort(unit)}
      </span>

      <button
        type="button"
        onClick={step(meta.step)}
        className={`btn ${size} btn-square border-green-200 bg-white text-green-800 hover:bg-green-50`}
        aria-label="পরিমাণ বাড়ান"
      >
        +
      </button>

      <button
        type="button"
        onClick={handleRemove}
        className={`btn ${size} btn-square border-red-100 bg-white text-red-500 hover:bg-red-50`}
        aria-label="তালিকা থেকে সরান"
      >
        ✕
      </button>
    </div>
  );
}
