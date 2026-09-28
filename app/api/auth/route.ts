import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nama: true,
        email: true,
        noHp: true,
        nik: true,
        role: true,
        poin: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Gagal mengambil data user' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, password, nama, noHp, nik, role } = body;

    if (action === 'REGISTER') {
      if (!email || !nama || !noHp || !nik) {
        return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { noHp }, { nik }],
        },
      });

      if (existingUser) {
        return NextResponse.json({ error: 'Email, No HP, atau NIK sudah terdaftar' }, { status: 400 });
      }

      const user = await prisma.user.create({
        data: {
          nama,
          email,
          noHp,
          nik,
          password: password || '123456',
          role: role || 'WARGA',
        },
      });

      return NextResponse.json({ message: 'Registrasi berhasil', user });
    }

    // LOGIN
    if (!email) {
      return NextResponse.json({ error: 'Email wajib diisi' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    if (password && user.password !== password) {
      return NextResponse.json({ error: 'Password salah' }, { status: 401 });
    }

    return NextResponse.json({
      message: 'Login berhasil',
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        noHp: user.noHp,
        nik: user.nik,
        role: user.role,
        poin: user.poin,
      },
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
