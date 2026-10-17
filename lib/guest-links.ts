import { randomBytes } from "crypto";

// Token tamu: 16 char URL-safe dari 96 bit entropi (tak bisa ditebak).
export function newGuestToken(): string {
  return randomBytes(12)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
    .slice(0, 16);
}

// Nama cookie pengikat perangkat per undangan.
export function guestCookieName(slug: string): string {
  return `undg_${slug}`;
}

// Link undangan private untuk satu tamu.
export function guestLink(baseUrl: string, slug: string, token: string): string {
  return `${baseUrl.replace(/\/$/, "")}/i/${slug}?t=${token}`;
}

// Teks WA siap kirim per tamu.
export function guestWaText(
  guestName: string,
  couple: string,
  link: string,
): string {
  return (
    `Assalamu'alaikum ${guestName},\n\n` +
    `Dengan hormat, kami mengundang Bapak/Ibu/Saudara/i ke pernikahan kami:\n${couple}\n\n` +
    `Tautan undangan khusus (pribadi, mohon tidak diteruskan):\n${link}\n\n` +
    `Merupakan suatu kehormatan bagi kami atas kehadiran dan doa restunya.`
  );
}
