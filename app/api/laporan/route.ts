import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const petugasId = searchParams.get('petugasId');
    const status = searchParams.get('status');
    const wilayahId = searchParams.get('wilayahId');

    const whereClause: Record<string, any> = {};

    if (userId) whereClause.userId = userId;
    if (petugasId) whereClause.petugasId = petugasId;
    if (status && status !== 'ALL') whereClause.status = status;
    if (wilayahId) whereClause.wilayahId = wilayahId;

    const laporanList = await prisma.laporanSampah.findMany({
      where: whereClause,
      include: {
        user: {
          select: { id: true, nama: true, email: true, noHp: true },
        },
        petugas: {
          select: { id: true, nama: true, noHp: true },
        },
        jenisSampah: true,
        wilayah: true,
        fotoSampah: true,
        ulasan: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(laporanList);
  } catch (error) {
    console.error('Error fetching laporan:', error);
    return NextResponse.json({ error: 'Gagal mengambil data laporan' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, jenisSampahId, wilayahId, berat, deskripsi, alamatLengkap, fotoUrl } = body;

    if (!userId || !jenisSampahId || !wilayahId || !berat) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }

    const beratNum = parseFloat(berat);
    if (isNaN(beratNum) || beratNum <= 0) {
      return NextResponse.json({ error: 'Berat sampah harus lebih dari 0 kg' }, { status: 400 });
    }

    // Create LaporanSampah and FotoSampah One-to-One relation
    const laporan = await prisma.laporanSampah.create({
      data: {
        userId,
        jenisSampahId,
        wilayahId,
        berat: beratNum,
        deskripsi: deskripsi || null,
        alamatLengkap: alamatLengkap || null,
        fotoUrl: fotoUrl || null,
        status: 'PENDING',
        fotoSampah: fotoUrl
          ? {
              create: {
                fotoUrl,
              },
            }
          : undefined,
      },
      include: {
        user: true,
        jenisSampah: true,
        wilayah: true,
        fotoSampah: true,
      },
    });

    // Create Notifikasi for User
    await prisma.notifikasi.create({
      data: {
        userId,
        laporanId: laporan.id,
        judul: 'Laporan Berhasil Dibuat',
        pesan: `Laporan penjemputan ${laporan.jenisSampah.namaJenis} (${beratNum}kg) berhasil dibuat. Menunggu penugasan kurir.`,
      },
    });

    return NextResponse.json({ message: 'Laporan sampah berhasil dibuat', laporan });
  } catch (error) {
    console.error('Error creating laporan:', error);
    return NextResponse.json({ error: 'Gagal membuat laporan' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, petugasId, beratAktual, catatanPetugas } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID Laporan wajib disertakan' }, { status: 400 });
    }

    const existingLaporan = await prisma.laporanSampah.findUnique({
      where: { id },
      include: { jenisSampah: true },
    });

    if (!existingLaporan) {
      return NextResponse.json({ error: 'Laporan tidak ditemukan' }, { status: 404 });
    }

    const updateData: Record<string, any> = {};

    if (status) updateData.status = status;
    if (petugasId !== undefined) updateData.petugasId = petugasId;
    if (catatanPetugas !== undefined) updateData.catatanPetugas = catatanPetugas;

    if (beratAktual !== undefined && beratAktual !== null) {
      const bAktual = parseFloat(beratAktual);
      if (!isNaN(bAktual) && bAktual > 0) {
        updateData.beratAktual = bAktual;
      }
    }

    // Direct calculation of points when report status becomes DONE
    if (status === 'DONE') {
      updateData.tanggalSelesai = new Date();
      
      const finalBerat = updateData.beratAktual ?? existingLaporan.beratAktual ?? existingLaporan.berat;
      const poinPerKg = existingLaporan.jenisSampah.poinPerKg || 100;
      const calculatedPoints = Math.round(finalBerat * poinPerKg);

      updateData.poinDiperoleh = calculatedPoints;

      // Increment points for the user
      await prisma.user.update({
        where: { id: existingLaporan.userId },
        data: {
          poin: { increment: calculatedPoints },
        },
      });

      // Send completion notification to User
      await prisma.notifikasi.create({
        data: {
          userId: existingLaporan.userId,
          laporanId: existingLaporan.id,
          judul: 'Penjemputan Sampah Selesai',
          pesan: `Penjemputan ${existingLaporan.jenisSampah.namaJenis} selesai. Poin sebesar +${calculatedPoints} telah ditambahkan ke akun Anda!`,
        },
      });
    }

    // Send assignment notification to Petugas if assigned
    if (petugasId && petugasId !== existingLaporan.petugasId) {
      await prisma.notifikasi.create({
        data: {
          userId: petugasId,
          laporanId: existingLaporan.id,
          judul: 'Tugas Penjemputan Baru',
          pesan: `Anda telah ditugaskan untuk mengambil sampah ${existingLaporan.jenisSampah.namaJenis}.`,
        },
      });
    }

    const updatedLaporan = await prisma.laporanSampah.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        petugas: true,
        jenisSampah: true,
        wilayah: true,
        fotoSampah: true,
        ulasan: true,
      },
    });

    return NextResponse.json({ message: 'Status laporan diperbarui', laporan: updatedLaporan });
  } catch (error) {
    console.error('Error updating laporan:', error);
    return NextResponse.json({ error: 'Gagal merubah status laporan' }, { status: 500 });
  }
}
