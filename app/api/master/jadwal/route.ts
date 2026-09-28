import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const wilayahId = searchParams.get('wilayahId');

    const whereClause: Record<string, any> = {};
    if (wilayahId) whereClause.wilayahId = wilayahId;

    const jadwalList = await prisma.jadwalWilayah.findMany({
      where: whereClause,
      include: {
        wilayah: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(jadwalList);
  } catch (error) {
    console.error('Error fetching jadwal wilayah:', error);
    return NextResponse.json({ error: 'Gagal mengambil data jadwal wilayah' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { wilayahId, hari, jamMulai, jamSelesai, kuotaMaks } = await req.json();

    if (!wilayahId || !hari || !jamMulai || !jamSelesai) {
      return NextResponse.json({ error: 'Semua kolom jadwal wajib diisi' }, { status: 400 });
    }

    const jadwal = await prisma.jadwalWilayah.upsert({
      where: {
        wilayahId_hari: { wilayahId, hari },
      },
      update: {
        jamMulai,
        jamSelesai,
        kuotaMaks: parseInt(kuotaMaks) || 50,
      },
      create: {
        wilayahId,
        hari,
        jamMulai,
        jamSelesai,
        kuotaMaks: parseInt(kuotaMaks) || 50,
      },
      include: { wilayah: true },
    });

    return NextResponse.json({ message: 'Jadwal wilayah berhasil disimpan', data: jadwal });
  } catch (error) {
    console.error('Error saving jadwal wilayah:', error);
    return NextResponse.json({ error: 'Gagal menyimpan jadwal wilayah' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID Jadwal wajib disertakan' }, { status: 400 });
    }

    await prisma.jadwalWilayah.delete({ where: { id } });

    return NextResponse.json({ message: 'Jadwal wilayah berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting jadwal wilayah:', error);
    return NextResponse.json({ error: 'Gagal menghapus jadwal' }, { status: 500 });
  }
}
