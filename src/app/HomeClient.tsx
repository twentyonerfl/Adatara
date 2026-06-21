"use client";

import { useState, useEffect } from "react";
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
  Palette,
  Mail
} from "lucide-react";

const getSafeThumbnail = (url?: string) => {
  if (!url || (!url.startsWith("http") && !url.startsWith("/") && !url.startsWith("data:image"))) {
    return "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop";
  }
  return url;
};

function hexToRgba(hex: string, alpha: number) {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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
  initialCategories,
  settings: initialSettings
}: {
  initialTemplates: any[];
  initialCategories: string[];
  settings: any;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [templates] = useState<any[]>(initialTemplates);
  const [categories] = useState<string[]>(initialCategories);

  // Set default settings if not defined or partially defined
  const defaultSettings = {
    hero_title: "Abadikan Momen Berharga Anda Dengan Kemewahan <span class='text-accent'>Digital</span>",
    hero_subtitle: "Platform SaaS undangan digital premium nomor satu di Indonesia. Didesain khusus dengan perpaduan keindahan ornamen Nusantara, kemewahan modern, dan animasi interaktif terbaik.",
    hero_cta_text: "Buat Undangan Sekarang",
    hero_cta_url: "/templates",
    hero_demo_text: "Lihat Katalog Demo",
    hero_demo_url: "#template",
    bg_color: "#f5f5dc",
    text_color: "#064e3b",
    accent_color: "#d4af37",
    bg_image: "",
    bg_gradient: true,
    hero_title_font: "Playfair Display",
    hero_title_color: "#064e3b",
    hero_title_size: 56,
    hero_title_align: "left",
    hero_subtitle_font: "Inter",
    hero_subtitle_color: "#064e3b",
    hero_subtitle_size: 16,
    hero_subtitle_align: "left",
    emulator_covers: JSON.stringify([
      {
        image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
        badge: "GALERI DESAIN PREMIUM",
        title: "Pilih Desain Eksklusif Anda",
        subtitle: "Sesuaikan tema undangan dengan tradisi, gaya modern, atau konsep khidmat acara Anda. Semua terintegrasi dalam sistem kami."
      },
      {
        image_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
        badge: "ESTETIKA MODERN",
        title: "Sentuhan Romantisme Abadi",
        subtitle: "Kemewahan dalam kesederhanaan desain minimalis premium."
      }
    ])
  };

  const settings = initialSettings ? { ...defaultSettings, ...initialSettings } : defaultSettings;

  // Safe slide parser
  const slides = (() => {
    try {
      return typeof settings.emulator_covers === "string"
        ? JSON.parse(settings.emulator_covers)
        : settings.emulator_covers;
    } catch {
      return [];
    }
  })();

  const [currentSlide, setCurrentSlide] = useState(0);

  // Slide rotation effect
  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [slides]);

  const filteredTemplates = selectedCategory === "Semua" 
    ? templates 
    : templates.filter(t => t.kategori === selectedCategory);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div 
      className="flex flex-col min-h-screen overflow-x-hidden font-sans relative bg-[#f5f5dc]"
      style={{
        color: "#064e3b"
      }}
    >
      {/* Dynamic CSS styles injection */}
      <style>{`
        .text-accent {
          color: ${settings.accent_color} !important;
        }
        .custom-text-color {
          color: #064e3b !important;
        }
        .custom-text-color-hover:hover {
          color: ${settings.accent_color} !important;
        }
        .custom-bg-color {
          background-color: ${settings.bg_color} !important;
        }
        .custom-accent-color {
          color: ${settings.accent_color} !important;
        }
        .custom-accent-bg {
          background-color: ${settings.accent_color} !important;
        }
        .custom-border-color {
          border-color: #064e3b1a !important;
        }
        .custom-btn-primary {
          background-color: #064e3b !important;
          color: #f5f5dc !important;
          border-color: ${settings.accent_color}80 !important;
        }
        .custom-btn-primary:hover {
          background-color: #064e3be6 !important;
          border-color: ${settings.accent_color} !important;
          opacity: 0.95;
        }
        .custom-btn-secondary {
          background-color: transparent !important;
          color: #064e3b !important;
          border-color: #064e3b33 !important;
        }
        .custom-btn-secondary:hover {
          background-color: #064e3b0d !important;
        }
        .custom-badge {
          background-color: rgba(255, 255, 255, 0.08) !important;
          color: #ffffff !important;
          border-color: rgba(255, 255, 255, 0.25) !important;
        }
        .custom-card-bg {
          background-color: #064e3b08 !important;
          border-color: #064e3b14 !important;
        }
        .custom-card-bg:hover {
          border-color: ${settings.accent_color}4d !important;
        }

        .custom-hero-title {
          font-family: '${settings.hero_title_font || "Playfair Display"}', serif !important;
          color: ${settings.hero_title_color || "#064e3b"} !important;
          text-align: ${settings.hero_title_align || "left"} !important;
          font-size: calc(${settings.hero_title_size || 56}px * 0.7) !important;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.06) !important;
        }
        @media (min-width: 640px) {
          .custom-hero-title {
            font-size: calc(${settings.hero_title_size || 56}px * 0.85) !important;
          }
        }
        @media (min-width: 1024px) {
          .custom-hero-title {
            font-size: ${settings.hero_title_size || 56}px !important;
          }
        }

        .custom-hero-subtitle {
          font-family: '${settings.hero_subtitle_font || "Inter"}', sans-serif !important;
          color: ${settings.hero_subtitle_color || "#064e3b"} !important;
          text-align: ${settings.hero_subtitle_align || "left"} !important;
          font-size: calc(${settings.hero_subtitle_size || 16}px * 0.9) !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.04) !important;
        }
        @media (min-width: 1024px) {
          .custom-hero-subtitle {
            font-size: ${settings.hero_subtitle_size || 16}px !important;
          }
        }
      `}</style>

      {/* HEADER NAVBAR */}
      <header 
        className="sticky top-0 z-50 backdrop-blur-md border-b custom-border-color transition-all"
        style={{ backgroundColor: `${settings.bg_color}e6` }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center select-none">
            <img 
              src="/logo.png" 
              alt="Adatara Logo" 
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold opacity-80">
            <a href="#" className="custom-text-color font-bold transition-colors">Beranda</a>
            <a href="#fitur" className="custom-text-color-hover transition-colors">Cara Order</a>
            <a href="#template" className="custom-text-color-hover transition-colors">Katalog</a>
            <a href="#fitur" className="custom-text-color-hover transition-colors">Fitur</a>
            <a href="#harga" className="custom-text-color-hover transition-colors">Paket Harga</a>
            <a href="#faq" className="custom-text-color-hover transition-colors">FAQ</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold opacity-80 custom-text-color custom-text-color-hover transition-colors">
              Login Admin
            </Link>
            <Link href={settings.hero_cta_url} className="px-6 py-2.5 rounded-full text-sm font-black border transition-all duration-300 custom-btn-primary shadow-md">
              Buat Undangan
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 opacity-80 hover:opacity-100 md:hidden cursor-pointer custom-text-color"
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
              className="md:hidden border-t custom-border-color px-6 py-6 flex flex-col gap-5 text-base font-semibold"
              style={{ backgroundColor: settings.bg_color }}
            >
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="custom-text-color font-bold">Beranda</Link>
              <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className="opacity-75 custom-text-color custom-text-color-hover">Cara Order</a>
              <a href="#template" onClick={() => setMobileMenuOpen(false)} className="opacity-75 custom-text-color custom-text-color-hover">Katalog</a>
              <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className="opacity-75 custom-text-color custom-text-color-hover">Fitur</a>
              <a href="#harga" onClick={() => setMobileMenuOpen(false)} className="opacity-75 custom-text-color custom-text-color-hover">Paket Harga</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="opacity-75 custom-text-color custom-text-color-hover">FAQ</a>
              <hr className="custom-border-color my-1" />
              <div className="flex flex-col gap-3">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 opacity-70 font-semibold custom-text-color-hover">
                  Login Admin
                </Link>
                <Link href={settings.hero_cta_url} onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-3 rounded-xl font-semibold border custom-btn-primary">
                  Buat Undangan
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION WRAPPER WITH CUSTOM BACKGROUND PATTERN */}
      <div 
        className="w-full relative overflow-hidden isolate"
        style={{ backgroundColor: settings.bg_color }}
      >
        {/* Background Pattern Layer with Custom Opacity and Blur */}
        {settings.bg_image && (
          <div 
            className="absolute inset-0 -z-20 pointer-events-none"
            style={{
              backgroundImage: `url(${settings.bg_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: settings.bg_pattern_opacity ?? 0.3,
              filter: settings.bg_pattern_blur ? `blur(${settings.bg_pattern_blur}px)` : "none",
              transform: settings.bg_pattern_blur ? "scale(1.05)" : "none"
            }}
          />
        )}

        {/* Gradient/Color Blend Overlay Layer */}
        <div 
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, 
              ${hexToRgba(settings.bg_color || "#f5f5dc", settings.bg_overlay_opacity ?? 0.2)} 0%, 
              ${settings.bg_color || "#f5f5dc"} 100%)`
          }}
        />

        {/* BACKGROUND GRADIENT GLOWS */}
        {settings.bg_gradient && (
          <>
            <div 
              className="absolute top-0 left-1/4 w-[500px] h-[500px] blur-[150px] rounded-full pointer-events-none -z-10 opacity-30 animate-pulse" 
              style={{ backgroundColor: settings.text_color }}
            />
            <div 
              className="absolute top-1/3 right-1/4 w-[600px] h-[600px] blur-[180px] rounded-full pointer-events-none -z-10 opacity-20 animate-pulse" 
              style={{ backgroundColor: settings.accent_color }}
            />
          </>
        )}

        {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 px-6 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column (Hero Content) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={`lg:col-span-7 flex flex-col ${
              settings.hero_title_align === "center"
                ? "items-center text-center"
                : settings.hero_title_align === "right"
                ? "items-end text-right"
                : "items-start text-left"
            }`}
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black tracking-widest uppercase mb-6 select-none custom-badge">
              <Mail className="w-3 h-3 shrink-0" /> ELEGANT NUSANTARA HERITAGE
            </div>

            {/* Heading */}
            <h1 
              className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight leading-tight mb-6 max-w-2xl custom-hero-title"
              dangerouslySetInnerHTML={{ __html: settings.hero_title }}
            />

            {/* Subtitle / Paragraph */}
            <p className="text-sm sm:text-base opacity-75 max-w-xl leading-relaxed mb-8 font-medium custom-hero-subtitle">
              {settings.hero_subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href={settings.hero_cta_url} className="w-full sm:w-auto px-7 py-3.5 rounded-full font-black border transition-all text-center custom-btn-primary shadow-md shadow-black/5">
                {settings.hero_cta_text}
              </Link>
              <a href={settings.hero_demo_url} className="w-full sm:w-auto px-7 py-3.5 rounded-full font-black border transition-all text-center custom-btn-secondary">
                {settings.hero_demo_text}
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
            {/* Soft accent glow background behind phone */}
            <div 
              className="absolute w-72 h-72 blur-[80px] rounded-full -z-10 pointer-events-none opacity-20" 
              style={{ backgroundColor: settings.accent_color }}
            />

            {/* Outer Smartphone Shell with subtle floating animation */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative w-[270px] sm:w-[290px] aspect-[9/18.5] bg-[#0c1322] rounded-[45px] p-2.5 shadow-2xl border-[5px] border-[#222f46] flex flex-col justify-between"
            >
              {/* Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-[#0c1322] rounded-full z-30 flex items-center justify-between px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                <div className="w-8 h-1 bg-slate-800 rounded-full" />
              </div>

              {/* Inner Screen Container */}
              <div 
                className="w-full h-full rounded-[36px] overflow-hidden border border-black/10 relative flex flex-col select-none"
                style={{ backgroundColor: settings.bg_color }}
              >

                {/* Mock Page Content Slider (Framer Motion) */}
                <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col justify-between">
                  {slides && slides.length > 0 ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center"
                        style={{
                          background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.65)), url(${getSafeThumbnail(slides[currentSlide]?.image_url)}) center/cover no-repeat`
                        }}
                      >
                        {/* Decorative background vectors or shapes */}
                        <div className="absolute top-3.5 left-3.5 w-14 h-14 border-t border-l pointer-events-none" style={{ borderColor: `${settings.accent_color}33` }} />
                        <div className="absolute bottom-3.5 right-3.5 w-14 h-14 border-b border-r pointer-events-none" style={{ borderColor: `${settings.accent_color}33` }} />
                        
                        {/* Content elements matching smartphone inside the image */}
                        <div className="space-y-4 max-w-[200px] my-auto text-white">
                          {slides[currentSlide]?.badge && (
                            <div className="inline-block px-2.5 py-0.75 rounded text-[6px] font-bold tracking-widest uppercase"
                              style={{ backgroundColor: `${settings.accent_color}1e`, border: `1px solid ${settings.accent_color}33`, color: settings.accent_color }}
                            >
                              {slides[currentSlide].badge}
                            </div>
                          )}

                          {slides[currentSlide]?.title && (
                            <h2 className="text-lg sm:text-xl font-bold font-serif leading-tight">
                              {slides[currentSlide].title}
                            </h2>
                          )}

                          {/* Divider decoration */}
                          <div className="flex items-center justify-center gap-1.5">
                            <div className="w-5 h-[0.5px]" style={{ backgroundColor: `${settings.accent_color}33` }} />
                            <span className="text-[7px]" style={{ color: settings.accent_color }}>✦</span>
                            <div className="w-5 h-[0.5px]" style={{ backgroundColor: `${settings.accent_color}33` }} />
                          </div>

                          {slides[currentSlide]?.subtitle && (
                            <p className="text-[8.5px] opacity-80 leading-relaxed font-medium">
                              {slides[currentSlide].subtitle}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-xs opacity-50" style={{ color: settings.text_color }}>
                      Belum ada slide
                    </div>
                  )}

                  {/* Navigation dots on emulator */}
                  {slides && slides.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1 z-20">
                      {slides.map((_: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                            currentSlide === idx 
                              ? "w-4 bg-white" 
                              : "bg-white/40 hover:bg-white/60"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      </div>

      {/* STATS SECTION */}
      <section 
        className="border-y custom-border-color py-16 transition-all"
        style={{ backgroundColor: settings.stats_bg_color || "#064e3b" }}
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white">10,000+</div>
            <p className="text-sm opacity-80 mt-2 font-bold text-white/80">Undangan Dibuat</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white">150,000+</div>
            <p className="text-sm opacity-80 mt-2 font-bold text-white/80">Tamu Terundang</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white">50+</div>
            <p className="text-sm opacity-80 mt-2 font-bold text-white/80">Template Premium</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white">99.9%</div>
            <p className="text-sm opacity-80 mt-2 font-bold text-white/80">Uptime Server</p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="fitur" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold custom-accent-color uppercase tracking-widest">Fitur Unggulan</h2>
          <h3 className="text-3xl sm:text-4xl font-black mt-2 mb-4 custom-text-color">Semua yang Anda Butuhkan untuk Undangan Sempurna</h3>
          <p className="opacity-75 leading-relaxed custom-text-color">
            Adatara dirancang dengan fitur terkini yang mempermudah tamu Anda menerima, mengonfirmasi, dan merayakan momen kebahagiaan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <div className="border rounded-2xl p-8 transition-all duration-300 group custom-card-bg">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: `${settings.text_color}15`, color: settings.text_color }}
            >
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-black mb-3 custom-text-color">Real-Time Template Builder</h4>
            <p className="opacity-75 text-sm leading-relaxed custom-text-color">
              Pilih dari 6 modul visual utama (Cover, Pembuka, Profil, Acara, Cerita/Galeri, RSVP). Edit teks, tata letak, warna, dan font secara instan.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="border rounded-2xl p-8 transition-all duration-300 group custom-card-bg">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: `${settings.accent_color}18`, color: settings.accent_color }}
            >
              <Music className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-black mb-3 custom-text-color">Audio Latar & Galeri Media</h4>
            <p className="opacity-75 text-sm leading-relaxed custom-text-color">
              Tambahkan musik romantis dari library kami atau unggah file MP3 Anda sendiri. Dukungan galeri foto berformat Grid, Masonry, Carousel, hingga Pinterest style.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="border rounded-2xl p-8 transition-all duration-300 group custom-card-bg">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: `${settings.text_color}15`, color: settings.text_color }}
            >
              <BellRing className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-black mb-3 custom-text-color">RSVP & Ucapan Real-Time</h4>
            <p className="opacity-75 text-sm leading-relaxed custom-text-color">
              Tamu dapat melakukan konfirmasi kehadiran secara instan. Anda mendapatkan daftar rekapitulasi kehadiran (RSVP) langsung dari dashboard.
            </p>
          </div>

          {/* Feature Card 4 */}
          <div className="border rounded-2xl p-8 transition-all duration-300 group custom-card-bg">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: `${settings.accent_color}18`, color: settings.accent_color }}
            >
              <Gift className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-black mb-3 custom-text-color">Kado & Amplop Digital</h4>
            <p className="opacity-75 text-sm leading-relaxed custom-text-color">
              Sediakan nomor rekening bank, e-wallet, atau barcode QRIS di dalam undangan untuk memudahkan tamu mengirimkan kado/amplop secara cashless.
            </p>
          </div>

          {/* Feature Card 5 */}
          <div className="border rounded-2xl p-8 transition-all duration-300 group custom-card-bg">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: `${settings.text_color}15`, color: settings.text_color }}
            >
              <MapPin className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-black mb-3 custom-text-color">Petunjuk Lokasi & Kalender</h4>
            <p className="opacity-75 text-sm leading-relaxed custom-text-color">
              Tamu Anda tidak akan tersesat berkat peta interaktif Google Maps. Dilengkapi fitur pencatatan otomatis di Google Calendar.
            </p>
          </div>

          {/* Feature Card 6 */}
          <div className="border rounded-2xl p-8 transition-all duration-300 group custom-card-bg">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: `${settings.accent_color}18`, color: settings.accent_color }}
            >
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-black mb-3 custom-text-color">Countdown Hitung Mundur</h4>
            <p className="opacity-75 text-sm leading-relaxed custom-text-color">
              Tampilkan penghitung waktu mundur otomatis yang presisi hingga detik dimulainya acara utama untuk membangkitkan antusiasme tamu.
            </p>
          </div>
        </div>
      </section>

      {/* TEMPLATES INTERACTIVE SHOWCASE SECTION */}
      <section 
        id="template" 
        className="py-24 border-t custom-border-color px-6 scroll-mt-10 transition-all"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col mb-8 text-left">
            <h2 className="text-xs font-extrabold custom-accent-color uppercase tracking-widest">Galeri Desain</h2>
            <h3 className="text-3xl sm:text-4xl font-black mt-2 custom-text-color">Pilih Template Favorit Anda</h3>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-12 w-full justify-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border"
                style={{
                  backgroundColor: selectedCategory === cat ? settings.text_color : "white",
                  color: selectedCategory === cat ? settings.bg_color : settings.text_color,
                  borderColor: selectedCategory === cat ? settings.accent_color : `${settings.text_color}1c`
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Template Cards Grid */}
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-20 bg-white border custom-border-color rounded-3xl shadow-sm max-w-md mx-auto">
              <Palette className="w-12 h-12 opacity-30 mx-auto mb-4 custom-text-color" />
              <h4 className="text-base font-black custom-text-color">Tidak Ada Template</h4>
              <p className="text-xs opacity-60 mt-1.5 custom-text-color">Belum ada template yang dipublikasikan dalam kategori ini.</p>
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
                    className="group bg-white border custom-border-color hover:border-[#d4af37]/35 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div 
                      className="w-full aspect-[9/16] overflow-hidden relative rounded-t-2xl"
                      style={{ backgroundColor: `${settings.text_color}10` }}
                    >
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
                    <div className="p-3 flex flex-col flex-1 text-left bg-white">
                      {/* Title & Category Badge Row */}
                      <div className="flex items-start justify-between gap-1 min-w-0">
                        <h4 className="text-[11px] font-black custom-text-color group-hover:text-accent transition-colors leading-tight flex-1 break-words">
                          {template.nama}
                        </h4>
                        <span className="px-1 py-0.5 rounded text-[6.5px] font-extrabold uppercase tracking-wider whitespace-nowrap flex-shrink-0 mt-0.5 border custom-badge">
                          {template.kategori}
                        </span>
                      </div>
                      
                      <p className="text-[9px] mt-1.5 line-clamp-1 leading-normal flex-1 custom-text-color opacity-70">
                        {template.deskripsi}
                      </p>
                      <div className="mt-3 pt-2.5 border-t custom-border-color">
                        <Link 
                          href={`/demo/${template.id}`} 
                          className="w-full py-1.5 text-white text-[9px] font-black rounded-lg border flex items-center justify-center gap-1 transition-all shadow-sm tracking-wider uppercase custom-btn-primary"
                        >
                          Live Demo
                          <ArrowRight className="w-2.5 h-2.5 text-accent" />
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
          <h2 className="text-xs font-extrabold custom-accent-color uppercase tracking-widest">Paket Harga</h2>
          <h3 className="text-3xl sm:text-4xl font-black mt-2 mb-4 custom-text-color">Investasi Kecil untuk Momen Terindah</h3>
          <p className="opacity-75 custom-text-color">
            Tersedia paket langganan fleksibel tanpa biaya tersembunyi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Plan 1: Free */}
          <div className="border rounded-3xl p-8 flex flex-col transition-all duration-300 custom-card-bg">
            <div>
              <span className="text-xs font-bold opacity-60 uppercase tracking-wider custom-text-color">PAKET SILVER</span>
              <h4 className="text-3xl font-extrabold custom-text-color mt-4">Rp 0</h4>
              <p className="text-xs opacity-50 mt-1 custom-text-color">Selamanya Gratis</p>
              <p className="opacity-75 text-sm mt-6 custom-text-color">Cocok untuk mencoba fitur builder dasar kami sebelum memutuskan berlangganan.</p>
            </div>
            
            <hr className="custom-border-color my-8" />

            <ul className="space-y-4 flex-1 text-sm opacity-90 custom-text-color">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: settings.text_color }} />
                Masa aktif undangan 3 hari
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: settings.text_color }} />
                Maksimal 50 tamu undangan
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: settings.text_color }} />
                Desain template dasar (Silver)
              </li>
              <li className="flex items-center gap-3 opacity-40">
                <span className="w-4 h-4 inline-flex items-center justify-center font-bold">✕</span>
                Tanpa kustom musik & galeri
              </li>
              <li className="flex items-center gap-3 opacity-40">
                <span className="w-4 h-4 inline-flex items-center justify-center font-bold">✕</span>
                Terdapat watermark brand Adatara
              </li>
            </ul>

            <Link href="/register" className="mt-8 w-full py-3 text-center rounded-xl font-bold transition-all border custom-btn-primary">
              Mulai Gratis
            </Link>
          </div>

          {/* Plan 2: Pro */}
          <div 
            className="border-2 rounded-3xl p-8 flex flex-col relative shadow-2xl hover:-translate-y-1 transition-all duration-300"
            style={{ 
              borderColor: settings.accent_color,
              backgroundColor: `${settings.text_color}10`
            }}
          >
            <div 
              className="absolute top-0 right-8 -translate-y-1/2 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider"
              style={{ backgroundColor: settings.accent_color }}
            >
              Paling Populer
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider custom-accent-color">PAKET GOLD</span>
              <h4 className="text-3xl font-extrabold custom-text-color mt-4">Rp 99.000</h4>
              <p className="text-xs opacity-50 mt-1 custom-text-color">Bayar Sekali (Aktif Selamanya)</p>
              <p className="opacity-75 text-sm mt-6 custom-text-color">Fitur terlengkap untuk menghadirkan undangan yang elegan dengan ornamen terbaik.</p>
            </div>
            
            <hr className="custom-border-color my-8" />

            <ul className="space-y-4 flex-1 text-sm opacity-90 custom-text-color">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: settings.text_color }} />
                Masa aktif undangan selamanya
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: settings.text_color }} />
                Tamu undangan tak terbatas
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: settings.text_color }} />
                Bebas kustom musik latar & audio
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: settings.text_color }} />
                Galeri foto & video tak terbatas
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: settings.text_color }} />
                RSVP & amplop digital cashless
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: settings.text_color }} />
                Bebas watermark brand Adatara
              </li>
            </ul>

            <Link 
              href="/register?plan=gold" 
              className="mt-8 w-full py-4 text-center rounded-xl font-extrabold transition-all shadow-lg hover:brightness-105"
              style={{
                backgroundColor: settings.accent_color,
                color: settings.bg_color,
                border: `1px solid ${settings.accent_color}`
              }}
            >
              Pilih Paket Gold
            </Link>
          </div>

          {/* Plan 3: VIP */}
          <div className="border rounded-3xl p-8 flex flex-col transition-all duration-300 custom-card-bg">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider custom-accent-color">PAKET PLATINUM</span>
              <h4 className="text-3xl font-extrabold custom-text-color mt-4">Rp 149.000</h4>
              <p className="text-xs opacity-50 mt-1 custom-text-color">Bayar Sekali (Aktif Selamanya)</p>
              <p className="opacity-75 text-sm mt-6 custom-text-color">Layanan ekstra VIP untuk Anda yang menginginkan integrasi pesan WhatsApp otomatis.</p>
            </div>
            
            <hr className="custom-border-color my-8" />

            <ul className="space-y-4 flex-1 text-sm opacity-90 custom-text-color">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: settings.text_color }} />
                Semua fitur paket GOLD
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: settings.text_color }} />
                Subdomain kustom (.adatara.id/nama)
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: settings.text_color }} />
                100 WhatsApp blast untuk undangan tamu
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: settings.text_color }} />
                Prioritas bantuan admin 24/7
              </li>
            </ul>

            <Link href="/register?plan=platinum" className="mt-8 w-full py-3 text-center rounded-xl font-bold transition-all border custom-btn-primary">
              Pilih Paket Platinum
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 border-t custom-border-color px-6 scroll-mt-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-extrabold custom-accent-color uppercase tracking-widest">Tanya Jawab</h2>
            <h3 className="text-3xl sm:text-4xl font-black mt-2 custom-text-color">Pertanyaan yang Sering Diajukan</h3>
          </div>

          <div className="space-y-4">
            {MOCK_FAQS.map((faq, idx) => (
              <div 
                key={idx}
                className="border rounded-2xl overflow-hidden transition-all custom-card-bg"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bold custom-text-color custom-text-color-hover transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 custom-accent-color shrink-0" />
                    {faq.tanya}
                  </span>
                  <ChevronDown 
                    className="w-5 h-5 opacity-50 transition-transform" 
                    style={{
                      transform: openFaq === idx ? "rotate(180deg)" : "none",
                      color: openFaq === idx ? settings.accent_color : settings.text_color
                    }}
                  />
                </button>
                
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 pt-1 text-sm opacity-80 leading-relaxed border-t custom-border-color"
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
      <section 
        className="py-24 px-6 relative overflow-hidden border-t custom-border-color transition-all"
        style={{
          background: `linear-gradient(to top right, ${settings.text_color || "#064e3b"}18, #f5f5dc, ${settings.accent_color}14)`
        }}
      >
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[#f5f5dc]" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-6 custom-text-color">
            Siap Membuat Momen Acara Anda Menjadi Lebih Indah?
          </h2>
          <p className="opacity-75 text-lg max-w-2xl mx-auto mb-10 leading-relaxed custom-text-color">
            Daftar sekarang dan mulailah merancang undangan digital Anda. Gratis biaya pembuatan untuk masa percobaan awal.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all shadow-xl shadow-black/5 group custom-btn-primary border">
            Mulai Buat Sekarang
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer 
        className="border-t custom-border-color py-12 px-6 bg-[#f5f5dc]"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm opacity-70 custom-text-color">
          <div className="flex items-center gap-2 font-bold text-lg custom-text-color">
            <Sparkles className="w-5 h-5 custom-accent-color" />
            Adatara
          </div>
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} Adatara. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <div className="flex gap-6">
            <a href="#" className="custom-text-color-hover transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="custom-text-color-hover transition-colors">Kebijakan Privasi</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
