"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ScaledCoverPreview } from "./dashboard/templates/BuilderTabsCoverPembuka";
import { 
  Sparkles, 
  Layers, 
  Music, 
  MapPin, 
  Gift, 
  CheckCircle, 
  Menu, 
  X, 
  ArrowRight, 
  HelpCircle, 
  ChevronDown,
  Clock,
  BellRing,
  Palette
} from "lucide-react";

const getSafeThumbnail = (url?: string) => {
  if (!url || (!url.startsWith("http") && !url.startsWith("/") && !url.startsWith("data:image"))) {
    return "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop";
  }
  return url;
};

// Mock FAQs data
const MOCK_FAQS = [
  {
    tanya: "Apakah saya bisa mengubah data undangan setelah dipublikasikan?",
    jawab: "Ya, tentu saja. Anda dapat memperbarui data acara, foto, musik, lokasi, hingga daftar tamu kapan saja melalui Dashboard Adatara secara real-time tanpa mengubah link sebaran."
  },
  {
    tanya: "Bagaimana cara tamu mengisi RSVP?",
    jawab: "Tamu cukup mengklik tombol RSVP di halaman undangan, mengisi nama, jumlah kehadiran, dan ucapan doa. Hasilnya akan langsung masuk ke dashboard Anda dan dikirimkan via notifikasi."
  },
  {
    tanya: "Bagaimana metode pembayaran langganan?",
    jawab: "Kami menggunakan Midtrans sebagai payment gateway aman. Anda bisa membayar dengan GoPay, ShopeePay, QRIS, Transfer Bank (Virtual Account), hingga kartu kredit."
  },
  {
    tanya: "Apakah undangan digital ini ramah pengguna mobile?",
    jawab: "Tentu. Setiap undangan dirancang khusus dengan prinsip Mobile-First untuk memastikan tampilan super responsif dan cepat saat dibuka di smartphone tamu Anda."
  }
];

