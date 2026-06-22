import { db } from "@/lib/db";
import Link from "next/link";
import { Sparkles, Heart, MapPin, Clock, Mail } from "lucide-react";
import { TemplateListPublic } from "./TemplateListPublic";

export const revalidate = 0; // Disable server cache for real-time listings

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

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
          <Link href="/" className="flex items-center select-none">
            <img
              src="/logo.png"
              alt="Adatara Logo"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="px-4 py-2 text-sm font-bold hover:text-[#064e3b] text-[#064e3b]/70 transition-colors">
              Beranda
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
      <footer className="relative overflow-hidden bg-gradient-to-b from-[#05291e] to-[#031c14] text-[#f5f5dc]/70 border-t border-[#064e3b]/40 pt-20 pb-10 px-6">
        {/* Subtle decorative glow */}
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#d4af37]/[0.02] blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">

            {/* Column 1: Brand Info */}
            <div className="space-y-4 md:space-y-6 col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 select-none">
                <img
                  src="/logo-white.png"
                  alt="Adatara Logo"
                  className="h-8 md:h-12 w-auto object-contain"
                />
              </div>
              <p className="text-xs md:text-sm leading-relaxed text-[#f5f5dc]/80 font-medium">
                Platform pembuatan undangan digital premium terbaik di Indonesia. Hadirkan momen terindah Anda secara elegan, cepat, dan ramah lingkungan.
              </p>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-[#d4af37] hover:border-[#d4af37]/50 hover:bg-white/10 transition-all duration-300"
                >
                  <InstagramIcon className="w-4 h-4 md:w-5 md:h-5" />
                </a>
                <a
                  href="https://wa.me"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-[#d4af37] hover:border-[#d4af37]/50 hover:bg-white/10 transition-all duration-300"
                >
                  <PhoneIcon className="w-4 h-4 md:w-5 md:h-5" />
                </a>
                <a
                  href="mailto:support@adatara.id"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:text-[#d4af37] hover:border-[#d4af37]/50 hover:bg-white/10 transition-all duration-300"
                >
                  <Mail className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              </div>
            </div>

            {/* Column 2: Tautan Penting */}
            <div className="space-y-4 md:space-y-6">
              <h4 className="text-white font-bold text-sm md:text-base uppercase tracking-wider">Tautan Penting</h4>
              <ul className="space-y-2 md:space-y-3.5 text-xs md:text-sm font-medium">
                <li>
                  <Link href="/" className="hover:text-white transition-colors duration-250 flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] scale-0 group-hover:scale-100 transition-transform duration-200" />
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link href="/templates" className="hover:text-white transition-colors duration-250 flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] scale-0 group-hover:scale-100 transition-transform duration-200" />
                    Katalog Undangan
                  </Link>
                </li>
                <li>
                  <Link href="/#harga" className="hover:text-white transition-colors duration-250 flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] scale-0 group-hover:scale-100 transition-transform duration-200" />
                    Paket Harga
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="hover:text-white transition-colors duration-250 flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] scale-0 group-hover:scale-100 transition-transform duration-200" />
                    Tanya Jawab
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Dukungan & Legal */}
            <div className="space-y-4 md:space-y-6">
              <h4 className="text-white font-bold text-sm md:text-base uppercase tracking-wider">Dukungan & Legal</h4>
              <ul className="space-y-2 md:space-y-3.5 text-xs md:text-sm font-medium">
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-250 flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] scale-0 group-hover:scale-100 transition-transform duration-200" />
                    Syarat & Ketentuan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-250 flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] scale-0 group-hover:scale-100 transition-transform duration-200" />
                    Kebijakan Privasi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-250 flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] scale-0 group-hover:scale-100 transition-transform duration-200" />
                    Hubungi Admin
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors duration-250 flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] scale-0 group-hover:scale-100 transition-transform duration-200" />
                    Pusat Bantuan
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Kontak & Jam Layanan */}
            <div className="space-y-4 md:space-y-6 col-span-2 md:col-span-1">
              <h4 className="text-white font-bold text-sm md:text-base uppercase tracking-wider">Kantor & Jam Layanan</h4>
              <ul className="space-y-3 md:space-y-4 text-xs md:text-sm font-medium">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <span>Kota Juang,Bireuen,Aceh,Indonesia</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <span>Jam Layanan:<br />Setiap Hari (08.00 - 17.00 WIB)</span>
                </li>
                <li className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-[#d4af37] bg-white/5 border border-[#d4af37]/20 rounded-full px-2.5 py-1 w-fit">
                  <HeartIcon className="w-3 h-3 fill-current text-[#d4af37]" />
                  <span>Dibuat dengan cinta untuk Anda</span>
                </li>
              </ul>
            </div>

          </div>

          <hr className="border-white/5 my-8" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
            <p>
              © {new Date().getFullYear()} Adatara. Hak Cipta Dilindungi Undang-Undang.
            </p>
            <p className="flex items-center gap-1 text-[#f5f5dc]/55">
              Powered by <span className="text-white font-bold">Adatara Invitation</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
