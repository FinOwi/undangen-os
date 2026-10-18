// Registry template statis Undangen: tema HTML mandiri di themes/<id>/index.html
// yang bisa diisi dari panel admin (foto sesuai urutan + data undangan).
// Engine klasik (template.html + themes.json) tetap seperti semula.

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "datetime" | "textarea";
  placeholder?: string;
  required?: boolean;
  section: string;
  def?: string;
}

export interface PhotoSlotDef {
  key: string;
  label: string;
  hint: string;
  max: number; // 1 = satu foto, >1 = array
}

export interface StaticTemplateDef {
  id: string;
  name: string;
  file: string; // relatif di dalam themes/
  fields: FieldDef[];
  photoSlots: PhotoSlotDef[];
}

const RPG_FIELDS: FieldDef[] = [
  { key: "c1", label: "Nama panggilan mempelai 1", type: "text", placeholder: "Bima", required: true, section: "Mempelai" },
  { key: "c1full", label: "Nama lengkap mempelai 1", type: "text", placeholder: "Bima Ginting", required: true, section: "Mempelai" },
  { key: "c2", label: "Nama panggilan mempelai 2", type: "text", placeholder: "Sari", required: true, section: "Mempelai" },
  { key: "c2full", label: "Nama lengkap mempelai 2", type: "text", placeholder: "Sari Br Tarigan", required: true, section: "Mempelai" },
  { key: "p1", label: "Orang tua mempelai 1", type: "text", placeholder: "Putra dari Bpk. … & Ibu …", section: "Mempelai" },
  { key: "p2", label: "Orang tua mempelai 2", type: "text", placeholder: "Putri dari Bpk. … & Ibu …", section: "Mempelai" },
  { key: "dt", label: "Tanggal & jam acara", type: "datetime", required: true, section: "Acara" },
  { key: "akad_waktu", label: "Jam akad", type: "text", placeholder: "08.00 – 10.00 WIB", section: "Acara" },
  { key: "akad_tempat", label: "Tempat akad", type: "text", placeholder: "Balai Adat Karo, Berastagi", section: "Acara" },
  { key: "akad_maps", label: "Link maps akad", type: "text", placeholder: "https://maps.google.com/?q=…", section: "Acara" },
  { key: "resepsi_waktu", label: "Jam resepsi", type: "text", placeholder: "11.00 – 14.00 WIB", section: "Acara" },
  { key: "resepsi_tempat", label: "Tempat resepsi", type: "text", placeholder: "Jambur Adat, Berastagi", section: "Acara" },
  { key: "resepsi_maps", label: "Link maps resepsi", type: "text", placeholder: "https://maps.google.com/?q=…", section: "Acara" },
  { key: "wa", label: "No. WhatsApp (format 628…)", type: "text", placeholder: "6281234567890", required: true, section: "Kontak & Gift" },
  { key: "gift1_bank", label: "Bank gift 1", type: "text", placeholder: "BCA", section: "Kontak & Gift" },
  { key: "gift1_num", label: "No. rekening gift 1", type: "text", placeholder: "8210888800", section: "Kontak & Gift" },
  { key: "gift1_an", label: "a.n. gift 1", type: "text", placeholder: "otomatis = nama lengkap", section: "Kontak & Gift" },
  { key: "gift2_bank", label: "Bank gift 2 (opsional)", type: "text", section: "Kontak & Gift" },
  { key: "gift2_num", label: "No. rekening gift 2", type: "text", section: "Kontak & Gift" },
  { key: "gift2_an", label: "a.n. gift 2", type: "text", section: "Kontak & Gift" },
  { key: "alamat", label: "Alamat kirim fisik", type: "text", placeholder: "Jl. …", section: "Kontak & Gift" },
];

const RPG_SLOTS: PhotoSlotDef[] = [
  { key: "photo_pria", label: "🤵 1. Foto Mempelai Pria", hint: "Rumah Mempelai · portrait", max: 1 },
  { key: "photo_wanita", label: "👰 2. Foto Mempelai Wanita", hint: "Rumah Mempelai · portrait", max: 1 },
  { key: "galeri", label: "🖼️ 3–8. Galeri Kenangan", hint: "6 foto, tampil di Galeri · landscape/portrait", max: 6 },
];

