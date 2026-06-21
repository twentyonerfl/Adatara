import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  Plus, 
  Calendar, 
  Users, 
  FileText, 
  ExternalLink, 
  Edit3, 
  Heart,
  ChevronRight,
  TrendingUp,
  CreditCard,
  DollarSign,
  UserCheck,
  Globe
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  // Fetch platform-wide statistics
  const [
    totalInvitations,
    activeInvitations,
    totalUsers,
    totalTransactions,
    recentInvitations,
    recentTransactions
  ] = await Promise.all([
    db.invitation.count(),
    db.invitation.count({ where: { status: "ACTIVE" } }),
    db.user.count({ where: { role: "USER" } }),
    db.transaction.findMany({ where: { status_pembayaran: "SUCCESS" } }),
    db.invitation.findMany({
      take: 5,
      orderBy: { created_at: "desc" },
      include: { template: true, user: true }
    }),
    db.transaction.findMany({
      take: 5,
      orderBy: { created_at: "desc" },
      include: { user: true }
    })
  ]);

  // Calculate total revenue
  const totalRevenue = totalTransactions.reduce((sum, tx) => sum + Number(tx.nominal), 0);

  // Helper to format currency
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-8 text-[#064e3b]">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#064e3b] tracking-tight">Overview Dashboard</h1>
          <p className="text-[#064e3b]/70 text-sm mt-1">Platform metrics, financial status, and recent registrations.</p>
        </div>
        <Link 
          href="/dashboard/templates" 
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black bg-[#064e3b] hover:bg-[#064e3b]/95 text-white border border-[#d4af37] shadow-lg shadow-[#064e3b]/10 transition-all uppercase tracking-wider"
        >
          <Plus className="w-4.5 h-4.5 text-[#d4af37]" />
          Buat Template Baru
        </Link>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white border border-[#064e3b]/10 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-[#d4af37]/45 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37]/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#064e3b]/50 uppercase tracking-widest">Total Pendapatan</span>
            <DollarSign className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div className="text-2xl font-black text-[#064e3b] mt-4">{formatRupiah(totalRevenue)}</div>
          <div className="text-[10px] font-bold text-emerald-700 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +100% dari transaksi terverifikasi
          </div>
        </div>

        {/* Total Invitations */}
        <div className="bg-white border border-[#064e3b]/10 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-[#d4af37]/45 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#064e3b]/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#064e3b]/50 uppercase tracking-widest">Total Undangan</span>
            <FileText className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div className="text-2xl font-black text-[#064e3b] mt-4">{totalInvitations}</div>
          <div className="text-[10px] font-bold text-[#064e3b]/60 mt-2">
            {activeInvitations} undangan status AKTIF
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white border border-[#064e3b]/10 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-[#d4af37]/45 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37]/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#064e3b]/50 uppercase tracking-widest">Total Pengguna</span>
            <Users className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div className="text-2xl font-black text-[#064e3b] mt-4">{totalUsers}</div>
          <div className="text-[10px] font-bold text-[#064e3b]/60 mt-2">
            Termasuk akun tamu & pembayar
          </div>
        </div>

        {/* Active Ratio */}
        <div className="bg-white border border-[#064e3b]/10 rounded-3xl p-6 shadow-sm relative overflow-hidden group hover:border-[#d4af37]/45 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#064e3b]/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#064e3b]/50 uppercase tracking-widest">Rasio Konversi</span>
            <Globe className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div className="text-2xl font-black text-[#064e3b] mt-4">
            {totalInvitations > 0 ? ((activeInvitations / totalInvitations) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-[10px] font-bold text-[#064e3b]/60 mt-2">
            Rasio draf terbit menjadi aktif
          </div>
        </div>
      </div>

      {/* RECENT DATA SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Invitations */}
        <div className="bg-white border border-[#064e3b]/10 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#064e3b]/10 pb-4">
            <h3 className="text-lg font-black flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#d4af37]" />
              Pendaftaran Undangan Terbaru
            </h3>
            <Link 
              href="/dashboard/invitations" 
              className="text-xs font-black text-[#d4af37] hover:text-[#d4af37]/80 uppercase tracking-wider"
            >
              Semua
            </Link>
          </div>

          <div className="divide-y divide-[#064e3b]/10">
            {recentInvitations.map((inv) => (
              <div key={inv.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#064e3b]">/u/{inv.slug}</span>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${
                      inv.status === "ACTIVE"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-amber-50 border-amber-200 text-amber-800"
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <div className="text-xs text-[#064e3b]/60 font-semibold">
                    Email: {inv.user.email} • Template: {inv.template.nama_template}
                  </div>
                </div>
                <Link
                  href={`/builder/${inv.id}`}
                  target="_blank"
                  className="p-1.5 hover:bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-lg text-[#064e3b] transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            ))}
            {recentInvitations.length === 0 && (
              <div className="text-center py-6 text-xs text-[#064e3b]/50">
                Belum ada pendaftaran undangan masuk.
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white border border-[#064e3b]/10 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#064e3b]/10 pb-4">
            <h3 className="text-lg font-black flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#d4af37]" />
              Transaksi Terbaru
            </h3>
            <Link 
              href="/dashboard/payments" 
              className="text-xs font-black text-[#d4af37] hover:text-[#d4af37]/80 uppercase tracking-wider"
            >
              Semua
            </Link>
          </div>

          <div className="divide-y divide-[#064e3b]/10">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#064e3b]">{formatRupiah(Number(tx.nominal))}</span>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${
                      tx.status_pembayaran === "SUCCESS"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : tx.status_pembayaran === "PENDING"
                        ? "bg-amber-50 border-amber-200 text-amber-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}>
                      {tx.status_pembayaran}
                    </span>
                  </div>
                  <div className="text-xs text-[#064e3b]/60 font-semibold">
                    User: {tx.user.email} • Method: {tx.metode_pembayaran || "QRIS"}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#064e3b]/40">
                  {new Date(tx.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short"
                  })}
                </span>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <div className="text-center py-6 text-xs text-[#064e3b]/50">
                Belum ada transaksi terekam.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
