"use client";

import { useState } from "react";
import Script from "next/script";
import { createPayment } from "./payment-actions";
import { Sparkles, Check, Loader2 } from "lucide-react";

declare global {
  interface Window {
    snap: any;
  }
}

export function UpgradeAccountCard({ userStatus }: { userStatus: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpgrade = async (packageType: "PREMIUM" | "SULTAN" | "EXCLUSIVE") => {
    setLoading(packageType);
    setMessage(null);

    try {
      const res = await createPayment(packageType);
      if (res?.error) {
        setMessage({ type: "error", text: res.error });
        setLoading(null);
        return;
      }

      if (res?.token && window.snap) {
        window.snap.pay(res.token, {
          onSuccess: function (result: any) {
            setMessage({ type: "success", text: "Pembayaran berhasil! Halaman akan dimuat ulang." });
            setLoading(null);
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          },
          onPending: function (result: any) {
            setMessage({ type: "success", text: "Menunggu pembayaran..." });
            setLoading(null);
          },
          onError: function (result: any) {
            setMessage({ type: "error", text: "Pembayaran gagal. Silakan coba kembali." });
            setLoading(null);
          },
          onClose: function () {
            setMessage({ type: "error", text: "Pembayaran dibatalkan." });
            setLoading(null);
          }
        });
      } else {
        setMessage({ type: "error", text: "Gagal memuat sistem pembayaran." });
        setLoading(null);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Terjadi kesalahan sistem." });
      setLoading(null);
    }
  };

  if (userStatus === "ACTIVE") {
    return (
      <div className="bg-[#064e3b]/5 border border-[#d4af37]/30 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#064e3b]/10 border border-[#064e3b]/20 flex items-center justify-center text-xl shrink-0">
            👑
          </div>
          <div>
            <h4 className="text-[#064e3b] font-extrabold text-base">Akun Adatara Premium Aktif</h4>
            <p className="text-[#064e3b]/70 text-xs mt-1">Anda memiliki akses tak terbatas ke seluruh template premium.</p>
          </div>
        </div>
        <span className="px-4 py-2 rounded-xl text-xs font-bold bg-[#064e3b]/10 border border-[#064e3b]/20 text-[#064e3b] shrink-0">
          PRO MEMBER
        </span>
      </div>
    );
  }

  return (
    <div className="bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
      <Script src="https://app.sandbox.midtrans.com/snap/snap.js" strategy="lazyOnload" />
      
      {/* Background decoration highlight */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#064e3b]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#064e3b]/10 pb-6 text-left">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-[#064e3b]/10 border border-[#064e3b]/20 text-[#064e3b] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Upgrade Akun
          </div>
          <h3 className="text-xl font-extrabold text-[#064e3b]">Buka Fitur Premium Adatara</h3>
          <p className="text-[#064e3b]/70 text-xs max-w-lg leading-relaxed">
            Status akun Anda saat ini adalah **Free Trial**. Hubungkan undangan digital Anda ke domain publik dengan melakukan aktivasi paket premium di bawah ini.
          </p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-bold border text-left ${
          message.type === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-red-50 border-red-200 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      {/* Pricing options list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Premium */}
        <div className="bg-white border border-[#064e3b]/10 rounded-2xl p-5 flex flex-col justify-between space-y-5 hover:border-[#d4af37]/35 transition-all text-left">
          <div className="space-y-2">
            <h4 className="text-[#064e3b] font-extrabold text-sm">Paket Premium</h4>
            <div className="text-xl font-black text-[#064e3b]">Rp 99.000</div>
            <ul className="text-[10px] text-[#064e3b]/70 space-y-2 pt-3 border-t border-[#064e3b]/10">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                Semua Template Premium
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                Aktif Selamanya
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                Tamu Tak Terbatas
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                Kustom Musik Latar
              </li>
            </ul>
          </div>
          <button
            disabled={loading !== null}
            onClick={() => handleUpgrade("PREMIUM")}
            className="w-full py-2.5 rounded-xl bg-[#f5f5dc] hover:bg-[#064e3b]/5 border border-[#064e3b]/20 text-[#064e3b] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {loading === "PREMIUM" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              "Pilih Premium"
            )}
          </button>
        </div>

        {/* Sultan */}
        <div className="bg-white border border-[#d4af37]/50 rounded-2xl p-5 flex flex-col justify-between space-y-5 hover:border-[#d4af37] relative transition-all text-left">
          <div className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded text-[8px] font-bold bg-[#d4af37] text-white uppercase tracking-wider">
            Terpopuler
          </div>
          <div className="space-y-2">
            <h4 className="text-[#064e3b] font-extrabold text-sm">Paket Sultan</h4>
            <div className="text-xl font-black text-[#064e3b]">Rp 149.000</div>
            <ul className="text-[10px] text-[#064e3b]/70 space-y-2 pt-3 border-t border-[#064e3b]/10">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                Semua Fitur Premium
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                Subdomain Kustom (.id/nama)
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                100 WA Blast
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                Bantuan Prioritas 24/7
              </li>
            </ul>
          </div>
          <button
            disabled={loading !== null}
            onClick={() => handleUpgrade("SULTAN")}
            className="w-full py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#d4af37]/90 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {loading === "SULTAN" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              "Pilih Sultan"
            )}
          </button>
        </div>

        {/* Exclusive */}
        <div className="bg-white border border-[#064e3b]/10 rounded-2xl p-5 flex flex-col justify-between space-y-5 hover:border-[#d4af37]/35 transition-all text-left">
          <div className="space-y-2">
            <h4 className="text-[#064e3b] font-extrabold text-sm">Paket Exclusive</h4>
            <div className="text-xl font-black text-[#064e3b]">Rp 299.000</div>
            <ul className="text-[10px] text-[#064e3b]/70 space-y-2 pt-3 border-t border-[#064e3b]/10">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                Semua Fitur Sultan
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                Pembuatan Dibantu Desainer
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                Revisi Tanpa Batas
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                Kustom Domain (.com/.id)
              </li>
            </ul>
          </div>
          <button
            disabled={loading !== null}
            onClick={() => handleUpgrade("EXCLUSIVE")}
            className="w-full py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#064e3b]/90 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {loading === "EXCLUSIVE" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              "Pilih Exclusive"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
