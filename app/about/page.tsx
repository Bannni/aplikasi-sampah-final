import React from 'react';
import Link from 'next/link';
import {
  Recycle,
  UserCheck,
  Truck,
  ShieldCheck,
  Sparkles,
  Award,
  Globe,
  Users,
  Target,
  Heart,
  ArrowRight,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-start pb-20">
      {/* Header Banner */}
      <section className="w-full bg-gradient-to-b from-emerald-600/10 via-teal-500/5 to-transparent py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Inovasi Pengelolaan Sampah Berbasis Digital</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Mengenal Lebih Dekat{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
              SampahKita
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Solusi pengelolaan sampah modern yang mengintegrasikan peran Warga, Petugas Kurir Lapangan, dan Administrator dalam satu platform terpadu.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12 space-y-16">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">Visi Utama</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Mewujudkan lingkungan perkotaan yang bersih, bebas dari penumpukan sampah liar, serta membentuk kesadaran pemilahan sampah mandiri dari tingkat rumah tangga dengan dukungan insentif digital.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">Misi Lingkungan</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Menyediakan jalur penjemputan sampah terukur per wilayah, memberikan apresiasi poin daur ulang yang dapat ditukarkan, dan memberikan analitik transparan bagi pihak pengelola lingkungan.
            </p>
          </div>
        </div>

        {/* 3 Pillars / Roles Concept */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
              Sistem Ekosistem
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
              Tiga Sinar Kolaborasi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Warga / Nasabah</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Warga melakukan pemilahan sampah dari rumah, mengirim laporan lokasi penjemputan, dan mendapatkan saldo poin daur ulang.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Petugas Kurir</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Petugas kurir menerima penugasan per wilayah operasional, melakukan verifikasi & penimbangan berat di tempat warga.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Admin Pengelola</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Admin memantau data secara real-time, menugaskan kurir, mengelola hak akses pengguna, serta mengatur tarif insentif poin.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-3xl p-8 text-center space-y-4 shadow-xl">
          <h3 className="text-2xl font-black">Bersama Jaga Kelestarian Bumi</h3>
          <p className="text-xs text-emerald-100 max-w-xl mx-auto">
            Daftarkan diri Anda hari ini dan mulai kumpulkan poin dari sampah daur ulang rumah tangga Anda.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-emerald-800 font-extrabold text-xs shadow-md hover:bg-emerald-50 transition-colors"
            >
              Daftar Sekarang <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
