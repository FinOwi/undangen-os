// Halaman error untuk undangan private — desain orisinal Undangen (dark + gold).

function shell(title: string, heading: string, body: string): string {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — Undangen</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#14100b;color:#f5ead6;font-family:Georgia,'Times New Roman',serif;
min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center}
.card{max-width:420px}
.seal{width:74px;height:74px;margin:0 auto 26px;border:1px solid #d4a24e;border-radius:50%;
display:flex;align-items:center;justify-content:center;font-size:30px;color:#d4a24e;
background:radial-gradient(circle,rgba(212,162,78,.14),transparent 70%)}
h1{font-size:32px;font-weight:600;margin-bottom:14px}
h1 em{color:#d4a24e;font-style:italic}
p{font-family:system-ui,sans-serif;font-size:14.5px;line-height:1.8;color:rgba(245,234,214,.72)}
.rule{width:64px;height:1px;background:linear-gradient(90deg,transparent,#d4a24e,transparent);margin:24px auto}
small{display:block;margin-top:26px;font-family:system-ui,sans-serif;font-size:11px;letter-spacing:.22em;color:rgba(245,234,214,.4)}
small b{color:#d4a24e}
</style></head><body><div class="card">
<div class="seal">✦</div><h1>${heading}</h1><div class="rule"></div><p>${body}</p>
<small><b>UNDANGEN</b><br>undangen.my.id</small>
</div></body></html>`;
}

export function linkNotFoundPage(): string {
  return shell(
    "Tautan Tidak Ditemukan",
    "Tautan <em>Tidak Ditemukan</em>",
    "Tautan undangan ini tidak valid, sudah dicabut, atau bukan untuk Anda. " +
      "Setiap tamu menerima tautan pribadi yang tidak dapat diteruskan. " +
      "Silakan hubungi mempelai untuk mendapatkan tautan undangan Anda.",
  );
}

export function deviceMismatchPage(guestName: string): string {
  const who = guestName ? ` (${escapeHtml(guestName)})` : "";
  return shell(
    "Tautan Sudah Dibuka",
    "Sudah Dibuka di <em>Perangkat Lain</em>",
    `Tautan pribadi ini${who} sudah dibuka di perangkat lain dan tidak dapat diteruskan. ` +
      `Jika ini perangkat Anda yang baru, silakan hubungi mempelai untuk mengatur ulang tautan Anda.`,
  );
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
