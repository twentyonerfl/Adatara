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
    <div className="min-h-screen bg-[#fdfdfb] text-[#064e3b] flex flex-col lg:grid lg:grid-cols-12 font-sans relative overflow-hidden">
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

      {/* Left Column (Desktop Only Editorial Cover) */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 text-[#f5f5dc] overflow-hidden bg-[#053c2e]">
        {/* Background Image with botanical artwork */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{ backgroundImage: `url('/login-bg.png')` }}
        />
        
        {/* Modern subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#032018] via-[#053c2e]/80 to-transparent pointer-events-none" />
        
        {/* Floating glowing orbs inside left panel for magic premium feel */}
        <div className="absolute top-1/4 right-[-10%] w-[300px] h-[300px] bg-[#d4af37]/15 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-[-10%] w-[250px] h-[250px] bg-white/5 blur-[90px] rounded-full pointer-events-none" />

        {/* Brand Logo in Cover */}
        <div className="relative z-10">
          <Link href="/" className="inline-block transition-transform duration-300 hover:scale-105">
            <img
              src="/logo-white.png"
              alt="Adatara Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Elegant typography & quote */}
        <div className="relative z-10 space-y-6 max-w-sm my-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#d4af37] block mb-3">Premium Digital Invitation</span>
            <h1 className="text-3xl xl:text-4xl font-serif font-semibold leading-tight tracking-tight text-white">
              Mengabadikan Momen Istimewa dalam Undangan Digital yang Abadi.
            </h1>
            <div className="h-[2px] w-12 bg-gradient-to-r from-[#d4af37] to-transparent mt-6" />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[#f5f5dc]/70 text-sm font-light leading-relaxed font-sans"
          >
            Setiap detail didesain dengan keanggunan khas nusantara. Selamat datang kembali di Adatara.
          </motion.p>
        </div>

        {/* Footer info in Cover */}
        <div className="relative z-10 text-xs text-[#f5f5dc]/40 font-light tracking-wider">
          © 2026 Adatara. All rights reserved.
        </div>
      </div>

      {/* Right Column (Form Container) */}
      <div className="col-span-1 lg:col-span-7 flex flex-col min-h-screen justify-center px-6 py-16 sm:px-16 md:px-24 xl:px-32 bg-gradient-to-b from-[#fdfdfb] to-[#f5f5dc] lg:from-transparent lg:to-transparent relative">
        
        {/* Floating glows for mobile view (where left panel is hidden) */}
        <div className="lg:hidden absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-[#d4af37]/8 blur-[100px] rounded-full pointer-events-none -z-10" />
        <div className="lg:hidden absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#064e3b]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Elegant Back button at top right */}
        <div className="absolute top-6 right-6 z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/80 backdrop-blur-md border border-[#064e3b]/10 shadow-sm px-4 py-2 rounded-full text-[#064e3b] hover:bg-white hover:border-[#d4af37]/45 hover:shadow-md transition-all duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Centered / clean max-width form container */}
        <div className="w-full max-w-md mx-auto relative z-10">
          {/* Mobile-only logo */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="inline-block">
              <img
                src="/logo.png"
                alt="Adatara Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Header */}
          <div className="mb-10 text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-serif font-bold text-[#064e3b] tracking-tight"
            >
              Masuk ke Akun Anda
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-2 text-sm text-[#064e3b]/70 font-medium"
            >
              Selamat datang kembali di platform undangan digital premium.
            </motion.p>
          </div>

          {/* Success State / Form */}
          {success ? (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-start py-8 space-y-4"
            >
              <div className="w-12 h-12 bg-[#064e3b]/10 border border-[#064e3b]/20 text-[#064e3b] rounded-full flex items-center justify-center shadow-inner">
                <Check className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-[#064e3b] font-serif">Login Berhasil!</h3>
                <p className="text-[#064e3b]/70 text-sm font-medium">
                  Mengalihkan ke dashboard akun Anda...
                </p>
              </div>
            </motion.div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Alert error */}
              {errorMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50/50 border border-red-200/60 text-red-800 p-4 rounded-xl text-sm font-medium backdrop-blur-md"
                >
                  {errorMessage}
                </motion.div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#064e3b]/70 uppercase tracking-widest">
                  Alamat Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-[14px] w-4.5 h-4.5 text-[#064e3b]/30 group-focus-within:text-[#d4af37] transition-colors" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="nama@email.com"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-[#064e3b]/10 focus:border-[#d4af37]/80 focus:ring-2 focus:ring-[#d4af37]/10 rounded-xl text-sm text-[#064e3b] placeholder-[#064e3b]/30 outline-none transition-all duration-300 shadow-sm"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-[#064e3b]/70 uppercase tracking-widest">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs font-semibold text-[#064e3b]/60 hover:text-[#d4af37] transition-colors">
                    Lupa Password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-[14px] w-4.5 h-4.5 text-[#064e3b]/30 group-focus-within:text-[#d4af37] transition-colors" />
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-[#064e3b]/10 focus:border-[#d4af37]/80 focus:ring-2 focus:ring-[#d4af37]/10 rounded-xl text-sm text-[#064e3b] placeholder-[#064e3b]/30 outline-none transition-all duration-300 shadow-sm"
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-sm font-bold bg-[#064e3b] hover:bg-[#053c2e] border border-[#d4af37]/20 hover:border-[#d4af37] text-white shadow-md shadow-[#064e3b]/5 hover:shadow-lg hover:shadow-[#064e3b]/15 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:-translate-y-[1px]"
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

          {/* Register redirect */}
          <div className="mt-8 pt-6 border-t border-[#064e3b]/5 text-left text-sm text-[#064e3b]/60 font-medium font-sans">
            Belum memiliki akun?{" "}
            <Link href="/register" className="text-[#064e3b] hover:text-[#d4af37] font-bold transition-colors">
              Daftar sekarang
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
