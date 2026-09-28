import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    if (user.password !== password) {
      return NextResponse.json({ error: 'Password yang Anda masukkan salah' }, { status: 401 });
    }

    const sessionPayload = {
      id: user.id,
      nama: user.nama,
      email: user.email,
      noHp: user.noHp,
      nik: user.nik,
      role: user.role,
      poin: user.poin,
    };

    const response = NextResponse.json({
      message: 'Login berhasil',
      user: sessionPayload,
    });

    // Set HTTP-only Cookie for session
    response.cookies.set('user_session', encodeURIComponent(JSON.stringify(sessionPayload)), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server saat login' }, { status: 500 });
  }
}
