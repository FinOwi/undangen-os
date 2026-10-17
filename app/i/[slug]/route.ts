import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { loadEngine, renderInvitation, getTheme, type OrderData } from "@/lib/render";
import { createPublicClient } from "@/lib/supabase-public";
import { guestCookieName } from "@/lib/guest-links";
import { linkNotFoundPage, deviceMismatchPage } from "@/lib/private-pages";

const HTML = { "Content-Type": "text/html; charset=utf-8" };

// GET /i/[slug] — render halaman undangan dinamis dari database.
// 21 tema existing dipakai apa adanya (tanpa rewrite React).
// Mode private (content.private === true): wajib ?t=TOKEN valid + device binding.
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
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

  const c = (data.content ?? {}) as Record<string, any>;
  let guestName: string | null = null;
  let deviceCookie: { name: string; value: string } | null = null;

  // ---------- gerbang private ----------
  if (c.private === true) {
    const token = req.nextUrl.searchParams.get("t") ?? "";
    const { data: v, error: vErr } = await supabase.rpc("validate_guest_token", {
      p_slug: slug,
      p_token: token,
    });
    if (vErr) {
      console.error(`[undangen-os] validate_guest_token gagal utk slug=${slug}:`, vErr.message);
      return new NextResponse("Fitur undangan private belum aktif. Hubungi admin.", { status: 503 });
    }
    const row = Array.isArray(v) ? v[0] : v;
    if (!row?.ok) {
      return new NextResponse(linkNotFoundPage(), { status: 404, headers: HTML });
    }

    const cookieName = guestCookieName(slug);
    let deviceHash = req.cookies.get(cookieName)?.value ?? "";
    if (!deviceHash) {
      deviceHash = randomBytes(16).toString("hex");
      deviceCookie = { name: cookieName, value: deviceHash };
    }
    const { data: touch, error: tErr } = await supabase.rpc("touch_guest_link", {
      p_link_id: row.link_id,
      p_device_hash: deviceHash,
    });
    if (tErr) {
      console.error(`[undangen-os] touch_guest_link gagal utk slug=${slug}:`, tErr.message);
      return new NextResponse("Fitur undangan private belum aktif. Hubungi admin.", { status: 503 });
    }
    if (touch === "device_mismatch") {
      return new NextResponse(deviceMismatchPage(row.guest_name ?? ""), { status: 403, headers: HTML });
    }
    guestName = (row.guest_name as string) || null;
  }

  const { tpl, themes } = await loadEngine();
  const tema = getTheme(themes ?? [], data.theme);
  if (!tema) {
    return new NextResponse("Tema tidak ditemukan.", { status: 404 });
  }

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
    photo_cover: c.photo_cover, photo_groom: c.photo_groom, photo_bride: c.photo_bride,
    story_photos: c.story_photos, video_url: c.video_url,
  };
  const urls: string[] = Array.isArray((data.content as { gallery?: unknown })?.gallery)
    ? ((data.content as { gallery: string[] }).gallery ?? [])
    : [];

  const { html, leftover } = renderInvitation(tpl ?? "", tema, slug, order, urls);
  if (leftover.length) console.warn(`[undangen-os] placeholder gantung utk slug=${slug}:`, leftover.join(","));

  // Nama tamu private: ganti pembaca ?to= di template dgn nama tervalidasi.
  let out = html;
  if (guestName) {
    out = out.replace(
      "new URLSearchParams(location.search).get('to')",
      JSON.stringify(guestName),
    );
  }

  const res = new NextResponse(out, { headers: HTML });
  if (deviceCookie) {
    res.cookies.set(deviceCookie.name, deviceCookie.value, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return res;
}
