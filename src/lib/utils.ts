// ইংরেজি সংখ্যাকে বাংলা সংখ্যায় রূপান্তর করার ফাংশন
export function toBengaliNumber(num: number | string): string {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/[0-9]/g, (d) => bengaliDigits[parseInt(d)]);
}

// বাংলা সংখ্যাকে ইংরেজি সংখ্যায় রূপান্তর (sorting এর জন্য)
export function toEnglishNumber(str: string): number {
  const englishDigits: Record<string, string> = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  };
  const converted = str.replace(/[০-৯]/g, (d) => englishDigits[d] || d);
  return parseFloat(converted);
}

// দাম ফরম্যাট: কমা দিয়ে (যেমন ১,৮৫০)

export function formatPrice(price: number | string | null | undefined): string {
  const numericPrice = Number(price);

  if (price === null || price === undefined || price === "" || !Number.isFinite(numericPrice)) {
    return "০";
  }

  const formatted = numericPrice.toLocaleString("en-IN");

  return toBengaliNumber(formatted);
}


// ইউনিট বাংলায়
export function getUnitBn(unit: string): string {
  const unitMap: Record<string, string> = {
    kg: "প্রতি কেজি",
    litre: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    piece: "প্রতি পিস",
  };
  return unitMap[unit] || unit;
}

// আজকের তারিখ বাংলায়

export function getBanglaDate(): string {
  const now = new Date();

  return now.toLocaleDateString("bn-BD", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}


// Product type definition
export interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets: {
    market: string;
    division: string;
    min: number;
    max: number;
  }[];
}

export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}