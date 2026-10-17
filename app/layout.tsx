import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Undangen OS — Panel Internal",
  description: "Platform internal Undangen: kelola undangan digital (done-for-you).",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
