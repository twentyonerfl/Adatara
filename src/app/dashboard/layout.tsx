import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  LayoutDashboard,
  Palette,
  LogOut,
  CreditCard,
  Layers,
  FileText,
  Gift,
  Home
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "SUPER_ADMIN") {
    redirect("/templates");
  }

  return (
    <div className="min-h-screen bg-[#f5f5dc] text-[#064e3b] flex flex-col md:flex-row font-sans">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#064e3b]/10 bg-[#f5f5dc] md:sticky md:top-0 md:h-screen flex flex-col shrink-0 shadow-lg shadow-[#064e3b]/5">
        {/* Logo */}
        <div className="p-6 border-b border-[#064e3b]/10 flex items-center justify-between bg-[#064e3b]/5">
          <Link href="/dashboard" className="flex items-center gap-2 font-black text-xl tracking-wider text-[#064e3b]">
            <Sparkles className="w-6 h-6 text-[#d4af37] animate-pulse" />
            Adatara Panel
          </Link>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-[#064e3b]/10 flex items-center gap-3 bg-[#064e3b]/5">
          <div className="w-10 h-10 rounded-full bg-[#064e3b] border border-[#d4af37] flex items-center justify-center text-[#f5f5dc] font-bold uppercase text-sm shadow-md">
            {session.user.name.charAt(0)}
          </div>
          <div className="overflow-hidden flex-1">
            <h4 className="text-sm font-bold text-[#064e3b] truncate">{session.user.name}</h4>
            <span className="text-[9px] font-black text-[#d4af37] uppercase bg-[#064e3b] px-2.5 py-0.5 rounded-full border border-[#d4af37]/40 inline-block mt-1 tracking-wider">
              {session.user.role || "USER"}
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="p-4 flex-1 flex flex-col gap-1.5">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black text-[#064e3b]/70 hover:text-[#064e3b] hover:bg-[#064e3b]/5 border border-transparent hover:border-[#064e3b]/10 transition-all uppercase tracking-wider"
          >
            <LayoutDashboard className="w-4 h-4 text-[#d4af37]" />
            Overview
          </Link>
          <Link
            href="/dashboard/homepage"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black text-[#064e3b]/70 hover:text-[#064e3b] hover:bg-[#064e3b]/5 border border-transparent hover:border-[#064e3b]/10 transition-all uppercase tracking-wider"
          >
            <Home className="w-4 h-4 text-[#d4af37]" />
            Kustom Beranda
          </Link>
          <Link
            href="/dashboard/categories"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black text-[#064e3b]/70 hover:text-[#064e3b] hover:bg-[#064e3b]/5 border border-transparent hover:border-[#064e3b]/10 transition-all uppercase tracking-wider"
          >
            <Layers className="w-4 h-4 text-[#d4af37]" />
            Kategori Undangan
          </Link>
          <Link
            href="/dashboard/templates"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black text-[#064e3b]/70 hover:text-[#064e3b] hover:bg-[#064e3b]/5 border border-transparent hover:border-[#064e3b]/10 transition-all uppercase tracking-wider"
          >
            <Palette className="w-4 h-4 text-[#d4af37]" />
            Template Builder
          </Link>
          <Link
            href="/dashboard/invitations"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black text-[#064e3b]/70 hover:text-[#064e3b] hover:bg-[#064e3b]/5 border border-transparent hover:border-[#064e3b]/10 transition-all uppercase tracking-wider"
          >
            <FileText className="w-4 h-4 text-[#d4af37]" />
            Daftar Undangan
          </Link>
          <Link
            href="/dashboard/packages"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black text-[#064e3b]/70 hover:text-[#064e3b] hover:bg-[#064e3b]/5 border border-transparent hover:border-[#064e3b]/10 transition-all uppercase tracking-wider"
          >
            <Gift className="w-4 h-4 text-[#d4af37]" />
            Paket Undangan
          </Link>
          <Link
            href="/dashboard/payments"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black text-[#064e3b]/70 hover:text-[#064e3b] hover:bg-[#064e3b]/5 border border-transparent hover:border-[#064e3b]/10 transition-all uppercase tracking-wider"
          >
            <CreditCard className="w-4 h-4 text-[#d4af37]" />
            Pembayaran & Keuangan
          </Link>
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-[#064e3b]/10">
          <LogoutButton />
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#f5f5dc]/90 backdrop-blur-sm border-b border-[#064e3b]/10 px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-black text-[#064e3b]/40 uppercase tracking-widest">
            <span className="text-[#d4af37]">✦</span>
            Adatara Admin Panel
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#064e3b]/10 rounded-full text-[10px] font-black text-[#064e3b]/60 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Sistem Aktif
          </div>
        </div>
        {/* Page Content */}
        <div className="flex-1 p-6 sm:p-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
