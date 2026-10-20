import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  type Product,
  formatPrice,
  formatQty,
  getBanglaDate,
  getUnitShort,
  toBengaliNumber,
} from "@/lib/utils";
import {
  basketTotals,
  buildBasket,
  decodeItems,
  optimizeMarkets,
} from "@/lib/bazar";

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor/products";

const GREEN = "#16a34a";
const DARK = "#111827";
const GRAY = "#6b7280";

function taka(value: number): string {
  return `৳${formatPrice(Math.round(value))}`;
}

let fontPromise: Promise<Buffer> | null = null;

function loadFont(): Promise<Buffer> {
  fontPromise ??= readFile(
    join(process.cwd(), "assets/fonts/NotoSerifBengali-Bold.ttf")
  );
  return fontPromise;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const items = decodeItems(searchParams.get("items"));

  const font = await loadFont();

  const res = await fetch(API_URL, { next: { revalidate: 60 } });
  const products: Product[] = res.ok ? await res.json() : [];

  const allEntries = buildBasket(items, products);
  const entries = allEntries.slice(0, 8);
  const totals = basketTotals(allEntries);
  const optimize = optimizeMarkets(allEntries);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#ffffff",
          padding: 64,
          fontFamily: "Noto Serif Bengali",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 72,
                height: 72,
                borderRadius: 20,
                backgroundColor: "#f0fdf4",
                fontSize: 40,
              }}
            >
              🛒
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 40, fontWeight: 700, color: GREEN }}>
                বাজার দর
              </div>
              <div style={{ fontSize: 22, color: GRAY }}>
                {getBanglaDate()}
              </div>
            </div>
          </div>

          <div style={{ fontSize: 24, color: GRAY }}>
            আমার বাজারের রিপোর্ট
          </div>
        </div>

        <div
          style={{
            display: "flex",
            height: 2,
            backgroundColor: "#e5e7eb",
            marginTop: 28,
            marginBottom: 28,
          }}
        />

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {entries.length === 0 ? (
            <div style={{ fontSize: 30, color: GRAY }}>
              তালিকায় কোনো পণ্য নেই।
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.product.slug}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 12,
                  paddingBottom: 12,
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 32 }}>{entry.product.image}</div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      maxWidth: 560,
                    }}
                  >
                    <div style={{ fontSize: 30, color: DARK }}>
                      {entry.product.nameBn}
                    </div>
                    <div style={{ fontSize: 20, color: GRAY }}>
                      {`${formatQty(entry.qty)} ${getUnitShort(
                        entry.product.unit
                      )} × ${taka(entry.product.today)}`}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 30, fontWeight: 700, color: DARK }}>
                  {taka(entry.lineToday)}
                </div>
              </div>
            ))
          )}
        </div>

        {allEntries.length > entries.length && (
          <div style={{ display: "flex", fontSize: 22, color: GRAY, marginTop: 12 }}>
            {`আরও ${toBengaliNumber(allEntries.length - entries.length)} ধরনের পণ্য আছে`}
          </div>
        )}

        {/* Total */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 24,
          }}
        >
          <div style={{ fontSize: 32, color: GRAY }}>
            মোট (আজকের দামে)
          </div>
          <div style={{ fontSize: 52, fontWeight: 700, color: DARK }}>
            {taka(totals.today)}
          </div>
        </div>

        {/* Best market */}
        {optimize.oneStop && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 24,
              padding: 28,
              borderRadius: 24,
              backgroundColor: "#f0fdf4",
              border: "2px solid #bbf7d0",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 22, color: GRAY }}>
                সবচেয়ে সস্তা বাজার
              </div>
              <div style={{ fontSize: 34, fontWeight: 700, color: GREEN }}>
                {`${optimize.oneStop.market} (${optimize.oneStop.division})`}
              </div>
            </div>

            {optimize.oneStopSavings > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <div style={{ fontSize: 22, color: GRAY }}>সাশ্রয়</div>
                <div style={{ fontSize: 34, fontWeight: 700, color: GREEN }}>
                  {taka(optimize.oneStopSavings)}
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", fontSize: 20, color: GRAY, marginTop: 20 }}>
          বাজার দর — প্রতিদিনের নিত্যপ্রয়োজনীয় পণ্যের দাম এক নজরে
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1350,
      fonts: [
        {
          name: "Noto Serif Bengali",
          data: font,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
