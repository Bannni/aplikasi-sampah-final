import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout berhasil' });
  response.cookies.set('user_session', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  return response;
}
