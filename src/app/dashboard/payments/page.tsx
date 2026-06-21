import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  HelpCircle,
  FileSpreadsheet
} from "lucide-react";

export default async function PaymentsPageAdmin() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  // Fetch transactions and compute metrics
  const transactions = await db.transaction.findMany({
    orderBy: { created_at: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  const successTransactions = transactions.filter(t => t.status_pembayaran === "SUCCESS");
  const pendingTransactions = transactions.filter(t => t.status_pembayaran === "PENDING");
  const failedTransactions = transactions.filter(t => ["FAILED", "EXPIRED"].includes(t.status_pembayaran));

  const totalRevenue = successTransactions.reduce((sum, tx) => sum + Number(tx.nominal), 0);
  const totalSuccessCount = successTransactions.length;
  const totalPendingCount = pendingTransactions.length;
  const totalFailedCount = failedTransactions.length;

  // Average transaction value
  const averageValue = totalSuccessCount > 0 ? totalRevenue / totalSuccessCount : 0;

  // Payment Method Breakdown
  const methodCounts: Record<string, number> = {};
  successTransactions.forEach(tx => {
    const method = tx.metode_pembayaran || "QRIS";
    methodCounts[method] = (methodCounts[method] || 0) + 1;
  });

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
      <div>
        <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
          <CreditCard className="w-3.5 h-3.5" />
          Pembayaran & Keuangan
        </span>
        <h1 className="text-3xl font-black text-[#064e3b] tracking-tight">Laporan Keuangan</h1>
        <p className="text-[#064e3b]/70 text-sm mt-1">
          Pantau omzet penjualan, riwayat pembayaran lunas, status tagihan tertunda, dan rasio metode pembayaran.
        </p>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Omzet */}
        <div className="bg-white border border-[#064e3b]/10 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#064e3b]/50 uppercase tracking-widest">Total Pendapatan (Omzet)</span>
            <DollarSign className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div className="text-2xl font-black text-[#064e3b] mt-4">{formatRupiah(totalRevenue)}</div>
          <div className="text-[10px] font-bold text-emerald-700 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Dari {totalSuccessCount} invoice lunas
          </div>
        </div>

        {/* Average Transaction Value */}
        <div className="bg-white border border-[#064e3b]/10 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#064e3b]/50 uppercase tracking-widest">Rata-Rata Keranjang</span>
            <TrendingUp className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div className="text-2xl font-black text-[#064e3b] mt-4">{formatRupiah(averageValue)}</div>
          <div className="text-[10px] font-bold text-[#064e3b]/60 mt-2">
            Nilai transaksi rata-rata
          </div>
        </div>

        {/* Pending Invoices */}
        <div className="bg-white border border-[#064e3b]/10 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#064e3b]/50 uppercase tracking-widest">Invoice Pending</span>
            <HelpCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-[#064e3b] mt-4">{totalPendingCount}</div>
          <div className="text-[10px] font-bold text-amber-700 mt-2">
            Menunggu pembayaran user
          </div>
        </div>

        {/* Failed / Expired Invoices */}
        <div className="bg-white border border-[#064e3b]/10 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-[#064e3b]/50 uppercase tracking-widest">Invoice Gagal/Kedaluwarsa</span>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-2xl font-black text-[#064e3b] mt-4">{totalFailedCount}</div>
          <div className="text-[10px] font-bold text-red-700 mt-2">
            Kedaluwarsa atau dibatalkan
          </div>
        </div>
      </div>

      {/* METHOD BREAKDOWN & TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Method Breakdown */}
        <div className="bg-white border border-[#064e3b]/10 rounded-3xl p-6 shadow-sm space-y-6 h-fit">
          <h3 className="text-lg font-black border-b border-[#064e3b]/10 pb-4 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#d4af37]" />
            Metode Pembayaran Sukses
          </h3>
          <div className="space-y-4">
            {Object.entries(methodCounts).map(([method, count]) => (
              <div key={method} className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#064e3b]/80">{method}</span>
                <span className="px-3 py-1 bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-full text-xs font-black">
                  {count} Transaksi
                </span>
              </div>
            ))}
            {Object.keys(methodCounts).length === 0 && (
              <div className="text-center py-6 text-xs text-[#064e3b]/50">
                Belum ada transaksi sukses tercatat.
              </div>
            )}
          </div>
        </div>

        {/* History Logs */}
        <div className="lg:col-span-2 bg-white border border-[#064e3b]/10 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-black border-b border-[#064e3b]/10 pb-4">
            Log Transaksi Lengkap
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-[#064e3b]/5 border-b border-[#064e3b]/10 text-[#064e3b] font-black uppercase tracking-wider">
                  <th className="px-4 py-3">ID Transaksi</th>
                  <th className="px-4 py-3">Nama / Email</th>
                  <th className="px-4 py-3">Nominal</th>
                  <th className="px-4 py-3">Metode</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#064e3b]/10">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#064e3b]/5 transition-colors">
                    <td className="px-4 py-3 font-bold text-[#064e3b]/70 truncate max-w-[100px]">
                      {tx.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <div className="font-bold">{tx.user.name}</div>
                        <div className="text-[10px] text-[#064e3b]/60">{tx.user.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-extrabold">
                      {formatRupiah(Number(tx.nominal))}
                    </td>
                    <td className="px-4 py-3 uppercase text-[#064e3b]/80 font-bold">
                      {tx.metode_pembayaran || "QRIS"}
                    </td>
                    <td className="px-4 py-3 text-[#064e3b]/60 font-semibold">
                      {new Date(tx.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border inline-block ${
                        tx.status_pembayaran === "SUCCESS"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : tx.status_pembayaran === "PENDING"
                          ? "bg-amber-50 border-amber-200 text-amber-800"
                          : "bg-red-50 border-red-200 text-red-800"
                      }`}>
                        {tx.status_pembayaran}
                      </span>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-xs text-[#064e3b]/50">
                      Tidak ada transaksi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
