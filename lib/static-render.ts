import { readFile } from "fs/promises";
import path from "path";
import { getStaticTemplate } from "./templates";

// Render tema statis (HTML mandiri di themes/<id>/) dengan data order dari panel.
// Pola injeksi: ganti blok `var CFG = {...};` / `var D={...};` dengan JSON dari content.

const cache: Record<string, string> = {};

async function loadTheme(id: string): Promise<string> {
  if (!cache[id]) {
    const tpl = getStaticTemplate(id);
    if (!tpl) throw new Error("template statis tidak dikenal: " + id);
    cache[id] = await readFile(path.join(process.cwd(), "themes", tpl.file), "utf-8");
  }
  return cache[id];
}

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function fmtID(dtLocal: string): { iso: string; dateLabel: string } {
  const dt = new Date(dtLocal);
  return {
    iso: dt.toISOString(),
    dateLabel: `${HARI[dt.getDay()]}, ${dt.getDate()} ${BULAN[dt.getMonth()]} ${dt.getFullYear()}`,
  };
}

function pad(arr: unknown, n: number): string[] {
  const a = Array.isArray(arr) ? (arr as string[]) : [];
  while (a.length < n) a.push("");
  return a.slice(0, n);
}

export async function renderStaticTheme(
  templateId: string,
  c: Record<string, any>
): Promise<string> {
  const html0 = await loadTheme(templateId);
  let html = html0;

  if (templateId === "rpg-cinta") {
    const f = c.dt ? fmtID(c.dt) : { iso: c.iso ?? "", dateLabel: c.dateLabel ?? "" };
    const rek: { bank: string; no: string; nama: string }[] = [];
    if (c.gift1_bank || c.gift1_num)
      rek.push({ bank: c.gift1_bank ?? "", no: c.gift1_num ?? "", nama: c.gift1_an || `a.n. ${c.c1full ?? ""}` });
    if (c.gift2_bank || c.gift2_num)
      rek.push({ bank: c.gift2_bank ?? "", no: c.gift2_num ?? "", nama: c.gift2_an || `a.n. ${c.c2full ?? ""}` });
    const cfg = {
      PRIA: c.c1 ?? "",
      WANITA: c.c2 ?? "",
      ORTU_P: c.p1 ?? "",
      ORTU_W: c.p2 ?? "",
      TGL_ISO: f.iso,
      TGL_TAMPIL: f.dateLabel,
      AKAD_WAKTU: c.akad_waktu ?? "",
      AKAD_TEMPAT: c.akad_tempat ?? "",
      AKAD_MAPS: c.akad_maps ?? "",
      RESEPSI_WAKTU: c.resepsi_waktu ?? "",
      RESEPSI_TEMPAT: c.resepsi_tempat ?? "",
      RESEPSI_MAPS: c.resepsi_maps ?? "",
      WA: c.wa ?? "",
      REK: rek,
      ALAMAT: c.alamat ?? "",
      MUSIK: c.music_url ?? "",
      FOTO: {
        pria: c.photo_pria ?? "",
        wanita: c.photo_wanita ?? "",
        galeri: pad(c.galeri, 6),
      },
    };
    const next = html.replace(/var CFG = \{[\s\S]*?\n\};/, "var CFG = " + JSON.stringify(cfg) + ";");
    if (next === html) throw new Error("blok CFG tidak ditemukan di tema rpg-cinta");
    html = next;
  } else if (templateId === "peta-perjalanan") {
    const f = c.dt ? fmtID(c.dt) : { iso: c.iso ?? "", dateLabel: c.dateLabel ?? "" };
    const stops = Array.from({ length: 10 }, (_, i) => {
      const n = i + 1;
      return {
        t: c[`stop${n}_t`] ?? "",
        y: c[`stop${n}_y`] ?? "",
        x: c[`stop${n}_x`] ?? "",
        img: c[`stop${n}_img`] ?? "",
      };
    });
    const D = {
      names: [c.c1 ?? "", c.c2 ?? ""],
      date: f.iso,
      dateLabel: f.dateLabel,
      wa: c.wa ?? "",
      music: c.music_url || "/tema/peta-perjalanan/assets/bgm.m4a",
      events: [
        { t: c.ev1_t ?? "Akad Nikah", d: c.ev1_d ?? "", p: c.ev1_p ?? "", m: c.ev1_m ?? "https://maps.google.com" },
        { t: c.ev2_t ?? "Resepsi", d: c.ev2_d ?? "", p: c.ev2_p ?? "", m: c.ev2_m ?? "https://maps.google.com" },
      ],
      gifts: [
        { b: c.gift1_bank ?? "", n: c.gift1_num ?? "", a: c.gift1_an ?? "" },
        { b: c.gift2_bank ?? "", n: c.gift2_num ?? "", a: c.gift2_an ?? "" },
      ],
      stops,
    };
    const next = html.replace(/var D=\{[\s\S]*?\]\};/, "var D=" + JSON.stringify(D) + ";");
    if (next === html) throw new Error("blok D tidak ditemukan di tema peta-perjalanan");
    html = next;
  } else if (templateId === "wisuda-quest") {
    const f = c.dt ? fmtID(c.dt) : { iso: "", dateLabel: "" };
    const rek: { bank: string; no: string; nama: string }[] = [];
    if (c.gift1_bank || c.gift1_num)
      rek.push({ bank: c.gift1_bank ?? "", no: c.gift1_num ?? "", nama: c.gift1_an || `a.n. ${c.nama ?? ""}` });
    if (c.gift2_bank || c.gift2_num)
      rek.push({ bank: c.gift2_bank ?? "", no: c.gift2_num ?? "", nama: c.gift2_an || `a.n. ${c.nama ?? ""}` });
    const semFoto = Array.from({ length: 8 }, (_, i) => {
      const v = c[`semester_${i + 1}`];
      return Array.isArray(v) ? v.filter(Boolean) : (v ?? "");
    });
    const semesters = Array.from({ length: 8 }, (_, i) => ({
      t: c[`sem${i + 1}_t`] ?? "",
      y: c[`sem${i + 1}_y`] ?? "",
      x: c[`sem${i + 1}_x`] ?? "",
    }));
    const wisuda = {
      NAMA: c.nama ?? "",
      PANGGILAN: c.panggilan ?? "",
      JURUSAN: c.jurusan ?? "",
      KAMPUS: c.kampus ?? "",
      NIM: c.nim ?? "",
      GELAR: c.gelar ?? "",
      TGL_ISO: f.iso,
      TGL_TAMPIL: f.dateLabel,
      SIDANG_WAKTU: c.sidang_waktu ?? "",
      SIDANG_TEMPAT: c.sidang_tempat ?? "",
      SIDANG_MAPS: c.sidang_maps ?? "https://maps.google.com",
      WA: c.wa ?? "",
      REK: rek,
      ALAMAT: c.alamat ?? "",
      MUSIK: c.music_url ?? "",
      KELAMIN: c.kelamin ?? "cowok",
      FOTO: { wisudawan: c.wisudawan ?? "", semester: semFoto },
      SEMESTER: semesters,
    };
    const next = html.replace(/var WISUDA = \{[\s\S]*?\n\};/, "var WISUDA = " + JSON.stringify(wisuda) + ";");
    if (next === html) throw new Error("blok WISUDA tidak ditemukan di tema wisuda-quest");
    html = next;
  } else if (templateId === "baroque-rose") {
    const f = c.dt ? fmtID(c.dt) : { iso: "", dateLabel: "" };
    const rek: { b: string; n: string; a: string }[] = [];
    if (c.gift1_bank || c.gift1_num)
      rek.push({ b: c.gift1_bank ?? "", n: c.gift1_num ?? "", a: c.gift1_an || `a.n. ${c.pria_full ?? ""}` });
    if (c.gift2_bank || c.gift2_num)
      rek.push({ b: c.gift2_bank ?? "", n: c.gift2_num ?? "", a: c.gift2_an || `a.n. ${c.wanita_full ?? ""}` });
    const rose = {
      PRIA: c.pria ?? "",
      WANITA: c.wanita ?? "",
      NAMA_PRIA: c.pria_full ?? "",
      NAMA_WANITA: c.wanita_full ?? "",
      ORTU_P: c.ortu_p ?? "",
      ORTU_W: c.ortu_w ?? "",
      TGL_ISO: f.iso,
      TGL_TAMPIL: f.dateLabel,
      AKAD_T: c.akad_t ?? "Akad Nikah",
      AKAD_JAM: c.akad_jam ?? "",
      AKAD_TEMPAT: c.akad_tempat ?? "",
      AKAD_MAPS: c.akad_maps ?? "https://maps.google.com",
      RESEPSI_T: c.resepsi_t ?? "Resepsi",
      RESEPSI_JAM: c.resepsi_jam ?? "",
      RESEPSI_TEMPAT: c.resepsi_tempat ?? "",
      RESEPSI_MAPS: c.resepsi_maps ?? "https://maps.google.com",
      WA: c.wa ?? "",
      REK: rek,
      ALAMAT: c.alamat ?? "",
      MUSIK: c.music_url ?? "",
      AYAT: c.ayat ?? "",
      AYAT_SRC: c.ayat_src ?? "",
      FOTO: {
        pria: c.foto_pria ?? "",
        wanita: c.foto_wanita ?? "",
        pasangan: c.foto_pasangan ?? "",
        galeri: pad(c.galeri, 6),
      },
    };
    const next = html.replace(/var ROSE = \{[\s\S]*?\n\};/, "var ROSE = " + JSON.stringify(rose) + ";");
    if (next === html) throw new Error("blok ROSE tidak ditemukan di tema baroque-rose");
    html = next;
  } else if (templateId === "lakon-cinta") {
    const f = c.dt ? fmtID(c.dt) : { iso: "", dateLabel: "" };
    const rek: { b: string; n: string; a: string }[] = [];
    if (c.gift1_bank || c.gift1_num)
      rek.push({ b: c.gift1_bank ?? "", n: c.gift1_num ?? "", a: c.gift1_an || `a.n. ${c.pria_full ?? ""}` });
    if (c.gift2_bank || c.gift2_num)
      rek.push({ b: c.gift2_bank ?? "", n: c.gift2_num ?? "", a: c.gift2_an || `a.n. ${c.wanita_full ?? ""}` });
    const story = [1, 2, 3].map((n) => ({
      t: c[`story${n}_t`] ?? "",
      x: c[`story${n}_x`] ?? "",
      img: c[`story${n}_img`] ?? "",
    }));
    const lakon = {
      PRIA: c.pria ?? "",
      WANITA: c.wanita ?? "",
      NAMA_PRIA: c.pria_full ?? "",
      NAMA_WANITA: c.wanita_full ?? "",
      ORTU_P: c.ortu_p ?? "",
      ORTU_W: c.ortu_w ?? "",
      TGL_ISO: f.iso,
      TGL_TAMPIL: f.dateLabel,
      AKAD_T: c.akad_t ?? "Akad Nikah",
      AKAD_JAM: c.akad_jam ?? "",
      AKAD_TEMPAT: c.akad_tempat ?? "",
      AKAD_MAPS: c.akad_maps ?? "https://maps.google.com",
      RESEPSI_T: c.resepsi_t ?? "Resepsi",
      RESEPSI_JAM: c.resepsi_jam ?? "",
      RESEPSI_TEMPAT: c.resepsi_tempat ?? "",
      RESEPSI_MAPS: c.resepsi_maps ?? "https://maps.google.com",
      WA: c.wa ?? "",
      REK: rek,
      ALAMAT: c.alamat ?? "",
      MUSIK: c.music_url ?? "",
      AYAT: c.ayat ?? "",
      AYAT_SRC: c.ayat_src ?? "",
      STORY: story,
      FOTO: {
        pria: c.foto_pria ?? "",
        wanita: c.foto_wanita ?? "",
        pasangan: c.foto_pasangan ?? "",
        galeri: pad(c.galeri, 6),
      },
    };
    const next = html.replace(/var LAKON = \{[\s\S]*?\n\};/, "var LAKON = " + JSON.stringify(lakon) + ";");
    if (next === html) throw new Error("blok LAKON tidak ditemukan di tema lakon-cinta");
    html = next;
  } else {
    throw new Error("template statis tidak dikenal: " + templateId);
  }

  return html;
}
