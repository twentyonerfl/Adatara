"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getPublishedTemplates } from "./templates/actions";
import { CoverPreview } from "./dashboard/templates/BuilderTabsCoverPembuka";
import { 
  Sparkles, 
  Layers, 
  Music, 
  MapPin, 
  Image as ImageIcon, 
  Gift, 
  CheckCircle, 
  Menu, 
  X, 
  ArrowRight, 
  Star, 
  HelpCircle, 
  Heart,
  ChevronDown,
  Clock,
  Users,
  BellRing
} from "lucide-react";

// Mock templates data for interactive showcase
const TEMPLATE_CATEGORIES = [
  "Semua",
  "Pernikahan",
  "Ulang Tahun",
  "Syukuran",
  "Acara Bisnis"
];

const MOCK_TEMPLATES = [
  {
    id: "1",
    nama: "Rustik Romantis",
    kategori: "Pernikahan",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
    warna: "bg-[#064e3b]",
    deskripsi: "Desain hangat dengan nuansa kayu, bunga kering, dan estetika vintage."
  },
  {
    id: "2",
    nama: "Minimalis Elegan",
    kategori: "Pernikahan",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
    warna: "bg-[#d4af37]",
    deskripsi: "Sentuhan modern monokrom dengan tipografi serif klasik mewah."
  },
  {
    id: "3",
    nama: "Neon Party",
    kategori: "Ulang Tahun",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop",
    warna: "bg-rose-700",
    deskripsi: "Penuh energi, warna gradasi neon terang, cocok untuk pesta meriah."
  },
  {
    id: "4",
    nama: "Syukuran Aqiqah",
    kategori: "Syukuran",
    image: "https://images.unsplash.com/photo-1507504038482-762618d23dd5?q=80&w=600&auto=format&fit=crop",
    warna: "bg-emerald-800",
    deskripsi: "Desain lembut berkarakter ilustrasi anak yang bersih dan religius."
  },
  {
    id: "5",
    nama: "Summit Bisnis",
    kategori: "Acara Bisnis",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop",
    warna: "bg-slate-800",
    deskripsi: "Profesional, rapi, dengan layout jadwal acara terintegrasi map."
  },
  {
    id: "6",
    nama: "Emas Kerajaan",
    kategori: "Pernikahan",
    image: "https://images.unsplash.com/photo-1519225495810-7512c696505a?q=80&w=600&auto=format&fit=crop",
    warna: "bg-[#d4af37] text-[#064e3b]",
    deskripsi: "Ornamen ukiran emas berlatar gelap yang menyiratkan kemegahan."
  }
];

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