const PETA_STOPS: { t: string; y: string; x: string }[] = [
  { t: "Awal Berjumpa", y: "2019", x: "Perkenalan singkat di acara kampus, tanpa tahu itu awal segalanya." },
  { t: "Obrolan Pertama", y: "2019", x: "Dari pesan singkat menjadi obrolan yang tak pernah selesai." },
  { t: "Kencan Pertama", y: "2020", x: "Kopi sore dan cerita yang terasa terlalu cepat habis." },
  { t: "Jarak Memisahkan", y: "2021", x: "Berjauhan, tetapi kabar tak pernah putus." },
  { t: "Liburan Bersama", y: "2022", x: "Menyusuri kota baru dan menemukan sisi lain satu sama lain." },
  { t: "Bertemu Keluarga", y: "2022", x: "Restu pertama datang dari meja makan keluarga." },
  { t: "Melewati Badai", y: "2023", x: "Ujian yang justru menguatkan kami." },
  { t: "Lamaran", y: "2024", x: "Satu pertanyaan, satu jawaban: ya." },
  { t: "Menyusun Rencana", y: "2026", x: "Memilih tanggal, tempat, dan segala yang kami impikan." },
  { t: "Menuju Halal", y: "2027", x: "Perjalanan panjang ini berhenti di satu tujuan." },
];

const PETA_FIELDS: FieldDef[] = [
  { key: "c1", label: "Nama panggilan mempelai 1", type: "text", required: true, section: "Dasar" },
  { key: "c2", label: "Nama panggilan mempelai 2", type: "text", required: true, section: "Dasar" },
  { key: "dt", label: "Tanggal & jam acara", type: "datetime", required: true, section: "Dasar" },
  { key: "wa", label: "No. WhatsApp RSVP (628…)", type: "text", required: true, section: "Dasar" },
  { key: "ev1_t", label: "Acara 1 — judul", type: "text", def: "Akad Nikah", section: "Acara" },
  { key: "ev1_d", label: "Acara 1 — tanggal & jam", type: "text", def: "08.00 WIB", section: "Acara" },
  { key: "ev1_p", label: "Acara 1 — tempat", type: "text", section: "Acara" },
  { key: "ev1_m", label: "Acara 1 — link maps", type: "text", section: "Acara" },
  { key: "ev2_t", label: "Acara 2 — judul", type: "text", def: "Resepsi", section: "Acara" },
  { key: "ev2_d", label: "Acara 2 — tanggal & jam", type: "text", def: "11.00–14.00 WIB", section: "Acara" },
  { key: "ev2_p", label: "Acara 2 — tempat", type: "text", section: "Acara" },
  { key: "ev2_m", label: "Acara 2 — link maps", type: "text", section: "Acara" },
  { key: "gift1_bank", label: "Bank gift 1", type: "text", section: "Gift" },
  { key: "gift1_num", label: "No. rekening gift 1", type: "text", section: "Gift" },
  { key: "gift1_an", label: "a.n. gift 1", type: "text", section: "Gift" },
  { key: "gift2_bank", label: "Bank gift 2", type: "text", section: "Gift" },
  { key: "gift2_num", label: "No. rekening gift 2", type: "text", section: "Gift" },
  { key: "gift2_an", label: "a.n. gift 2", type: "text", section: "Gift" },
  ...PETA_STOPS.flatMap((s, i): FieldDef[] => [
    { key: `stop${i + 1}_t`, label: `Stop ${i + 1} — judul`, type: "text", def: s.t, section: `Stop ${i + 1}` },
    { key: `stop${i + 1}_y`, label: `Stop ${i + 1} — tahun`, type: "text", def: s.y, section: `Stop ${i + 1}` },
    { key: `stop${i + 1}_x`, label: `Stop ${i + 1} — cerita`, type: "textarea", def: s.x, section: `Stop ${i + 1}` },
  ]),
];

const PETA_SLOTS: PhotoSlotDef[] = PETA_STOPS.map((s, i) => ({
  key: `stop${i + 1}_img`,
  label: `📍 ${i + 1}. Foto ${s.t}`,
  hint: i === 3 || i === 6 ? "Opsional — kosong = kartu tanpa foto" : "Stop ke-" + (i + 1) + " di peta",
  max: 1,
}));

