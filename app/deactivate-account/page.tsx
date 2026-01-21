"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UserX,
  UserCheck,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Loader2,
  LogIn,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { checkAuthStatus } from "@/lib/api/account-deletion";
import {
  getDeactivationStatus,
  updateDeactivationStatus,
} from "@/lib/api/account-deactivation";
import SupportChatButton from "@/components/SupportChatButton";

export default function DeactivateAccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [actionType, setActionType] = useState<"deactivate" | "reactivate">(
    "deactivate",
  );

  // Check if user is logged in and get deactivation status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await checkAuthStatus();

        if (authStatus.authenticated && authStatus.user) {
          setIsLoggedIn(true);
          setEmail(authStatus.user.email || "");

          // Get deactivation status
          try {
            const deactivated = await getDeactivationStatus();
            setIsDeactivated(deactivated);
            setActionType(deactivated ? "reactivate" : "deactivate");
          } catch (err) {
            console.error("Error fetching deactivation status:", err);
          }
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

  const expectedConfirmText =
    actionType === "deactivate" ? "NONAKTIFKAN AKUN" : "AKTIFKAN AKUN";
  const isFormValid = confirmText === expectedConfirmText;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) {
      setError("Mohon konfirmasi dengan teks yang benar");
      return;
    }

    setIsLoading(true);

    try {
      await updateDeactivationStatus(actionType === "deactivate");

      // On success
      setIsLoading(false);
      setIsSuccess(true);
      setIsDeactivated(actionType === "deactivate");
    } catch (err) {
      setIsLoading(false);
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan. Silakan coba lagi.",
      );
    }
  };

  const handleLogin = () => {
    window.location.href = `/auth/login?redirect=/deactivate-account`;
  };

  const handleReset = () => {
    setIsSuccess(false);
    setConfirmText("");
    setError("");
    setActionType(isDeactivated ? "reactivate" : "deactivate");
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
              Anda harus login terlebih dahulu untuk dapat mengelola status akun
              Anda. Ini untuk memastikan keamanan data Anda.
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
          <div
            className={`w-20 h-20 ${
              actionType === "deactivate" ? "bg-orange-100" : "bg-green-100"
            } rounded-full flex items-center justify-center mx-auto mb-6`}
          >
            <CheckCircle
              className={`w-10 h-10 ${
                actionType === "deactivate"
                  ? "text-orange-600"
                  : "text-green-600"
              }`}
            />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">
            {actionType === "deactivate"
              ? "Akun Berhasil Dinonaktifkan"
              : "Akun Berhasil Diaktifkan Kembali"}
          </h1>
          <p className="text-gray-600 mb-8">
            {actionType === "deactivate"
              ? "Akun Anda telah dinonaktifkan. Anda masih dapat mengaktifkan kembali akun Anda kapan saja dengan mengunjungi halaman ini."
              : "Selamat datang kembali! Akun Anda telah diaktifkan dan Anda dapat menggunakan semua fitur aplikasi."}
          </p>
          <div className="space-y-4">
            <button
              onClick={handleReset}
              className="w-full px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Ubah Status Lagi
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
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                isDeactivated
                  ? "bg-orange-100 text-orange-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              <Shield size={18} />
              <span className="font-semibold">
                Status Akun: {isDeactivated ? "Dinonaktifkan" : "Aktif"}
              </span>
            </div>
          </motion.div>

          {/* Warning/Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${
              actionType === "deactivate"
                ? "bg-orange-50 border-orange-200"
                : "bg-blue-50 border-blue-200"
            } border-2 rounded-2xl p-6 mb-8`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 ${
                  actionType === "deactivate" ? "bg-orange-100" : "bg-blue-100"
                } rounded-full flex items-center justify-center shrink-0`}
              >
                {actionType === "deactivate" ? (
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                ) : (
                  <UserCheck className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <div>
                <h2
                  className={`text-xl font-bold ${
                    actionType === "deactivate"
                      ? "text-orange-900"
                      : "text-blue-900"
                  } mb-2`}
                >
                  {actionType === "deactivate"
                    ? "Perhatian!"
                    : "Aktivasi Kembali"}
                </h2>
                <p
                  className={
                    actionType === "deactivate"
                      ? "text-orange-700"
                      : "text-blue-700"
                  }
                >
                  {actionType === "deactivate"
                    ? "Menonaktifkan akun akan membatasi akses Anda ke aplikasi. Namun, akun Anda tidak akan dihapus dan dapat diaktifkan kembali kapan saja."
                    : "Mengaktifkan kembali akun akan mengembalikan semua akses Anda ke aplikasi dan fitur-fiturnya."}
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
              <div
                className={`w-16 h-16 ${
                  actionType === "deactivate" ? "bg-orange-100" : "bg-green-100"
                } rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                {actionType === "deactivate" ? (
                  <UserX className="w-8 h-8 text-orange-600" />
                ) : (
                  <UserCheck className="w-8 h-8 text-green-600" />
                )}
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-2">
                {actionType === "deactivate"
                  ? "Nonaktifkan Akun"
                  : "Aktifkan Akun Kembali"}
              </h1>
              <p className="text-gray-600">
                {actionType === "deactivate"
                  ? "Konfirmasi untuk menonaktifkan akun Anda sementara."
                  : "Konfirmasi untuk mengaktifkan kembali akun Anda."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field (Read-only) */}
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900"
                  disabled
                />
              </div>

              {/* Confirmation Field */}
              <div>
                <label
                  htmlFor="confirm"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Konfirmasi Tindakan
                </label>
                <input
                  type="text"
                  id="confirm"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                  placeholder={`Ketik ${expectedConfirmText}`}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-900 focus:outline-none transition-colors text-gray-900 font-mono"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Ketik{" "}
                  <span className="font-mono font-bold text-gray-700">
                    {expectedConfirmText}
                  </span>{" "}
                  untuk mengonfirmasi.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* What will happen */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {actionType === "deactivate"
                    ? "Yang akan terjadi:"
                    : "Yang akan dipulihkan:"}
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    {actionType === "deactivate"
                      ? "Akses ke aplikasi akan dibatasi"
                      : "Akses penuh ke aplikasi"}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    {actionType === "deactivate"
                      ? "Data Anda akan tetap tersimpan"
                      : "Semua fitur dapat digunakan kembali"}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    {actionType === "deactivate"
                      ? "Anda dapat mengaktifkan kembali kapan saja"
                      : "Profil Anda akan aktif kembali"}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    {actionType === "deactivate"
                      ? "Tidak ada data yang akan dihapus"
                      : "Notifikasi akan aktif kembali"}
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  isFormValid && !isLoading
                    ? actionType === "deactivate"
                      ? "bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
                      : "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Memproses...
                  </>
                ) : actionType === "deactivate" ? (
                  <>
                    <UserX className="w-5 h-5" />
                    Nonaktifkan Akun
                  </>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5" />
                    Aktifkan Akun
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
            Butuh bantuan? Hubungi kami di{" "}
            <a
              href="mailto:support@satuteladan.id"
              className="text-gray-900 font-medium hover:underline"
            >
              support@satuteladan.id
            </a>
          </motion.p>
        </div>
      </div>

      {/* Support Chat Button */}
      <SupportChatButton />
    </div>
  );
}
