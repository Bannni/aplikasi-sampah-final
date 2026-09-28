import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('user_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }

    const payload = JSON.parse(decodeURIComponent(sessionCookie));
    if (!payload?.id) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        nama: true,
        email: true,
        noHp: true,
        nik: true,
        role: true,
        poin: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching current user session:', error);
    return NextResponse.json({ user: null });
  }
}
