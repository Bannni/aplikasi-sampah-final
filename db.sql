-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('WARGA', 'PETUGAS', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'WARGA',
    "password" TEXT NOT NULL DEFAULT '123456',
    "poin" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jenis_sampah" (
    "id" TEXT NOT NULL,
    "namaJenis" TEXT NOT NULL,
    "deskripsi" TEXT,
    "poinPerKg" INTEGER NOT NULL DEFAULT 100,
    "icon" TEXT NOT NULL DEFAULT 'Recycle',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jenis_sampah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wilayah" (
    "id" TEXT NOT NULL,
    "namaWilayah" TEXT NOT NULL,
    "kodeWilayah" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wilayah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laporan_sampah" (
    "id" TEXT NOT NULL,
    "berat" DOUBLE PRECISION NOT NULL,
    "beratAktual" DOUBLE PRECISION,
    "tanggalLapor" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalSelesai" TIMESTAMP(3),
    "deskripsi" TEXT,
    "catatanPetugas" TEXT,
    "fotoUrl" TEXT,
    "poinDiperoleh" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "alamatLengkap" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "petugasId" TEXT,
    "jenisSampahId" TEXT NOT NULL,
    "wilayahId" TEXT NOT NULL,

    CONSTRAINT "laporan_sampah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foto_sampah" (
    "id" TEXT NOT NULL,
    "fotoUrl" TEXT NOT NULL,
    "laporanId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "foto_sampah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reward_catalog" (
    "id" TEXT NOT NULL,
    "namaReward" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "biayaPoin" INTEGER NOT NULL,
    "kategori" TEXT NOT NULL,
    "stok" INTEGER NOT NULL DEFAULT 100,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reward_catalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaksi_reward" (
    "id" TEXT NOT NULL,
    "kodeKupon" TEXT,
    "noHpTujuan" TEXT,
    "biayaPoin" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "rewardId" TEXT NOT NULL,

    CONSTRAINT "transaksi_reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ulasan_penjemputan" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "komentar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "laporanId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "petugasId" TEXT NOT NULL,

    CONSTRAINT "ulasan_penjemputan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jadwal_wilayah" (
    "id" TEXT NOT NULL,
    "hari" TEXT NOT NULL,
    "jamMulai" TEXT NOT NULL,
    "jamSelesai" TEXT NOT NULL,
    "kuotaMaks" INTEGER NOT NULL DEFAULT 50,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "wilayahId" TEXT NOT NULL,

    CONSTRAINT "jadwal_wilayah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifikasi" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "laporanId" TEXT,

    CONSTRAINT "notifikasi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_noHp_key" ON "users"("noHp");

-- CreateIndex
CREATE UNIQUE INDEX "users_nik_key" ON "users"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_noHp_key" ON "users"("email", "noHp");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_sampah_namaJenis_key" ON "jenis_sampah"("namaJenis");

-- CreateIndex
CREATE UNIQUE INDEX "wilayah_namaWilayah_key" ON "wilayah"("namaWilayah");

-- CreateIndex
CREATE UNIQUE INDEX "wilayah_kodeWilayah_key" ON "wilayah"("kodeWilayah");

-- CreateIndex
CREATE INDEX "laporan_sampah_userId_idx" ON "laporan_sampah"("userId");

-- CreateIndex
CREATE INDEX "laporan_sampah_petugasId_idx" ON "laporan_sampah"("petugasId");

-- CreateIndex
CREATE INDEX "laporan_sampah_jenisSampahId_idx" ON "laporan_sampah"("jenisSampahId");

-- CreateIndex
CREATE INDEX "laporan_sampah_wilayahId_idx" ON "laporan_sampah"("wilayahId");

-- CreateIndex
CREATE INDEX "laporan_sampah_status_idx" ON "laporan_sampah"("status");

-- CreateIndex
CREATE UNIQUE INDEX "foto_sampah_laporanId_key" ON "foto_sampah"("laporanId");

-- CreateIndex
CREATE UNIQUE INDEX "transaksi_reward_kodeKupon_key" ON "transaksi_reward"("kodeKupon");

-- CreateIndex
CREATE INDEX "transaksi_reward_userId_idx" ON "transaksi_reward"("userId");

-- CreateIndex
CREATE INDEX "transaksi_reward_rewardId_idx" ON "transaksi_reward"("rewardId");

-- CreateIndex
CREATE INDEX "transaksi_reward_status_idx" ON "transaksi_reward"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ulasan_penjemputan_laporanId_key" ON "ulasan_penjemputan"("laporanId");

-- CreateIndex
CREATE INDEX "ulasan_penjemputan_userId_idx" ON "ulasan_penjemputan"("userId");

-- CreateIndex
CREATE INDEX "ulasan_penjemputan_petugasId_idx" ON "ulasan_penjemputan"("petugasId");

-- CreateIndex
CREATE INDEX "jadwal_wilayah_wilayahId_idx" ON "jadwal_wilayah"("wilayahId");

-- CreateIndex
CREATE UNIQUE INDEX "jadwal_wilayah_wilayahId_hari_key" ON "jadwal_wilayah"("wilayahId", "hari");

-- CreateIndex
CREATE INDEX "notifikasi_userId_idx" ON "notifikasi"("userId");

-- CreateIndex
CREATE INDEX "notifikasi_isRead_idx" ON "notifikasi"("isRead");

-- AddForeignKey
ALTER TABLE "laporan_sampah" ADD CONSTRAINT "laporan_sampah_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_sampah" ADD CONSTRAINT "laporan_sampah_petugasId_fkey" FOREIGN KEY ("petugasId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_sampah" ADD CONSTRAINT "laporan_sampah_jenisSampahId_fkey" FOREIGN KEY ("jenisSampahId") REFERENCES "jenis_sampah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laporan_sampah" ADD CONSTRAINT "laporan_sampah_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES "wilayah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foto_sampah" ADD CONSTRAINT "foto_sampah_laporanId_fkey" FOREIGN KEY ("laporanId") REFERENCES "laporan_sampah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi_reward" ADD CONSTRAINT "transaksi_reward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi_reward" ADD CONSTRAINT "transaksi_reward_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "reward_catalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ulasan_penjemputan" ADD CONSTRAINT "ulasan_penjemputan_laporanId_fkey" FOREIGN KEY ("laporanId") REFERENCES "laporan_sampah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ulasan_penjemputan" ADD CONSTRAINT "ulasan_penjemputan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ulasan_penjemputan" ADD CONSTRAINT "ulasan_penjemputan_petugasId_fkey" FOREIGN KEY ("petugasId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal_wilayah" ADD CONSTRAINT "jadwal_wilayah_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES "wilayah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifikasi" ADD CONSTRAINT "notifikasi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifikasi" ADD CONSTRAINT "notifikasi_laporanId_fkey" FOREIGN KEY ("laporanId") REFERENCES "laporan_sampah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

