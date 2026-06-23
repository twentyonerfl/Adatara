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
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5dc] via-[#fdfdfb] to-[#f5f5dc] text-[#064e3b] flex flex-col justify-center relative overflow-hidden font-sans py-12 px-6">
      {/* Autofill override styles */}
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
          -webkit-text-fill-color: #064e3b !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* Layered ambient glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[450px] h-[450px] bg-[#d4af37]/8 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#064e3b]/6 blur-[150px] rounded-full pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }} />

      {/* Elegant Back button */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold bg-white/70 backdrop-blur-md border border-[#064e3b]/10 shadow-sm px-4 py-2 rounded-full text-[#064e3b] hover:bg-white hover:border-[#d4af37] hover:shadow-md transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Logo */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center mb-4"
        >
          <Link href="/" className="transition-transform duration-300 hover:scale-105">
            <img
              src="/logo.png"
              alt="Adatara Logo"
              className="h-16 md:h-20 w-auto object-contain"
            />
          </Link>
        </motion.div>
        
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold font-serif text-[#064e3b] tracking-tight">
            Masuk ke Akun Anda
          </h2>
          <p className="mt-2 text-sm text-[#064e3b]/70 font-medium">
            Selamat datang kembali di platform undangan digital premium.
          </p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-lg border border-[#064e3b]/10 py-10 px-10 shadow-[0_20px_50px_rgba(6,78,59,0.08)] rounded-[2.25rem] sm:px-10 relative overflow-hidden">
          {/* Subtle gold line ornament at the top of the card */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />

          {success ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center text-center py-8"
            >
              <div className="w-16 h-16 bg-[#064e3b]/10 border border-[#064e3b]/20 text-[#064e3b] rounded-full flex items-center justify-center mb-4 shadow-inner">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#064e3b] font-serif">Login Berhasil!</h3>
              <p className="text-[#064e3b]/70 text-sm mt-2 font-medium">
                Mengalihkan ke dashboard akun Anda...
              </p>
            </motion.div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Alert error */}
              {errorMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium"
                >
                  {errorMessage}
                </motion.div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#064e3b]/80 uppercase tracking-widest">
                  Alamat Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-[15px] w-5 h-5 text-[#064e3b]/40 group-focus-within:text-[#064e3b] transition-colors" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="aditya@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#064e3b]/15 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 rounded-xl text-sm text-[#064e3b] placeholder-[#064e3b]/35 outline-none transition-all shadow-sm focus:shadow-md"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#064e3b]/80 uppercase tracking-widest">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs font-semibold text-[#064e3b]/70 hover:text-[#d4af37] transition-colors">
                    Lupa Password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-[15px] w-5 h-5 text-[#064e3b]/40 group-focus-within:text-[#064e3b] transition-colors" />
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#064e3b]/15 focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 rounded-xl text-sm text-[#064e3b] placeholder-[#064e3b]/35 outline-none transition-all shadow-sm focus:shadow-md"
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl text-sm font-bold bg-[#064e3b] hover:bg-[#043427] border border-[#d4af37]/40 hover:border-[#d4af37] text-[#f5f5dc] shadow-lg shadow-[#064e3b]/10 hover:shadow-[#064e3b]/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:-translate-y-[1px]"
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

          <div className="mt-8 pt-6 border-t border-[#064e3b]/5 text-center text-sm text-[#064e3b]/70 font-medium">
            Belum memiliki akun?{" "}
            <Link href="/register" className="text-[#064e3b] hover:text-[#d4af37] font-bold transition-colors">
              Daftar sekarang
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
