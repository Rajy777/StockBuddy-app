import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatYYYYMMDD(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDateRange(daysBack: number): { from: string; to: string } {
  const safeDaysBack = Number.isFinite(daysBack) ? Math.max(0, Math.floor(daysBack)) : 0;
  const toDate = new Date();
  const fromDate = new Date(toDate);
  fromDate.setUTCDate(fromDate.getUTCDate() - safeDaysBack);

  return {
    from: formatYYYYMMDD(fromDate),
    to: formatYYYYMMDD(toDate),
  };
}

export function validateArticle(article: unknown): article is RawNewsArticle {
  if (!article || typeof article !== "object") return false;
  const a = article as Partial<RawNewsArticle>;

  return (
    typeof a.id === "number" &&
    typeof a.url === "string" &&
    a.url.length > 0 &&
    typeof a.headline === "string" &&
    a.headline.length > 0 &&
    typeof a.datetime === "number" &&
    a.datetime > 0
  );
}

export function formatArticle(
  article: RawNewsArticle,
  isCompanyNews: boolean,
  symbol?: string,
  index?: number
): MarketNewsArticle {
  const fallbackId = Number(Date.now()) + (typeof index === "number" ? index : 0);
  const id = typeof article.id === "number" ? article.id : fallbackId;

  return {
    id,
    headline: article.headline ?? "",
    summary: article.summary ?? "",
    source: article.source ?? "",
    url: article.url ?? "",
    datetime: article.datetime ?? 0,
    category: article.category ?? (isCompanyNews ? "company" : "general"),
    related: article.related ?? symbol ?? "",
    image: article.image,
  };
}


export function getFormattedTodayDate(locale: string = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "2-digit",
    timeZone: "UTC",
  }).format(new Date());
}

export function formatTradingViewSymbol(symbol: string): string {
  const s = (symbol || "").trim().toUpperCase();
  if (s.endsWith(".TO")) return `TSX:${s.replace(".TO", "")}`;
  if (s.endsWith(".V")) return `TSXV:${s.replace(".V", "")}`;
  if (s.endsWith(".L")) return `LSE:${s.replace(".L", "")}`;
  if (s.endsWith(".NS")) return `NSE:${s.replace(".NS", "")}`;
  if (s.endsWith(".BO")) return `BSE:${s.replace(".BO", "")}`;
  return s;
}
