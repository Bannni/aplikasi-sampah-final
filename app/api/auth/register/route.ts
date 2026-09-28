import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const { nama, email, password, noHp, nik, role } = await req.json();

    if (!nama || !email || !password || !noHp || !nik) {
      return NextResponse.json({ error: 'Semua kolom registrasi wajib diisi' }, { status: 400 });
    }

    // Check if email, noHp, or nik exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { noHp }, { nik }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Email, Nomor HP, atau NIK sudah terdaftar sebelumnya' },
        { status: 400 }
      );
    }

    const assignedRole: Role = role === 'ADMIN' ? 'ADMIN' : role === 'PETUGAS' ? 'PETUGAS' : 'WARGA';

    const newUser = await prisma.user.create({
      data: {
        nama,
        email,
        password,
        noHp,
        nik,
        role: assignedRole,
        poin: 0,
      },
    });

    const sessionPayload = {
      id: newUser.id,
      nama: newUser.nama,
      email: newUser.email,
      noHp: newUser.noHp,
      nik: newUser.nik,
      role: newUser.role,
      poin: newUser.poin,
    };

    const response = NextResponse.json({
      message: 'Registrasi berhasil',
      user: sessionPayload,
    });

    // Set HTTP-only Cookie for session
    response.cookies.set('user_session', encodeURIComponent(JSON.stringify(sessionPayload)), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server saat registrasi' }, { status: 500 });
  }
}
