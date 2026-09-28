'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/SessionContext';
import {
  Recycle,
  UserCheck,
  Truck,
  Mail,
  Lock,
  User,
  Phone,
  CreditCard,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { UserRole } from '@/lib/types';

export default function RegisterPage() {
  const router = useRouter();
  const { setCurrentUser } = useSession();

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [noHp, setNoHp] = useState('');
  const [nik, setNik] = useState('');
  const [role, setRole] = useState<UserRole>('WARGA');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama,
          email,
          password,
          noHp,
          nik,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Gagal mendaftar.');
      } else {
        setCurrentUser(data.user);
        if (data.user.role === 'PETUGAS') router.push('/petugas');
        else router.push('/warga');
        router.refresh();
      }
    } catch (err) {
      setErrorMessage('Terjadi kesalahan jaringan saat mendaftar.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-500/20">
            <Recycle className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Buat Akun Baru
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Bergabung dengan ekosistem digital daur ulang SampahKita
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Role Selection Tabs (Only Warga & Petugas) */}
            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 mb-2">
                Pilih Tipe Akun
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('WARGA')}
                  className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                    role === 'WARGA'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <UserCheck className="w-5 h-5" />
                  <span>Daftar Akun Warga</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('PETUGAS')}
                  className={`p-3 rounded-2xl border text-center text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                    role === 'PETUGAS'
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <Truck className="w-5 h-5" />
                  <span>Daftar Akun Petugas</span>
                </button>
              </div>
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Budi Rahardjo"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full p-3.5 pl-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-4" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="budi@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3.5 pl-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-4" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 mb-1.5">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3.5 pl-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-4" />
              </div>
            </div>

            {/* No HP & NIK */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 mb-1.5">
                  No. HP / WA
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="08123456789"
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value)}
                    className="w-full p-3.5 pl-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-4" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 mb-1.5">
                  NIK KTP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="327501..."
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    className="w-full p-3.5 pl-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <CreditCard className="w-4 h-4 text-zinc-400 absolute left-3.5 top-4" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-zinc-500">
          Sudah memiliki akun?{' '}
          <Link href="/login" className="font-bold text-emerald-600 hover:underline">
            Masuk Sekarang
          </Link>
        </p>
      </div>
    </main>
  );
}
