/** @type {import('next').NextConfig} */
const nextConfig = {
  // engine/ dibaca via fs di route handler — pastikan ikut terbawa
  outputFileTracingIncludes: {
    "/i/[slug]": ["./engine/**/*"],
  },
};
export default nextConfig;
