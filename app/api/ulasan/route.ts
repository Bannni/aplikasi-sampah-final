import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const petugasId = searchParams.get('petugasId');
    const laporanId = searchParams.get('laporanId');

    const whereClause: Record<string, any> = {};
    if (petugasId) whereClause.petugasId = petugasId;
    if (laporanId) whereClause.laporanId = laporanId;

    const ulasanList = await prisma.ulasanPenjemputan.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, nama: true } },
        petugas: { select: { id: true, nama: true } },
        laporan: { select: { id: true, jenisSampah: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate average rating if petugasId is provided
    let avgRating = 0;
    if (petugasId && ulasanList.length > 0) {
      const sum = ulasanList.reduce((acc, curr) => acc + curr.rating, 0);
      avgRating = Number((sum / ulasanList.length).toFixed(1));
    }

    return NextResponse.json({ ulasanList, avgRating, totalUlasan: ulasanList.length });
  } catch (error) {
    console.error('Error fetching ulasan:', error);
    return NextResponse.json({ error: 'Gagal mengambil ulasan' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { laporanId, userId, rating, komentar } = await req.json();

    if (!laporanId || !userId || !rating) {
      return NextResponse.json({ error: 'Laporan ID, User ID, dan Rating wajib diisi' }, { status: 400 });
    }

    const ratingNum = parseInt(rating);
    if (ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ error: 'Rating harus antara 1 sampai 5 bintang' }, { status: 400 });
    }

    const laporan = await prisma.laporanSampah.findUnique({
      where: { id: laporanId },
    });

    if (!laporan) {
      return NextResponse.json({ error: 'Laporan tidak ditemukan' }, { status: 404 });
    }

    if (laporan.status !== 'DONE') {
      return NextResponse.json({ error: 'Ulasan hanya dapat diberikan untuk penjemputan yang sudah selesai' }, { status: 400 });
    }

    if (!laporan.petugasId) {
      return NextResponse.json({ error: 'Petugas penjemput tidak terdaftar' }, { status: 400 });
    }

    // Check if ulasan already exists for this laporanId
    const existingUlasan = await prisma.ulasanPenjemputan.findUnique({
      where: { laporanId },
    });

    if (existingUlasan) {
      return NextResponse.json({ error: 'Ulasan untuk laporan ini sudah pernah dikirim' }, { status: 400 });
    }

    // Create UlasanPenjemputan (One-to-One Foreign Key relation with LaporanSampah)
    const ulasan = await prisma.ulasanPenjemputan.create({
      data: {
        laporanId,
        userId,
        petugasId: laporan.petugasId,
        rating: ratingNum,
        komentar: komentar || null,
      },
    });

    // Send notification to Petugas
    await prisma.notifikasi.create({
      data: {
        userId: laporan.petugasId,
        laporanId: laporan.id,
        judul: 'Ulasan Baru Diterima',
        pesan: `Warga memberikan rating ${ratingNum} bintang untuk penjemputan sampah.`,
      },
    });

    return NextResponse.json({ message: 'Ulasan berhasil dikirim. Terima kasih!', ulasan });
  } catch (error) {
    console.error('Error submitting ulasan:', error);
    return NextResponse.json({ error: 'Gagal mengirim ulasan' }, { status: 500 });
  }
}
