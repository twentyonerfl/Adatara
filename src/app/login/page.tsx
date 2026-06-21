"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { Sparkles, ArrowLeft, Loader2, Mail, Lock, Check } from "lucide-react";

// Form validation schema with Zod
const loginSchema = z.object({
  email: z.string().email("Masukkan alamat email yang valid"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (response?.error) {
        setErrorMessage(response.error.message || "Gagal masuk. Periksa email atau password Anda.");
        setLoading(false);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err) {
      setErrorMessage("Terjadi kesalahan sistem. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5dc] text-[#064e3b] flex flex-col justify-center relative overflow-hidden font-sans py-12 px-6">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#064e3b]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Back button */}
      <div className="absolute top-6 left-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-[#064e3b]/70 hover:text-[#064e3b] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2 font-bold text-3xl tracking-wide text-[#064e3b] mb-6">
          <Sparkles className="w-8 h-8 text-[#d4af37]" />
          Adatara
        </div>
        <h2 className="text-center text-3xl font-extrabold text-[#064e3b] tracking-tight">
          Masuk ke Akun Anda
        </h2>
        <p className="mt-2 text-center text-sm text-[#064e3b]/70">
          Selamat datang kembali di platform undangan digital premium.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white border border-[#064e3b]/10 py-8 px-10 shadow-2xl rounded-3xl sm:px-10">
          {success ? (
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center justify-center text-center py-8"
            >
              <div className="w-16 h-16 bg-[#064e3b]/10 border border-[#064e3b] text-[#064e3b] rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#064e3b]">Login Berhasil!</h3>
              <p className="text-[#064e3b]/70 text-sm mt-2">
                Mengalihkan ke dashboard akun Anda...
              </p>
            </motion.div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Alert error */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-[#064e3b]/80 uppercase tracking-wider mb-2">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-[#064e3b]/40" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="aditya@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-[#f5f5dc]/10 border border-[#064e3b]/20 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl text-sm text-[#064e3b] placeholder-[#064e3b]/30 outline-none transition-all"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#064e3b]/80 uppercase tracking-wider">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs font-semibold text-[#064e3b]/70 hover:text-[#d4af37] transition-colors">
                    Lupa Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-[#064e3b]/40" />
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-[#f5f5dc]/10 border border-[#064e3b]/20 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl text-sm text-[#064e3b] placeholder-[#064e3b]/30 outline-none transition-all"
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-sm font-bold bg-[#064e3b] hover:bg-[#064e3b]/95 border border-[#d4af37] text-white shadow-lg shadow-[#064e3b]/10 hover:shadow-[#064e3b]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Memverifikasi...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-[#064e3b]/70">
            Belum memiliki akun?{" "}
            <Link href="/register" className="text-[#064e3b] hover:text-[#d4af37] font-semibold transition-colors">
              Daftar sekarang
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
