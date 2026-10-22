// Registry template statis Undangen: tema HTML mandiri di themes/<id>/index.html
// yang bisa diisi dari panel admin (foto sesuai urutan + data undangan).
// Engine klasik (template.html + themes.json) tetap seperti semula.

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "datetime" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  section: string;
  def?: string;
  options?: string[];
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

// Field musik custom — dipakai semua template statis (kosong = musik bawaan tema)
const MUSIK_FIELD: FieldDef = {
  key: "music_url",
  label: "🎵 Link musik latar (MP3 / YouTube)",
  type: "text",
  placeholder: "Link MP3 atau YouTube — kosongkan untuk musik bawaan",
  section: "Musik",
};

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
RPG_FIELDS.push(MUSIK_FIELD);

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
PETA_FIELDS.push(MUSIK_FIELD);

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
  { key: "kelamin", label: "Karakter default", type: "select", options: ["cowok", "cewek"], def: "cowok", section: "Wisudawan" },
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
WISUDA_FIELDS.push(MUSIK_FIELD);
const WISUDA_SLOTS: PhotoSlotDef[] = [
  { key: "wisudawan", label: "\u2460 1. Foto Wisudawan", hint: "Aula Sidang \u00b7 portrait", max: 1 },
  { key: "semester_1", label: "\u2461 2. Galeri Semester 1", hint: "Gerbang Kampus \u00b7 semester 1 \u00b7 maks 6", max: 6 },
  { key: "semester_2", label: "\u2462 3. Galeri Semester 2", hint: "Ruang Kuliah \u00b7 semester 2 \u00b7 maks 6", max: 6 },
  { key: "semester_3", label: "\u2463 4. Galeri Semester 3", hint: "Perpustakaan \u00b7 semester 3 \u00b7 maks 6", max: 6 },
  { key: "semester_4", label: "\u2464 5. Galeri Semester 4", hint: "Organisasi \u00b7 semester 4 \u00b7 maks 6", max: 6 },
  { key: "semester_5", label: "\u2465 6. Galeri Semester 5", hint: "Laboratorium \u00b7 semester 5 \u00b7 maks 6", max: 6 },
  { key: "semester_6", label: "\u2466 7. Galeri Semester 6", hint: "Penelitian \u00b7 semester 6 \u00b7 maks 6", max: 6 },
  { key: "semester_7", label: "\u2467 8. Galeri Semester 7", hint: "Ruang Sidang \u00b7 semester 7 \u00b7 maks 6", max: 6 },
  { key: "semester_8", label: "\u2468 9. Galeri Semester 8", hint: "Gedung Wisuda \u00b7 semester 8 \u00b7 maks 6", max: 6 },
];

const ROSE_FIELDS: FieldDef[] = [
  { key: "pria", label: "Nama panggilan mempelai pria", type: "text", placeholder: "Bagas", required: true, section: "Mempelai" },
  { key: "pria_full", label: "Nama lengkap mempelai pria", type: "text", placeholder: "Bagas Pratama", required: true, section: "Mempelai" },
  { key: "wanita", label: "Nama panggilan mempelai wanita", type: "text", placeholder: "Kirana", required: true, section: "Mempelai" },
  { key: "wanita_full", label: "Nama lengkap mempelai wanita", type: "text", placeholder: "Kirana Ayu", required: true, section: "Mempelai" },
  { key: "ortu_p", label: "Orang tua mempelai pria", type: "text", placeholder: "Putra Bapak … & Ibu …", section: "Mempelai" },
  { key: "ortu_w", label: "Orang tua mempelai wanita", type: "text", placeholder: "Putri Bapak … & Ibu …", section: "Mempelai" },
  { key: "dt", label: "Tanggal & jam acara", type: "datetime", required: true, section: "Acara" },
  { key: "akad_t", label: "Acara 1 — judul", type: "text", def: "Akad Nikah", section: "Acara" },
  { key: "akad_jam", label: "Acara 1 — jam", type: "text", placeholder: "08.00 – 10.00 WIB", section: "Acara" },
  { key: "akad_tempat", label: "Acara 1 — tempat", type: "text", placeholder: "Gedung …, Medan", section: "Acara" },
  { key: "akad_maps", label: "Acara 1 — link maps", type: "text", placeholder: "https://maps.google.com/?q=…", section: "Acara" },
  { key: "resepsi_t", label: "Acara 2 — judul", type: "text", def: "Resepsi", section: "Acara" },
  { key: "resepsi_jam", label: "Acara 2 — jam", type: "text", placeholder: "11.00 – 14.00 WIB", section: "Acara" },
  { key: "resepsi_tempat", label: "Acara 2 — tempat", type: "text", placeholder: "Gedung …, Medan", section: "Acara" },
  { key: "resepsi_maps", label: "Acara 2 — link maps", type: "text", placeholder: "https://maps.google.com/?q=…", section: "Acara" },
  { key: "ayat", label: "Ayat / kutipan", type: "textarea", def: "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.", section: "Ayat" },
  { key: "ayat_src", label: "Sumber ayat", type: "text", def: "QS. Ar-Rūm : 21", section: "Ayat" },
  { key: "wa", label: "No. WhatsApp RSVP (628…)", type: "text", required: true, section: "Kontak & Gift" },
  { key: "gift1_bank", label: "Bank gift 1", type: "text", section: "Kontak & Gift" },
  { key: "gift1_num", label: "No. rekening gift 1", type: "text", section: "Kontak & Gift" },
  { key: "gift1_an", label: "a.n. gift 1", type: "text", placeholder: "otomatis = nama lengkap", section: "Kontak & Gift" },
  { key: "gift2_bank", label: "Bank gift 2 (opsional)", type: "text", section: "Kontak & Gift" },
  { key: "gift2_num", label: "No. rekening gift 2", type: "text", section: "Kontak & Gift" },
  { key: "gift2_an", label: "a.n. gift 2", type: "text", section: "Kontak & Gift" },
  { key: "alamat", label: "Alamat kirim fisik", type: "text", placeholder: "Jl. …", section: "Kontak & Gift" },
];
ROSE_FIELDS.push(MUSIK_FIELD);

