'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from './SessionContext';
import {
  Recycle,
  UserCheck,
  ShieldCheck,
  Truck,
  Award,
  ChevronDown,
  LogOut,
  LogIn,
  UserPlus,
  Info,
  Home,
  LayoutDashboard,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, logout } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
            <ShieldCheck className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            ADMIN
          </span>
        );
      case 'PETUGAS':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
            <Truck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            PETUGAS
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <UserCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            WARGA
          </span>
        );
    }
  };

  const getPortalLink = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'ADMIN') return '/admin';
    if (currentUser.role === 'PETUGAS') return '/petugas';
    return '/warga';
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 dark:bg-zinc-950/85 border-b border-zinc-200 dark:border-zinc-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Recycle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
              SampahKita
            </span>
            <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
              Eco Management System
            </span>
          </div>
        </Link>

        {/* Center Nav Links: ONLY Beranda & Tentang Kami */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              pathname === '/'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Home className="w-4 h-4" />
            Beranda
          </Link>
          <Link
            href="/about"
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              pathname.startsWith('/about')
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Info className="w-4 h-4" />
            Tentang Kami
          </Link>
        </nav>

        {/* Right Section: Points & Profile Dropdown / Auth Buttons */}
        <div className="flex items-center gap-3">
          {/* User Points Badge if WARGA */}
          {currentUser && currentUser.role === 'WARGA' && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/30 rounded-xl text-amber-600 dark:text-amber-400 text-xs font-bold shadow-2xs">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{currentUser.poin.toLocaleString('id-ID')} Poin</span>
            </div>
          )}

          {currentUser ? (
            /* Logged-in Profile Menu */
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-emerald-500 transition-all text-left shadow-xs"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center font-bold text-xs text-emerald-700 dark:text-emerald-300">
                  {currentUser.nama.charAt(0)}
                </div>
                <div className="hidden lg:block text-xs">
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1">
                    {currentUser.nama}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {getRoleBadge(currentUser.role)}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <div
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-2 z-50 animate-in fade-in zoom-in-95"
                >
                  <div className="p-3 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="font-bold text-xs text-zinc-800 dark:text-zinc-200">{currentUser.nama}</p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{currentUser.email}</p>
                    <div className="mt-1.5">{getRoleBadge(currentUser.role)}</div>
                  </div>

                  <div className="p-1 space-y-1">
                    <Link
                      href={getPortalLink()}
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-600" /> Dashboard Saya
                    </Link>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Keluar (Logout)
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged-out CTA buttons */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" /> Masuk
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 rounded-xl transition-colors shadow-md shadow-emerald-600/20"
              >
                <UserPlus className="w-3.5 h-3.5" /> Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
