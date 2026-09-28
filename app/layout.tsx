import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "SampahKita - Aplikasi Pengelolaan & Pelaporan Sampah",
  description: "Sistem Manajemen Sampah Terpadu 3 Role (Warga, Petugas, Admin). Lapor Sampah, Kumpulkan Poin, & Jaga Kelestarian Lingkungan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
        <SessionProvider>
          <Navbar />
          <div className="flex-1 flex flex-col">{children}</div>
          <footer className="py-6 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 bg-white dark:bg-zinc-900 mt-auto">
            © 2026 SampahKita Eco Management. Pengelolaan Sampah Berbasis Digital 3 Role.
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}


