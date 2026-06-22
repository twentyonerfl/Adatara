"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
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
  Mail,
  Search
} from "lucide-react";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
} as const;

const itemVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15
    }
  }
} as const;

function AnimatedCounter({
  value,
  duration = 2,
  suffix = "",
  decimals = 0,
}: {
  value: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // easeOutQuad easing
      const easeProgress = progress * (2 - progress);

      const currentVal = easeProgress * value;
      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration, isInView]);

  const formatted = count.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return <span ref={ref}>{formatted}{suffix}</span>;
}

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
  const [selectedPaket, setSelectedPaket] = useState("Semua");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [templates] = useState<any[]>(initialTemplates);
  const [categories] = useState<string[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [paketDropdownOpen, setPaketDropdownOpen] = useState(false);

  // Set default settings if not defined or partially defined
  const defaultSettings = {
    hero_title: "Abadikan Momen Berharga Anda Dengan Kemewahan <span class='text-accent'>Digital</span>",
    hero_subtitle: "Platform SaaS undangan digital premium nomor satu di Indonesia. Didesain khusus dengan perpaduan keindahan ornamen Nusantara, kemewahan modern, dan animasi interaktif terbaik.",
    hero_cta_text: "Buat Undangan Sekarang",
    hero_cta_url: "/templates",
    hero_demo_text: "Lihat Katalog Undangan",
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

  // Close dropdowns on outside clicks
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setCategoryDropdownOpen(false);
        setPaketDropdownOpen(false);
      }
    }
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory === "Semua" || t.kategori === selectedCategory;
    const matchesPaket = selectedPaket === "Semua" || t.paket === selectedPaket;
    const matchesSearch = t.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.deskripsi && t.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesPaket && matchesSearch;
  });

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
          background-color: rgba(255, 255, 255, 0.4) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          color: #064e3b !important;
          border-color: rgba(6, 78, 59, 0.15) !important;
          box-shadow: 0 8px 32px 0 rgba(6, 78, 59, 0.04) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .custom-btn-secondary:hover {
          background-color: rgba(255, 255, 255, 0.6) !important;
          border-color: rgba(6, 78, 59, 0.3) !important;
          box-shadow: 0 8px 32px 0 rgba(6, 78, 59, 0.08) !important;
          transform: translateY(-2px) !important;
        }
        .custom-card-btn {
          background-color: transparent !important;
          color: ${settings.text_color} !important;
          border-color: ${settings.text_color}26 !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .group:hover .custom-card-btn {
          background-color: ${settings.text_color} !important;
          color: #ffffff !important;
          border-color: ${settings.text_color} !important;
          box-shadow: 0 4px 12px ${settings.text_color}20 !important;
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
        .custom-feature-title {
          transition: color 0.3s ease !important;
        }
        .group:hover .custom-feature-title {
          color: ${settings.accent_color} !important;
        }

        .custom-hero-title {
          font-family: '${settings.hero_title_font || "Playfair Display"}', serif !important;
          color: ${settings.hero_title_color || "#064e3b"} !important;
          text-align: center !important;
          font-size: calc(${settings.hero_title_size || 56}px * 0.55) !important;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.06) !important;
        }
        @media (min-width: 640px) {
          .custom-hero-title {
            font-size: calc(${settings.hero_title_size || 56}px * 0.75) !important;
          }
        }
        @media (min-width: 1024px) {
          .custom-hero-title {
            text-align: ${settings.hero_title_align || "left"} !important;
            font-size: ${settings.hero_title_size || 56}px !important;
          }
        }

        .custom-hero-subtitle {
          font-family: '${settings.hero_subtitle_font || "Inter"}', sans-serif !important;
          color: ${settings.hero_subtitle_color || "#064e3b"} !important;
          text-align: center !important;
          font-size: calc(${settings.hero_subtitle_size || 16}px * 0.85) !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.04) !important;
        }
        @media (min-width: 1024px) {
          .custom-hero-subtitle {
            text-align: ${settings.hero_subtitle_align || "left"} !important;
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
            <a href="#cara-order" className="custom-text-color-hover transition-colors">Cara Order</a>
            <a href="#template" className="custom-text-color-hover transition-colors">Katalog</a>
            <a href="#fitur" className="custom-text-color-hover transition-colors">Fitur</a>
            <a href="#harga" className="custom-text-color-hover transition-colors">Paket Harga</a>
            <a href="#faq" className="custom-text-color-hover transition-colors">FAQ</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-6">
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
              <a href="#cara-order" onClick={() => setMobileMenuOpen(false)} className="opacity-75 custom-text-color custom-text-color-hover">Cara Order</a>
              <a href="#template" onClick={() => setMobileMenuOpen(false)} className="opacity-75 custom-text-color custom-text-color-hover">Katalog</a>
              <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className="opacity-75 custom-text-color custom-text-color-hover">Fitur</a>
              <a href="#harga" onClick={() => setMobileMenuOpen(false)} className="opacity-75 custom-text-color custom-text-color-hover">Paket Harga</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="opacity-75 custom-text-color custom-text-color-hover">FAQ</a>
              <hr className="custom-border-color my-1" />
              <div className="flex flex-col gap-3">
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
        <section className="relative pt-8 pb-12 sm:pt-12 sm:pb-24 px-4 sm:px-6 max-w-7xl mx-auto z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column (Hero Content) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={`lg:col-span-7 flex flex-col items-center text-center ${settings.hero_title_align === "center"
                  ? "lg:items-center lg:text-center"
                  : settings.hero_title_align === "right"
                    ? "lg:items-end lg:text-right"
                    : "lg:items-start lg:text-left"
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
              <div className="flex flex-row items-center gap-2 w-full sm:w-auto justify-center">
                <Link
                  href={settings.hero_cta_url}
                  className="flex-1 sm:flex-none px-2.5 sm:px-7 py-2.5 sm:py-3.5 rounded-full font-black border transition-all text-center custom-btn-primary shadow-md shadow-black/5 text-[10px] min-[360px]:text-xs sm:text-base"
                >
                  {settings.hero_cta_text}
                </Link>
                <a
                  href={settings.hero_demo_url}
                  className="flex-1 sm:flex-none px-2.5 sm:px-7 py-2.5 sm:py-3.5 rounded-full font-black border transition-all text-center custom-btn-secondary text-[10px] min-[360px]:text-xs sm:text-base"
                >
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
                className="relative w-[270px] sm:w-[290px] aspect-[9/18.5] bg-[#0c1322] rounded-[38px] p-1 shadow-2xl border-[3px] border-[#222f46] flex flex-col justify-between"
              >
                {/* Notch */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#0c1322] rounded-full z-30 flex items-center justify-between px-3">
                  <div className="w-2 h-2 rounded-full bg-slate-900" />
                  <div className="w-8 h-0.5 bg-slate-800 rounded-full" />
                </div>

                {/* Inner Screen Container */}
                <div
                  className="w-full h-full rounded-[34px] overflow-hidden border border-black/10 relative flex flex-col select-none"
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
                            className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${currentSlide === idx
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
        className="border-y custom-border-color py-8 sm:py-16 transition-all"
        style={{ backgroundColor: settings.stats_bg_color || "#064e3b" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white">
              <AnimatedCounter value={1000} suffix="+" />
            </div>
            <p className="text-sm opacity-80 mt-2 font-bold text-white/80">Undangan Dibuat</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white">
              <AnimatedCounter value={50000} suffix="+" />
            </div>
            <p className="text-sm opacity-80 mt-2 font-bold text-white/80">Tamu Terundang</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white">
              <AnimatedCounter value={50} suffix="+" />
            </div>
            <p className="text-sm opacity-80 mt-2 font-bold text-white/80">Template Premium</p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white">
              <AnimatedCounter value={99.9} decimals={1} suffix="%" />
            </div>
            <p className="text-sm opacity-80 mt-2 font-bold text-white/80">Uptime Server</p>
          </div>
        </div>
      </section>

      {/* CARA ORDER SECTION */}
      <section
        id="cara-order"
        className="py-12 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-[#f5f5dc] via-[#fcfcf7] to-[#f5f5dc] relative overflow-hidden scroll-mt-24"
      >
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#d4af37]/[0.02] blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] font-extrabold text-[#064e3b] uppercase tracking-widest bg-[#064e3b]/5 px-4 py-1.5 rounded-full border border-[#064e3b]/10">
              Langkah Pembuatan
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-4 text-[#064e3b] tracking-tight leading-tight">
              Hanya 4 Langkah Mudah
            </h2>
            <p className="text-[#064e3b]/70 text-xs sm:text-sm mt-3 font-medium">
              Buat undangan digital premium Anda sendiri dalam hitungan menit tanpa ribet.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-6 md:gap-8 relative">
            {/* Connecting line for desktop/tablet */}
            <div className="hidden sm:block absolute top-1/2 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-emerald-100 via-[#d4af37]/35 to-emerald-100 -translate-y-10 z-0" />

            {/* Step 1 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-white/40 backdrop-blur-md border border-[#064e3b]/10 rounded-xl sm:rounded-3xl p-1.5 sm:p-8 flex flex-col items-center text-center relative z-10 hover:bg-white/70 hover:border-[#d4af37]/50 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-[#064e3b] flex items-center justify-center text-white font-black text-xs sm:text-base shadow-md shadow-[#064e3b]/10 mb-2 sm:mb-4">
                01
              </div>
              <h3 className="text-[10px] sm:text-lg font-bold text-[#064e3b] mb-1 sm:mb-2">Pilih Template</h3>
              <p className="text-[8px] sm:text-xs text-[#064e3b]/70 font-medium leading-normal sm:leading-relaxed">
                Temukan desain undangan digital terindah dan favorit Anda dari katalog lengkap kami.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-white/40 backdrop-blur-md border border-[#064e3b]/10 rounded-xl sm:rounded-3xl p-1.5 sm:p-8 flex flex-col items-center text-center relative z-10 hover:bg-white/70 hover:border-[#d4af37]/50 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-[#064e3b] flex items-center justify-center text-white font-black text-xs sm:text-base shadow-md shadow-[#064e3b]/10 mb-2 sm:mb-4">
                02
              </div>
              <h3 className="text-[10px] sm:text-lg font-bold text-[#064e3b] mb-1 sm:mb-2">Isi Data</h3>
              <p className="text-[8px] sm:text-xs text-[#064e3b]/70 font-medium leading-normal sm:leading-relaxed">
                Lengkapi seluruh informasi detail acara, profil mempelai, cerita cinta, dan galeri foto terbaik Anda.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-white/40 backdrop-blur-md border border-[#064e3b]/10 rounded-xl sm:rounded-3xl p-1.5 sm:p-8 flex flex-col items-center text-center relative z-10 hover:bg-white/70 hover:border-[#d4af37]/50 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-[#064e3b] flex items-center justify-center text-white font-black text-xs sm:text-base shadow-md shadow-[#064e3b]/10 mb-2 sm:mb-4">
                03
              </div>
              <h3 className="text-[10px] sm:text-lg font-bold text-[#064e3b] mb-1 sm:mb-2">Payment</h3>
              <p className="text-[8px] sm:text-xs text-[#064e3b]/70 font-medium leading-normal sm:leading-relaxed">
                Lakukan pembayaran aman dan instan untuk mengaktifkan seluruh fitur premium undangan Anda.
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-white/40 backdrop-blur-md border border-[#064e3b]/10 rounded-xl sm:rounded-3xl p-1.5 sm:p-8 flex flex-col items-center text-center relative z-10 hover:bg-white/70 hover:border-[#d4af37]/50 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-[#064e3b] flex items-center justify-center text-white font-black text-xs sm:text-base shadow-md shadow-[#064e3b]/10 mb-2 sm:mb-4">
                04
              </div>
              <h3 className="text-[10px] sm:text-lg font-bold text-[#064e3b] mb-1 sm:mb-2">Selesai</h3>
              <p className="text-[8px] sm:text-xs text-[#064e3b]/70 font-medium leading-normal sm:leading-relaxed">
                Undangan siap digunakan dan dibagikan secara instan kepada seluruh keluarga dan kerabat terdekat!
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TEMPLATES INTERACTIVE SHOWCASE SECTION */}
      <section
        id="template"
        className="py-12 sm:py-24 px-4 sm:px-6 scroll-mt-24 transition-all"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col mb-8 text-left">
            <h2 className="text-xs font-extrabold custom-accent-color uppercase tracking-widest">Galeri Desain</h2>
            <h3 className="text-3xl sm:text-4xl font-black mt-2 custom-text-color">Pilih Template Favorit Anda</h3>
          </div>

          {/* Search and Category Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-10 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none opacity-50">
                <Search className="w-5 h-5 custom-text-color" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari desain undangan..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border text-sm font-medium transition-all outline-none bg-white/70 backdrop-blur-sm custom-border-color focus:border-[#d4af37] focus:bg-white custom-text-color"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-bold opacity-60 hover:opacity-100 transition-opacity custom-text-color"
                >
                  Batal
                </button>
              )}
            </div>

            {/* Dropdowns Wrapper */}
            <div className="flex gap-3 flex-wrap md:flex-nowrap">
              {/* Category Dropdown */}
              <div className="relative min-w-[170px] flex-1 md:flex-none dropdown-container">
                <button
                  onClick={() => { setCategoryDropdownOpen(!categoryDropdownOpen); setPaketDropdownOpen(false); }}
                  className="w-full flex items-center justify-between gap-3 px-5 py-3 rounded-2xl border text-sm font-bold bg-white/70 backdrop-blur-sm transition-all custom-border-color hover:border-[#d4af37] custom-text-color cursor-pointer"
                >
                  <span>{selectedCategory === "Semua" ? "Semua Kategori" : selectedCategory}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${categoryDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {categoryDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-full md:w-64 max-h-72 overflow-y-auto bg-white border custom-border-color rounded-2xl shadow-xl z-50 p-2 scrollbar-thin"
                    >
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setCategoryDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedCategory === cat
                            ? "custom-btn-primary"
                            : "hover:bg-[#064e3b]/5 custom-text-color"
                            }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Paket Dropdown */}
              <div className="relative min-w-[150px] flex-1 md:flex-none dropdown-container">
                <button
                  onClick={() => { setPaketDropdownOpen(!paketDropdownOpen); setCategoryDropdownOpen(false); }}
                  className="w-full flex items-center justify-between gap-3 px-5 py-3 rounded-2xl border text-sm font-bold bg-white/70 backdrop-blur-sm transition-all custom-border-color hover:border-[#d4af37] custom-text-color cursor-pointer"
                >
                  <span>{selectedPaket === "Semua" ? "Semua Paket" : selectedPaket}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${paketDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {paketDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-full md:w-48 bg-white border custom-border-color rounded-2xl shadow-xl z-50 p-2"
                    >
                      {["Semua", "BASIC", "PREMIUM", "SULTAN", "EXCLUSIVE"].map((tier) => (
                        <button
                          key={tier}
                          onClick={() => {
                            setSelectedPaket(tier);
                            setPaketDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedPaket === tier
                            ? "custom-btn-primary"
                            : "hover:bg-[#064e3b]/5 custom-text-color"
                            }`}
                        >
                          {tier === "Semua" ? "Semua Paket" : tier}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Template Cards Grid */}
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-20 bg-white border custom-border-color rounded-3xl shadow-sm max-w-md mx-auto">
              <Palette className="w-12 h-12 opacity-30 mx-auto mb-4 custom-text-color" />
              <h4 className="text-base font-black custom-text-color">Tidak Ada Template</h4>
              <p className="text-xs opacity-60 mt-1.5 custom-text-color">Belum ada template yang dipublikasikan dalam kategori ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <AnimatePresence>
                {filteredTemplates.map((template) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={template.id}
                    className="group bg-white border custom-border-color hover:border-[#d4af37]/45 hover:-translate-y-1 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div
                      className="w-full aspect-square overflow-hidden relative rounded-t-2xl flex items-center justify-center p-2.5"
                      style={{ backgroundColor: `${settings.text_color}08` }}
                    >
                      {/* Package Tier Badge Overlay */}
                      <div className="absolute top-2 left-2 z-20 pointer-events-none w-max">
                        <span className={`px-1.5 py-0.5 rounded-md text-[5.5px] font-extrabold uppercase tracking-wider border shadow-sm ${template.paket === "EXCLUSIVE"
                          ? "bg-gradient-to-r from-purple-500 via-fuchsia-600 to-indigo-600 text-white border-purple-500/40 shadow-purple-500/20"
                          : template.paket === "SULTAN"
                            ? "bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 text-white border-emerald-500/40 shadow-emerald-500/20"
                            : template.paket === "PREMIUM"
                              ? "bg-gradient-to-r from-amber-400 via-[#d4af37] to-yellow-500 text-white border-amber-400/40 shadow-amber-500/20"
                              : "bg-gradient-to-r from-slate-200 via-zinc-300 to-slate-400 text-slate-800 border-slate-300/40 shadow-slate-500/10"
                          }`}>
                          {template.paket || "BASIC"}
                        </span>
                      </div>

                      {/* Category Badge Overlay - Premium Glassmorphism */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-max">
                        <span className="px-2 py-0.5 rounded-full text-[6px] font-black uppercase tracking-wider bg-white/80 backdrop-blur-md text-[#064e3b] border border-white/40 shadow-sm">
                          {template.kategori}
                        </span>
                      </div>

                      {/* Cover Preview Zoom Wrapper in 9:16 aspect ratio */}
                      <div className="h-full aspect-[9/16] relative overflow-hidden bg-white shadow-sm border border-[#064e3b]/10 rounded-lg transition-transform duration-700 ease-out group-hover:scale-[1.04]">
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
                                background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.55)), url(${getSafeThumbnail(template.image)}) center/cover no-repeat`
                              }}
                            >
                              <div className="space-y-2 pt-6">
                                <span className="font-extrabold uppercase tracking-widest text-[10px] text-white block">
                                  UNDANGAN {template.kategori}
                                </span>
                                <div className="h-[1px] w-10 bg-white/30 mx-auto" />
                              </div>
                              <div className="my-auto">
                                <h1 className="leading-tight text-xl font-black text-white break-words font-serif">
                                  {template.nama}
                                </h1>
                              </div>
                              <div className="space-y-3 pb-6">
                                <span className="text-[9px] text-white/60 block font-medium">Kepada Yth. Tamu Undangan</span>
                                <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-bold text-white shadow-lg mx-auto">
                                  Buka Undangan
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="p-2 flex flex-col justify-between bg-white border-t custom-border-color">
                      {/* Title */}
                      <h4 className="text-[10px] font-extrabold custom-text-color tracking-wide group-hover:custom-accent-color transition-colors duration-300 leading-tight break-words w-full text-center py-0.5">
                        {template.nama}
                      </h4>

                      {/* Button */}
                      <Link
                        href={`/demo/${template.id}`}
                        className="mt-1.5 w-full py-1.5 text-center text-[8.5px] font-black rounded-md border flex items-center justify-center gap-1.5 transition-all shadow-sm tracking-widest uppercase custom-card-btn"
                      >
                        Live Demo
                        <ArrowRight className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <div className="relative overflow-hidden border-t border-b custom-border-color bg-gradient-to-tr from-[#064e3b]/[0.03] via-transparent to-[#d4af37]/[0.04]">
        {/* Ambient Decorative Light Glows */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-[#064e3b]/[0.03] blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-[#d4af37]/[0.04] blur-3xl pointer-events-none" />

        <section id="fitur" className="py-12 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16 relative z-10"
          >
            <h2 className="text-xs font-extrabold custom-accent-color uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Fitur Unggulan
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black mt-2 mb-4 custom-text-color tracking-tight">Semua yang Anda Butuhkan untuk Undangan Sempurna</h3>
            <p className="opacity-75 leading-relaxed custom-text-color font-medium">
              Adatara dirancang dengan fitur terkini yang mempermudah tamu Anda menerima, mengonfirmasi, dan merayakan momen kebahagiaan Anda.
            </p>
          </motion.div>          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-8 relative z-10"
          >
            {/* Feature Card 1 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative border border-[#064e3b]/25 rounded-xl sm:rounded-3xl p-3 sm:p-5 md:p-8 bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-md hover:border-[#064e3b]/60 transition-all duration-500 group overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#064e3b]/5 hover:from-white/90 hover:to-white/70 cursor-default"
            >
              {/* Glowing Accent Corner */}
              <div
                className="absolute -right-16 -top-16 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                style={{ backgroundColor: settings.accent_color }}
              />
              <div
                className="w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-2xl flex items-center justify-center mb-3 md:mb-6 transition-all duration-500 shadow-sm group-hover:rotate-6 group-hover:scale-110 shrink-0"
                style={{ backgroundColor: `${settings.text_color}08`, border: `1px solid ${settings.text_color}15`, color: settings.text_color }}
              >
                <Layers className="w-4 h-4 md:w-7 md:h-7" />
              </div>
              <h4 className="text-[10px] sm:text-base md:text-xl font-black mb-1.5 md:mb-3 custom-text-color tracking-tight custom-feature-title leading-snug">Real-Time Template Builder</h4>
              <p className="opacity-75 text-[9px] sm:text-xs md:text-sm leading-relaxed custom-text-color font-medium">
                Pilih dari 6 modul visual utama (Cover, Pembuka, Profil, Acara, Cerita/Galeri, RSVP). Edit teks, tata letak, warna, dan font secara instan.
              </p>
            </motion.div>

            {/* Feature Card 2 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative border border-[#064e3b]/25 rounded-xl sm:rounded-3xl p-3 sm:p-5 md:p-8 bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-md hover:border-[#064e3b]/60 transition-all duration-500 group overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#064e3b]/5 hover:from-white/90 hover:to-white/70 cursor-default"
            >
              {/* Glowing Accent Corner */}
              <div
                className="absolute -right-16 -top-16 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                style={{ backgroundColor: settings.accent_color }}
              />
              <div
                className="w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-2xl flex items-center justify-center mb-3 md:mb-6 transition-all duration-500 shadow-sm group-hover:rotate-6 group-hover:scale-110 shrink-0"
                style={{ backgroundColor: `${settings.accent_color}08`, border: `1px solid ${settings.accent_color}15`, color: settings.accent_color }}
              >
                <Music className="w-4 h-4 md:w-7 md:h-7" />
              </div>
              <h4 className="text-[10px] sm:text-base md:text-xl font-black mb-1.5 md:mb-3 custom-text-color tracking-tight custom-feature-title leading-snug">Audio Latar & Galeri Media</h4>
              <p className="opacity-75 text-[9px] sm:text-xs md:text-sm leading-relaxed custom-text-color font-medium">
                Tambahkan musik romantis dari library kami atau unggah file MP3 Anda sendiri. Dukungan galeri foto berformat Grid, Masonry, Carousel, hingga Pinterest style.
              </p>
            </motion.div>

            {/* Feature Card 3 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative border border-[#064e3b]/25 rounded-xl sm:rounded-3xl p-3 sm:p-5 md:p-8 bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-md hover:border-[#064e3b]/60 transition-all duration-500 group overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#064e3b]/5 hover:from-white/90 hover:to-white/70 cursor-default"
            >
              {/* Glowing Accent Corner */}
              <div
                className="absolute -right-16 -top-16 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                style={{ backgroundColor: settings.accent_color }}
              />
              <div
                className="w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-2xl flex items-center justify-center mb-3 md:mb-6 transition-all duration-500 shadow-sm group-hover:rotate-6 group-hover:scale-110 shrink-0"
                style={{ backgroundColor: `${settings.text_color}08`, border: `1px solid ${settings.text_color}15`, color: settings.text_color }}
              >
                <BellRing className="w-4 h-4 md:w-7 md:h-7" />
              </div>
              <h4 className="text-[10px] sm:text-base md:text-xl font-black mb-1.5 md:mb-3 custom-text-color tracking-tight custom-feature-title leading-snug">RSVP & Ucapan Real-Time</h4>
              <p className="opacity-75 text-[9px] sm:text-xs md:text-sm leading-relaxed custom-text-color font-medium">
                Tamu dapat melakukan konfirmasi kehadiran secara instan. Anda mendapatkan daftar rekapitulasi kehadiran (RSVP) langsung dari dashboard.
              </p>
            </motion.div>

            {/* Feature Card 4 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative border border-[#064e3b]/25 rounded-xl sm:rounded-3xl p-3 sm:p-5 md:p-8 bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-md hover:border-[#064e3b]/60 transition-all duration-500 group overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#064e3b]/5 hover:from-white/90 hover:to-white/70 cursor-default"
            >
              {/* Glowing Accent Corner */}
              <div
                className="absolute -right-16 -top-16 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                style={{ backgroundColor: settings.accent_color }}
              />
              <div
                className="w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-2xl flex items-center justify-center mb-3 md:mb-6 transition-all duration-500 shadow-sm group-hover:rotate-6 group-hover:scale-110 shrink-0"
                style={{ backgroundColor: `${settings.accent_color}08`, border: `1px solid ${settings.accent_color}15`, color: settings.accent_color }}
              >
                <Gift className="w-4 h-4 md:w-7 md:h-7" />
              </div>
              <h4 className="text-[10px] sm:text-base md:text-xl font-black mb-1.5 md:mb-3 custom-text-color tracking-tight custom-feature-title leading-snug">Kado & Amplop Digital</h4>
              <p className="opacity-75 text-[9px] sm:text-xs md:text-sm leading-relaxed custom-text-color font-medium">
                Sediakan nomor rekening bank, e-wallet, atau barcode QRIS di dalam undangan untuk memudahkan tamu mengirimkan kado/amplop secara cashless.
              </p>
            </motion.div>

            {/* Feature Card 5 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative border border-[#064e3b]/25 rounded-xl sm:rounded-3xl p-3 sm:p-5 md:p-8 bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-md hover:border-[#064e3b]/60 transition-all duration-500 group overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#064e3b]/5 hover:from-white/90 hover:to-white/70 cursor-default"
            >
              {/* Glowing Accent Corner */}
              <div
                className="absolute -right-16 -top-16 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                style={{ backgroundColor: settings.accent_color }}
              />
              <div
                className="w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-2xl flex items-center justify-center mb-3 md:mb-6 transition-all duration-500 shadow-sm group-hover:rotate-6 group-hover:scale-110 shrink-0"
                style={{ backgroundColor: `${settings.text_color}08`, border: `1px solid ${settings.text_color}15`, color: settings.text_color }}
              >
                <MapPin className="w-4 h-4 md:w-7 md:h-7" />
              </div>
              <h4 className="text-[10px] sm:text-base md:text-xl font-black mb-1.5 md:mb-3 custom-text-color tracking-tight custom-feature-title leading-snug">Petunjuk Lokasi & Kalender</h4>
              <p className="opacity-75 text-[9px] sm:text-xs md:text-sm leading-relaxed custom-text-color font-medium">
                Tamu Anda tidak akan tersesat berkat peta interaktif Google Maps. Dilengkapi fitur pencatatan otomatis di Google Calendar.
              </p>
            </motion.div>

            {/* Feature Card 6 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative border border-[#064e3b]/25 rounded-xl sm:rounded-3xl p-3 sm:p-5 md:p-8 bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-md hover:border-[#064e3b]/60 transition-all duration-500 group overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#064e3b]/5 hover:from-white/90 hover:to-white/70 cursor-default"
            >
              {/* Glowing Accent Corner */}
              <div
                className="absolute -right-16 -top-16 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                style={{ backgroundColor: settings.accent_color }}
              />
              <div
                className="w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-2xl flex items-center justify-center mb-3 md:mb-6 transition-all duration-500 shadow-sm group-hover:rotate-6 group-hover:scale-110 shrink-0"
                style={{ backgroundColor: `${settings.accent_color}08`, border: `1px solid ${settings.accent_color}15`, color: settings.accent_color }}
              >
                <Clock className="w-4 h-4 md:w-7 md:h-7" />
              </div>
              <h4 className="text-[10px] sm:text-base md:text-xl font-black mb-1.5 md:mb-3 custom-text-color tracking-tight custom-feature-title leading-snug">Countdown Hitung Mundur</h4>
              <p className="opacity-75 text-[9px] sm:text-xs md:text-sm leading-relaxed custom-text-color font-medium">
                Tampilkan penghitung waktu mundur otomatis yang presisi hingga detik dimulainya acara utama untuk membangkitkan antusiasme tamu.
              </p>
            </motion.div>
          </motion.div>
        </section>
      </div>

      {/* PRICING SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#063024] via-[#042018] to-[#02100c] py-12 sm:py-24 px-4 sm:px-6 border-t border-b border-[#064e3b]/30">
        {/* Ambient golden lighting glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#d4af37]/[0.04] blur-3xl pointer-events-none" />

        <section id="harga" className="max-w-7xl mx-auto scroll-mt-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#d4af37] flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Paket Harga
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black mt-2 mb-4 text-white tracking-tight">Investasi Kecil untuk Momen Terindah</h3>
            <p className="opacity-80 text-[#f5f5dc] font-medium">
              Tersedia paket langganan fleksibel tanpa biaya tersembunyi.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 items-stretch"
          >
            {/* Plan 1: Free */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="border rounded-xl sm:rounded-3xl p-2 sm:p-5 md:p-8 flex flex-col transition-all duration-500 bg-white/[0.02] backdrop-blur-md border-slate-800 hover:border-slate-600 hover:bg-white/[0.04] shadow-sm hover:shadow-2xl hover:shadow-black/20"
            >
              <div>
                <span className="inline-block px-2 py-0.5 rounded-full text-[8px] sm:text-xs font-black uppercase tracking-wider bg-slate-800/60 text-slate-300 border border-slate-700/40 shadow-sm">
                  PAKET BASIC
                </span>
                <h4 className="text-base sm:text-2xl md:text-4xl font-extrabold text-slate-300 mt-2 md:mt-4">Rp 0</h4>
                <p className="text-[9px] sm:text-xs opacity-60 mt-0.5 md:mt-1 text-[#f5f5dc]">Selamanya Gratis</p>
                <p className="opacity-80 text-[9px] sm:text-xs md:text-sm mt-3 md:mt-6 text-[#f5f5dc]">Cocok untuk mencoba fitur builder dasar kami sebelum memutuskan berlangganan.</p>
              </div>

              <hr className="border-slate-800 my-4 md:my-8" />

              <ul className="space-y-2 md:space-y-4 flex-1 text-[9px] sm:text-xs md:text-sm text-[#f5f5dc]/80">
                <li className="flex items-center gap-1.5 md:gap-3">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                  Masa aktif undangan 3 hari
                </li>
                <li className="flex items-center gap-1.5 md:gap-3">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                  Maksimal 50 tamu undangan
                </li>
                <li className="flex items-center gap-1.5 md:gap-3">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                  Desain template dasar (Basic)
                </li>
                <li className="flex items-center gap-1.5 md:gap-3 opacity-30">
                  <span className="w-3.5 h-3.5 inline-flex items-center justify-center font-bold text-white">✕</span>
                  Tanpa kustom musik & galeri
                </li>
                <li className="flex items-center gap-1.5 md:gap-3 opacity-30">
                  <span className="w-3.5 h-3.5 inline-flex items-center justify-center font-bold text-white">✕</span>
                  Terdapat watermark brand Adatara
                </li>
              </ul>

              <Link href="/register?plan=basic" className="mt-4 md:mt-8 w-full py-2 sm:py-3 text-center rounded-lg md:rounded-xl text-[10px] sm:text-sm md:text-base font-bold transition-all border border-slate-800 bg-slate-900/10 text-slate-400 hover:bg-slate-800 hover:text-white">
                Mulai Gratis
              </Link>
            </motion.div>

            {/* Plan 2: Pro */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="border rounded-xl sm:rounded-3xl p-2 sm:p-5 md:p-8 flex flex-col relative shadow-xl transition-all duration-500 bg-emerald-950/15 backdrop-blur-md border-emerald-900/50 hover:border-emerald-700 hover:shadow-emerald-950/10"
            >
              <div className="absolute top-0 right-3 sm:right-8 -translate-y-1/2 text-emerald-300 text-[6px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-widest bg-emerald-950 border border-emerald-800 shadow-sm">
                Paling Populer
              </div>

              <div>
                <span className="inline-block px-2 py-0.5 rounded-full text-[8px] sm:text-xs font-black uppercase tracking-wider bg-emerald-900/50 text-emerald-300 border border-emerald-800/40 shadow-sm">
                  PAKET PREMIUM
                </span>
                <h4 className="text-base sm:text-2xl md:text-4xl font-extrabold text-emerald-300 mt-2 md:mt-4">Rp 99.000</h4>
                <p className="text-[9px] sm:text-xs opacity-75 mt-0.5 md:mt-1 text-[#f5f5dc]">Bayar Sekali (Aktif Selamanya)</p>
                <p className="opacity-80 text-[9px] sm:text-xs md:text-sm mt-3 md:mt-6 text-[#f5f5dc]">Fitur terlengkap untuk menghadirkan undangan yang elegan dengan ornamen terbaik.</p>
              </div>

              <hr className="border-emerald-900/30 my-4 md:my-8" />

              <ul className="space-y-2 md:space-y-4 flex-1 text-[9px] sm:text-xs md:text-sm text-[#f5f5dc]/90">
                <li className="flex items-center gap-1.5 md:gap-3">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  Masa aktif undangan selamanya
                </li>
                <li className="flex items-center gap-1.5 md:gap-3">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  Tamu undangan tak terbatas
                </li>
                <li className="flex items-center gap-1.5 md:gap-3">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  Bebas kustom musik latar & audio
                </li>
                <li className="flex items-center gap-1.5 md:gap-3">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  Galeri foto & video tak terbatas
                </li>
                <li className="flex items-center gap-1.5 md:gap-3">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  RSVP & amplop digital cashless
                </li>
                <li className="flex items-center gap-1.5 md:gap-3">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  Bebas watermark brand Adatara
                </li>
              </ul>

              <Link
                href="/register?plan=premium"
                className="mt-4 md:mt-8 w-full py-2 sm:py-3 text-center rounded-lg md:rounded-xl text-[10px] sm:text-sm md:text-base font-bold transition-all border border-emerald-700 bg-emerald-800/20 text-emerald-300 hover:bg-emerald-500 hover:text-[#063024] hover:shadow-lg shadow-emerald-500/10"
              >
                Pilih Premium
              </Link>
            </motion.div>

            {/* Plan 3: VIP */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.01 }}
              className="border-2 rounded-xl sm:rounded-3xl p-2 sm:p-5 md:p-8 flex flex-col relative shadow-2xl transition-all duration-500 bg-gradient-to-b from-[#d4af37]/15 via-[#063024]/10 to-transparent backdrop-blur-md border-[#d4af37] hover:from-[#d4af37]/20 hover:shadow-[#d4af37]/15"
            >
              <div className="absolute top-0 right-3 sm:right-8 -translate-y-1/2 text-[#063024] text-[6px] sm:text-[10px] font-black px-1.5 py-0.5 sm:px-3.5 sm:py-1.5 rounded-full uppercase tracking-widest bg-gradient-to-r from-amber-400 to-[#d4af37] shadow-lg shadow-[#d4af37]/30 animate-pulse">
                Rekomendasi VIP
              </div>

              <div>
                <span className="inline-block px-2 py-0.5 rounded-full text-[8px] sm:text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 via-[#d4af37] to-yellow-500 text-[#063024] border border-amber-300/30 shadow-md">
                  PAKET SULTAN
                </span>
                <h4 className="text-base sm:text-2xl md:text-4xl font-black text-[#d4af37] mt-2 md:mt-4 drop-shadow-sm">Rp 149.000</h4>
                <p className="text-[9px] sm:text-xs opacity-75 mt-0.5 md:mt-1 text-[#f5f5dc]">Bayar Sekali (Aktif Selamanya)</p>
                <p className="opacity-95 text-[9px] sm:text-xs md:text-sm mt-3 md:mt-6 text-[#f5f5dc] font-medium">Layanan ekstra VIP untuk Anda yang menginginkan integrasi pesan WhatsApp otomatis.</p>
              </div>

              <hr className="border-[#d4af37]/20 my-4 md:my-8" />

              <ul className="space-y-2 md:space-y-4 flex-1 text-[9px] sm:text-xs md:text-sm text-white font-medium">
                <li className="flex items-center gap-1.5 md:gap-3">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 text-[#d4af37]" />
                  Semua fitur paket PREMIUM
                </li>
                <li className="flex items-center gap-1.5 md:gap-3">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 text-[#d4af37]" />
                  Subdomain kustom (.adatara.id/nama)
                </li>
                <li className="flex items-center gap-1.5 md:gap-3">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 text-[#d4af37]" />
                  100 WhatsApp blast untuk undangan tamu
                </li>
                <li className="flex items-center gap-1.5 md:gap-3">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 text-[#d4af37]" />
                  Prioritas bantuan admin 24/7
                </li>
              </ul>

              <Link
                href="/register?plan=sultan"
                className="mt-4 md:mt-8 w-full py-2 sm:py-4 text-center rounded-lg md:rounded-xl text-[10px] sm:text-sm md:text-base font-black transition-all shadow-lg shadow-[#d4af37]/10 hover:shadow-[#d4af37]/25 bg-[#d4af37] text-[#063024] hover:bg-[#c5a030] hover:scale-[1.02]"
              >
                Pilih Sultan
              </Link>
            </motion.div>

            {/* Plan 4: Exclusive */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.01 }}
              className="border-2 rounded-xl sm:rounded-3xl p-2 sm:p-5 md:p-8 flex flex-col relative shadow-2xl transition-all duration-500 bg-gradient-to-b from-purple-950/20 via-[#063024]/10 to-transparent backdrop-blur-md border-purple-500 hover:from-purple-900/25 hover:shadow-purple-500/20"
            >
              <div className="absolute top-0 right-3 sm:right-8 -translate-y-1/2 text-white text-[6px] sm:text-[10px] font-black px-1.5 py-0.5 sm:px-3.5 sm:py-1.5 rounded-full uppercase tracking-widest bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30 animate-pulse">
                Terima Beres
              </div>

              <div>
                <span className="inline-block px-2 py-0.5 rounded-full text-[8px] sm:text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-500 to-indigo-500 text-white border border-purple-400/30 shadow-md">
                  PAKET EXCLUSIVE
                </span>
                <h4 className="text-base sm:text-2xl md:text-4xl font-black text-purple-300 mt-2 md:mt-4 drop-shadow-sm">Rp 299.000</h4>
                <p className="text-[9px] sm:text-xs opacity-75 mt-0.5 md:mt-1 text-[#f5f5dc]">Bayar Sekali (Aktif Selamanya)</p>
                <p className="opacity-95 text-[9px] sm:text-xs md:text-sm mt-3 md:mt-6 text-[#f5f5dc] font-medium">Layanan premium terima beres. Tim kami yang akan menginput data dan mendesain undangan Anda sepenuhnya.</p>
              </div>

              <hr className="border-purple-500/20 my-4 md:my-8" />

              <ul className="space-y-2 md:space-y-4 flex-1 text-[9px] sm:text-xs md:text-sm text-white font-medium">
                <li className="flex items-center gap-1.5 md:gap-3">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                  Semua fitur paket SULTAN
                </li>
                <li className="flex items-center gap-1.5 md:gap-3">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                  Pembuatan dibantu desainer kami
                </li>
                <li className="flex items-center gap-1.5 md:gap-3">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                  Revisi tanpa batas sepuasnya
                </li>
                <li className="flex items-center gap-1.5 md:gap-3">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                  WhatsApp Blast tak terbatas
                </li>
                <li className="flex items-center gap-1.5 md:gap-3">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0 text-purple-400" />
                  Kustom domain pribadi (.com/.id)
                </li>
              </ul>

              <Link
                href="/register?plan=exclusive"
                className="mt-4 md:mt-8 w-full py-2 sm:py-4 text-center rounded-lg md:rounded-xl text-[10px] sm:text-sm md:text-base font-black transition-all shadow-lg shadow-purple-500/10 hover:shadow-purple-500/25 bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90 hover:scale-[1.02]"
              >
                Pilih Exclusive
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </div>

      {/* FAQ SECTION */}
      <section id="faq" className="py-12 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-transparent via-white to-transparent scroll-mt-24">
        {/* Soft elegant glows */}
        <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-[#064e3b]/[0.02] blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-72 h-72 rounded-full bg-[#d4af37]/[0.03] blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-xs font-extrabold custom-accent-color uppercase tracking-widest flex items-center justify-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" /> Tanya Jawab
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black mt-2 custom-text-color tracking-tight">Pertanyaan yang Sering Diajukan</h3>
            <p className="opacity-75 mt-3 text-sm font-medium custom-text-color max-w-lg mx-auto">
              Temukan jawaban cepat untuk pertanyaan umum seputar fitur, pemesanan, dan pengelolaan undangan digital Anda.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-4"
          >
            {MOCK_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 bg-white ${isOpen
                      ? "border-[#064e3b]/35 shadow-md shadow-[#064e3b]/5 bg-gradient-to-r from-[#064e3b]/[0.02] to-transparent"
                      : "border-[#064e3b]/10 shadow-sm hover:shadow-md hover:border-[#064e3b]/25"
                    }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-bold custom-text-color transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-3 pr-4">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isOpen
                          ? "bg-[#064e3b] text-[#f5f5dc]"
                          : "bg-[#064e3b]/5 text-[#064e3b] group-hover:bg-[#064e3b]/10"
                        }`}>
                        <HelpCircle className="w-4 h-4" />
                      </span>
                      <span className="text-base sm:text-lg font-black tracking-tight">{faq.tanya}</span>
                    </span>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${isOpen ? "bg-[#064e3b]/10" : "bg-transparent"
                      }`}>
                      <ChevronDown
                        className="w-4 h-4 transition-transform duration-300"
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "none",
                          color: isOpen ? "#064e3b" : "currentColor"
                        }}
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pt-1 text-sm text-[#064e3b]/85 leading-relaxed font-medium pl-[52px]">
                          {faq.jawab}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>


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
                  <a href="#" className="hover:text-white transition-colors duration-250 flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] scale-0 group-hover:scale-100 transition-transform duration-200" />
                    Beranda
                  </a>
                </li>
                <li>
                  <a href="#katalog" className="hover:text-white transition-colors duration-250 flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] scale-0 group-hover:scale-100 transition-transform duration-200" />
                    Katalog Undangan
                  </a>
                </li>
                <li>
                  <a href="#harga" className="hover:text-white transition-colors duration-250 flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] scale-0 group-hover:scale-100 transition-transform duration-200" />
                    Paket Harga
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors duration-250 flex items-center gap-1.5 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] scale-0 group-hover:scale-100 transition-transform duration-200" />
                    Tanya Jawab
                  </a>
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
