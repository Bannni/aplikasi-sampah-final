import React from 'react';
import Link from 'next/link';
import {
  Recycle,
  UserCheck,
  Truck,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Award,
  MapPin,
  Sparkles,
  CheckCircle2,
  Boxes,
  Gift,
  Zap,
  FileText,
  Clock,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import prisma from '@/lib/prisma';

export default async function HomePage() {
  let userCount = 0;
  let totalWeight = 0;
  let laporanDoneCount = 0;
  let wilayahCount = 0;
  let jenisSampahList: any[] = [];
  let rewardList: any[] = [];

  try {
    userCount = await prisma.user.count();
    const aggregate = await prisma.laporanSampah.aggregate({
      _sum: { berat: true },
      _count: { id: true },
    });
    totalWeight = aggregate._sum.berat || 0;

    laporanDoneCount = await prisma.laporanSampah.count({
      where: { status: 'DONE' },
    });

    wilayahCount = await prisma.wilayah.count();
    jenisSampahList = await prisma.jenisSampah.findMany({ take: 6 });
    rewardList = await prisma.rewardCatalog.findMany({ take: 4 });
  } catch (err) {
    console.error('Failed to fetch landing page statistics:', err);
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-start pb-20">
      {/* 1. HERO BANNER SECTION */}
      <section className="w-full bg-gradient-to-b from-emerald-600/10 via-teal-500/5 to-transparent py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden border-b border-zinc-200/50 dark:border-zinc-800/50">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-500 animate-spin" />
            <span>Platform Pengelolaan Sampah Digital Terpadu 3 Peran</span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]">
            Setor Sampah Terpilah,{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
              Raih Insentif Poin Daur Ulang
            </span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Menghubungkan <strong>Warga</strong> yang peduli lingkungan, <strong>Petugas Kurir</strong> yang menjemput sampah ke lokasi, dan <strong>Admin Pengelola</strong> dalam satu sistem ekosistem terpadu.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/warga"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-extrabold text-base shadow-xl shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 group"
            >
              Mulai Lapor Sampah <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-extrabold text-base border border-zinc-200 dark:border-zinc-800 shadow-md transition-all text-center"
            >
              Daftar Akun Baru
            </Link>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC IMPACT METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-10 z-20">
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-white rounded-3xl p-8 border border-zinc-800 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Recycle className="w-80 h-80" />
          </div>

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-zinc-800/80">
            <div className="p-2 space-y-1">
              <div className="inline-flex p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl mb-1">
                <Boxes className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white">{totalWeight.toFixed(1)} <span className="text-base font-normal text-emerald-400">KG</span></p>
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Sampah Terkumpul</p>
            </div>

            <div className="p-2 space-y-1">
              <div className="inline-flex p-2.5 bg-blue-500/20 text-blue-400 rounded-2xl mb-1">
                <TrendingUp className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white">{laporanDoneCount}</p>
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Penjemputan Tuntas</p>
            </div>

            <div className="p-2 space-y-1">
              <div className="inline-flex p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl mb-1">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white">{userCount}</p>
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Pengguna Terdaftar</p>
            </div>

            <div className="p-2 space-y-1">
              <div className="inline-flex p-2.5 bg-purple-500/20 text-purple-400 rounded-2xl mb-1">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white">{wilayahCount}</p>
              <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Wilayah Terjangkau</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ALUR CARA KERJA APLIKASI (4 STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-20 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
            Alur Pengelolaan Praktis
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100">
            Cara Kerja Sistem SampahKita
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Proses transparan & terukur dari pelaporan di rumah hingga penukaran poin reward
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-4 hover:border-emerald-500 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
              01
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Pilah & Lapor Sampah</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Warga memilah sampah (Plastik, Kardus, Logam, Beling, B3) dan mengirimkan formulir laporan penjemputan via web.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-4 hover:border-blue-500 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
              02
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Penugasan Kurir</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Admin/Sistem menugaskan Petugas Kurir sesuai wilayah operasional untuk meluncur ke lokasi rumah warga.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-4 hover:border-indigo-500 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
              03
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Penimbangan Aktual</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Petugas menimbang berat sampah secara presisi di lokasi dan memperbarui status laporan menjadi selesai.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-4 hover:border-amber-500 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
              04
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Cairkan Poin Reward</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Poin daur ulang masuk ke saldo akun warga dan siap ditukarkan dengan saldo DANA, Pulsa, atau paket Sembako.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SHOWCASE FITUR 3 ROLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-24 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
            Multi Role Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100">
            Didesain Khusus Untuk 3 Role
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Tiap peran memiliki portal khusus dengan antarmuka yang dioptimalkan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Role 1 Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl hover:border-emerald-500 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <UserCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-emerald-600 dark:text-emerald-400">Role Warga</span>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">Masyarakat & Nasabah</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Lapor sampah terpisah dari rumah, pantau status kurir secara live, dan kumpulkan poin reward daur ulang.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Form Lapor Sampah & Estimasi Poin
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Timeline Status Penjemputan
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Penukaran E-Wallet & Sembako
                </li>
              </ul>
            </div>

            <Link
              href="/warga"
              className="w-full py-3 text-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/20"
            >
              Buka Portal Warga
            </Link>
          </div>

          {/* Role 2 Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl hover:border-blue-500 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Truck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-blue-600 dark:text-blue-400">Role Petugas</span>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">Kurir & Field Officer</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Terima antrean tugas penjemputan per wilayah, catat berat timbangan aktual, dan selesaikan laporan.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" /> Antrean Penjemputan per Wilayah
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" /> Input Timbangan Berat Aktual
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" /> Update Status (Verified ➔ Done)
                </li>
              </ul>
            </div>

            <Link
              href="/petugas"
              className="w-full py-3 text-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md shadow-blue-600/20"
            >
              Buka Portal Petugas
            </Link>
          </div>

          {/* Role 3 Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl hover:border-purple-500 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-purple-600 dark:text-purple-400">Role Admin</span>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">Pengelola & DLH</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Monitoring analitik laporan, assign petugas kurir, kelola role pengguna, dan konfigurasi tarif poin.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" /> Monitoring & Penugasan Petugas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" /> User & Role Management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" /> Master Data Sampah & Tarif Poin
                </li>
              </ul>
            </div>

            <Link
              href="/admin"
              className="w-full py-3 text-center rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-md shadow-purple-600/20"
            >
              Buka Portal Admin
            </Link>
          </div>
        </div>
      </section>

      {/* 5. KATEGORI SAMPAH & TARIF POIN GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-24 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
              Tarif Insentif Daur Ulang
            </span>
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
              Jenis Sampah Dilayani
            </h2>
          </div>
          <Link
            href="/warga"
            className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
          >
            Lapor Sampah Sekarang <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jenisSampahList.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md flex items-start justify-between hover:border-emerald-500 transition-all"
            >
              <div className="space-y-2">
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">{item.namaJenis}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.deskripsi}</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs rounded-xl shrink-0">
                +{item.poinPerKg} pt/kg
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-24">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black">
              Siap Menjadi Pahlawan Lingkungan?
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Bergabunglah dengan ribuan warga Bekasi lainnya. Pilah sampahmu, panggil kurir penjemputan, dan dapatkan manfaat langsung untuk dompetmu.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-emerald-800 font-extrabold text-sm hover:bg-emerald-50 transition-colors shadow-lg"
              >
                Daftar Akun Sekarang
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border border-white/40 text-white font-extrabold text-sm hover:bg-white/10 transition-colors"
              >
                Masuk ke Akun
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