const ROSE_SLOTS: PhotoSlotDef[] = [
  { key: "foto_pria", label: "🤵 1. Foto Mempelai Pria", hint: "Section mempelai · portrait oval", max: 1 },
  { key: "foto_wanita", label: "👰 2. Foto Mempelai Wanita", hint: "Section mempelai · portrait oval", max: 1 },
  { key: "foto_pasangan", label: "💑 3. Foto Pasangan", hint: "Section Celebrate · bingkai pearl arch", max: 1 },
  { key: "galeri", label: "🖼️ 4–9. Galeri Kenangan", hint: "6 foto · section galeri", max: 6 },
];

const LAKON_FIELDS: FieldDef[] = [
  { key: "pria", label: "Nama panggilan mempelai pria", type: "text", placeholder: "Galih", required: true, section: "Mempelai" },
  { key: "pria_full", label: "Nama lengkap mempelai pria", type: "text", placeholder: "Galih Prasetyo", required: true, section: "Mempelai" },
  { key: "wanita", label: "Nama panggilan mempelai wanita", type: "text", placeholder: "Sekar", required: true, section: "Mempelai" },
  { key: "wanita_full", label: "Nama lengkap mempelai wanita", type: "text", placeholder: "Sekar Ayu Lestari", required: true, section: "Mempelai" },
  { key: "ortu_p", label: "Orang tua mempelai pria", type: "text", placeholder: "Putra Bapak … & Ibu …", section: "Mempelai" },
  { key: "ortu_w", label: "Orang tua mempelai wanita", type: "text", placeholder: "Putri Bapak … & Ibu …", section: "Mempelai" },
  { key: "dt", label: "Tanggal & jam acara", type: "datetime", required: true, section: "Acara" },
  { key: "akad_t", label: "Acara 1 — judul", type: "text", def: "Akad Nikah", section: "Acara" },
  { key: "akad_jam", label: "Acara 1 — jam", type: "text", placeholder: "08.00 – 10.00 WIB", section: "Acara" },
  { key: "akad_tempat", label: "Acara 1 — tempat", type: "text", placeholder: "Pendopo …, Yogyakarta", section: "Acara" },
  { key: "akad_maps", label: "Acara 1 — link maps", type: "text", placeholder: "https://maps.google.com/?q=…", section: "Acara" },
  { key: "resepsi_t", label: "Acara 2 — judul", type: "text", def: "Resepsi", section: "Acara" },
  { key: "resepsi_jam", label: "Acara 2 — jam", type: "text", placeholder: "11.00 – 14.00 WIB", section: "Acara" },
  { key: "resepsi_tempat", label: "Acara 2 — tempat", type: "text", placeholder: "Pendopo …, Yogyakarta", section: "Acara" },
  { key: "resepsi_maps", label: "Acara 2 — link maps", type: "text", placeholder: "https://maps.google.com/?q=…", section: "Acara" },
  { key: "ayat", label: "Ayat / kutipan", type: "textarea", def: "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.", section: "Ayat" },
  { key: "ayat_src", label: "Sumber ayat", type: "text", def: "QS. Ar-Rūm : 21", section: "Ayat" },
  { key: "story1_t", label: "Kisah 1 — judul", type: "text", def: "Pitepangan", section: "Kisah" },
  { key: "story1_x", label: "Kisah 1 — cerita", type: "textarea", def: "Kenal di acara kampus — obrolan singkat yang ternyata awal segalanya.", section: "Kisah" },
  { key: "story2_t", label: "Kisah 2 — judul", type: "text", def: "Katresnan Tuwuh", section: "Kisah" },
  { key: "story2_x", label: "Kisah 2 — cerita", type: "textarea", def: "Makin sering bertemu, makin yakin: ini orangnya.", section: "Kisah" },
  { key: "story3_t", label: "Kisah 3 — judul", type: "text", def: "Lamaran", section: "Kisah" },
  { key: "story3_x", label: "Kisah 3 — cerita", type: "textarea", def: "Satu pertanyaan, satu jawaban: ya, dengan restu keluarga.", section: "Kisah" },
  { key: "wa", label: "No. WhatsApp RSVP (628…)", type: "text", required: true, section: "Kontak & Gift" },
  { key: "gift1_bank", label: "Bank gift 1", type: "text", section: "Kontak & Gift" },
  { key: "gift1_num", label: "No. rekening gift 1", type: "text", section: "Kontak & Gift" },
  { key: "gift1_an", label: "a.n. gift 1", type: "text", placeholder: "otomatis = nama lengkap", section: "Kontak & Gift" },
  { key: "gift2_bank", label: "Bank gift 2 (opsional)", type: "text", section: "Kontak & Gift" },
  { key: "gift2_num", label: "No. rekening gift 2", type: "text", section: "Kontak & Gift" },
  { key: "gift2_an", label: "a.n. gift 2", type: "text", section: "Kontak & Gift" },
  { key: "alamat", label: "Alamat kirim fisik", type: "text", placeholder: "Jl. …", section: "Kontak & Gift" },
];
LAKON_FIELDS.push(MUSIK_FIELD);

const LAKON_SLOTS: PhotoSlotDef[] = [
  { key: "foto_pria", label: "🤵 1. Foto Mempelai Pria", hint: "Jejer · bingkai oval emas", max: 1 },
  { key: "foto_wanita", label: "👰 2. Foto Mempelai Wanita", hint: "Jejer · bingkai oval emas", max: 1 },
  { key: "foto_pasangan", label: "💑 3. Foto Pasangan", hint: "Finale Tanceb Kayon · bingkai oval", max: 1 },
  { key: "story1_img", label: "📖 4. Foto Kisah 1", hint: "Lelampahan · opsional", max: 1 },
  { key: "story2_img", label: "📖 5. Foto Kisah 2", hint: "Lelampahan · opsional", max: 1 },
  { key: "story3_img", label: "📖 6. Foto Kisah 3", hint: "Lelampahan · opsional", max: 1 },
  { key: "galeri", label: "🖼️ 7–12. Galeri Kenangan", hint: "6 foto · Tetenger", max: 6 },
];

