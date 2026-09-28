'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from '@/components/SessionContext';
import {
  Recycle,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const { setCurrentUser } = useSession();
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput,
          password: passwordInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Gagal login.');
      } else {
        setCurrentUser(data.user);
        if (callbackUrl && callbackUrl !== '/') {
          router.push(callbackUrl);
        } else {
          if (data.user.role === 'ADMIN') router.push('/admin');
          else if (data.user.role === 'PETUGAS') router.push('/petugas');
          else router.push('/warga');
        }
        router.refresh();
      }
    } catch (err) {
      setErrorMessage('Terjadi kesalahan koneksi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-500/20">
          <Recycle className="w-8 h-8 animate-pulse" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Masuk ke SampahKita
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Sistem Manajemen Pelaporan Sampah Terpadu 3 Role
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
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 mb-1.5">
              Alamat Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full p-3.5 pl-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-4" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 mb-1.5">
              Kata Sandi (Password)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-3.5 pl-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-4" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'Memproses...' : 'Masuk Sekarang'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Footer Link to Register */}
      <p className="text-center text-xs text-zinc-500">
        Belum punya akun?{' '}
        <Link href="/register" className="font-bold text-emerald-600 hover:underline">
          Daftar Akun Baru
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-center text-sm text-zinc-500 py-12">Memuat halaman login...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
