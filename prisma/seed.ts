import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with expanded 5-table relational schema...');

  // 1. Seed Wilayah
  const wilayahBekasiTimur = await prisma.wilayah.upsert({
    where: { namaWilayah: 'Kecamatan Bekasi Timur' },
    update: {},
    create: {
      namaWilayah: 'Kecamatan Bekasi Timur',
      kodeWilayah: 'BKS-TMR-01',
    },
  });

  const wilayahBekasiBarat = await prisma.wilayah.upsert({
    where: { namaWilayah: 'Kecamatan Bekasi Barat' },
    update: {},
    create: {
      namaWilayah: 'Kecamatan Bekasi Barat',
      kodeWilayah: 'BKS-BRT-02',
    },
  });

  const wilayahBekasiSelatan = await prisma.wilayah.upsert({
    where: { namaWilayah: 'Kecamatan Bekasi Selatan' },
    update: {},
    create: {
      namaWilayah: 'Kecamatan Bekasi Selatan',
      kodeWilayah: 'BKS-SLT-03',
    },
  });

  // 2. Seed Jadwal Wilayah (New Table: JadwalWilayah)
  const hariJadwal = [
    { hari: 'Senin', jamMulai: '08:00', jamSelesai: '12:00', kuotaMaks: 40 },
    { hari: 'Rabu', jamMulai: '08:00', jamSelesai: '12:00', kuotaMaks: 40 },
    { hari: 'Jumat', jamMulai: '08:00', jamSelesai: '12:00', kuotaMaks: 40 },
  ];

  for (const j of hariJadwal) {
    await prisma.jadwalWilayah.upsert({
      where: {
        wilayahId_hari: { wilayahId: wilayahBekasiTimur.id, hari: j.hari },
      },
      update: {},
      create: {
        wilayahId: wilayahBekasiTimur.id,
        hari: j.hari,
        jamMulai: j.jamMulai,
        jamSelesai: j.jamSelesai,
        kuotaMaks: j.kuotaMaks,
      },
    });
  }

  // 3. Seed Jenis Sampah
  const jenisPlastik = await prisma.jenisSampah.upsert({
    where: { namaJenis: 'Plastik (PET / HDPE)' },
    update: {},
    create: {
      namaJenis: 'Plastik (PET / HDPE)',
      deskripsi: 'Botol plastik, kemasan makanan, kantong belanja',
      poinPerKg: 500,
      icon: 'Boxes',
    },
  });

  const jenisKertas = await prisma.jenisSampah.upsert({
    where: { namaJenis: 'Kertas & Kardus' },
    update: {},
    create: {
      namaJenis: 'Kertas & Kardus',
      deskripsi: 'Kardus bekas, majalah, koran, kertas HVS',
      poinPerKg: 300,
      icon: 'FileText',
    },
  });

  const jenisLogam = await prisma.jenisSampah.upsert({
    where: { namaJenis: 'Logam & Kaleng' },
    update: {},
    create: {
      namaJenis: 'Logam & Kaleng',
      deskripsi: 'Kaleng minuman, besi tua, aluminium, tembaga',
      poinPerKg: 1200,
      icon: 'Wrench',
    },
  });

  // 4. Seed Users (Warga, Petugas, Admin)
  const userAdmin = await prisma.user.upsert({
    where: { email: 'admin@sampah.id' },
    update: {},
    create: {
      nama: 'Budi Santoso (Admin DLH)',
      email: 'admin@sampah.id',
      noHp: '081299887766',
      nik: '3275011201900001',
      role: 'ADMIN',
      password: '123',
      poin: 0,
    },
  });

  const userPetugas1 = await prisma.user.upsert({
    where: { email: 'petugas1@sampah.id' },
    update: {},
    create: {
      nama: 'Ahmad Supriatna (Kurir Timur)',
      email: 'petugas1@sampah.id',
      noHp: '081388776655',
      nik: '3275011503880002',
      role: 'PETUGAS',
      password: '123',
      poin: 0,
    },
  });

  const userWarga1 = await prisma.user.upsert({
    where: { email: 'warga@gmail.com' },
    update: {},
    create: {
      nama: 'Siti Rahmawati',
      email: 'warga@gmail.com',
      noHp: '085711223344',
      nik: '3275014506950005',
      role: 'WARGA',
      password: '123',
      poin: 4500,
    },
  });

  // 5. Seed Sample Laporan Sampah with FotoSampah (One-to-One)
  const laporanSelesai = await prisma.laporanSampah.create({
    data: {
      userId: userWarga1.id,
      jenisSampahId: jenisPlastik.id,
      wilayahId: wilayahBekasiTimur.id,
      berat: 5.0,
      beratAktual: 5.0,
      deskripsi: 'Botol mineral dan galon bekas 2 karung.',
      alamatLengkap: 'Jl. Margahayu No. 12, RT 02/05, Bekasi Timur',
      status: 'DONE',
      poinDiperoleh: 2500,
      petugasId: userPetugas1.id,
      catatanPetugas: 'Penjemputan selesai pukul 10:00 WIB, barang bersih.',
      fotoUrl: '/uploads/sample_plastik.jpg',
      fotoSampah: {
        create: {
          fotoUrl: '/uploads/sample_plastik.jpg',
        },
      },
    },
  });

  // 6. Seed UlasanPenjemputan (New Table: One-to-One with LaporanSampah)
  await prisma.ulasanPenjemputan.create({
    data: {
      laporanId: laporanSelesai.id,
      userId: userWarga1.id,
      petugasId: userPetugas1.id,
      rating: 5,
      komentar: 'Petugas mas Ahmad sangat ramah, jemputnya cepat sekali!',
    },
  });

  // 7. Seed Reward Catalog & TransaksiReward (New Table: TransaksiReward)
  const rewardDana = await prisma.rewardCatalog.create({
    data: {
      namaReward: 'Voucher E-Wallet DANA Rp 25.000',
      deskripsi: 'Tukarkan 2.500 Poin daur ulangmu menjadi saldo DANA.',
      biayaPoin: 2500,
      kategori: 'VOUCHER',
      stok: 50,
    },
  });

  await prisma.transaksiReward.create({
    data: {
      userId: userWarga1.id,
      rewardId: rewardDana.id,
      biayaPoin: 2500,
      noHpTujuan: '085711223344',
      kodeKupon: `DN25K-${Date.now()}`,
      status: 'DONE',
    },
  });

  // 8. Seed Notifikasi (New Table: Notifikasi)
  await prisma.notifikasi.createMany({
    data: [
      {
        userId: userWarga1.id,
        laporanId: laporanSelesai.id,
        judul: 'Laporan Penjemputan Selesai',
        pesan: 'Sampah Anda telah berhasil dijemput dan disetujui. Anda memperoleh +2.500 Poin!',
        isRead: false,
      },
      {
        userId: userWarga1.id,
        judul: 'Penukaran Saldo DANA Berhasil',
        pesan: 'Penukaran Voucher DANA Rp 25.000 telah sukses diproses.',
        isRead: true,
      },
    ],
  });

  console.log('Database seeding completed with all 5 new relational tables!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