const WISUDA_FIELDS: FieldDef[] = [
  { key: "nama", label: "Nama wisudawan", type: "text", placeholder: "Raka Pratama", required: true, section: "Wisudawan" },
  { key: "panggilan", label: "Nama panggilan", type: "text", placeholder: "Raka", section: "Wisudawan" },
  { key: "jurusan", label: "Jurusan", type: "text", placeholder: "Teknik Informatika", section: "Wisudawan" },
  { key: "kampus", label: "Kampus", type: "text", placeholder: "Universitas Sumatera Utara", section: "Wisudawan" },
  { key: "nim", label: "NIM", type: "text", placeholder: "211401001", section: "Wisudawan" },
  { key: "gelar", label: "Gelar", type: "text", placeholder: "S.Kom", section: "Wisudawan" },
  { key: "dt", label: "Tanggal & jam sidang", type: "datetime", required: true, section: "Acara" },
  { key: "sidang_waktu", label: "Jam sidang", type: "text", placeholder: "09.00 \u2013 11.00 WIB", section: "Acara" },
  { key: "sidang_tempat", label: "Tempat sidang", type: "text", placeholder: "Aula FMIPA USU, Medan", section: "Acara" },
  { key: "sidang_maps", label: "Link maps sidang", type: "text", placeholder: "https://maps.google.com/?q=\u2026", section: "Acara" },
  { key: "wa", label: "No. WhatsApp (format 628\u2026)", type: "text", placeholder: "6281234567890", required: true, section: "Kontak & Gift" },
  { key: "gift1_bank", label: "Bank gift 1", type: "text", placeholder: "BCA", section: "Kontak & Gift" },
  { key: "gift1_num", label: "No. rekening gift 1", type: "text", section: "Kontak & Gift" },
  { key: "gift1_an", label: "a.n. gift 1", type: "text", placeholder: "otomatis = nama wisudawan", section: "Kontak & Gift" },
  { key: "gift2_bank", label: "Bank gift 2 (opsional)", type: "text", section: "Kontak & Gift" },
  { key: "gift2_num", label: "No. rekening gift 2", type: "text", section: "Kontak & Gift" },
  { key: "gift2_an", label: "a.n. gift 2", type: "text", section: "Kontak & Gift" },
  { key: "alamat", label: "Alamat kirim fisik", type: "text", placeholder: "Jl. \u2026", section: "Kontak & Gift" },
];
const WISUDA_SLOTS: PhotoSlotDef[] = [
  { key: "wisudawan", label: "\u2460 1. Foto Wisudawan", hint: "Aula Sidang \u00b7 portrait", max: 1 },
  { key: "semester_1", label: "\u2461 2. Foto Semester 1", hint: "Gerbang Kampus \u00b7 semester 1", max: 1 },
  { key: "semester_2", label: "\u2462 3. Foto Semester 2", hint: "Perpustakaan \u00b7 semester 2", max: 1 },
  { key: "semester_3", label: "\u2463 4. Foto Semester 3", hint: "Kantin \u00b7 semester 3", max: 1 },
  { key: "semester_4", label: "\u2464 5. Foto Semester 4", hint: "Lab Komputer \u00b7 semester 4", max: 1 },
  { key: "semester_5", label: "\u2465 6. Foto Semester 5", hint: "Gedung Kuliah \u00b7 semester 5", max: 1 },
  { key: "semester_6", label: "\u2466 7. Foto Semester 6", hint: "Posko KKN \u00b7 semester 6", max: 1 },
  { key: "semester_7", label: "\u2467 8. Foto Semester 7", hint: "Ruang Dosen \u00b7 semester 7", max: 1 },
  { key: "semester_8", label: "\u2468 9. Foto Semester 8", hint: "Aula Sidang \u00b7 semester 8", max: 1 },
];

export const STATIC_TEMPLATES: StaticTemplateDef[] = [
  {
    id: "rpg-cinta",
    name: "RPG Cinta — game top-down",
    file: "rpg-cinta/index.html",
    fields: RPG_FIELDS,
    photoSlots: RPG_SLOTS,
  },
  {
    id: "peta-perjalanan",
    name: "Peta Perjalanan — kota 3D",
    file: "peta-perjalanan/index.html",
    fields: PETA_FIELDS,
    photoSlots: PETA_SLOTS,
  },
  {
    id: "wisuda-quest",
    name: "Wisuda Quest — game 8 semester",
    file: "wisuda-quest/index.html",
    fields: WISUDA_FIELDS,
    photoSlots: WISUDA_SLOTS,
  },
];

export function getStaticTemplate(id: string | undefined | null): StaticTemplateDef | undefined {
  if (!id) return undefined;
  return STATIC_TEMPLATES.find((t) => t.id === id);
}

export function templateDisplayName(id: string): string {
  return getStaticTemplate(id)?.name ?? id;
}