const getSafeThumbnail = (url?: string) => {
  if (!url || (!url.startsWith("http") && !url.startsWith("/") && !url.startsWith("data:image"))) {
    return "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop";
  }
  return url;
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    async function loadTemplates() {
      const res = await getPublishedTemplates();
      if (res?.success && res.templates && res.templates.length > 0) {
        const mapped = res.templates.map((t: any) => ({
          id: t.id,
          nama: t.nama_template,
          kategori: t.kategori,
          image: t.thumbnail,
          warna: "bg-[#064e3b]",
          deskripsi: t.deskripsi || "Tidak ada deskripsi.",
          template_json: t.template_json
        }));
        setTemplates(mapped);
      } else {
        setTemplates(MOCK_TEMPLATES);
      }
    }
    loadTemplates();
  }, []);

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
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#f5f5dc]/80 border-b border-[#064e3b]/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-wide text-[#064e3b]">
            <Sparkles className="w-7 h-7 text-[#d4af37] animate-pulse" />
            Adatara
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#064e3b]/80">
            <a href="#fitur" className="hover:text-[#064e3b] transition-colors">Fitur</a>
            <a href="#template" className="hover:text-[#064e3b] transition-colors">Template</a>
            <a href="#harga" className="hover:text-[#064e3b] transition-colors">Harga</a>
            <a href="#faq" className="hover:text-[#064e3b] transition-colors">FAQ</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="px-4 py-2 text-sm font-bold hover:text-[#064e3b] text-[#064e3b]/70 transition-colors">
              Masuk
            </Link>
            <Link href="/templates" className="px-5 py-2.5 rounded-full text-sm font-bold bg-[#064e3b] hover:bg-[#064e3b]/95 text-[#f5f5dc] border border-[#d4af37] shadow-lg shadow-[#064e3b]/10 transition-all duration-300">
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
              <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className="text-[#064e3b]/70 hover:text-[#064e3b]">Fitur</a>
              <a href="#template" onClick={() => setMobileMenuOpen(false)} className="text-[#064e3b]/70 hover:text-[#064e3b]">Template</a>
              <a href="#harga" onClick={() => setMobileMenuOpen(false)} className="text-[#064e3b]/70 hover:text-[#064e3b]">Harga</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-[#064e3b]/70 hover:text-[#064e3b]">FAQ</a>
              <hr className="border-[#064e3b]/10 my-1" />
              <div className="flex flex-col gap-3">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 text-[#064e3b]/70 font-semibold hover:text-[#064e3b]">
                  Masuk
                </Link>
                <Link href="/templates" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-3 rounded-xl bg-[#064e3b] text-[#f5f5dc] border border-[#d4af37] font-semibold">
                  Buat Undangan
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#064e3b]/5 border border-[#064e3b]/10 text-xs font-bold text-[#064e3b] mb-8">
            <Heart className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37] animate-pulse" />
            #1 Platform Undangan Digital Terpercaya
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight max-w-5xl mb-6 text-[#064e3b]">
            Undangan Digital Elegan,<br />
            <span className="bg-gradient-to-r from-[#064e3b] via-[#a68c26] to-[#d4af37] bg-clip-text text-transparent">Dibuat dalam Hitungan Menit.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-[#064e3b]/80 max-w-3xl leading-relaxed mb-10">
            Adatara membantu Anda mendesain, menyesuaikan, dan menyebarkan undangan digital premium untuk Pernikahan, Ulang Tahun, Syukuran dengan Musik Latar, Galeri Foto, RSVP Otomatis, dan Amplop Digital Cashless.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center w-full mb-16">
            <Link href="/templates" className="w-full sm:w-auto px-8 py-4 rounded-full font-bold bg-[#064e3b] hover:bg-[#064e3b]/90 text-[#f5f5dc] border border-[#d4af37] flex items-center justify-center gap-2 shadow-xl shadow-[#064e3b]/10 group transition-all">
              Mulai Buat Gratis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#template" className="w-full sm:w-auto px-8 py-4 rounded-full font-bold bg-[#f5f5dc] border border-[#064e3b]/20 text-[#064e3b] hover:bg-[#064e3b]/5 transition-all text-center">
              Lihat Template
            </a>
          </div>
        </motion.div>

        {/* HERO VISUAL/MOCKUP */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative w-full max-w-5xl rounded-2xl border border-[#064e3b]/20 bg-[#f5f5dc] p-3 shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#064e3b]/5 to-[#d4af37]/5 rounded-2xl pointer-events-none" />
          <div className="w-full h-[320px] sm:h-[480px] md:h-[540px] rounded-xl overflow-hidden bg-[#064e3b]/10 relative">
            <img 
              src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1200&auto=format&fit=crop" 
              alt="Dashboard Preview" 
              className="w-full h-full object-cover opacity-90"
            />
            {/* Overlay builder simulation UI */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#f5f5dc] via-[#f5f5dc]/80 to-transparent p-6 text-left flex flex-col justify-end border-t border-[#064e3b]/10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-black text-[#d4af37] uppercase tracking-widest">Adatara Live Editor</span>
                  <h3 className="text-xl sm:text-2xl font-black mt-1 text-[#064e3b]">Sistem Drag & Drop Mudah untuk Kustomisasi</h3>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1 bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-lg text-xs font-bold text-[#064e3b]">Responsif Seluler</div>
                  <div className="px-3 py-1 bg-[#064e3b] text-white text-xs font-bold rounded-lg">Pratinjau Instan</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
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
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-extrabold text-[#d4af37] uppercase tracking-widest">Galeri Desain</h2>
              <h3 className="text-3xl sm:text-4xl font-black mt-2 text-[#064e3b]">Pilih Template Favorit Anda</h3>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mt-6 md:mt-0 bg-[#064e3b]/5 p-1.5 rounded-xl border border-[#064e3b]/10">
              {TEMPLATE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#064e3b] text-[#f5f5dc] shadow-md"
                      : "text-[#064e3b]/60 hover:text-[#064e3b]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Template Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={template.id}
                  className="group bg-[#064e3b]/5 border border-[#064e3b]/10 hover:border-[#d4af37]/40 rounded-2xl overflow-hidden flex flex-col"
                >
                  <div className="w-full aspect-[9/16] overflow-hidden relative bg-[#064e3b]/10 rounded-t-2xl">
                    {template.template_json?.cover ? (
                      <div className="w-full h-full pointer-events-none select-none">
                        <CoverPreview 
                          data={template.template_json.cover} 
                          meta={{ kategori: template.kategori, bahasa: "id" }} 
                        />
                      </div>
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
                          <h1 className="leading-tight text-2xl font-black text-white break-words">
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
                    )}
                    <div className="absolute top-4 left-4 z-20">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-[#f5f5dc] uppercase tracking-wider ${template.warna}`}>
                        {template.kategori}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h4 className="text-lg font-black text-[#064e3b] group-hover:text-[#d4af37] transition-colors">{template.nama}</h4>
                    <p className="text-[#064e3b]/70 text-xs mt-2 line-clamp-2 leading-relaxed flex-1">
                      {template.deskripsi}
                    </p>
                    <div className="mt-6 pt-4 border-t border-[#064e3b]/10 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#064e3b]/50">Demo Desain</span>
                      <Link href={`/demo/${template.id}`} className="text-xs font-bold text-[#064e3b] hover:text-[#d4af37] flex items-center gap-1">
                        Lihat Live Demo
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
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
