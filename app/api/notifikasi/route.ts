import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID wajib disertakan' }, { status: 400 });
    }

    const notifikasiList = await prisma.notifikasi.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const unreadCount = await prisma.notifikasi.count({
      where: { userId, isRead: false },
    });

    return NextResponse.json({ notifikasiList, unreadCount });
  } catch (error) {
    console.error('Error fetching notifikasi:', error);
    return NextResponse.json({ error: 'Gagal mengambil notifikasi' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, userId, markAll } = await req.json();

    if (markAll && userId) {
      await prisma.notifikasi.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ message: 'Semua notifikasi ditandai sudah dibaca' });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID Notifikasi wajib diisi' }, { status: 400 });
    }

    const updated = await prisma.notifikasi.update({
      where: { id },
      data: { isRead: true },
    });

    return NextResponse.json({ message: 'Notifikasi dibaca', data: updated });
  } catch (error) {
    console.error('Error updating notifikasi:', error);
    return NextResponse.json({ error: 'Gagal memperbarui notifikasi' }, { status: 500 });
  }
}
