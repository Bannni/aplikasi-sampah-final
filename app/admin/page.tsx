'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/components/SessionContext';
import {
  ShieldCheck,
  Users,
  Boxes,
  MapPin,
  FileText,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  UserCheck,
  Truck,
  TrendingUp,
  Calendar,
  Ticket,
} from 'lucide-react';
import {
  LaporanSampahItem,
  JenisSampahItem,
  WilayahItem,
  UserSession,
  JadwalWilayahItem,
  TransaksiRewardItem,
} from '@/lib/types';

export default function AdminPage() {
  const { currentUser, refreshUsers } = useSession();
  const [activeTab, setActiveTab] = useState<'laporan' | 'users' | 'jenis' | 'wilayah' | 'jadwal' | 'transaksi'>('laporan');

  // Master Data & Lists
  const [laporanList, setLaporanList] = useState<LaporanSampahItem[]>([]);
  const [userList, setUserList] = useState<UserSession[]>([]);
  const [jenisList, setJenisList] = useState<JenisSampahItem[]>([]);
  const [wilayahList, setWilayahList] = useState<WilayahItem[]>([]);
  const [jadwalList, setJadwalList] = useState<JadwalWilayahItem[]>([]);
  const [transaksiList, setTransaksiList] = useState<TransaksiRewardItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Messages
  const [msgSuccess, setMsgSuccess] = useState('');
  const [msgError, setMsgError] = useState('');

  // Modals / Forms
  // 1. Jenis Sampah Form Modal
  const [showJenisModal, setShowJenisModal] = useState(false);
  const [jenisFormId, setJenisFormId] = useState<string | null>(null);
  const [namaJenisInput, setNamaJenisInput] = useState('');
  const [deskripsiJenisInput, setDeskripsiJenisInput] = useState('');
  const [poinPerKgInput, setPoinPerKgInput] = useState('500');

  // 2. Wilayah Form Modal
  const [showWilayahModal, setShowWilayahModal] = useState(false);
  const [wilayahFormId, setWilayahFormId] = useState<string | null>(null);
  const [namaWilayahInput, setNamaWilayahInput] = useState('');
  const [kodeWilayahInput, setKodeWilayahInput] = useState('');

  // 3. Jadwal Wilayah Modal
  const [showJadwalModal, setShowJadwalModal] = useState(false);
  const [jadwalWilayahIdInput, setJadwalWilayahIdInput] = useState('');
  const [hariInput, setHariInput] = useState('Senin');
  const [jamMulaiInput, setJamMulaiInput] = useState('08:00');
  const [jamSelesaiInput, setJamSelesaiInput] = useState('12:00');
  const [kuotaMaksInput, setKuotaMaksInput] = useState('50');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [resLap, resUsr, resJen, resWil, resJad, resTx] = await Promise.all([
        fetch('/api/laporan'),
        fetch('/api/master/users'),
        fetch('/api/master/jenis-sampah'),
        fetch('/api/master/wilayah'),
        fetch('/api/master/jadwal'),
        fetch('/api/transaksi-reward'),
      ]);

      if (resLap.ok) setLaporanList(await resLap.json());
      if (resUsr.ok) setUserList(await resUsr.json());
      if (resJen.ok) setJenisList(await resJen.json());
      if (resWil.ok) setWilayahList(await resWil.json());
      if (resJad.ok) setJadwalList(await resJad.json());
      if (resTx.ok) setTransaksiList(await resTx.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Assign Petugas to Report
  const handleAssignPetugas = async (laporanId: string, petugasId: string) => {
    setMsgSuccess('');
    setMsgError('');
    try {
      const res = await fetch('/api/laporan', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: laporanId,
          petugasId: petugasId || null,
          status: 'VERIFIED',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsgError(data.error || 'Gagal menugaskan petugas');
      } else {
        setMsgSuccess('Petugas berhasil ditugaskan!');
        fetchAllData();
      }
    } catch (err) {
      setMsgError('Terjadi kesalahan jaringan');
    }
  };

  // Change User Role
  const handleChangeRole = async (userId: string, newRole: string) => {
    setMsgSuccess('');
    setMsgError('');
    try {
      const res = await fetch('/api/master/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) setMsgError(data.error);
      else {
        setMsgSuccess('Role pengguna berhasil diperbarui!');
        fetchAllData();
        await refreshUsers();
      }
    } catch (err) {
      setMsgError('Gagal mengubah role');
    }
  };

  // Save Jenis Sampah
  const handleSaveJenis = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgSuccess('');
    setMsgError('');
    try {
      const isEdit = !!jenisFormId;
      const url = '/api/master/jenis-sampah';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: jenisFormId,
          namaJenis: namaJenisInput,
          deskripsi: deskripsiJenisInput,
          poinPerKg: parseInt(poinPerKgInput),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsgError(data.error || 'Gagal menyimpan jenis sampah');
      } else {
        setMsgSuccess(data.message);
        setShowJenisModal(false);
        fetchAllData();
      }
    } catch (err) {
      setMsgError('Terjadi kesalahan koneksi');
    }
  };

  // Save Wilayah
  const handleSaveWilayah = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgSuccess('');
    setMsgError('');
    try {
      const isEdit = !!wilayahFormId;
      const url = '/api/master/wilayah';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: wilayahFormId,
          namaWilayah: namaWilayahInput,
          kodeWilayah: kodeWilayahInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsgError(data.error || 'Gagal menyimpan wilayah');
      } else {
        setMsgSuccess(data.message);
        setShowWilayahModal(false);
        fetchAllData();
      }
    } catch (err) {
      setMsgError('Terjadi kesalahan koneksi');
    }
  };

  // Save Jadwal Wilayah (Table: JadwalWilayah)
  const handleSaveJadwal = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsgSuccess('');
    setMsgError('');
    try {
      const res = await fetch('/api/master/jadwal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wilayahId: jadwalWilayahIdInput,
          hari: hariInput,
          jamMulai: jamMulaiInput,
          jamSelesai: jamSelesaiInput,
          kuotaMaks: kuotaMaksInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsgError(data.error || 'Gagal menyimpan jadwal');
      } else {
        setMsgSuccess(data.message);
        setShowJadwalModal(false);
        fetchAllData();
      }
    } catch (err) {
      setMsgError('Terjadi kesalahan server');
    }
  };

  // Update Transaksi Reward Status (Table: TransaksiReward)
  const handleUpdateTxStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/transaksi-reward', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setMsgSuccess('Status transaksi reward diperbarui!');
        fetchAllData();
      }
    } catch (err) {
      setMsgError('Gagal memperbarui status transaksi');
    }
  };

  const petugasUsers = userList.filter((u) => u.role === 'PETUGAS');
  const totalBeratAccumulated = laporanList.reduce((acc, curr) => acc + (curr.beratAktual || curr.berat), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4" /> Portal Administrator System
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Dashboard Panel Pengelola
          </h1>
          <p className="text-purple-100 text-sm max-w-xl">
            Kelola data laporan, penugasan kurir petugas, user role, tarif jenis sampah, dan jadwal operasional wilayah.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 w-full sm:w-auto shrink-0 relative z-10 text-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4">
            <p className="text-[10px] uppercase font-bold text-purple-200">Total User</p>
            <p className="text-xl sm:text-2xl font-black text-amber-300">{userList.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4">
            <p className="text-[10px] uppercase font-bold text-purple-200">Laporan</p>
            <p className="text-xl sm:text-2xl font-black text-purple-200">{laporanList.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 sm:p-4">
            <p className="text-[10px] uppercase font-bold text-purple-200">Total Tonase</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-300">{totalBeratAccumulated.toFixed(1)} kg</p>
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

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('laporan')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'laporan'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <FileText className="w-4 h-4" /> Kelola Laporan ({laporanList.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Users className="w-4 h-4" /> User & Role ({userList.length})
        </button>
        <button
          onClick={() => setActiveTab('jenis')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'jenis'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Boxes className="w-4 h-4" /> Master Jenis Sampah ({jenisList.length})
        </button>
        <button
          onClick={() => setActiveTab('wilayah')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'wilayah'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <MapPin className="w-4 h-4" /> Master Wilayah ({wilayahList.length})
        </button>
        <button
          onClick={() => setActiveTab('jadwal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'jadwal'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-400" /> Jadwal Wilayah ({jadwalList.length})
        </button>
        <button
          onClick={() => setActiveTab('transaksi')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'transaksi'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Ticket className="w-4 h-4 text-amber-400" /> Transaksi Reward ({transaksiList.length})
        </button>
      </div>

      {/* TAB 1: KELOLA & ASSIGN LAPORAN */}
      {activeTab === 'laporan' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Daftar Semua Laporan & Penugasan Petugas</h2>
            <p className="text-xs text-zinc-500 mt-1">Assign petugas kurir ke laporan PENDING dan pantau penjemputan</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Warga & Wilayah</th>
                  <th className="py-3 px-4">Foto (FK)</th>
                  <th className="py-3 px-4">Jenis & Berat</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Penugasan Petugas</th>
                  <th className="py-3 px-4 text-right">Poin Cair</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-medium">
                {laporanList.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-4">
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">{item.user.nama}</p>
                      <p className="text-zinc-500 text-[11px]">{item.wilayah.namaWilayah}</p>
                    </td>
                    <td className="py-3 px-4">
                      {(item.fotoUrl || item.fotoSampah?.fotoUrl) ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
                          <img src={item.fotoUrl || item.fotoSampah?.fotoUrl || ''} alt="Foto Sampah" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <span className="text-[10px] text-zinc-400">Tidak ada</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-zinc-800 dark:text-zinc-200">{item.jenisSampah.namaJenis}</p>
                      <p className="text-zinc-500 text-[11px]">{item.berat} kg (Aktual: {item.beratAktual ?? '-'} kg)</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-zinc-100 dark:bg-zinc-800">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={item.petugasId || ''}
                        onChange={(e) => handleAssignPetugas(item.id, e.target.value)}
                        className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs font-medium outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">-- Pilih Petugas Kurir --</option>
                        {petugasUsers.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nama} ({p.email})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-amber-500">
                      +{item.poinDiperoleh} Poin
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: USER & ROLE MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">User & Role Management</h2>
            <p className="text-xs text-zinc-500 mt-1">Ubah role pengguna menjadi Warga, Petugas, atau Admin</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Nama User</th>
                  <th className="py-3 px-4">Kontak (Email / HP)</th>
                  <th className="py-3 px-4">NIK</th>
                  <th className="py-3 px-4">Saldo Poin</th>
                  <th className="py-3 px-4">Role Akses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-medium">
                {userList.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">{u.nama}</td>
                    <td className="py-3 px-4 text-zinc-500">
                      <p>{u.email}</p>
                      <p className="text-[11px] text-zinc-400">{u.noHp}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-600 dark:text-zinc-400">{u.nik}</td>
                    <td className="py-3 px-4 font-bold text-amber-500">{u.poin.toLocaleString('id-ID')} Poin</td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 font-bold text-xs outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="WARGA">WARGA</option>
                        <option value="PETUGAS">PETUGAS</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MASTER JENIS SAMPAH */}
      {activeTab === 'jenis' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Master Jenis Sampah & Rate Poin</h2>
              <p className="text-xs text-zinc-500 mt-1">Atur kategori sampah daur ulang dan imbalan poin per kg</p>
            </div>
            <button
              onClick={() => {
                setJenisFormId(null);
                setNamaJenisInput('');
                setDeskripsiJenisInput('');
                setPoinPerKgInput('500');
                setShowJenisModal(true);
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-purple-600/20"
            >
              <Plus className="w-4 h-4" /> Tambah Jenis Sampah
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {jenisList.map((j) => (
              <div key={j.id} className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100">{j.namaJenis}</h4>
                  <p className="text-xs text-zinc-500 mt-1">{j.deskripsi || 'Tidak ada deskripsi'}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-zinc-200/60 dark:border-zinc-800">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
                    +{j.poinPerKg} pt/kg
                  </span>
                  <button
                    onClick={() => {
                      setJenisFormId(j.id);
                      setNamaJenisInput(j.namaJenis);
                      setDeskripsiJenisInput(j.deskripsi || '');
                      setPoinPerKgInput(String(j.poinPerKg));
                      setShowJenisModal(true);
                    }}
                    className="p-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-purple-500 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MASTER WILAYAH */}
      {activeTab === 'wilayah' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Master Wilayah Operasional</h2>
              <p className="text-xs text-zinc-500 mt-1">Daftar wilayah/kecamatan cakupan kurir penjemputan</p>
            </div>
            <button
              onClick={() => {
                setWilayahFormId(null);
                setNamaWilayahInput('');
                setKodeWilayahInput('');
                setShowWilayahModal(true);
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-purple-600/20"
            >
              <Plus className="w-4 h-4" /> Tambah Wilayah Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {wilayahList.map((w) => (
              <div key={w.id} className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{w.namaWilayah}</h4>
                  <p className="text-xs font-mono text-zinc-400 mt-0.5">{w.kodeWilayah || '-'}</p>
                </div>
                <button
                  onClick={() => {
                    setWilayahFormId(w.id);
                    setNamaWilayahInput(w.namaWilayah);
                    setKodeWilayahInput(w.kodeWilayah || '');
                    setShowWilayahModal(true);
                  }}
                  className="p-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-purple-500 hover:text-white transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: JADWAL WILAYAH (Table: JadwalWilayah) */}
      {activeTab === 'jadwal' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" /> Jadwal Operasional Rutin Per Wilayah
              </h2>
              <p className="text-xs text-zinc-500 mt-1">Konfigurasi hari & jam penjemputan rutin untuk masing-masing kecamatan</p>
            </div>
            <button
              onClick={() => {
                if (wilayahList.length > 0) setJadwalWilayahIdInput(wilayahList[0].id);
                setShowJadwalModal(true);
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-purple-600/20"
            >
              <Plus className="w-4 h-4" /> Tambah Jadwal Wilayah
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Wilayah</th>
                  <th className="py-3 px-4">Hari Operasional</th>
                  <th className="py-3 px-4">Jam Penjemputan</th>
                  <th className="py-3 px-4">Kuota Maksimal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-medium">
                {jadwalList.map((j) => (
                  <tr key={j.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">{j.wilayah?.namaWilayah}</td>
                    <td className="py-3 px-4 font-semibold text-purple-600 dark:text-purple-400">{j.hari}</td>
                    <td className="py-3 px-4">{j.jamMulai} - {j.jamSelesai} WIB</td>
                    <td className="py-3 px-4 font-bold">{j.kuotaMaks} Laporan / Hari</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: KELOLA TRANSAKSI REWARD (Table: TransaksiReward) */}
      {activeTab === 'transaksi' && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-amber-500" /> Transaksi Penukaran Reward Poin
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Daftar klaim voucher/sembako oleh warga dan status pengirimannya</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">User Warga</th>
                  <th className="py-3 px-4">Nama Reward</th>
                  <th className="py-3 px-4">Kode Kupon / No HP</th>
                  <th className="py-3 px-4">Biaya Poin</th>
                  <th className="py-3 px-4">Status Pengiriman</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-medium">
                {transaksiList.map((t) => (
                  <tr key={t.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-4">
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">{t.user?.nama}</p>
                      <p className="text-zinc-500 text-[11px]">{t.user?.email}</p>
                    </td>
                    <td className="py-3 px-4 font-semibold">{t.reward.namaReward}</td>
                    <td className="py-3 px-4">
                      <p className="font-mono text-purple-600 dark:text-purple-400">{t.kodeKupon || '-'}</p>
                      <p className="text-[11px] text-zinc-400">Target: {t.noHpTujuan}</p>
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-500">-{t.biayaPoin} Poin</td>
                    <td className="py-3 px-4">
                      <select
                        value={t.status}
                        onChange={(e) => handleUpdateTxStatus(t.id, e.target.value)}
                        className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 font-bold text-xs outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSED">DIPROSES</option>
                        <option value="DONE">DONE (Selesai)</option>
                        <option value="CANCELLED">BATAL</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL JENIS SAMPAH */}
      {showJenisModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {jenisFormId ? 'Edit Jenis Sampah' : 'Tambah Jenis Sampah Baru'}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">Konfigurasi imbalan poin per kg</p>
            </div>

            <form onSubmit={handleSaveJenis} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Nama Jenis Sampah</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Plastik PET"
                  value={namaJenisInput}
                  onChange={(e) => setNamaJenisInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Poin Per Kg</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Contoh: 500"
                  value={poinPerKgInput}
                  onChange={(e) => setPoinPerKgInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Deskripsi</label>
                <textarea
                  rows={2}
                  placeholder="Deskripsi singkat jenis sampah"
                  value={deskripsiJenisInput}
                  onChange={(e) => setDeskripsiJenisInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJenisModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL WILAYAH */}
      {showWilayahModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {wilayahFormId ? 'Edit Wilayah' : 'Tambah Wilayah Baru'}
              </h3>
            </div>

            <form onSubmit={handleSaveWilayah} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Nama Wilayah / Kecamatan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kecamatan Bekasi Timur"
                  value={namaWilayahInput}
                  onChange={(e) => setNamaWilayahInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Kode Wilayah (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: BKS-TMR"
                  value={kodeWilayahInput}
                  onChange={(e) => setKodeWilayahInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWilayahModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL JADWAL WILAYAH (Table: JadwalWilayah) */}
      {showJadwalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Tambah / Update Jadwal Wilayah</h3>
              <p className="text-xs text-zinc-500 mt-1">Tetapkan hari & jam operasional rutin per kecamatan</p>
            </div>

            <form onSubmit={handleSaveJadwal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Pilih Wilayah</label>
                <select
                  value={jadwalWilayahIdInput}
                  onChange={(e) => setJadwalWilayahIdInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {wilayahList.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.namaWilayah}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Hari Operasional</label>
                <select
                  value={hariInput}
                  onChange={(e) => setHariInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Jam Mulai</label>
                  <input
                    type="text"
                    required
                    placeholder="08:00"
                    value={jamMulaiInput}
                    onChange={(e) => setJamMulaiInput(e.target.value)}
                    className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Jam Selesai</label>
                  <input
                    type="text"
                    required
                    placeholder="12:00"
                    value={jamSelesaiInput}
                    onChange={(e) => setJamSelesaiInput(e.target.value)}
                    className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs font-semibold outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Kuota Maksimal Laporan</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={kuotaMaksInput}
                  onChange={(e) => setKuotaMaksInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJadwalModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