const DAKI_FIELDS: FieldDef[] = [
  { key: "pria", label: "Nama panggilan mempelai pria", type: "text", placeholder: "Arka", required: true, section: "Mempelai" },
  { key: "pria_full", label: "Nama lengkap mempelai pria", type: "text", placeholder: "Arka Pradana", required: true, section: "Mempelai" },
  { key: "wanita", label: "Nama panggilan mempelai wanita", type: "text", placeholder: "Naya", required: true, section: "Mempelai" },
  { key: "wanita_full", label: "Nama lengkap mempelai wanita", type: "text", placeholder: "Naya Kirana", required: true, section: "Mempelai" },
  { key: "ortu_p", label: "Orang tua mempelai pria", type: "text", placeholder: "Putra Bapak \u2026 & Ibu \u2026", section: "Mempelai" },
  { key: "ortu_w", label: "Orang tua mempelai wanita", type: "text", placeholder: "Putri Bapak \u2026 & Ibu \u2026", section: "Mempelai" },
  { key: "dt", label: "Tanggal & jam acara", type: "datetime", required: true, section: "Acara" },
  { key: "akad_waktu", label: "Jam akad", type: "text", placeholder: "08.00 \u2013 10.00 WIB", section: "Acara" },
  { key: "akad_tempat", label: "Tempat akad", type: "text", placeholder: "Aula Pendopo Agung, Yogyakarta", section: "Acara" },
  { key: "akad_maps", label: "Link maps akad", type: "text", placeholder: "https://maps.google.com/?q=\u2026", section: "Acara" },
  { key: "resepsi_waktu", label: "Jam resepsi", type: "text", placeholder: "11.00 \u2013 13.00 WIB", section: "Acara" },
  { key: "resepsi_tempat", label: "Tempat resepsi", type: "text", placeholder: "Gedung Serbaguna Cinta, Yogyakarta", section: "Acara" },
  { key: "resepsi_maps", label: "Link maps resepsi", type: "text", placeholder: "https://maps.google.com/?q=\u2026", section: "Acara" },
  { key: "pos1_t", label: "Pos 1 \u2014 judul", type: "text", def: "Langkah Pertama", section: "Pos 1" },
  { key: "pos1_mdpl", label: "Pos 1 \u2014 ketinggian", type: "text", def: "1.450", section: "Pos 1" },
  { key: "pos1_x", label: "Pos 1 \u2014 kata-kata", type: "textarea", def: "Semua pendakian besar dimulai dari satu langkah kecil. Di sinilah kami memutuskan untuk berjalan beriringan.", section: "Pos 1" },
  { key: "pos2_t", label: "Pos 2 \u2014 judul", type: "text", def: "Seperjalanan", section: "Pos 2" },
  { key: "pos2_mdpl", label: "Pos 2 \u2014 ketinggian", type: "text", def: "1.980", section: "Pos 2" },
  { key: "pos2_x", label: "Pos 2 \u2014 kata-kata", type: "textarea", def: "Jalur menanjak, napas memburu, tapi tawa tak pernah berhenti. Lelah itu ringan kalau dipikul berdua.", section: "Pos 2" },
  { key: "pos3_t", label: "Pos 3 \u2014 judul", type: "text", def: "Badai & Tawa", section: "Pos 3" },
  { key: "pos3_mdpl", label: "Pos 3 \u2014 ketinggian", type: "text", def: "2.520", section: "Pos 3" },
  { key: "pos3_x", label: "Pos 3 \u2014 kata-kata", type: "textarea", def: "Pernah ada badai yang hampir membuat kami turun. Tapi justru di tengah hujan itulah kami memilih saling menguatkan.", section: "Pos 3" },
  { key: "pos4_t", label: "Pos 4 \u2014 judul", type: "text", def: "Selangkah Lagi", section: "Pos 4" },
  { key: "pos4_mdpl", label: "Pos 4 \u2014 ketinggian", type: "text", def: "2.950", section: "Pos 4" },
  { key: "pos4_x", label: "Pos 4 \u2014 kata-kata", type: "textarea", def: "Puncak sudah terlihat. Terima kasih sudah mendaki sejauh ini \u2014 sekarang giliran kami mengundangmu ke puncak.", section: "Pos 4" },
  { key: "wa", label: "No. WhatsApp RSVP (628\u2026)", type: "text", required: true, section: "Kontak & Gift" },
  { key: "gift1_bank", label: "Bank gift 1", type: "text", section: "Kontak & Gift" },
  { key: "gift1_num", label: "No. rekening gift 1", type: "text", section: "Kontak & Gift" },
  { key: "gift1_an", label: "a.n. gift 1", type: "text", placeholder: "otomatis = nama lengkap", section: "Kontak & Gift" },
  { key: "gift2_bank", label: "Bank gift 2 (opsional)", type: "text", section: "Kontak & Gift" },
  { key: "gift2_num", label: "No. rekening gift 2", type: "text", section: "Kontak & Gift" },
  { key: "gift2_an", label: "a.n. gift 2", type: "text", section: "Kontak & Gift" },
  { key: "alamat", label: "Alamat kirim fisik", type: "text", placeholder: "Jl. \u2026", section: "Kontak & Gift" },
];
DAKI_FIELDS.push(MUSIK_FIELD);

const DAKI_SLOTS: PhotoSlotDef[] = [
  { key: "pos1_img", label: "\u{1F4F7} 1\u20135. Galeri Pos 1", hint: "maks 5 foto \u00b7 Langkah Pertama", max: 5 },
  { key: "pos2_img", label: "\u{1F4F7} 6\u201310. Galeri Pos 2", hint: "maks 5 foto \u00b7 Seperjalanan", max: 5 },
  { key: "pos3_img", label: "\u{1F4F7} 11\u201315. Galeri Pos 3", hint: "maks 5 foto \u00b7 Badai & Tawa", max: 5 },
  { key: "pos4_img", label: "\u{1F4F7} 16\u201320. Galeri Pos 4", hint: "maks 5 foto \u00b7 Selangkah Lagi", max: 5 },
];

