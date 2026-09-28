'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/components/SessionContext';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  Filter,
  CheckSquare,
  Boxes,
  AlertCircle,
  ShieldAlert,
  Star,
} from 'lucide-react';
import { LaporanSampahItem, WilayahItem } from '@/lib/types';

export default function PetugasPage() {
  const { currentUser } = useSession();
  const [laporanTasks, setLaporanTasks] = useState<LaporanSampahItem[]>([]);
  const [wilayahList, setWilayahList] = useState<WilayahItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Ratings State (Table: UlasanPenjemputan)
  const [avgRating, setAvgRating] = useState<number>(0);
  const [totalUlasan, setTotalUlasan] = useState<number>(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [wilayahFilter, setWilayahFilter] = useState<string>('');

  // Selected Task Modal / Update State
  const [activeTask, setActiveTask] = useState<LaporanSampahItem | null>(null);
  const [beratAktualInput, setBeratAktualInput] = useState<string>('');
  const [catatanInput, setCatatanInput] = useState<string>('');
  const [targetStatus, setTargetStatus] = useState<string>('DONE');
  const [updating, setUpdating] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState('');
  const [msgError, setMsgError] = useState('');

  useEffect(() => {
    fetchWilayah();
  }, []);

  useEffect(() => {
    fetchTasks();
    if (currentUser) {
      fetchRatingStats();
    }
  }, [statusFilter, wilayahFilter, currentUser]);

  const fetchWilayah = async () => {
    try {
      const res = await fetch('/api/master/wilayah');
      if (res.ok) setWilayahList(await res.json());
    } catch (err) {
      console.error('Error fetching wilayah:', err);
    }
  };

  const fetchRatingStats = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/ulasan?petugasId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setAvgRating(data.avgRating || 5.0);
        setTotalUlasan(data.totalUlasan || 0);
      }
    } catch (err) {
      console.error('Error fetching rating stats:', err);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      let url = `/api/laporan?status=${statusFilter}`;
      if (wilayahFilter) url += `&wilayahId=${wilayahFilter}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data: LaporanSampahItem[] = await res.json();
        setLaporanTasks(data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (task: LaporanSampahItem, nextStatus: string) => {
    setActiveTask(task);
    setTargetStatus(nextStatus);
    setBeratAktualInput(task.beratAktual ? String(task.beratAktual) : String(task.berat));
    setCatatanInput(task.catatanPetugas || '');
    setMsgSuccess('');
    setMsgError('');
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask || !currentUser) return;

    setUpdating(true);
    setMsgSuccess('');
    setMsgError('');

    try {
      const res = await fetch('/api/laporan', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeTask.id,
          status: targetStatus,
          petugasId: currentUser.id,
          beratAktual: parseFloat(beratAktualInput),
          catatanPetugas: catatanInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsgError(data.error || 'Gagal merubah status tugas');
      } else {
        setMsgSuccess(`Status tugas berhasil diubah menjadi ${targetStatus}!`);
        setActiveTask(null);
        fetchTasks();
      }
    } catch (err) {
      setMsgError('Terjadi kesalahan jaringan');
    } finally {
      setUpdating(false);
    }
  };

  // Status Badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Belum Diambil</span>;
      case 'VERIFIED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">Terverifikasi</span>;
      case 'PROCESSED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">Dalam Penjemputan</span>;
      case 'DONE':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Selesai</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">{status}</span>;
    }
  };

  const pendingCount = laporanTasks.filter((t) => t.status === 'PENDING').length;
  const processedCount = laporanTasks.filter((t) => t.status === 'PROCESSED' || t.status === 'VERIFIED').length;
  const doneCount = laporanTasks.filter((t) => t.status === 'DONE').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
            <Truck className="w-4 h-4" /> Portal Petugas & Kurir Penjemputan
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Tugas Lapangan, {currentUser?.nama || 'Petugas'}!
          </h1>
          <p className="text-blue-100 text-sm max-w-xl">
            Kelola jadwal penjemputan sampah terpilah warga dan input berat timbangan aktual.
          </p>

          {/* Average Rating Stars (Table: UlasanPenjemputan) */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold mt-2">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Rating Kurir: {avgRating > 0 ? avgRating : '5.0'} / 5 ({totalUlasan} Ulasan Warga)</span>
          </div>
        </div>

        {/* Stats Quick Badges */}
        <div className="grid grid-cols-3 gap-3 w-full sm:w-auto shrink-0 relative z-10 text-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4">
            <p className="text-[10px] uppercase font-bold text-blue-200">Pending</p>
            <p className="text-xl sm:text-2xl font-black text-amber-300">{pendingCount}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4">
            <p className="text-[10px] uppercase font-bold text-blue-200">Proses</p>
            <p className="text-xl sm:text-2xl font-black text-blue-200">{processedCount}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4">
            <p className="text-[10px] uppercase font-bold text-blue-200">Selesai</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-300">{doneCount}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
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

      {/* Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
          <Filter className="w-4 h-4 text-blue-600" /> Filter Antrean Penjemputan
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-initial"
          >
            <option value="ALL">Semua Status</option>
            <option value="PENDING">PENDING (Belum Diambil)</option>
            <option value="VERIFIED">VERIFIED (Terverifikasi)</option>
            <option value="PROCESSED">PROCESSED (Dalam Penjemputan)</option>
            <option value="DONE">DONE (Selesai)</option>
          </select>

          <select
            value={wilayahFilter}
            onChange={(e) => setWilayahFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-initial"
          >
            <option value="">Semua Wilayah Operasional</option>
            {wilayahList.map((w) => (
              <option key={w.id} value={w.id}>
                {w.namaWilayah}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List Grid */}
      {loading ? (
        <div className="py-16 text-center text-sm text-zinc-500">Memuat daftar tugas penjemputan...</div>
      ) : laporanTasks.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800 space-y-3">
          <Boxes className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto" />
          <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">Tidak ada tugas penjemputan yang sesuai dengan filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {laporanTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-lg flex flex-col justify-between space-y-4 hover:border-blue-500 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {task.jenisSampah.namaJenis}
                  </span>
                  {getStatusBadge(task.status)}
                </div>

                <div className="border-t border-b border-zinc-100 dark:border-zinc-800/80 py-3 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-semibold">
                    <User className="w-4 h-4 text-blue-500" />
                    <span>{task.user.nama}</span>
                    <span className="text-zinc-400 font-normal">({task.user.noHp})</span>
                  </div>

                  <div className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-zinc-800 dark:text-zinc-200">{task.wilayah.namaWilayah}</p>
                      <p className="text-[11px] leading-relaxed mt-0.5">{task.alamatLengkap || 'Alamat tidak diisi'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-zinc-500 pt-1">
                    <span>Estimasi Berat: <strong>{task.berat} kg</strong></span>
                    <span>Timbangan: <strong className="text-emerald-600">{task.beratAktual ? `${task.beratAktual} kg` : '-'}</strong></span>
                  </div>

                  {(task.fotoUrl || task.fotoSampah?.fotoUrl) && (
                    <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 max-h-36 relative">
                      <img src={task.fotoUrl || task.fotoSampah?.fotoUrl || ''} alt="Foto Sampah Warga" className="w-full h-36 object-cover" />
                      <span className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-white text-[9px] px-2 py-0.5 rounded-md font-semibold">
                        Tabel FotoSampah (FK)
                      </span>
                    </div>
                  )}

                  {task.deskripsi && (
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-xl text-[11px] text-zinc-600 dark:text-zinc-400">
                      <strong>Catatan Warga:</strong> {task.deskripsi}
                    </div>
                  )}

                  {/* Rating & Ulasan from Warga (Table: UlasanPenjemputan) */}
                  {task.ulasan && (
                    <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-[11px] text-amber-800 dark:text-amber-300 space-y-0.5">
                      <div className="flex items-center gap-1 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>Rating Warga: {task.ulasan.rating} / 5</span>
                      </div>
                      {task.ulasan.komentar && <p className="italic text-[10px]">"{task.ulasan.komentar}"</p>}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons based on status */}
              <div className="space-y-2">
                {task.status === 'PENDING' && (
                  <button
                    onClick={() => openUpdateModal(task, 'VERIFIED')}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckSquare className="w-4 h-4" /> Terima & Verifikasi Tugas
                  </button>
                )}

                {task.status === 'VERIFIED' && (
                  <button
                    onClick={() => openUpdateModal(task, 'PROCESSED')}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Truck className="w-4 h-4" /> Mulai Penjemputan Kurir
                  </button>
                )}

                {task.status === 'PROCESSED' && (
                  <button
                    onClick={() => openUpdateModal(task, 'DONE')}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Timbang & Selesaikan Tugas
                  </button>
                )}

                {task.status === 'DONE' && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-center text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    Tugas Penjemputan Selesai
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPDATE MODAL */}
      {activeTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Update Tugas Penjemputan</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Laporan: {activeTask.jenisSampah.namaJenis} ({activeTask.user.nama})
              </p>
            </div>

            <form onSubmit={handleUpdateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Status Target</label>
                <input
                  type="text"
                  readOnly
                  value={targetStatus}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 font-bold text-xs text-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Hasil Timbangan Aktual (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={beratAktualInput}
                  onChange={(e) => setBeratAktualInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[10px] text-zinc-400 mt-1">Poin warga akan dicairkan berdasarkan timbangan aktual ini.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Catatan Petugas (Opsional)</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Sampah sudah bersih dan sesuai kategori"
                  value={catatanInput}
                  onChange={(e) => setCatatanInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTask(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
                >
                  {updating ? 'Menyimpan...' : 'Simpan Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
