export type UserRole = 'WARGA' | 'PETUGAS' | 'ADMIN';

export interface UserSession {
  id: string;
  nama: string;
  email: string;
  noHp: string;
  nik: string;
  role: UserRole;
  poin: number;
}

export interface JenisSampahItem {
  id: string;
  namaJenis: string;
  deskripsi?: string | null;
  poinPerKg: number;
  icon: string;
}

export interface WilayahItem {
  id: string;
  namaWilayah: string;
  kodeWilayah?: string | null;
}

export interface FotoSampahItem {
  id: string;
  fotoUrl: string;
  laporanId: string;
  createdAt: string;
}

export interface UlasanItem {
  id: string;
  rating: number;
  komentar?: string | null;
  laporanId: string;
  userId: string;
  petugasId: string;
  createdAt: string;
  user?: {
    id: string;
    nama: string;
  };
  petugas?: {
    id: string;
    nama: string;
  };
}

export interface LaporanSampahItem {
  id: string;
  berat: number;
  beratAktual?: number | null;
  tanggalLapor: string;
  tanggalSelesai?: string | null;
  deskripsi?: string | null;
  catatanPetugas?: string | null;
  fotoUrl?: string | null;
  poinDiperoleh: number;
  status: 'PENDING' | 'VERIFIED' | 'PROCESSED' | 'DONE' | 'CANCELLED';
  alamatLengkap?: string | null;
  userId: string;
  petugasId?: string | null;
  jenisSampahId: string;
  wilayahId: string;
  user: {
    id: string;
    nama: string;
    email: string;
    noHp: string;
  };
  petugas?: {
    id: string;
    nama: string;
    noHp: string;
  } | null;
  jenisSampah: JenisSampahItem;
  wilayah: WilayahItem;
  fotoSampah?: FotoSampahItem | null;
  ulasan?: UlasanItem | null;
}

export interface RewardItem {
  id: string;
  namaReward: string;
  deskripsi: string;
  biayaPoin: number;
  kategori: string;
  stok: number;
  imageUrl?: string | null;
}

export interface TransaksiRewardItem {
  id: string;
  kodeKupon?: string | null;
  noHpTujuan?: string | null;
  biayaPoin: number;
  status: 'PENDING' | 'PROCESSED' | 'DONE' | 'CANCELLED';
  createdAt: string;
  userId: string;
  rewardId: string;
  reward: RewardItem;
  user?: {
    id: string;
    nama: string;
    email: string;
    noHp: string;
  };
}

export interface JadwalWilayahItem {
  id: string;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  kuotaMaks: number;
  wilayahId: string;
  wilayah?: WilayahItem;
}

export interface NotifikasiItem {
  id: string;
  judul: string;
  pesan: string;
  isRead: boolean;
  createdAt: string;
  userId: string;
  laporanId?: string | null;
}