const BIRU_FIELDS: FieldDef[] = [
  { key: "pria", label: "Nama panggilan mempelai pria", type: "text", placeholder: "Damar", required: true, section: "Mempelai" },
  { key: "pria_full", label: "Nama lengkap mempelai pria", type: "text", placeholder: "Damar Wicaksono", required: true, section: "Mempelai" },
  { key: "wanita", label: "Nama panggilan mempelai wanita", type: "text", placeholder: "Laras", required: true, section: "Mempelai" },
  { key: "wanita_full", label: "Nama lengkap mempelai wanita", type: "text", placeholder: "Laras Ayu Ningrum", required: true, section: "Mempelai" },
  { key: "ortu_p", label: "Orang tua mempelai pria", type: "text", placeholder: "Putra Bapak \u2026 & Ibu \u2026", section: "Mempelai" },
  { key: "ortu_w", label: "Orang tua mempelai wanita", type: "text", placeholder: "Putri Bapak \u2026 & Ibu \u2026", section: "Mempelai" },
  { key: "dt", label: "Tanggal & jam acara", type: "datetime", required: true, section: "Acara" },
  { key: "akad_t", label: "Acara 1 \u2014 judul", type: "text", def: "Akad Nikah", section: "Acara" },
  { key: "akad_jam", label: "Acara 1 \u2014 jam", type: "text", placeholder: "08.00 \u2013 10.00 WIB", section: "Acara" },
  { key: "akad_tempat", label: "Acara 1 \u2014 tempat", type: "text", placeholder: "Pendopo \u2026, Yogyakarta", section: "Acara" },
  { key: "akad_maps", label: "Acara 1 \u2014 link maps", type: "text", placeholder: "https://maps.google.com/?q=\u2026", section: "Acara" },
  { key: "resepsi_t", label: "Acara 2 \u2014 judul", type: "text", def: "Resepsi", section: "Acara" },
  { key: "resepsi_jam", label: "Acara 2 \u2014 jam", type: "text", placeholder: "11.00 \u2013 13.00 WIB", section: "Acara" },
  { key: "resepsi_tempat", label: "Acara 2 \u2014 tempat", type: "text", placeholder: "Pendopo \u2026, Yogyakarta", section: "Acara" },
  { key: "resepsi_maps", label: "Acara 2 \u2014 link maps", type: "text", placeholder: "https://maps.google.com/?q=\u2026", section: "Acara" },
  { key: "ayat", label: "Ayat / kutipan", type: "textarea", def: "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.", section: "Ayat" },
  { key: "ayat_src", label: "Sumber ayat", type: "text", def: "QS. Ar-R\u016bm : 21", section: "Ayat" },
  { key: "wa", label: "No. WhatsApp RSVP (628\u2026)", type: "text", required: true, section: "Kontak & Gift" },
  { key: "gift1_bank", label: "Bank gift 1", type: "text", section: "Kontak & Gift" },
  { key: "gift1_num", label: "No. rekening gift 1", type: "text", section: "Kontak & Gift" },
  { key: "gift1_an", label: "a.n. gift 1", type: "text", placeholder: "otomatis = nama lengkap", section: "Kontak & Gift" },
  { key: "gift2_bank", label: "Bank gift 2 (opsional)", type: "text", section: "Kontak & Gift" },
  { key: "gift2_num", label: "No. rekening gift 2", type: "text", section: "Kontak & Gift" },
  { key: "gift2_an", label: "a.n. gift 2", type: "text", section: "Kontak & Gift" },
  { key: "alamat", label: "Alamat kirim fisik", type: "text", placeholder: "Jl. \u2026", section: "Kontak & Gift" },
];
BIRU_FIELDS.push(MUSIK_FIELD);

const BIRU_SLOTS: PhotoSlotDef[] = [
  { key: "foto_pria", label: "\u{1F935} 1. Foto Mempelai Pria", hint: "Kartu mempelai \u00b7 bingkai lengkung", max: 1 },
  { key: "foto_wanita", label: "\u{1F470} 2. Foto Mempelai Wanita", hint: "Kartu mempelai \u00b7 bingkai lengkung", max: 1 },
  { key: "foto_pasangan", label: "\u{1F491} 3. Foto Pasangan", hint: "Hero \u00b7 bingkai lengkung + bunga", max: 1 },
  { key: "galeri", label: "\u{1F5BC}\uFE0F 4\u20139. Galeri Kenangan", hint: "6 foto \u00b7 section galeri", max: 6 },
];

const JABU_FIELDS: FieldDef[] = [
  { key: "pria", label: "Nama panggilan mempelai pria", type: "text", placeholder: "Pranta", required: true, section: "Mempelai" },
  { key: "pria_full", label: "Nama lengkap mempelai pria", type: "text", placeholder: "Pranta Ginting", required: true, section: "Mempelai" },
  { key: "wanita", label: "Nama panggilan mempelai wanita", type: "text", placeholder: "Sania", required: true, section: "Mempelai" },
  { key: "wanita_full", label: "Nama lengkap mempelai wanita", type: "text", placeholder: "Sania br. Sembiring", required: true, section: "Mempelai" },
  { key: "ortu_p", label: "Orang tua mempelai pria", type: "text", placeholder: "Putra Bapak \u2026 & Ibu \u2026", section: "Mempelai" },
  { key: "ortu_w", label: "Orang tua mempelai wanita", type: "text", placeholder: "Putri Bapak \u2026 & Ibu \u2026", section: "Mempelai" },
  { key: "dt", label: "Tanggal & jam acara", type: "datetime", required: true, section: "Acara" },
  { key: "akad_t", label: "Acara 1 \u2014 judul", type: "text", def: "Pemberkatan", section: "Acara" },
  { key: "akad_jam", label: "Acara 1 \u2014 jam", type: "text", placeholder: "09.00 \u2013 11.00 WIB", section: "Acara" },
  { key: "akad_tempat", label: "Acara 1 \u2014 tempat", type: "text", placeholder: "Jambur/Gedung \u2026, Medan", section: "Acara" },
  { key: "akad_maps", label: "Acara 1 \u2014 link maps", type: "text", placeholder: "https://maps.google.com/?q=\u2026", section: "Acara" },
  { key: "resepsi_t", label: "Acara 2 \u2014 judul", type: "text", def: "Resepsi & Adat", section: "Acara" },
  { key: "resepsi_jam", label: "Acara 2 \u2014 jam", type: "text", placeholder: "12.00 \u2013 selesai", section: "Acara" },
  { key: "resepsi_tempat", label: "Acara 2 \u2014 tempat", type: "text", placeholder: "Jambur/Gedung \u2026, Medan", section: "Acara" },
  { key: "resepsi_maps", label: "Acara 2 \u2014 link maps", type: "text", placeholder: "https://maps.google.com/?q=\u2026", section: "Acara" },
  { key: "ayat", label: "Ayat / kutipan", type: "textarea", def: "Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.", section: "Ayat" },
  { key: "ayat_src", label: "Sumber ayat", type: "text", def: "Matius 19 : 6", section: "Ayat" },
  { key: "wa", label: "No. WhatsApp RSVP (628\u2026)", type: "text", required: true, section: "Kontak & Gift" },
  { key: "gift1_bank", label: "Bank gift 1", type: "text", section: "Kontak & Gift" },
  { key: "gift1_num", label: "No. rekening gift 1", type: "text", section: "Kontak & Gift" },
  { key: "gift1_an", label: "a.n. gift 1", type: "text", placeholder: "otomatis = nama lengkap", section: "Kontak & Gift" },
  { key: "gift2_bank", label: "Bank gift 2 (opsional)", type: "text", section: "Kontak & Gift" },
  { key: "gift2_num", label: "No. rekening gift 2", type: "text", section: "Kontak & Gift" },
  { key: "gift2_an", label: "a.n. gift 2", type: "text", section: "Kontak & Gift" },
  { key: "alamat", label: "Alamat kirim fisik", type: "text", placeholder: "Jl. \u2026", section: "Kontak & Gift" },
];
JABU_FIELDS.push(MUSIK_FIELD);

