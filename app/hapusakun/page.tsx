"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trash2,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Loader2,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import {
  checkAuthStatus,
  submitDeletionRequest,
} from "@/lib/api/account-deletion";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function HapusAkunPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await checkAuthStatus();

        if (authStatus.authenticated && authStatus.user) {
          setIsLoggedIn(true);
          setEmail(authStatus.user.email || "");
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setIsLoggedIn(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const isFormValid =
    email.includes("@") &&
    confirmText === "HAPUS AKUN" &&
    reason.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) {
      setError("Mohon lengkapi semua field dengan benar");
      return;
    }

    setIsLoading(true);

    try {
      await submitDeletionRequest({
        email,
        reason: reason.trim(),
      });

      // On success
      setIsLoading(false);
      setIsSuccess(true);
    } catch (err) {
      setIsLoading(false);
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan. Silakan coba lagi."
      );
    }
  };

  const handleLogin = () => {
    const supabase = getSupabaseBrowserClient();
    // Redirect to Supabase auth with redirect back to this page
    // You can customize this based on your auth setup
    window.location.href = `/auth/login?redirect=/hapusakun`;
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  // Show login required screen if user is not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="border-b border-gray-200 px-6 py-4">
          <div className="container mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold tracking-wider text-gray-900"
            >
              Satu Teladan App
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              <ArrowLeft size={18} />
              Kembali
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-10 h-10 text-gray-600" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-4">
              Login Diperlukan
            </h1>
            <p className="text-gray-600 mb-8">
              Anda harus login terlebih dahulu untuk dapat mengajukan permintaan
              penghapusan akun. Ini untuk memastikan keamanan data Anda.
            </p>
            <div className="space-y-4">
              <button
                onClick={handleLogin}
                className="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Login Sekarang
              </button>
              <Link
                href="/"
                className="block text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">
            Permintaan Diterima
          </h1>
          <p className="text-gray-600 mb-8">
            Permintaan penghapusan akun Anda telah kami terima. Tim kami akan
            memproses permintaan ini dalam waktu 3-5 hari kerja. Anda akan
            menerima konfirmasi melalui email.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b border-gray-200 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-wider text-gray-900"
          >
            Satu Teladan App
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            Kembali
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-xl mx-auto">
          {/* Warning Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-900 mb-2">
                  Perhatian!
                </h2>
                <p className="text-red-700">
                  Penghapusan akun bersifat permanen dan tidak dapat dibatalkan.
                  Semua data Anda termasuk riwayat aktivitas, preferensi, dan
                  informasi profil akan dihapus secara permanen dari sistem
                  kami.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border-2 border-gray-200 rounded-2xl p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-gray-600" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">
                Hapus Akun
              </h1>
              <p className="text-gray-600">
                Untuk menghapus akun Anda, silakan lengkapi formulir di bawah
                ini.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Email Akun
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email yang terdaftar"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none transition-colors text-gray-900 bg-gray-50"
                  required
                  disabled
                />
                <p className="text-sm text-gray-500 mt-1">
                  Email dari akun yang sedang login.
                </p>
              </div>

              {/* Reason Field */}
              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Alasan Penghapusan <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Jelaskan alasan Anda ingin menghapus akun (minimal 10 karakter)"
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none transition-colors text-gray-900 resize-none"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {reason.length}/10 karakter minimal
                </p>
              </div>

              {/* Confirmation Field */}
              <div>
                <label
                  htmlFor="confirm"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Konfirmasi Penghapusan
                </label>
                <input
                  type="text"
                  id="confirm"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                  placeholder="Ketik HAPUS AKUN"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none transition-colors text-gray-900 font-mono"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Ketik{" "}
                  <span className="font-mono font-bold text-gray-700">
                    HAPUS AKUN
                  </span>{" "}
                  untuk mengonfirmasi penghapusan.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* What will be deleted */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Data yang akan dihapus:
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    Informasi profil dan preferensi
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    Riwayat aktivitas dalam aplikasi
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    Data koneksi dan interaksi
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    Semua data terkait akun lainnya
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  isFormValid && !isLoading
                    ? "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Hapus Akun Saya
                  </>
                )}
              </button>

              {/* Cancel Link */}
              <p className="text-center text-gray-600">
                Berubah pikiran?{" "}
                <Link
                  href="/"
                  className="text-gray-900 font-semibold hover:underline"
                >
                  Batalkan dan kembali
                </Link>
              </p>
            </form>
          </motion.div>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-gray-500 text-sm mt-8"
          >
            Butuh bantuan? Hubungi{" "}
            <a
              href="mailto:katymentor@gmail.com"
              className="text-gray-900 font-medium hover:underline"
            >
              katymentor@gmail.com
            </a>{" "}
            untuk support.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
