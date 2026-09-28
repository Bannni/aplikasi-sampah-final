import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const list = await prisma.wilayah.findMany({
      orderBy: { namaWilayah: 'asc' },
    });
    return NextResponse.json(list);
  } catch (error) {
    console.error('Error fetching wilayah:', error);
    return NextResponse.json({ error: 'Gagal mengambil data wilayah' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { namaWilayah, kodeWilayah } = body;

    if (!namaWilayah) {
      return NextResponse.json({ error: 'Nama Wilayah wajib diisi' }, { status: 400 });
    }

    const newItem = await prisma.wilayah.create({
      data: {
        namaWilayah,
        kodeWilayah: kodeWilayah || null,
      },
    });

    return NextResponse.json({ message: 'Wilayah berhasil ditambahkan', data: newItem });
  } catch (error) {
    console.error('Error adding wilayah:', error);
    return NextResponse.json({ error: 'Gagal menambahkan wilayah' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, namaWilayah, kodeWilayah } = body;

    if (!id || !namaWilayah) {
      return NextResponse.json({ error: 'ID dan nama wilayah wajib diisi' }, { status: 400 });
    }

    const updated = await prisma.wilayah.update({
      where: { id },
      data: {
        namaWilayah,
        kodeWilayah: kodeWilayah || null,
      },
    });

    return NextResponse.json({ message: 'Wilayah diperbarui', data: updated });
  } catch (error) {
    console.error('Error updating wilayah:', error);
    return NextResponse.json({ error: 'Gagal memperbarui wilayah' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 });
    }

    await prisma.wilayah.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Wilayah berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting wilayah:', error);
    return NextResponse.json({ error: 'Gagal menghapus wilayah (Mungkin sedang digunakan)' }, { status: 400 });
  }
}