const JABU_SLOTS: PhotoSlotDef[] = [
  { key: "foto_pria", label: "\u{1F935} 1. Foto Mempelai Pria", hint: "Kartu mempelai \u00b7 bingkai lengkung", max: 1 },
  { key: "foto_wanita", label: "\u{1F470} 2. Foto Mempelai Wanita", hint: "Kartu mempelai \u00b7 bingkai lengkung", max: 1 },
  { key: "foto_pasangan", label: "\u{1F491} 3. Foto Pasangan", hint: "Hero \u00b7 bingkai lengkung + bunga", max: 1 },
  { key: "galeri", label: "\u{1F5BC}\uFE0F 4\u20139. Galeri Kenangan", hint: "6 foto \u00b7 section galeri", max: 6 },
];

const BALI_FIELDS: FieldDef[] = [
  { key: "pria", label: "Nama panggilan mempelai pria", type: "text", placeholder: "Made", required: true, section: "Mempelai" },
  { key: "pria_full", label: "Nama lengkap mempelai pria", type: "text", placeholder: "Made Wirawan", required: true, section: "Mempelai" },
  { key: "wanita", label: "Nama panggilan mempelai wanita", type: "text", placeholder: "Ayu", required: true, section: "Mempelai" },
  { key: "wanita_full", label: "Nama lengkap mempelai wanita", type: "text", placeholder: "Ayu Lestari", required: true, section: "Mempelai" },
  { key: "ortu_p", label: "Orang tua mempelai pria", type: "text", placeholder: "Putra Bapak \u2026 & Ibu \u2026", section: "Mempelai" },
  { key: "ortu_w", label: "Orang tua mempelai wanita", type: "text", placeholder: "Putri Bapak \u2026 & Ibu \u2026", section: "Mempelai" },
  { key: "dt", label: "Tanggal & jam acara", type: "datetime", required: true, section: "Acara" },
  { key: "akad_t", label: "Acara 1 \u2014 judul", type: "text", def: "Pemberkatan", section: "Acara" },
  { key: "akad_jam", label: "Acara 1 \u2014 jam", type: "text", placeholder: "09.00 \u2013 11.00 WITA", section: "Acara" },
  { key: "akad_tempat", label: "Acara 1 \u2014 tempat", type: "text", placeholder: "Gereja/Gedung \u2026, Gianyar", section: "Acara" },
  { key: "akad_maps", label: "Acara 1 \u2014 link maps", type: "text", placeholder: "https://maps.google.com/?q=\u2026", section: "Acara" },
  { key: "resepsi_t", label: "Acara 2 \u2014 judul", type: "text", def: "Resepsi", section: "Acara" },
  { key: "resepsi_jam", label: "Acara 2 \u2014 jam", type: "text", placeholder: "12.00 \u2013 selesai", section: "Acara" },
  { key: "resepsi_tempat", label: "Acara 2 \u2014 tempat", type: "text", placeholder: "Gedung \u2026, Gianyar", section: "Acara" },
  { key: "resepsi_maps", label: "Acara 2 \u2014 link maps", type: "text", placeholder: "https://maps.google.com/?q=\u2026", section: "Acara" },
  { key: "ayat", label: "Salam & kutipan pembuka", type: "textarea", def: "Atas Asung Kertha Wara Nugraha Ida Sang Hyang Widhi Wasa, kami bermaksud menyempurnakan ikatan suci pernikahan kami.", section: "Ayat" },
  { key: "ayat_src", label: "Label kutipan", type: "text", def: "Om Swastiastu", section: "Ayat" },
  { key: "wa", label: "No. WhatsApp RSVP (628\u2026)", type: "text", required: true, section: "Kontak & Gift" },
  { key: "gift1_bank", label: "Bank gift 1", type: "text", section: "Kontak & Gift" },
  { key: "gift1_num", label: "No. rekening gift 1", type: "text", section: "Kontak & Gift" },
  { key: "gift1_an", label: "a.n. gift 1", type: "text", placeholder: "otomatis = nama lengkap", section: "Kontak & Gift" },
  { key: "gift2_bank", label: "Bank gift 2 (opsional)", type: "text", section: "Kontak & Gift" },
  { key: "gift2_num", label: "No. rekening gift 2", type: "text", section: "Kontak & Gift" },
  { key: "gift2_an", label: "a.n. gift 2", type: "text", section: "Kontak & Gift" },
  { key: "alamat", label: "Alamat kirim fisik", type: "text", placeholder: "Jl. \u2026", section: "Kontak & Gift" },
];
BALI_FIELDS.push(MUSIK_FIELD);

