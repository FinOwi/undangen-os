import { NextRequest, NextResponse } from "next/server";
import { loadEngine, renderInvitation, getTheme, type OrderData } from "@/lib/render";
import { createPublicClient } from "@/lib/supabase-public";

// GET /i/[slug] — render halaman undangan dinamis dari database.
// 21 tema existing dipakai apa adanya (tanpa rewrite React).
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const supabase = createPublicClient();
  const { data } = await supabase
    .from("invitations")
    .select("theme, content")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) {
    return new NextResponse("Undangan tidak ditemukan.", { status: 404 });
  }

  const { tpl, themes } = await loadEngine();
  const tema = getTheme(themes ?? [], data.theme);
  if (!tema) {
    return new NextResponse("Tema tidak ditemukan.", { status: 404 });
  }

  const c = (data.content ?? {}) as Record<string, string>;
  const order: OrderData = {
    tema: data.theme,
    c1: c.c1 ?? "", c1full: c.c1full ?? "", c2: c.c2 ?? "", c2full: c.c2full ?? "",
    p1: c.p1, p2: c.p2,
    venue: c.venue, venue_addr: c.venue_addr, maps_q: c.maps_q,
    iso: c.iso ?? "", label: c.label ?? "", short: c.short ?? "",
    cover: c.cover ?? "", date_rsvp: c.date_rsvp,
    gift1_bank: c.gift1_bank ?? "", gift1_num: c.gift1_num ?? "", gift1_an: c.gift1_an,
    gift2_bank: c.gift2_bank, gift2_num: c.gift2_num, gift2_an: c.gift2_an,
    quote: c.quote, quote_src: c.quote_src,
  };
  const urls: string[] = Array.isArray((data.content as { gallery?: unknown })?.gallery)
    ? ((data.content as { gallery: string[] }).gallery ?? [])
    : [];

  const { html, leftover } = renderInvitation(tpl ?? "", tema, slug, order, urls);
  if (leftover.length) console.warn(`[simcha-os] placeholder gantung utk slug=${slug}:`, leftover.join(","));

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
