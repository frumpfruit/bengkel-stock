import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Boxes,
  Truck,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useStock } from '../../context/StockContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/atoms/Button';

export const Login = () => {
  const { login, settings } = useStock();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@bengkelstock.com');
  const [password, setPassword] = useState('bengkel123');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: 'Kelola Stok & Gudang Lebih Efisien.',
      subtitle:
        'Pantau ketersediaan ribuan suku cadang, peringatan otomatis saat stok menipis, dan pencatatan logistik dalam satu sistem terpadu.',
    },
    {
      title: 'Mutasi Barang Masuk & Keluar Real-time.',
      subtitle:
        'Catat setiap pasokan dari distributor resmi dan pemakaian servis kendaraan pelanggan dengan kalkulasi stok otomatis tanpa selisih.',
    },
    {
      title: 'Valuasi Aset & Analisis Profitabilitas.',
      subtitle:
        'Laporan cerdas untuk memantau nilai modal di rak, potensi laba kotor, dan suku cadang fast-moving terlaris bengkel Anda.',
    },
  ];

  // Auto rotate carousel slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showError('Gagal Masuk', 'Silakan masukkan alamat email bengkel.');
      return;
    }
    if (!password.trim()) {
      showError('Gagal Masuk', 'Silakan masukkan kata sandi Anda.');
      return;
    }

    login(email, password, selectedRole);
    showSuccess(
      'Login Berhasil!',
      `Masuk sebagai ${selectedRole === 'admin' ? 'Administrator (Full CRUD)' : 'Viewer (Hanya Baca)'}.`
    );
    navigate('/');
  };

  const handleQuickDemoAdmin = () => {
    setEmail('admin@bengkelstock.com');
    setPassword('bengkel123');
    setSelectedRole('admin');
    login('admin@bengkelstock.com', 'bengkel123', 'admin', 'Budi Pratama (Admin)');
    showSuccess(
      'Akses Admin Terbuka',
      'Masuk sebagai Kepala Gudang & Logistik dengan akses CRUD penuh.'
    );
    navigate('/');
  };

  const handleQuickDemoLogin = handleQuickDemoAdmin;

  const handleQuickDemoViewer = () => {
    setEmail('viewer@bengkelstock.com');
    setPassword('viewer123');
    setSelectedRole('viewer');
    login('viewer@bengkelstock.com', 'viewer123', 'viewer', 'Agus Santoso (Viewer)');
    showSuccess(
      'Akses Viewer Terbuka',
      'Masuk sebagai Mekanik / Viewer dengan hak akses Hanya Baca (Read-Only).'
    );
    navigate('/');
  };

  const handleGoogleLogin = () => {
    login('admin.google@bengkelstock.com', 'google_oauth_token', 'admin', 'Budi (Google Workspace)');
    showSuccess('Login Google Berhasil', 'Autentikasi akun Google bengkel berhasil diverifikasi.');
    navigate('/');
  };

  return (
    <div className="min-h-screen app-bg-mesh flex items-center justify-center p-4 sm:p-6 lg:p-8 select-none">
      {/* Outer Card - 50/50 Split Layout matching reference design with BengkelStock Red Theme */}
      <div className="w-full max-w-5xl bg-white dark:bg-[#111827] rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Column: Form Side (Clean White) */}
        <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-between bg-white dark:bg-[#111827]">
          <div>
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-red-500/25">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-rose-400 bg-clip-text text-transparent">
                  BengkelStock
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 dark:border dark:border-red-500/25">
                  PRO
                </span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Log in to your Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              Welcome back! Select method to log in:
            </p>

            {/* Quick Demo Login 1-Click Buttons for UTS Evaluation */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              {/* Demo Admin 1-Click Button */}
              <button
                type="button"
                onClick={handleQuickDemoAdmin}
                className="h-11 flex items-center justify-center gap-2 rounded-2xl border border-red-200 dark:border-red-500/30 bg-red-50/80 dark:bg-red-500/15 hover:bg-red-100 dark:hover:bg-red-500/25 text-xs font-bold text-red-700 dark:text-red-300 transition-all shadow-2xs group"
                title="Masuk sebagai Administrator dengan hak akses CRUD penuh"
              >
                <ShieldCheck className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
                <span>Demo Admin (CRUD)</span>
              </button>

              {/* Demo Viewer 1-Click Button */}
              <button
                type="button"
                onClick={handleQuickDemoViewer}
                className="h-11 flex items-center justify-center gap-2 rounded-2xl border border-blue-200 dark:border-blue-500/30 bg-blue-50/80 dark:bg-blue-500/15 hover:bg-blue-100 dark:hover:bg-blue-500/25 text-xs font-bold text-blue-700 dark:text-blue-300 transition-all shadow-2xs group"
                title="Masuk sebagai Viewer / Mekanik dengan hak akses Hanya Baca"
              >
                <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                <span>Demo Viewer (Read)</span>
              </button>
            </div>

            {/* Divider with Text */}
            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/80 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white dark:bg-[#111827] px-3 text-slate-400 font-medium">
                  atau masuk manual dengan role
                </span>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Role Selector Tabs */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Pilih Hak Akses (Role)
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('admin');
                      setEmail('admin@bengkelstock.com');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      selectedRole === 'admin'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin (CRUD)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('viewer');
                      setEmail('viewer@bengkelstock.com');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      selectedRole === 'viewer'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Viewer (Hanya Baca)</span>
                  </button>
                </div>
              </div>
              {/* Email Input */}
              <div className="space-y-1.5">
                <div className="relative w-full">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Bengkel"
                    className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0F17]/90 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-500/10 focus:border-red-500 dark:focus:border-red-500/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="relative w-full">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full h-11 pl-10 pr-10 text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0F17]/90 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:focus:ring-red-500/10 focus:border-red-500 dark:focus:border-red-500/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500 accent-red-600 border-slate-300"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    alert('Untuk pemulihan kata sandi, silakan hubungi Administrator IT Bengkel.')
                  }
                  className="font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primaryGradient"
                size="md"
                className="w-full h-11 text-sm font-bold shadow-lg shadow-red-500/25 mt-2"
              >
                Log in
              </Button>
            </form>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            <span>Don't have an account? </span>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="font-bold text-red-600 dark:text-red-400 hover:underline"
            >
              Create an account
            </button>
          </div>
        </div>

        {/* Right Column: Visual Showcase Side (Deep Branded Red Theme) */}
        <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Concentric Rings & Mesh Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-red-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-red-950/40 blur-3xl pointer-events-none" />

          {/* Top Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
              Bengkel & Spare Part Management
            </span>
            <span className="text-xs font-semibold text-white/70">v2.0 Pro</span>
          </div>

          {/* Center Graphic: Connected App Nodes to Floating Dashboard Card */}
          <div className="my-auto py-8 relative z-10">
            <div className="relative w-full max-w-sm mx-auto flex items-center justify-center">
              {/* Central Background Radar Ring */}
              <div className="absolute w-64 h-64 rounded-full border border-white/15 animate-spin-slow pointer-events-none" />
              <div className="absolute w-44 h-44 rounded-full border border-dashed border-white/20 pointer-events-none" />

              {/* 3 Circular Connection Nodes on Left */}
              <div className="flex flex-col gap-5 mr-6 relative z-10">
                <div
                  className="w-11 h-11 rounded-2xl bg-white text-red-600 shadow-xl flex items-center justify-center transform -translate-x-2 transition-transform hover:scale-110"
                  title="Katalog Spare Part"
                >
                  <Boxes className="w-5 h-5" />
                </div>
                <div
                  className="w-11 h-11 rounded-2xl bg-white text-emerald-600 shadow-xl flex items-center justify-center transform translate-x-1 transition-transform hover:scale-110"
                  title="Barang Masuk & Keluar"
                >
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <div
                  className="w-11 h-11 rounded-2xl bg-white text-indigo-600 shadow-xl flex items-center justify-center transform -translate-x-2 transition-transform hover:scale-110"
                  title="Distributor & Supplier"
                >
                  <Truck className="w-5 h-5" />
                </div>
              </div>

              {/* Floating SaaS Dashboard Card */}
              <div className="flex-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/40 text-slate-800 dark:text-slate-100 max-w-[220px]">
                {/* Window Dots */}
                <div className="flex items-center gap-1.5 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-bold text-slate-400 ml-auto">Live Stock</span>
                </div>

                {/* Stock Items Simulation */}
                <div className="space-y-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
                    <div className="font-bold text-slate-800 dark:text-white truncate">
                      Oli Yamalube 10W-40
                    </div>
                    <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>+24 unit masuk</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
                    <div className="font-bold text-slate-800 dark:text-white truncate">
                      Busi NGK Iridium
                    </div>
                    <div className="text-[10px] font-semibold text-sky-600 flex items-center gap-1 mt-0.5">
                      <Boxes className="w-3 h-3" />
                      <span>Stok Aman: 48 pcs</span>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-red-50/80 dark:bg-red-950/40 border border-red-100 dark:border-red-900/40">
                    <div className="font-bold text-red-900 dark:text-red-200 truncate">
                      Kampas Rem Depan
                    </div>
                    <div className="text-[10px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1 mt-0.5">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Sisa: 2 (Restock!)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copywriting & Pagination Carousel Dots */}
          <div className="relative z-10 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 leading-snug">
              {slides[activeSlide].title}
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-md">
              {slides[activeSlide].subtitle}
            </p>

            {/* Carousel Dots */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`transition-all duration-300 rounded-full h-2 ${
                    activeSlide === idx
                      ? 'w-7 bg-white shadow-sm'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
