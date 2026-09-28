'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/components/SessionContext';
import {
  UserCheck,
  PlusCircle,
  Clock,
  Gift,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  Boxes,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Star,
  Bell,
  Calendar,
  Send,
  Ticket,
} from 'lucide-react';
import {
  JenisSampahItem,
  WilayahItem,
  LaporanSampahItem,
  RewardItem,
  NotifikasiItem,
  TransaksiRewardItem,
  JadwalWilayahItem,
} from '@/lib/types';

export default function WargaPage() {
  const { currentUser, refreshUsers } = useSession();
  const [activeTab, setActiveTab] = useState<'lapor' | 'riwayat' | 'reward' | 'transaksi'>('lapor');

  // Master Data & Lists
  const [jenisSampahList, setJenisSampahList] = useState<JenisSampahItem[]>([]);
  const [wilayahList, setWilayahList] = useState<WilayahItem[]>([]);
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [jadwalList, setJadwalList] = useState<JadwalWilayahItem[]>([]);

  // User Reports & Transactions
  const [laporanList, setLaporanList] = useState<LaporanSampahItem[]>([]);
  const [transaksiRewardList, setTransaksiRewardList] = useState<TransaksiRewardItem[]>([]);
  const [loadingLaporan, setLoadingLaporan] = useState(false);

  // Notifications
  const [notifList, setNotifList] = useState<NotifikasiItem[]>([]);
  const [unreadNotif, setUnreadNotif] = useState(0);
  const [showNotifModal, setShowNotifModal] = useState(false);

  // Form State
  const [selectedJenis, setSelectedJenis] = useState('');
  const [selectedWilayah, setSelectedWilayah] = useState('');
  const [beratInput, setBeratInput] = useState('');
  const [alamatInput, setAlamatInput] = useState('');
  const [deskripsiInput, setDeskripsiInput] = useState('');
  const [fotoUrlInput, setFotoUrlInput] = useState('');
  const [fotoPreview, setFotoPreview] = useState('');
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState('');
  const [msgError, setMsgError] = useState('');

  // Ulasan Modal State
  const [activeUlasanLaporan, setActiveUlasanLaporan] = useState<LaporanSampahItem | null>(null);
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [komentarInput, setKomentarInput] = useState('');
  const [submittingUlasan, setSubmittingUlasan] = useState(false);

  // Reward Redemption state
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  // Fetch Master Data
  useEffect(() => {
    fetchMasterData();
    fetchRewards();
  }, []);

  // Fetch User Data whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      fetchLaporan();
      fetchNotifikasis();
      fetchTransaksiRewards();
    }
  }, [currentUser, activeTab]);

  // Fetch Jadwal when selectedWilayah changes
  useEffect(() => {
    if (selectedWilayah) {
      fetchJadwal(selectedWilayah);
    }
  }, [selectedWilayah]);

  const fetchMasterData = async () => {
    try {
      const [resJenis, resWil] = await Promise.all([
        fetch('/api/master/jenis-sampah'),
        fetch('/api/master/wilayah'),
      ]);
      if (resJenis.ok) setJenisSampahList(await resJenis.json());
      if (resWil.ok) setWilayahList(await resWil.json());
    } catch (err) {
      console.error('Error fetching master data:', err);
    }
  };

  const fetchRewards = async () => {
    try {
      const res = await fetch('/api/rewards');
      if (res.ok) setRewards(await res.json());
    } catch (err) {
      console.error('Error fetching rewards:', err);
    }
  };

  const fetchJadwal = async (wilId: string) => {
    try {
      const res = await fetch(`/api/master/jadwal?wilayahId=${wilId}`);
      if (res.ok) setJadwalList(await res.json());
    } catch (err) {
      console.error('Error fetching jadwal:', err);
    }
  };

  const fetchNotifikasis = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/notifikasi?userId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setNotifList(data.notifikasiList);
        setUnreadNotif(data.unreadCount);
      }
    } catch (err) {
      console.error('Error fetching notifikasi:', err);
    }
  };

  const fetchTransaksiRewards = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/transaksi-reward?userId=${currentUser.id}`);
      if (res.ok) setTransaksiRewardList(await res.json());
    } catch (err) {
      console.error('Error fetching transaksi reward:', err);
    }
  };

  const fetchLaporan = async () => {
    if (!currentUser) return;
    setLoadingLaporan(true);
    try {
      const res = await fetch(`/api/laporan?userId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setLaporanList(data);
      }
    } catch (err) {
      console.error('Error fetching laporan:', err);
    } finally {
      setLoadingLaporan(false);
    }
  };

  const handleMarkNotifRead = async () => {
    if (!currentUser) return;
    try {
      await fetch('/api/notifikasi', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, markAll: true }),
      });
      fetchNotifikasis();
    } catch (err) {
      console.error('Error marking notif read:', err);
    }
  };

  // Submit Laporan
  const handleSubmitLaporan = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgSuccess('');
    setMsgError('');

    if (!currentUser) {
      setMsgError('Silakan pilih atau login sebagai user Warga terlebih dahulu.');
      return;
    }

    if (!selectedJenis || !selectedWilayah || !beratInput) {
      setMsgError('Harap lengkapi jenis sampah, wilayah, dan estimasi berat.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/laporan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          jenisSampahId: selectedJenis,
          wilayahId: selectedWilayah,
          berat: parseFloat(beratInput),
          alamatLengkap: alamatInput,
          deskripsi: deskripsiInput,
          fotoUrl: fotoUrlInput || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsgError(data.error || 'Gagal membuat laporan.');
      } else {
        setMsgSuccess('Laporan sampah berhasil dibuat! Petugas kami akan memprosesnya.');
        setSelectedJenis('');
        setSelectedWilayah('');
        setBeratInput('');
        setAlamatInput('');
        setDeskripsiInput('');
        setFotoUrlInput('');
        setFotoPreview('');
        fetchLaporan();
        fetchNotifikasis();
      }
    } catch (err) {
      setMsgError('Terjadi kesalahan koneksi.');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Ulasan & Rating for Completed Laporan
  const handleSubmitUlasan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUlasanLaporan || !currentUser) return;

    setSubmittingUlasan(true);
    setMsgSuccess('');
    setMsgError('');

    try {
      const res = await fetch('/api/ulasan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          laporanId: activeUlasanLaporan.id,
          userId: currentUser.id,
          rating: ratingInput,
          komentar: komentarInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsgError(data.error || 'Gagal mengirim ulasan');
      } else {
        setMsgSuccess('Ulasan & Rating berhasil dikirim. Terima kasih!');
        setActiveUlasanLaporan(null);
        setRatingInput(5);
        setKomentarInput('');
        fetchLaporan();
      }
    } catch (err) {
      setMsgError('Terjadi kesalahan jaringan');
    } finally {
      setSubmittingUlasan(false);
    }
  };

  // Redeem Reward (New TransaksiReward Table integration)
  const handleRedeem = async (rewardId: string) => {
    if (!currentUser) return;
    setRedeemingId(rewardId);
    setMsgSuccess('');
    setMsgError('');

    try {
      const res = await fetch('/api/transaksi-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          rewardId,
          noHpTujuan: currentUser.noHp,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsgError(data.error || 'Gagal melakukan penukaran reward.');
      } else {
        setMsgSuccess(data.message);
        await refreshUsers();
        await fetchRewards();
        await fetchTransaksiRewards();
        await fetchNotifikasis();
      }
    } catch (err) {
      setMsgError('Terjadi kesalahan saat penukaran.');
    } finally {
      setRedeemingId(null);
    }
  };

  // Selected Jenis Object for points calculation preview
  const activeJenisObj = jenisSampahList.find((j) => j.id === selectedJenis);
  const estimatedPoints = activeJenisObj && beratInput ? Math.round(parseFloat(beratInput) * activeJenisObj.poinPerKg) : 0;

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Menunggu Petugas</span>;
      case 'VERIFIED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">Terverifikasi</span>;
      case 'PROCESSED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">Dalam Penjemputan</span>;
      case 'DONE':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Selesai & Poin Cair</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* User Header & Points Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
              <UserCheck className="w-4 h-4" /> Portal Warga & Nasabah Sampah
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => {
                setShowNotifModal(!showNotifModal);
                if (unreadNotif > 0) handleMarkNotifRead();
              }}
              className="relative p-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-md transition-all"
            >
              <Bell className="w-4 h-4 text-white" />
              {unreadNotif > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadNotif}
                </span>
              )}
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Selamat Datang, {currentUser?.nama || 'Pengunjung'}!
          </h1>
          <p className="text-emerald-100 text-sm max-w-xl">
            Setorkan sampah terpilah Anda, dapatkan poin insentif lingkungan, dan dukung Bekasi Bebas Sampah.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 text-center sm:text-right shrink-0 w-full sm:w-auto relative z-10">
          <p className="text-xs uppercase tracking-wider text-emerald-200 font-bold">Saldo Poin Daur Ulang</p>
          <p className="text-3xl sm:text-5xl font-black text-amber-300 mt-1">
            {(currentUser?.poin || 0).toLocaleString('id-ID')}{' '}
            <span className="text-sm font-semibold text-white">Poin</span>
          </p>
        </div>
      </div>

      {/* NOTIFIKASI DROPDOWN MODAL */}
      {showNotifModal && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-emerald-600" /> Notifikasi Aktivitas Akun
            </h3>
            <button
              onClick={() => setShowNotifModal(false)}
              className="text-xs text-zinc-400 hover:text-zinc-600"
            >
              Tutup
            </button>
          </div>

          {notifList.length === 0 ? (
            <p className="text-xs text-zinc-500 py-4 text-center">Belum ada notifikasi baru.</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {notifList.map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 text-xs space-y-0.5">
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">{n.judul}</p>
                  <p className="text-zinc-600 dark:text-zinc-400 text-[11px]">{n.pesan}</p>
                  <span className="text-[10px] text-zinc-400 block pt-1">{new Date(n.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('lapor')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'lapor'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <PlusCircle className="w-4 h-4" /> Lapor Sampah Baru
        </button>
        <button
          onClick={() => setActiveTab('riwayat')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'riwayat'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Clock className="w-4 h-4" /> Riwayat & Status ({laporanList.length})
        </button>
        <button
          onClick={() => setActiveTab('reward')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'reward'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Gift className="w-4 h-4 text-amber-400" /> Tukar Poin Reward
        </button>
        <button
          onClick={() => setActiveTab('transaksi')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'transaksi'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Ticket className="w-4 h-4 text-emerald-400" /> Riwayat Kupon ({transaksiRewardList.length})
        </button>
      </div>

      {/* Feedback Messages */}
      {msgSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{msgSuccess}</span>
        </div>
      )}
      {msgError && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{msgError}</span>
        </div>
      )}

      {/* TAB 1: FORM LAPOR SAMPAH */}
      {activeTab === 'lapor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" /> Form Pelaporan Sampah
              </h2>
              <p className="text-xs text-zinc-500 mt-1">Isi formulir penjemputan sampah terpisah Anda di bawah ini</p>
            </div>

            <form onSubmit={handleSubmitLaporan} className="space-y-5">
              {/* Jenis Sampah Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 mb-2">
                  1. Pilih Jenis Sampah
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {jenisSampahList.map((j) => (
                    <button
                      type="button"
                      key={j.id}
                      onClick={() => setSelectedJenis(j.id)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        selectedJenis === j.id
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-100 font-semibold ring-2 ring-emerald-500/20'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:border-zinc-300'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold">{j.namaJenis}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">{j.deskripsi}</p>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-lg shrink-0">
                        +{j.poinPerKg} pt/kg
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wilayah Operasional */}
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 mb-2">
                  2. Pilih Wilayah Operasional
                </label>
                <select
                  value={selectedWilayah}
                  onChange={(e) => setSelectedWilayah(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="">-- Pilih Wilayah / Kecamatan --</option>
                  {wilayahList.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.namaWilayah} {w.kodeWilayah ? `(${w.kodeWilayah})` : ''}
                    </option>
                  ))}
                </select>

                {/* Display Jadwal Wilayah table (Table: JadwalWilayah) */}
                {selectedWilayah && jadwalList.length > 0 && (
                  <div className="mt-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1.5">
                    <p className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Jadwal Operasional Penjemputan Rutin:
                    </p>
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      {jadwalList.map((j) => (
                        <span key={j.id} className="px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/20">
                          {j.hari}: {j.jamMulai} - {j.jamSelesai} (Kuota: {j.kuotaMaks})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Berat & Estimasi Poin */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 mb-2">
                    3. Estimasi Berat (kg)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="Contoh: 3.5"
                      value={beratInput}
                      onChange={(e) => setBeratInput(e.target.value)}
                      className="w-full p-3.5 pr-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    <span className="absolute right-4 top-3.5 text-xs font-bold text-zinc-400">KG</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 mb-2">
                    Estimasi Poin Diperoleh
                  </label>
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-amber-700 dark:text-amber-300">
                    <span className="text-xs font-semibold flex items-center gap-1">
                      <Award className="w-4 h-4 text-amber-500" /> Potensi Poin
                    </span>
                    <span className="text-lg font-black">{estimatedPoints.toLocaleString('id-ID')} Poin</span>
                  </div>
                </div>
              </div>

              {/* Alamat Lengkap */}
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 mb-2">
                  4. Alamat Lengkap Penjemputan
                </label>
                <textarea
                  rows={2}
                  placeholder="Jl. Margahayu No. 12, RT 02/RW 05 (Patokan samping mesjid)"
                  value={alamatInput}
                  onChange={(e) => setAlamatInput(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Upload Foto Sampah */}
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 mb-2">
                  5. Foto Sampah (Unggah Foto dari HP/Kamera)
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      setFotoPreview(URL.createObjectURL(file));
                      setUploadingFoto(true);

                      const formData = new FormData();
                      formData.append('file', file);

                      try {
                        const res = await fetch('/api/upload', {
                          method: 'POST',
                          body: formData,
                        });
                        const data = await res.json();
                        if (res.ok) {
                          setFotoUrlInput(data.fotoUrl);
                        } else {
                          setMsgError(data.error || 'Gagal mengunggah foto');
                        }
                      } catch (err) {
                        setMsgError('Gagal mengunggah foto');
                      } finally {
                        setUploadingFoto(false);
                      }
                    }}
                    className="block w-full text-xs text-zinc-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 dark:file:bg-emerald-950 dark:file:text-emerald-300 hover:file:bg-emerald-100 cursor-pointer"
                  />

                  {uploadingFoto && <span className="text-xs text-amber-500 font-semibold animate-pulse">Mengunggah foto...</span>}

                  {fotoPreview && (
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-emerald-500/30 shrink-0 shadow-md">
                      <img src={fotoPreview} alt="Preview Foto Sampah" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Deskripsi Catatan */}
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 mb-2">
                  Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 3 botol galon bekas dan 2 karung kardus"
                  value={deskripsiInput}
                  onChange={(e) => setDeskripsiInput(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || uploadingFoto}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-base shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50"
              >
                {submitting ? 'Memproses Laporan...' : 'Kirim Laporan Penjemputan Sampah'}
              </button>
            </form>
          </div>

          {/* Guide Card */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-950 to-teal-950 text-white rounded-3xl p-6 border border-emerald-800/50 shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Panduan Pemilahan Sampah</h3>
              <p className="text-xs text-emerald-200 leading-relaxed">
                Pastikan sampah dilaporkan dalam keadaan terpisah dan relatif kering agar memudahkan penimbangan oleh kurir petugas.
              </p>
              <div className="space-y-2 text-xs pt-2 border-t border-emerald-800/50">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-amber-400">1.</span>
                  <span><strong>Foto Sampah:</strong> Ambil foto tumpukan sampah secara jelas.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-amber-400">2.</span>
                  <span><strong>Plastik:</strong> Bersihkan dari sisa cairan / makanan.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-amber-400">3.</span>
                  <span><strong>Kertas:</strong> Ikat rapi kardus dan hindari basah air.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RIWAYAT & TIMELINE STATUS */}
      {activeTab === 'riwayat' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" /> Status Penjemputan Sampah Saya
              </h2>
              <p className="text-xs text-zinc-500 mt-1">Pantau perkembangan proses penjemputan dari PENDING hingga SELESAI</p>
            </div>
            <button
              onClick={fetchLaporan}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors w-fit"
            >
              Refresh Data
            </button>
          </div>

          {loadingLaporan ? (
            <div className="py-12 text-center text-sm text-zinc-500">Memuat riwayat laporan...</div>
          ) : laporanList.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Boxes className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto" />
              <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Belum ada laporan sampah disubmit.</p>
              <button
                onClick={() => setActiveTab('lapor')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Buat Laporan Pertama
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {laporanList.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-emerald-500/40 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/60 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 font-bold">
                        <Boxes className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{item.jenisSampah.namaJenis}</h4>
                        <p className="text-xs text-zinc-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400" /> {item.wilayah.namaWilayah} • {new Date(item.tanggalLapor).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <div>{getStatusBadge(item.status)}</div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-zinc-400 block font-medium">Estimasi Berat</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{item.berat} kg</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block font-medium">Berat Timbangan Aktual</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {item.beratAktual ? `${item.beratAktual} kg` : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block font-medium">Poin Diperoleh</span>
                      <span className="font-bold text-amber-500">+{item.poinDiperoleh} Poin</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block font-medium">Petugas Ditugaskan</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {item.petugas ? item.petugas.nama : 'Belum ditugaskan'}
                      </span>
                    </div>
                  </div>

                  {/* Foto Sampah (One-to-One Foreign Key relation with FotoSampah) */}
                  {(item.fotoUrl || item.fotoSampah?.fotoUrl) && (
                    <div className="flex items-center gap-3 bg-white dark:bg-zinc-800/80 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-700">
                        <img src={item.fotoUrl || item.fotoSampah?.fotoUrl || ''} alt="Foto Sampah" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-xs space-y-0.5">
                        <span className="font-bold text-zinc-700 dark:text-zinc-300 block">Foto Sampah Dilaporkan:</span>
                        <span className="text-[11px] text-zinc-500">Tersimpan dalam tabel FotoSampah (One-to-One FK)</span>
                      </div>
                    </div>
                  )}

                  {/* Ulasan & Rating (Table: UlasanPenjemputan) */}
                  {item.status === 'DONE' && (
                    <div className="pt-2 border-t border-zinc-200/50 dark:border-zinc-800 flex items-center justify-between">
                      {item.ulasan ? (
                        <div className="flex items-center gap-2 text-xs text-amber-500 font-semibold">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span>Rating Anda: {item.ulasan.rating}/5 {item.ulasan.komentar ? `("${item.ulasan.komentar}")` : ''}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveUlasanLaporan(item)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/20 transition-all"
                        >
                          <Star className="w-3.5 h-3.5" /> Beri Rating Kurir ⭐️
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: KATALOG REWARD POIN */}
      {activeTab === 'reward' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-500" /> Katalog Penukaran Reward Poin
              </h2>
              <p className="text-xs text-zinc-500 mt-1">Tukarkan poin daur ulang Anda dengan saldo e-wallet, pulsa, atau sembako</p>
            </div>
            <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-2xl border border-amber-500/30 text-amber-600 dark:text-amber-400">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold">Poin Anda: {(currentUser?.poin || 0).toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewards.map((r) => {
              const canAfford = (currentUser?.poin || 0) >= r.biayaPoin;
              return (
                <div
                  key={r.id}
                  className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-lg flex flex-col justify-between hover:border-amber-500 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold group-hover:scale-110 transition-transform">
                      <Gift className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {r.kategori}
                      </span>
                      <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">{r.namaReward}</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{r.deskripsi}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 font-medium">Biaya</span>
                      <span className="font-black text-amber-500 text-sm">{r.biayaPoin.toLocaleString('id-ID')} Poin</span>
                    </div>

                    <button
                      onClick={() => handleRedeem(r.id)}
                      disabled={!canAfford || redeemingId === r.id || r.stok <= 0}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all shadow-md ${
                        canAfford && r.stok > 0
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/20'
                          : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed shadow-none'
                      }`}
                    >
                      {redeemingId === r.id
                        ? 'Memproses...'
                        : r.stok <= 0
                        ? 'Stok Habis'
                        : canAfford
                        ? 'Tukarkan Poin'
                        : 'Poin Tidak Cukup'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: RIWAYAT KUPON & TRANSAKSI REWARD */}
      {activeTab === 'transaksi' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-emerald-600" /> Riwayat Transaksi Kupon & Reward
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Daftar kode voucher & pengiriman hadiah penukaran poin Anda</p>
          </div>

          {transaksiRewardList.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500">Belum ada riwayat penukaran reward.</div>
          ) : (
            <div className="space-y-3">
              {transaksiRewardList.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{t.reward.namaReward}</h4>
                    <p className="text-zinc-500 mt-0.5">Kode Kupon: <strong className="text-emerald-600 font-mono">{t.kodeKupon || '-'}</strong></p>
                    <p className="text-zinc-400 text-[11px]">Tujuan: {t.noHpTujuan} • {new Date(t.createdAt).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {t.status}
                    </span>
                    <span className="block font-bold text-amber-500 mt-1">-{t.biayaPoin} Poin</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL ULASAN PENJEMPUTAN (Table: UlasanPenjemputan) */}
      {activeUlasanLaporan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Beri Rating & Ulasan Kurir</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Laporan {activeUlasanLaporan.jenisSampah.namaJenis} oleh petugas {activeUlasanLaporan.petugas?.nama || 'Kurir'}
              </p>
            </div>

            <form onSubmit={handleSubmitUlasan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2">Rating Bintang (1 - 5)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingInput(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= ratingInput
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-zinc-300 dark:text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Masukan / Komentar (Opsional)</label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Petugas sangat tepat waktu dan sopan!"
                  value={komentarInput}
                  onChange={(e) => setKomentarInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveUlasanLaporan(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingUlasan}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-md shadow-amber-500/20"
                >
                  {submittingUlasan ? 'Mengirim...' : 'Kirim Ulasan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