const BALI_SLOTS: PhotoSlotDef[] = [
  { key: "foto_pria", label: "\u{1F935} 1. Foto Mempelai Pria", hint: "Kartu mempelai \u00b7 bingkai lengkung", max: 1 },
  { key: "foto_wanita", label: "\u{1F470} 2. Foto Mempelai Wanita", hint: "Kartu mempelai \u00b7 bingkai lengkung", max: 1 },
  { key: "foto_pasangan", label: "\u{1F491} 3. Foto Pasangan", hint: "Hero \u00b7 bingkai lengkung + bunga", max: 1 },
  { key: "galeri", label: "\u{1F5BC}\uFE0F 4\u20139. Galeri Kenangan", hint: "6 foto \u00b7 section galeri", max: 6 },
];

const BOLON_FIELDS: FieldDef[] = [
  { key: "pria", label: "Nama panggilan mempelai pria", type: "text", placeholder: "Hotma", required: true, section: "Mempelai" },
  { key: "pria_full", label: "Nama lengkap mempelai pria", type: "text", placeholder: "Hotma Simanjuntak", required: true, section: "Mempelai" },
  { key: "wanita", label: "Nama panggilan mempelai wanita", type: "text", placeholder: "Ruth", required: true, section: "Mempelai" },
  { key: "wanita_full", label: "Nama lengkap mempelai wanita", type: "text", placeholder: "Ruth br. Manurung", required: true, section: "Mempelai" },
  { key: "ortu_p", label: "Orang tua mempelai pria", type: "text", placeholder: "Putra Bapak \u2026 & Ibu \u2026", section: "Mempelai" },
  { key: "ortu_w", label: "Orang tua mempelai wanita", type: "text", placeholder: "Putri Bapak \u2026 & Ibu \u2026", section: "Mempelai" },
  { key: "dt", label: "Tanggal & jam acara", type: "datetime", required: true, section: "Acara" },
  { key: "akad_t", label: "Acara 1 \u2014 judul", type: "text", def: "Pemberkatan", section: "Acara" },
  { key: "akad_jam", label: "Acara 1 \u2014 jam", type: "text", placeholder: "09.00 \u2013 11.00 WIB", section: "Acara" },
  { key: "akad_tempat", label: "Acara 1 \u2014 tempat", type: "text", placeholder: "Balai/Gedung \u2026, Medan", section: "Acara" },
  { key: "akad_maps", label: "Acara 1 \u2014 link maps", type: "text", placeholder: "https://maps.google.com/?q=\u2026", section: "Acara" },
  { key: "resepsi_t", label: "Acara 2 \u2014 judul", type: "text", def: "Resepsi & Adat", section: "Acara" },
  { key: "resepsi_jam", label: "Acara 2 \u2014 jam", type: "text", placeholder: "12.00 \u2013 selesai", section: "Acara" },
  { key: "resepsi_tempat", label: "Acara 2 \u2014 tempat", type: "text", placeholder: "Balai/Gedung \u2026, Medan", section: "Acara" },
  { key: "resepsi_maps", label: "Acara 2 \u2014 link maps", type: "text", placeholder: "https://maps.google.com/?q=\u2026", section: "Acara" },
  { key: "ayat", label: "Ayat / kutipan", type: "textarea", def: "Sebab ke mana engkau pergi, ke situ jugalah aku pergi, dan di mana engkau bermalam, di situ jugalah aku bermalam. Bangsamulah bangsaku dan Allahmulah Allahku.", section: "Ayat" },
  { key: "ayat_src", label: "Sumber ayat", type: "text", def: "Ruth 1 : 16", section: "Ayat" },
  { key: "wa", label: "No. WhatsApp RSVP (628\u2026)", type: "text", required: true, section: "Kontak & Gift" },
  { key: "gift1_bank", label: "Bank gift 1", type: "text", section: "Kontak & Gift" },
  { key: "gift1_num", label: "No. rekening gift 1", type: "text", section: "Kontak & Gift" },
  { key: "gift1_an", label: "a.n. gift 1", type: "text", placeholder: "otomatis = nama lengkap", section: "Kontak & Gift" },
  { key: "gift2_bank", label: "Bank gift 2 (opsional)", type: "text", section: "Kontak & Gift" },
  { key: "gift2_num", label: "No. rekening gift 2", type: "text", section: "Kontak & Gift" },
  { key: "gift2_an", label: "a.n. gift 2", type: "text", section: "Kontak & Gift" },
  { key: "alamat", label: "Alamat kirim fisik", type: "text", placeholder: "Jl. \u2026", section: "Kontak & Gift" },
];
BOLON_FIELDS.push(MUSIK_FIELD);

const BOLON_SLOTS: PhotoSlotDef[] = [
  { key: "foto_pria", label: "\u{1F935} 1. Foto Mempelai Pria", hint: "Kartu mempelai \u00b7 bingkai lengkung", max: 1 },
  { key: "foto_wanita", label: "\u{1F470} 2. Foto Mempelai Wanita", hint: "Kartu mempelai \u00b7 bingkai lengkung", max: 1 },
  { key: "foto_pasangan", label: "\u{1F491} 3. Foto Pasangan", hint: "Hero \u00b7 bingkai lengkung + bunga", max: 1 },
  { key: "galeri", label: "\u{1F5BC}\uFE0F 4\u20139. Galeri Kenangan", hint: "6 foto \u00b7 section galeri", max: 6 },
];

