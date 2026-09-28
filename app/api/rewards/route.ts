import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const rewards = await prisma.rewardCatalog.findMany({
      orderBy: { biayaPoin: 'asc' },
    });
    return NextResponse.json(rewards);
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return NextResponse.json({ error: 'Gagal mengambil data reward' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, rewardId } = body;

    if (!userId || !rewardId) {
      return NextResponse.json({ error: 'User ID dan Reward ID wajib diisi' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const reward = await prisma.rewardCatalog.findUnique({ where: { id: rewardId } });

    if (!user || !reward) {
      return NextResponse.json({ error: 'Data user atau reward tidak ditemukan' }, { status: 404 });
    }

    if (user.poin < reward.biayaPoin) {
      return NextResponse.json({ error: 'Poin Anda tidak mencukupi untuk penukaran ini' }, { status: 400 });
    }

    if (reward.stok <= 0) {
      return NextResponse.json({ error: 'Stok reward ini sudah habis' }, { status: 400 });
    }

    // Deduct user points & update stock
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { poin: user.poin - reward.biayaPoin },
    });

    await prisma.rewardCatalog.update({
      where: { id: rewardId },
      data: { stok: reward.stok - 1 },
    });

    return NextResponse.json({
      message: `Berhasil menukarkan ${reward.namaReward}! Poin tersisa: ${updatedUser.poin}`,
      poin: updatedUser.poin,
    });
  } catch (error) {
    console.error('Error redeeming reward:', error);
    return NextResponse.json({ error: 'Gagal melakukan penukaran reward' }, { status: 500 });
  }
}