export default function HomeClient({
  initialTemplates,
  initialCategories
}: {
  initialTemplates: any[];
  initialCategories: string[];
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [templates] = useState<any[]>(initialTemplates);
  const [categories] = useState<string[]>(initialCategories);

  const filteredTemplates = selectedCategory === "Semua" 
    ? templates 
    : templates.filter(t => t.kategori === selectedCategory);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5dc] text-[#064e3b] overflow-x-hidden font-sans">
      {/* BACKGROUND GRADIENT GLOWS */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#064e3b]/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[#d4af37]/5 blur-[180px] rounded-full pointer-events-none -z-10" />

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#f5f5dc]/90 border-b border-[#064e3b]/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 font-bold tracking-wide text-[#064e3b] select-none">
            <span className="font-extrabold text-2xl uppercase tracking-wider text-[#064e3b]">Adatara</span>
            <span className="px-1.5 py-0.5 rounded bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 text-[9px] font-black tracking-widest uppercase">Saas</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#064e3b]/80">
            <a href="#" className="text-[#064e3b] font-bold transition-colors">Beranda</a>
            <a href="#fitur" className="hover:text-[#064e3b] transition-colors">Cara Order</a>
            <a href="#template" className="hover:text-[#064e3b] transition-colors">Katalog</a>
            <a href="#fitur" className="hover:text-[#064e3b] transition-colors">Fitur</a>
            <a href="#harga" className="hover:text-[#064e3b] transition-colors">Paket Harga</a>
            <a href="#faq" className="hover:text-[#064e3b] transition-colors">FAQ</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold text-[#064e3b]/80 hover:text-[#064e3b] transition-colors">
              Login Admin
            </Link>
            <Link href="/templates" className="px-6 py-2.5 rounded-full text-sm font-black bg-[#064e3b] hover:bg-[#064e3b]/95 text-white border border-[#d4af37]/50 shadow-md shadow-[#064e3b]/10 transition-all duration-300">
              Buat Undangan
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#064e3b]/80 hover:text-[#064e3b] md:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[#064e3b]/10 bg-[#f5f5dc] px-6 py-6 flex flex-col gap-5 text-base font-semibold"
            >
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-[#064e3b] font-bold">Beranda</Link>
              <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className="text-[#064e3b]/70 hover:text-[#064e3b]">Cara Order</a>
              <a href="#template" onClick={() => setMobileMenuOpen(false)} className="text-[#064e3b]/70 hover:text-[#064e3b]">Katalog</a>
              <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className="text-[#064e3b]/70 hover:text-[#064e3b]">Fitur</a>
              <a href="#harga" onClick={() => setMobileMenuOpen(false)} className="text-[#064e3b]/70 hover:text-[#064e3b]">Paket Harga</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-[#064e3b]/70 hover:text-[#064e3b]">FAQ</a>
              <hr className="border-[#064e3b]/10 my-1" />
              <div className="flex flex-col gap-3">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 text-[#064e3b]/70 font-semibold hover:text-[#064e3b]">
                  Login Admin
                </Link>
                <Link href="/templates" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-3 rounded-xl bg-[#064e3b] text-white border border-[#d4af37] font-semibold">
                  Buat Undangan
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column (Hero Content) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[10px] font-black text-[#d4af37] tracking-widest uppercase mb-6 select-none">
              ✈ ELEGANT NUSANTARA HERITAGE
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight leading-tight text-[#064e3b] mb-6 font-serif max-w-2xl">
              Abadikan Momen Berharga Anda Dengan Kemewahan <span className="text-[#d4af37]">Digital</span>
            </h1>

            {/* Subtitle / Paragraph */}
            <p className="text-sm sm:text-base text-[#064e3b]/70 max-w-xl leading-relaxed mb-8 font-medium">
              Platform SaaS undangan digital premium nomor satu di Indonesia. Didesain khusus dengan perpaduan keindahan ornamen Nusantara, kemewahan modern, dan animasi interaktif terbaik.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href="/templates" className="w-full sm:w-auto px-7 py-3.5 rounded-full font-black bg-[#064e3b] hover:bg-[#064e3b]/95 text-white border border-[#d4af37]/50 shadow-md shadow-[#064e3b]/10 transition-all text-center">
                Buat Undangan Sekarang
              </Link>
              <a href="#template" className="w-full sm:w-auto px-7 py-3.5 rounded-full font-black bg-white hover:bg-[#064e3b]/5 border border-[#064e3b]/20 text-[#064e3b] transition-all text-center">
                Lihat Katalog Demo
              </a>
            </div>
          </motion.div>

          {/* Right Column (Hero Visual - Smartphone Mockup) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center items-center relative"
          >
            {/* Soft gold glow background behind phone */}
            <div className="absolute w-72 h-72 bg-[#d4af37]/10 blur-[80px] rounded-full -z-10 pointer-events-none" />

            {/* Outer Smartphone Shell */}
            <div className="relative w-[270px] sm:w-[290px] aspect-[9/18.5] bg-[#0c1322] rounded-[45px] p-2.5 shadow-2xl border-[5px] border-[#222f46] flex flex-col justify-between">
              {/* Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-[#0c1322] rounded-full z-30 flex items-center justify-between px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                <div className="w-8 h-1 bg-slate-800 rounded-full" />
              </div>

              {/* Inner Screen Container */}
              <div className="w-full h-full bg-[#f5f5dc] rounded-[36px] overflow-hidden border border-black/10 relative flex flex-col select-none">
                {/* Mock Phone Header / Navbar */}
                <div className="h-11 px-4 flex items-center justify-between border-b border-[#064e3b]/5 bg-[#f5f5dc]/90 z-20 pt-2.5">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-xs uppercase tracking-wider text-[#064e3b]">Adatara</span>
                    <span className="px-1 py-0.25 rounded bg-[#d4af37]/10 text-[#d4af37] text-[6px] font-black tracking-widest uppercase">Saas</span>
                  </div>
                  {/* Hamburger menu icon */}
                  <div className="flex flex-col gap-0.75 cursor-pointer">
                    <div className="w-3.5 h-0.5 bg-[#064e3b] rounded" />
                    <div className="w-3.5 h-0.5 bg-[#064e3b] rounded" />
                    <div className="w-3.5 h-0.5 bg-[#064e3b] rounded" />
                  </div>
                </div>

                {/* Mock Page Content (Simulated Template Preview) */}
                <div className="flex-1 flex flex-col items-center justify-center p-5 text-center bg-[#f5f5dc] relative overflow-hidden">
                  {/* Decorative background vectors or shapes */}
                  <div className="absolute top-2 left-2 w-16 h-16 border-t border-l border-[#d4af37]/20 pointer-events-none" />
                  <div className="absolute bottom-2 right-2 w-16 h-16 border-b border-r border-[#d4af37]/20 pointer-events-none" />
                  
                  {/* Content elements matching smartphone inside the image */}
                  <div className="space-y-4 max-w-[200px] my-auto">
                    {/* Badge */}
                    <div className="inline-block px-3 py-1 rounded bg-[#d4af37]/5 border border-[#d4af37]/15 text-[7px] font-bold text-[#d4af37] tracking-widest uppercase">
                      GALERI DESAIN PREMIUM
                    </div>

                    {/* Main Title */}
                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#064e3b] leading-tight">
                      Pilih Desain Eksklusif Anda
                    </h2>

                    {/* Divider decoration */}
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-6 h-[0.5px] bg-[#d4af37]/30" />
                      <span className="text-[8px] text-[#d4af37]">✦</span>
                      <div className="w-6 h-[0.5px] bg-[#d4af37]/30" />
                    </div>

                    {/* Desc */}
                    <p className="text-[9px] text-[#064e3b]/70 leading-relaxed font-medium">
                      Sesuaikan tema undangan dengan tradisi, gaya modern, atau konsep khidmat acara Anda. Semua terintegrasi dalam sistem kami.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-[#f5f5dc] border-y border-[#064e3b]/10 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#064e3b]">10,000+</div>
            <p className="text-sm text-[#064e3b]/70 mt-2 font-bold">Undangan Dibuat</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#d4af37]">150,000+</div>
            <p className="text-sm text-[#064e3b]/70 mt-2 font-bold">Tamu Terundang</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#064e3b]">50+</div>
            <p className="text-sm text-[#064e3b]/70 mt-2 font-bold">Template Premium</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#d4af37]">99.9%</div>
            <p className="text-sm text-[#064e3b]/70 mt-2 font-bold">Uptime Server</p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="fitur" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold text-[#d4af37] uppercase tracking-widest">Fitur Unggulan</h2>
          <h3 className="text-3xl sm:text-4xl font-black mt-2 mb-4 text-[#064e3b]">Semua yang Anda Butuhkan untuk Undangan Sempurna</h3>
          <p className="text-[#064e3b]/70 leading-relaxed">
            Adatara dirancang dengan fitur terkini yang mempermudah tamu Anda menerima, mengonfirmasi, dan merayakan momen kebahagiaan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <div className="bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-2xl p-8 hover:border-[#d4af37]/40 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-[#064e3b]/10 flex items-center justify-center text-[#064e3b] mb-6 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-black mb-3 text-[#064e3b]">Real-Time Template Builder</h4>
            <p className="text-[#064e3b]/70 text-sm leading-relaxed">
              Pilih dari 6 modul visual utama (Cover, Pembuka, Profil, Acara, Cerita/Galeri, RSVP). Edit teks, tata letak, warna, dan font secara instan.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-2xl p-8 hover:border-[#d4af37]/40 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mb-6 group-hover:scale-110 transition-transform">
              <Music className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-black mb-3 text-[#064e3b]">Audio Latar & Galeri Media</h4>
            <p className="text-[#064e3b]/70 text-sm leading-relaxed">
              Tambahkan musik romantis dari library kami atau unggah file MP3 Anda sendiri. Dukungan galeri foto berformat Grid, Masonry, Carousel, hingga Pinterest style.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-2xl p-8 hover:border-[#d4af37]/40 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-[#064e3b]/10 flex items-center justify-center text-[#064e3b] mb-6 group-hover:scale-110 transition-transform">
              <BellRing className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-black mb-3 text-[#064e3b]">RSVP & Ucapan Real-Time</h4>
            <p className="text-[#064e3b]/70 text-sm leading-relaxed">
              Tamu dapat melakukan konfirmasi kehadiran secara instan. Anda mendapatkan daftar rekapitulasi kehadiran (RSVP) langsung dari dashboard.
            </p>
          </div>

          {/* Feature Card 4 */}
          <div className="bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-2xl p-8 hover:border-[#d4af37]/40 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mb-6 group-hover:scale-110 transition-transform">
              <Gift className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-black mb-3 text-[#064e3b]">Kado & Amplop Digital</h4>
            <p className="text-[#064e3b]/70 text-sm leading-relaxed">
              Sediakan nomor rekening bank, e-wallet, atau barcode QRIS di dalam undangan untuk memudahkan tamu mengirimkan kado/amplop secara cashless.
            </p>
          </div>

          {/* Feature Card 5 */}
          <div className="bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-2xl p-8 hover:border-[#d4af37]/40 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-[#064e3b]/10 flex items-center justify-center text-[#064e3b] mb-6 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-black mb-3 text-[#064e3b]">Petunjuk Lokasi & Kalender</h4>
            <p className="text-[#064e3b]/70 text-sm leading-relaxed">
              Tamu Anda tidak akan tersesat berkat peta interaktif Google Maps. Dilengkapi fitur pencatatan otomatis di Google Calendar.
            </p>
          </div>

          {/* Feature Card 6 */}
          <div className="bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-2xl p-8 hover:border-[#d4af37]/40 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mb-6 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-black mb-3 text-[#064e3b]">Countdown Hitung Mundur</h4>
            <p className="text-[#064e3b]/70 text-sm leading-relaxed">
              Tampilkan penghitung waktu mundur otomatis yang presisi hingga detik dimulainya acara utama untuk membangkitkan antusiasme tamu.
            </p>
          </div>
        </div>
      </section>

      {/* TEMPLATES INTERACTIVE SHOWCASE SECTION */}
      <section id="template" className="py-24 bg-[#f5f5dc] border-t border-[#064e3b]/10 px-6 scroll-mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col mb-8 text-left">
            <h2 className="text-xs font-extrabold text-[#d4af37] uppercase tracking-widest">Galeri Desain</h2>
            <h3 className="text-3xl sm:text-4xl font-black mt-2 text-[#064e3b]">Pilih Template Favorit Anda</h3>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-12 w-full justify-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? "bg-[#064e3b] text-[#f5f5dc] border-[#d4af37] shadow-md shadow-[#064e3b]/10"
                    : "bg-white/60 hover:bg-white text-[#064e3b]/80 border-[#064e3b]/10 hover:border-[#064e3b]/20 hover:text-[#064e3b]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Template Cards Grid */}
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#064e3b]/5 rounded-3xl shadow-sm max-w-md mx-auto">
              <Palette className="w-12 h-12 text-[#064e3b]/30 mx-auto mb-4" />
              <h4 className="text-base font-black text-[#064e3b]">Tidak Ada Template</h4>
              <p className="text-xs text-[#064e3b]/60 mt-1.5">Belum ada template yang dipublikasikan dalam kategori ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredTemplates.map((template) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={template.id}
                    className="group bg-white border border-[#064e3b]/5 hover:border-[#d4af37]/35 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="w-full aspect-[9/16] overflow-hidden relative bg-[#064e3b]/10 rounded-t-2xl">
                      {(() => {
                        const parsedJson = typeof template.template_json === "string"
                          ? JSON.parse(template.template_json)
                          : template.template_json;
                        const coverData = parsedJson?.cover;
                        return coverData ? (
                          <ScaledCoverPreview 
                            coverData={coverData} 
                            meta={{ kategori: template.kategori, bahasa: "id" }} 
                          />
                        ) : (
                          <div className="w-full h-full relative flex flex-col justify-between p-6 text-center select-none"
                            style={{
                              background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.65)), url(${getSafeThumbnail(template.image)}) center/cover no-repeat`
                            }}
                          >
                            <div className="space-y-2 pt-6">
                              <span className="font-extrabold uppercase tracking-widest text-xs text-white block">
                                UNDANGAN {template.kategori}
                              </span>
                              <div className="h-[1px] w-12 bg-white/30 mx-auto" />
                            </div>
                            <div className="my-auto">
                              <h1 className="leading-tight text-2xl font-black text-white break-words font-serif">
                                {template.nama}
                              </h1>
                            </div>
                            <div className="space-y-4 pb-6">
                              <span className="text-[10px] text-white/60 block font-medium">Kepada Yth. Tamu Undangan</span>
                              <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-xs font-bold text-white shadow-lg mx-auto">
                                Buka Undangan
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    <div className="p-3 flex flex-col flex-1 text-left">
                      {/* Title & Category Badge Row */}
                      <div className="flex items-start justify-between gap-1 min-w-0">
                        <h4 className="text-[11px] font-black text-[#064e3b] group-hover:text-[#d4af37] transition-colors leading-tight flex-1 break-words">
                          {template.nama}
                        </h4>
                        <span className="px-1 py-0.5 rounded bg-[#064e3b]/5 text-[#d4af37]/90 border border-[#d4af37]/15 text-[6.5px] font-extrabold uppercase tracking-wider whitespace-nowrap flex-shrink-0 mt-0.5">
                          {template.kategori}
                        </span>
                      </div>
                      
                      <p className="text-[#064e3b]/60 text-[9.5px] mt-1.5 line-clamp-1 leading-normal flex-1">
                        {template.deskripsi}
                      </p>
                      <div className="mt-3 pt-2.5 border-t border-[#064e3b]/10">
                        <Link 
                          href={`/demo/${template.id}`} 
                          className="w-full py-1.5 bg-[#064e3b] hover:bg-[#064e3b]/95 text-white text-[9px] font-black rounded-lg border border-[#d4af37] flex items-center justify-center gap-1 transition-all shadow-sm shadow-[#064e3b]/5 tracking-wider uppercase"
                        >
                          Live Demo
                          <ArrowRight className="w-2.5 h-2.5 text-[#d4af37]" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="harga" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold text-[#d4af37] uppercase tracking-widest">Paket Harga</h2>
          <h3 className="text-3xl sm:text-4xl font-black mt-2 mb-4 text-[#064e3b]">Investasi Kecil untuk Momen Terindah</h3>
          <p className="text-[#064e3b]/70">
            Tersedia paket langganan fleksibel tanpa biaya tersembunyi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Plan 1: Free */}
          <div className="bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-3xl p-8 flex flex-col hover:border-[#d4af37]/30 transition-all duration-300">
            <div>
              <span className="text-xs font-bold text-[#064e3b]/60 uppercase tracking-wider">PAKET SILVER</span>
              <h4 className="text-3xl font-extrabold text-[#064e3b] mt-4">Rp 0</h4>
              <p className="text-xs text-[#064e3b]/50 mt-1">Selamanya Gratis</p>
              <p className="text-[#064e3b]/70 text-sm mt-6">Cocok untuk mencoba fitur builder dasar kami sebelum memutuskan berlangganan.</p>
            </div>
            
            <hr className="border-[#064e3b]/10 my-8" />

            <ul className="space-y-4 flex-1 text-sm text-[#064e3b]/85">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#064e3b] shrink-0" />
                Masa aktif undangan 3 hari
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#064e3b] shrink-0" />
                Maksimal 50 tamu undangan
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#064e3b] shrink-0" />
                Desain template dasar (Silver)
              </li>
              <li className="flex items-center gap-3 text-[#064e3b]/50">
                <span className="w-4 h-4 inline-flex items-center justify-center font-bold">✕</span>
                Tanpa kustom musik & galeri
              </li>
              <li className="flex items-center gap-3 text-[#064e3b]/50">
                <span className="w-4 h-4 inline-flex items-center justify-center font-bold">✕</span>
                Terdapat watermark brand Adatara
              </li>
            </ul>

            <Link href="/register" className="mt-8 w-full py-3 text-center rounded-xl bg-[#064e3b] hover:bg-[#064e3b]/90 text-white font-bold transition-all">
              Mulai Gratis
            </Link>
          </div>

          {/* Plan 2: Pro */}
          <div className="bg-[#064e3b]/10 border-2 border-[#d4af37] rounded-3xl p-8 flex flex-col relative shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#d4af37] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Paling Populer
            </div>

            <div>
              <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">PAKET GOLD</span>
              <h4 className="text-3xl font-extrabold text-[#064e3b] mt-4">Rp 99.000</h4>
              <p className="text-xs text-[#064e3b]/50 mt-1">Bayar Sekali (Aktif Selamanya)</p>
              <p className="text-[#064e3b]/70 text-sm mt-6">Fitur terlengkap untuk menghadirkan undangan yang elegan dengan ornamen terbaik.</p>
            </div>
            
            <hr className="border-[#064e3b]/10 my-8" />

            <ul className="space-y-4 flex-1 text-sm text-[#064e3b]/85">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#064e3b] shrink-0" />
                Masa aktif undangan selamanya
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#064e3b] shrink-0" />
                Tamu undangan tak terbatas
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#064e3b] shrink-0" />
                Bebas kustom musik latar & audio
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#064e3b] shrink-0" />
                Galeri foto & video tak terbatas
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#064e3b] shrink-0" />
                RSVP & amplop digital cashless
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#064e3b] shrink-0" />
                Bebas watermark brand Adatara
              </li>
            </ul>

            <Link href="/register?plan=gold" className="mt-8 w-full py-4 text-center rounded-xl bg-[#d4af37] hover:bg-[#d4af37]/90 text-[#064e3b] font-extrabold transition-all shadow-lg shadow-[#d4af37]/15">
              Pilih Paket Gold
            </Link>
          </div>

          {/* Plan 3: VIP */}
          <div className="bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-3xl p-8 flex flex-col hover:border-[#d4af37]/30 transition-all duration-300">
            <div>
              <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">PAKET PLATINUM</span>
              <h4 className="text-3xl font-extrabold text-[#064e3b] mt-4">Rp 149.000</h4>
              <p className="text-xs text-[#064e3b]/50 mt-1">Bayar Sekali (Aktif Selamanya)</p>
              <p className="text-[#064e3b]/70 text-sm mt-6">Layanan ekstra VIP untuk Anda yang menginginkan integrasi pesan WhatsApp otomatis.</p>
            </div>
            
            <hr className="border-[#064e3b]/10 my-8" />

            <ul className="space-y-4 flex-1 text-sm text-[#064e3b]/85">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#064e3b] shrink-0" />
                Semua fitur paket GOLD
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#064e3b] shrink-0" />
                Subdomain kustom (.adatara.id/nama)
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#064e3b] shrink-0" />
                100 WhatsApp blast untuk undangan tamu
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-[#064e3b] shrink-0" />
                Prioritas bantuan admin 24/7
              </li>
            </ul>

            <Link href="/register?plan=platinum" className="mt-8 w-full py-3 text-center rounded-xl bg-[#064e3b] hover:bg-[#064e3b]/90 text-white font-bold transition-all">
              Pilih Paket Platinum
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 bg-[#f5f5dc] border-t border-[#064e3b]/10 px-6 scroll-mt-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-extrabold text-[#d4af37] uppercase tracking-widest">Tanya Jawab</h2>
            <h3 className="text-3xl sm:text-4xl font-black mt-2 text-[#064e3b]">Pertanyaan yang Sering Diajukan</h3>
          </div>

          <div className="space-y-4">
            {MOCK_FAQS.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-[#064e3b] hover:text-[#d4af37] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#d4af37] shrink-0" />
                    {faq.tanya}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-[#064e3b]/50 transition-transform ${openFaq === idx ? "rotate-180 text-[#d4af37]" : ""}`} 
                  />
                </button>
                
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 pt-1 text-sm text-[#064e3b]/70 leading-relaxed border-t border-[#064e3b]/5"
                    >
                      {faq.jawab}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-tr from-[#064e3b]/10 via-[#f5f5dc] to-[#d4af37]/10 border-t border-[#064e3b]/10">
        <div className="absolute inset-0 bg-[#f5f5dc]/40 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-[#064e3b] tracking-tight mb-6">
            Siap Membuat Momen Acara Anda Menjadi Lebih Indah?
          </h2>
          <p className="text-[#064e3b]/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Daftar sekarang dan mulailah merancang undangan digital Anda. Gratis biaya pembuatan untuk masa percobaan awal.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold bg-[#064e3b] text-white hover:bg-[#064e3b]/95 transition-all shadow-xl shadow-[#064e3b]/10 group">
            Mulai Buat Sekarang
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

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
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#064e3b] transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-[#064e3b] transition-colors">Kebijakan Privasi</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