const GADANG_FIELDS: FieldDef[] = [
  { key: "pria", label: "Nama panggilan mempelai pria", type: "text", placeholder: "Rizky", required: true, section: "Mempelai" },
  { key: "pria_full", label: "Nama lengkap mempelai pria", type: "text", placeholder: "Rizky Pratama", required: true, section: "Mempelai" },
  { key: "wanita", label: "Nama panggilan mempelai wanita", type: "text", placeholder: "Puti", required: true, section: "Mempelai" },
  { key: "wanita_full", label: "Nama lengkap mempelai wanita", type: "text", placeholder: "Puti Anjani", required: true, section: "Mempelai" },
  { key: "ortu_p", label: "Orang tua mempelai pria", type: "text", placeholder: "Putra Bapak \u2026 & Ibu \u2026", section: "Mempelai" },
  { key: "ortu_w", label: "Orang tua mempelai wanita", type: "text", placeholder: "Putri Bapak \u2026 & Ibu \u2026", section: "Mempelai" },
  { key: "dt", label: "Tanggal & jam acara", type: "datetime", required: true, section: "Acara" },
  { key: "akad_t", label: "Acara 1 \u2014 judul", type: "text", def: "Akad Nikah", section: "Acara" },
  { key: "akad_jam", label: "Acara 1 \u2014 jam", type: "text", placeholder: "08.00 \u2013 10.00 WIB", section: "Acara" },
  { key: "akad_tempat", label: "Acara 1 \u2014 tempat", type: "text", placeholder: "Gedung \u2026, Bukittinggi", section: "Acara" },
  { key: "akad_maps", label: "Acara 1 \u2014 link maps", type: "text", placeholder: "https://maps.google.com/?q=\u2026", section: "Acara" },
  { key: "resepsi_t", label: "Acara 2 \u2014 judul", type: "text", def: "Baralek Gadang", section: "Acara" },
  { key: "resepsi_jam", label: "Acara 2 \u2014 jam", type: "text", placeholder: "11.00 \u2013 15.00 WIB", section: "Acara" },
  { key: "resepsi_tempat", label: "Acara 2 \u2014 tempat", type: "text", placeholder: "Gedung \u2026, Bukittinggi", section: "Acara" },
  { key: "resepsi_maps", label: "Acara 2 \u2014 link maps", type: "text", placeholder: "https://maps.google.com/?q=\u2026", section: "Acara" },
  { key: "ayat", label: "Ayat / kutipan", type: "textarea", def: "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.", section: "Ayat" },
  { key: "ayat_src", label: "Sumber ayat", type: "text", def: "QS. Ar-R\u016Bm : 21", section: "Ayat" },
  { key: "wa", label: "No. WhatsApp RSVP (628\u2026)", type: "text", required: true, section: "Kontak & Gift" },
  { key: "gift1_bank", label: "Bank gift 1", type: "text", section: "Kontak & Gift" },
  { key: "gift1_num", label: "No. rekening gift 1", type: "text", section: "Kontak & Gift" },
  { key: "gift1_an", label: "a.n. gift 1", type: "text", placeholder: "otomatis = nama lengkap", section: "Kontak & Gift" },
  { key: "gift2_bank", label: "Bank gift 2 (opsional)", type: "text", section: "Kontak & Gift" },
  { key: "gift2_num", label: "No. rekening gift 2", type: "text", section: "Kontak & Gift" },
  { key: "gift2_an", label: "a.n. gift 2", type: "text", section: "Kontak & Gift" },
  { key: "alamat", label: "Alamat kirim fisik", type: "text", placeholder: "Jl. \u2026", section: "Kontak & Gift" },
];
GADANG_FIELDS.push(MUSIK_FIELD);

const GADANG_SLOTS: PhotoSlotDef[] = [
  { key: "foto_pria", label: "\u{1F935} 1. Foto Mempelai Pria", hint: "Kartu mempelai \u00b7 bingkai lengkung", max: 1 },
  { key: "foto_wanita", label: "\u{1F470} 2. Foto Mempelai Wanita", hint: "Kartu mempelai \u00b7 bingkai lengkung", max: 1 },
  { key: "foto_pasangan", label: "\u{1F491} 3. Foto Pasangan", hint: "Hero \u00b7 bingkai lengkung + bunga", max: 1 },
  { key: "galeri", label: "\u{1F5BC}\uFE0F 4\u20139. Galeri Kenangan", hint: "6 foto \u00b7 section galeri", max: 6 },
];


function makeArtFields(o: { pria: string; priaFull: string; wanita: string; wanitaFull: string; akadDef: string; resepsiDef: string; tempat: string; ayat: string; ayatSrc: string }): FieldDef[] {
  return [
    { key: "pria", label: "Nama panggilan mempelai pria", type: "text", placeholder: o.pria, required: true, section: "Mempelai" },
    { key: "pria_full", label: "Nama lengkap mempelai pria", type: "text", placeholder: o.priaFull, required: true, section: "Mempelai" },
    { key: "wanita", label: "Nama panggilan mempelai wanita", type: "text", placeholder: o.wanita, required: true, section: "Mempelai" },
    { key: "wanita_full", label: "Nama lengkap mempelai wanita", type: "text", placeholder: o.wanitaFull, required: true, section: "Mempelai" },
    { key: "ortu_p", label: "Orang tua mempelai pria", type: "text", placeholder: "Putra Bapak \u2026 & Ibu \u2026", section: "Mempelai" },
    { key: "ortu_w", label: "Orang tua mempelai wanita", type: "text", placeholder: "Putri Bapak \u2026 & Ibu \u2026", section: "Mempelai" },
    { key: "dt", label: "Tanggal & jam acara", type: "datetime", required: true, section: "Acara" },
    { key: "akad_t", label: "Acara 1 \u2014 judul", type: "text", def: o.akadDef, section: "Acara" },
    { key: "akad_jam", label: "Acara 1 \u2014 jam", type: "text", placeholder: "08.00 \u2013 10.00 WIB", section: "Acara" },
    { key: "akad_tempat", label: "Acara 1 \u2014 tempat", type: "text", placeholder: o.tempat, section: "Acara" },
    { key: "akad_maps", label: "Acara 1 \u2014 link maps", type: "text", placeholder: "https://maps.google.com/?q=\u2026", section: "Acara" },
    { key: "resepsi_t", label: "Acara 2 \u2014 judul", type: "text", def: o.resepsiDef, section: "Acara" },
    { key: "resepsi_jam", label: "Acara 2 \u2014 jam", type: "text", placeholder: "11.00 \u2013 15.00 WIB", section: "Acara" },
    { key: "resepsi_tempat", label: "Acara 2 \u2014 tempat", type: "text", placeholder: o.tempat, section: "Acara" },
    { key: "resepsi_maps", label: "Acara 2 \u2014 link maps", type: "text", placeholder: "https://maps.google.com/?q=\u2026", section: "Acara" },
    { key: "ayat", label: "Ayat / kutipan", type: "textarea", def: o.ayat, section: "Ayat" },
    { key: "ayat_src", label: "Sumber ayat", type: "text", def: o.ayatSrc, section: "Ayat" },
    { key: "wa", label: "No. WhatsApp RSVP (628\u2026)", type: "text", required: true, section: "Kontak & Gift" },
    { key: "gift1_bank", label: "Bank gift 1", type: "text", section: "Kontak & Gift" },
    { key: "gift1_num", label: "No. rekening gift 1", type: "text", section: "Kontak & Gift" },
    { key: "gift1_an", label: "a.n. gift 1", type: "text", placeholder: "otomatis = nama lengkap", section: "Kontak & Gift" },
    { key: "gift2_bank", label: "Bank gift 2 (opsional)", type: "text", section: "Kontak & Gift" },
    { key: "gift2_num", label: "No. rekening gift 2", type: "text", section: "Kontak & Gift" },
    { key: "gift2_an", label: "a.n. gift 2", type: "text", section: "Kontak & Gift" },
    { key: "alamat", label: "Alamat kirim fisik", type: "text", placeholder: "Jl. \u2026", section: "Kontak & Gift" },
  ];
}

