import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Gift, Shield, CheckCircle, TrendingUp, Sparkles, Award } from "lucide-react";

export default async function PackagesPageAdmin() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  // Count activations by analyzing successful transactions nominals
  const [silverCount, goldCount, platinumCount] = await Promise.all([
    db.transaction.count({ where: { nominal: 49000, status_pembayaran: "SUCCESS" } }),
    db.transaction.count({ where: { nominal: 99000, status_pembayaran: "SUCCESS" } }),
    db.transaction.count({ where: { nominal: 149000, status_pembayaran: "SUCCESS" } })
  ]);

  const packages = [
    {
      id: "silver",
      name: "SILVER TIER",
      price: "Rp 49.000",
      activeCount: silverCount,
      color: "from-slate-400 to-slate-500",
      badgeColor: "bg-slate-500",
      features: [
        "Desain Standar",
        "Masa Aktif 3 Bulan",
        "Tanpa Background Musik",
        "Maksimal 100 Tamu"
      ]
    },
    {
      id: "gold",
      name: "GOLD TIER",
      price: "Rp 99.000",
      activeCount: goldCount,
      color: "from-[#d4af37] to-[#b89423]",
      badgeColor: "bg-[#d4af37]",
      isPopular: true,
      features: [
        "Desain Premium",
        "Masa Aktif 1 Tahun",
        "Pilihan Background Musik",
        "E-Gift & RSVP Otomatis",
        "Tanpa Iklan Adatara",
        "Maksimal 500 Tamu"
      ]
    },
    {
      id: "platinum",
      name: "PLATINUM TIER",
      price: "Rp 149.000",
      activeCount: platinumCount,
      color: "from-purple-600 to-indigo-700",
      badgeColor: "bg-purple-700",
      features: [
        "Semua Fitur Gold",
        "Masa Aktif Selamanya",
        "Kustom Musik Sendiri (MP3)",
        "Fitur Prioritas Support 24/7",
        "Tamu Tanpa Batas"
      ]
    }
  ];

  return (
    <div className="space-y-8 text-[#064e3b]">
      {/* HEADER */}
      <div>
        <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
          <Gift className="w-3.5 h-3.5" />
          Paket Undangan
        </span>
        <h1 className="text-3xl font-black text-[#064e3b] tracking-tight">Paket & Layanan</h1>
        <p className="text-[#064e3b]/70 text-sm mt-1">
          Pantau rasio kepopuleran paket langganan dan fitur-fitur aktif dari masing-masing paket.
        </p>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <div 
            key={pkg.id} 
            className={`bg-white border rounded-3xl p-6 relative flex flex-col justify-between shadow-sm hover:shadow-md transition-all ${
              pkg.isPopular ? "border-[#d4af37] ring-1 ring-[#d4af37]" : "border-[#064e3b]/10"
            }`}
          >
            {pkg.isPopular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#d4af37] text-white border border-[#d4af37] text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm">
                Most Popular
              </span>
            )}

            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black text-white ${pkg.badgeColor}`}>
                  {pkg.name}
                </span>
                <div className="text-2xl font-black text-[#064e3b]">{pkg.price}</div>
              </div>

              {/* Stats */}
              <div className="p-4 bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-2xl flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#064e3b]/60 uppercase tracking-wider">Total Penjualan:</span>
                <span className="text-sm font-black text-[#064e3b]">{pkg.activeCount} Kali</span>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-[#064e3b]/40 uppercase tracking-wider border-b border-[#064e3b]/10 pb-1.5">
                  Fitur Paket:
                </h4>
                <div className="space-y-2">
                  {pkg.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs font-semibold text-[#064e3b]/80">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Indicator */}
            <div className="pt-6 mt-6 border-t border-[#064e3b]/10 text-center text-[10px] font-black uppercase text-[#064e3b]/50 tracking-wider">
              {pkg.isPopular ? "⭐ Premium Value" : "✨ Standard Choice"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
