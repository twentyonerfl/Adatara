import { db } from "@/lib/db";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";
import { TemplateListPublic } from "./TemplateListPublic";

export const revalidate = 0; // Disable server cache for real-time listings

export default async function TemplatesPublicPage() {
  // Fetch published templates from database
  const templates = await db.template.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [
      { created_at: "desc" },
      { id: "asc" }
    ],
  });

  // Fetch categories from database
  const categoriesDb = await db.category.findMany({
    orderBy: { nama: "asc" },
  });

  const categories = categoriesDb.length > 0 
    ? ["Semua", ...categoriesDb.map(c => c.nama)]
    : [
        "Semua",
        "Keagamaan",
        "Aqiqah & Kelahiran",
        "Bisnis & Promosi",
        "Hiburan & Event",
        "Khitanan",
        "Komunitas & Reuni",
        "Lamaran & Pertunangan",
        "Pernikahan",
        "Resepsi Pernikahan",
        "Seminar & Workshop",
        "Syukuran Keluarga",
        "Ulang Tahun",
        "Wisuda & Kelulusan"
      ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5dc] text-[#064e3b] font-sans">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#f5f5dc]/80 border-b border-[#064e3b]/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-wide text-[#064e3b]">
            <Sparkles className="w-7 h-7 text-[#d4af37] animate-pulse" />
            Adatara
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="px-4 py-2 text-sm font-bold hover:text-[#064e3b] text-[#064e3b]/70 transition-colors">
              Beranda
            </Link>
            <Link href="/login" className="px-5 py-2.5 rounded-full text-sm font-bold bg-[#064e3b]/10 hover:bg-[#064e3b]/15 text-[#064e3b] border border-[#064e3b]/20 transition-all duration-300">
              Admin Panel
            </Link>
          </div>
        </div>
      </header>

      {/* CONTENT AREA */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#064e3b]/5 border border-[#064e3b]/10 text-xs font-bold text-[#064e3b] mb-4">
            <Heart className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
            Desain Undangan Premium Tanpa Login
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#064e3b] tracking-tight">Pilih Template Terbaik</h1>
          <p className="text-[#064e3b]/70 text-sm mt-1 max-w-xl">
            Pilih tema desain dasar favorit Anda, isi data acara secara langsung, bayar, dan aktifkan undangan digital instan Anda.
          </p>
        </div>

        <TemplateListPublic templates={templates} categories={categories} />
      </main>

      {/* FOOTER */}
      <footer className="bg-[#f5f5dc] border-t border-[#064e3b]/10 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#064e3b]/60">
          <div className="flex items-center gap-2 font-bold text-lg text-[#064e3b]">
            <Sparkles className="w-5 h-5 text-[#d4af37]" />
            Adatara
          </div>
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} Adatara. Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>
      </footer>
    </div>
  );
}