const JART_FIELDS = makeArtFields({ pria: "Damar", priaFull: "Damar Wicaksono", wanita: "Laras", wanitaFull: "Laras Ayu Ningrum", akadDef: "Akad Nikah", resepsiDef: "Resepsi", tempat: "Pendopo \u2026, Yogyakarta", ayat: "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.", ayatSrc: "QS. Ar-R\u016bm : 21" });
JART_FIELDS.push(MUSIK_FIELD);
const KART_FIELDS = makeArtFields({ pria: "Pranta", priaFull: "Pranta Ginting", wanita: "Sania", wanitaFull: "Sania br. Sembiring", akadDef: "Pemberkatan", resepsiDef: "Resepsi & Adat", tempat: "Jambur \u2026, Medan", ayat: "Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.", ayatSrc: "Matius 19 : 6" });
KART_FIELDS.push(MUSIK_FIELD);
const BART_FIELDS = makeArtFields({ pria: "Hotma", priaFull: "Hotma Simanjuntak", wanita: "Ruth", wanitaFull: "Ruth br. Manurung", akadDef: "Pemberkatan", resepsiDef: "Resepsi & Adat", tempat: "Balai \u2026, Medan", ayat: "Sebab ke mana engkau pergi, ke situ jugalah aku pergi, dan di mana engkau bermalam, di situ jugalah aku bermalam. Bangsamulah bangsaku dan Allahmulah Allahku.", ayatSrc: "Ruth 1 : 16" });
BART_FIELDS.push(MUSIK_FIELD);
const MALAM_FIELDS = makeArtFields({ pria: "Arya", priaFull: "Arya Langit Pradana", wanita: "Nadia", wanitaFull: "Nadia Bintang Kirana", akadDef: "Akad Nikah", resepsiDef: "Resepsi", tempat: "The Sky Hall \u2026, Jakarta Selatan", ayat: "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.", ayatSrc: "QS. Ar-R\u016bm : 21" });
MALAM_FIELDS.push(MUSIK_FIELD);

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
  {
    id: "baroque-rose",
    name: "Baroque Rose — undangan elegan",
    file: "baroque-rose/index.html",
    fields: ROSE_FIELDS,
    photoSlots: ROSE_SLOTS,
  },
  {
    id: "lakon-cinta",
    name: "Lakon Cinta — wayang interaktif",
    file: "lakon-cinta/index.html",
    fields: LAKON_FIELDS,
    photoSlots: LAKON_SLOTS,
  },
  {
    id: "pendakian-cinta",
    name: "Pendakian Cinta — game 2D",
    file: "pendakian-cinta/index.html",
    fields: DAKI_FIELDS,
    photoSlots: DAKI_SLOTS,
  },
  {
    id: "rumah-bolon",
    name: "Rumah Bolon — Batak Toba",
    file: "rumah-bolon/index.html",
    fields: BOLON_FIELDS,
    photoSlots: BOLON_SLOTS,
  },
  {
    id: "siwaluh-jabu",
    name: "Siwaluh Jabu — Karo",
    file: "siwaluh-jabu/index.html",
    fields: JABU_FIELDS,
    photoSlots: JABU_SLOTS,
  },
  {
    id: "candi-bentar",
    name: "Candi Bentar — Bali",
    file: "candi-bentar/index.html",
    fields: BALI_FIELDS,
    photoSlots: BALI_SLOTS,
  },
  {
    id: "pendopo-biru",
    name: "Pendopo Biru — elegan Jawa biru",
    file: "pendopo-biru/index.html",
    fields: BIRU_FIELDS,
    photoSlots: BIRU_SLOTS,
  },
  {
    id: "rumah-gadang",
    name: "Rumah Gadang — Minangkabau",
    file: "rumah-gadang/index.html",
    fields: GADANG_FIELDS,
    photoSlots: GADANG_SLOTS,
  },
  {
    id: "pendopo-biru-art",
    name: "Pendopo Biru Art — Jawa sinematik",
    file: "pendopo-biru-art/index.html",
    fields: JART_FIELDS,
    photoSlots: GADANG_SLOTS,
  },
  {
    id: "siwaluh-jabu-art",
    name: "Siwaluh Jabu Art — Karo sinematik",
    file: "siwaluh-jabu-art/index.html",
    fields: KART_FIELDS,
    photoSlots: GADANG_SLOTS,
  },
  {
    id: "malam-berbintang",
    name: "Malam Berbintang — malam elegan interaktif",
    file: "malam-berbintang/index.html",
    fields: MALAM_FIELDS,
    photoSlots: GADANG_SLOTS,
  },
  {
    id: "rumah-bolon-art",
    name: "Rumah Bolon Art — Batak sinematik",
    file: "rumah-bolon-art/index.html",
    fields: BART_FIELDS,
    photoSlots: GADANG_SLOTS,
  },
];

export function getStaticTemplate(id: string | undefined | null): StaticTemplateDef | undefined {
  if (!id) return undefined;
  return STATIC_TEMPLATES.find((t) => t.id === id);
}

export function templateDisplayName(id: string): string {
  return getStaticTemplate(id)?.name ?? id;
}
