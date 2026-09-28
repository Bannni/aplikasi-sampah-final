import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const list = await prisma.jenisSampah.findMany({
      orderBy: { namaJenis: 'asc' },
    });
    return NextResponse.json(list);
  } catch (error) {
    console.error('Error fetching jenis sampah:', error);
    return NextResponse.json({ error: 'Gagal mengambil jenis sampah' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { namaJenis, deskripsi, poinPerKg, icon } = body;

    if (!namaJenis) {
      return NextResponse.json({ error: 'Nama Jenis Sampah wajib diisi' }, { status: 400 });
    }

    const newItem = await prisma.jenisSampah.create({
      data: {
        namaJenis,
        deskripsi: deskripsi || null,
        poinPerKg: parseInt(poinPerKg) || 100,
        icon: icon || 'Recycle',
      },
    });

    return NextResponse.json({ message: 'Jenis sampah berhasil ditambahkan', data: newItem });
  } catch (error) {
    console.error('Error adding jenis sampah:', error);
    return NextResponse.json({ error: 'Gagal menambahkan jenis sampah' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, namaJenis, deskripsi, poinPerKg, icon } = body;

    if (!id || !namaJenis) {
      return NextResponse.json({ error: 'ID dan nama jenis wajib diisi' }, { status: 400 });
    }

    const updated = await prisma.jenisSampah.update({
      where: { id },
      data: {
        namaJenis,
        deskripsi: deskripsi || null,
        poinPerKg: parseInt(poinPerKg) || 100,
        icon: icon || 'Recycle',
      },
    });

    return NextResponse.json({ message: 'Jenis sampah diperbarui', data: updated });
  } catch (error) {
    console.error('Error updating jenis sampah:', error);
    return NextResponse.json({ error: 'Gagal memperbarui jenis sampah' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 });
    }

    await prisma.jenisSampah.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Jenis sampah berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting jenis sampah:', error);
    return NextResponse.json({ error: 'Gagal menghapus jenis sampah (Mungkin digunakan dalam laporan)' }, { status: 400 });
  }
}
