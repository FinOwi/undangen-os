/** @type {import('next').NextConfig} */
const nextConfig = {
  // App di-proxy via path /admin/*, /pantau/*, /i/* di domain utama —
  // aset _next dimuat langsung dari sini agar tidak 404 di domain utama.
  assetPrefix: "https://undangen-os.vercel.app",
  // engine/ dibaca via fs di route handler — pastikan ikut terbawa
  outputFileTracingIncludes: {
    "/i/[slug]": ["./engine/**/*"],
  },
};
export default nextConfig;
