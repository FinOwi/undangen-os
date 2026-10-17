import { readFile } from "fs/promises";
import path from "path";

// Port 1:1 dari renderOrder() di panel k3lola (terverifikasi byte-identik dgn build-order.py).
// Tema tetap: 21 tema statis existing, tanpa rewrite React.

const ASSET_BASE = "https://simcha.my.id/assets/";

export interface OrderData {
  tema: string;
  c1: string; c1full: string; c2: string; c2full: string;
  p1?: string; p2?: string;
  venue?: string; venue_addr?: string; maps_q?: string;
  iso: string; label: string; short: string; cover: string; date_rsvp?: string;
  gift1_bank: string; gift1_num: string; gift1_an?: string;
  gift2_bank?: string; gift2_num?: string; gift2_an?: string;
  quote?: string; quote_src?: string;
}

interface ThemeDict { [k: string]: string }

let tplCache: string | null = null;
let themesCache: ThemeDict[] | null = null;

export async function loadEngine() {
  if (!tplCache) {
    tplCache = await readFile(path.join(process.cwd(), "engine", "template.html"), "utf-8");
  }
  if (!themesCache) {
    const raw = await readFile(path.join(process.cwd(), "engine", "themes.json"), "utf-8");
    themesCache = JSON.parse(raw);
  }
  return { tpl: tplCache, themes: themesCache };
}

function esc(s: string): string {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

export function renderInvitation(
  tpl: string,
  tema: ThemeDict,
  slug: string,
  order: OrderData,
  urls: string[]
): { html: string; leftover: string[] } {
  const d: ThemeDict = { ...tema };
  const { c1, c2, c1full, c2full } = order;
  Object.assign(d, {
    SLUG: slug,
    C1: c1, C1FULL: c1full, C1_INITIAL: (c1[0] || "").toUpperCase(),
    C2: c2, C2FULL: c2full, C2_INITIAL: (c2[0] || "").toUpperCase(),
    P1: order.p1 || "", P2: order.p2 || "",
    VENUE: order.venue || "", VENUE_ADDR: order.venue_addr || "", MAPS_Q: order.maps_q || "",
    DATETIME_ISO: order.iso, DATE_LABEL: order.label, DATE_SHORT: order.short,
    DATE_RSVP: order.date_rsvp || "", DATE_COVER: order.cover,
    GIFT1_BANK: order.gift1_bank, GIFT1_NUM: order.gift1_num,
    GIFT1_RAW: order.gift1_num.replace(/\D/g, ""),
    GIFT1_AN: order.gift1_an || "a.n. " + c1full,
    COVER_IMG: urls[0] || tema.COVER_IMG || "",
  });
  if (order.gift2_bank) {
    Object.assign(d, {
      GIFT2_BANK: order.gift2_bank, GIFT2_NUM: order.gift2_num || "",
      GIFT2_RAW: (order.gift2_num || "").replace(/\D/g, ""),
      GIFT2_AN: order.gift2_an || "a.n. " + c2full,
    });
  }
  if (order.quote) { d.QUOTE = order.quote; d.QUOTE_SRC = order.quote_src || ""; }
  d.GALLERY_ITEMS = urls.map((u, i) => {
    const alt = i === 0 ? `${c1} dan ${c2}` : "Momen bahagia";
    return `<a href="${u}"><img src="${u}" alt="${esc(alt)}" loading="lazy"></a>`;
  }).join("\n      ");
  if (!("ROOM_HTML" in d)) d.ROOM_HTML = "";
  if (!("COVER_VIDEO" in d)) d.COVER_VIDEO = '<div class="bg"></div>';

  let html = tpl;
  if (!order.gift2_bank) {
    html = html.replace(
      /\s*<div class="gift rv">\s*<div class="bank">@GIFT2_BANK@<\/div>[\s\S]*?<\/button>\s*<\/div>/,
      ""
    );
  }
  for (const k of Object.keys(d)) {
    html = html.split("@" + k + "@").join(d[k] ?? "");
  }
  // Aset tema (../../assets/...) → absolut ke simcha.my.id (tetap di GitHub Pages yg cepat)
  html = html.split("../../assets/").join(ASSET_BASE);

  const leftover = html.match(/@[A-Z0-9_]+@/g);
  return { html, leftover: leftover ? [...new Set(leftover)] : [] };
}

export function getTheme(themes: ThemeDict[], slug: string): ThemeDict | undefined {
  return themes.find((t) => (t as { slug?: string }).slug === slug);
}
