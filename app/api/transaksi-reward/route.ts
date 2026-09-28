import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    const whereClause: Record<string, any> = {};
    if (userId) whereClause.userId = userId;
    if (status && status !== 'ALL') whereClause.status = status;

    const list = await prisma.transaksiReward.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, nama: true, email: true, noHp: true } },
        reward: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(list);
  } catch (error) {
    console.error('Error fetching transaksi reward:', error);
    return NextResponse.json({ error: 'Gagal mengambil data transaksi reward' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, rewardId, noHpTujuan } = await req.json();

    if (!userId || !rewardId) {
      return NextResponse.json({ error: 'User ID dan Reward ID wajib diisi' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const reward = await prisma.rewardCatalog.findUnique({ where: { id: rewardId } });

    if (!user || !reward) {
      return NextResponse.json({ error: 'Data user atau reward tidak ditemukan' }, { status: 404 });
    }

    if (user.poin < reward.biayaPoin) {
      return NextResponse.json({ error: 'Saldo poin Anda tidak mencukupi' }, { status: 400 });
    }

    if (reward.stok <= 0) {
      return NextResponse.json({ error: 'Stok reward ini telah habis' }, { status: 400 });
    }

    // Generate unique coupon code
    const kodeKupon = `${reward.kategori.slice(0, 3)}-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Deduct user points & update stock
    await prisma.user.update({
      where: { id: userId },
      data: { poin: user.poin - reward.biayaPoin },
    });

    await prisma.rewardCatalog.update({
      where: { id: rewardId },
      data: { stok: reward.stok - 1 },
    });

    // Create TransaksiReward record
    const transaksi = await prisma.transaksiReward.create({
      data: {
        userId,
        rewardId,
        biayaPoin: reward.biayaPoin,
        noHpTujuan: noHpTujuan || user.noHp,
        kodeKupon,
        status: 'DONE',
      },
      include: {
        reward: true,
      },
    });

    // Create Notifikasi for User
    await prisma.notifikasi.create({
      data: {
        userId,
        judul: 'Penukaran Reward Berhasil',
        pesan: `Selamat! Penukaran ${reward.namaReward} berhasil. Kode Kupon: ${kodeKupon}`,
      },
    });

    return NextResponse.json({
      message: `Penukaran ${reward.namaReward} berhasil!`,
      transaksi,
    });
  } catch (error) {
    console.error('Error creating transaksi reward:', error);
    return NextResponse.json({ error: 'Gagal memproses penukaran reward' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'ID Transaksi dan status wajib diisi' }, { status: 400 });
    }

    const updated = await prisma.transaksiReward.update({
      where: { id },
      data: { status },
      include: { reward: true },
    });

    // Send notification
    await prisma.notifikasi.create({
      data: {
        userId: updated.userId,
        judul: 'Status Transaksi Reward Diperbarui',
        pesan: `Status penukaran ${updated.reward.namaReward} diubah menjadi: ${status}`,
      },
    });

    return NextResponse.json({ message: 'Status transaksi reward berhasil diperbarui', data: updated });
  } catch (error) {
    console.error('Error updating transaksi reward status:', error);
    return NextResponse.json({ error: 'Gagal memperbarui status transaksi' }, { status: 500 });
  }
}
