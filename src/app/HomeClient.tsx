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
  settings: initialSettings,
  packages: initialPackages
}: {
  initialTemplates: any[];
  initialCategories: string[];
  settings: any;
  packages?: any;
}) {
  const defaultPackages = {
    BASIC: {
      price: 0,
      name: "PAKET BASIC",
      sub: "Selamanya Gratis",
      desc: "Cocok untuk mencoba fitur builder dasar kami sebelum memutuskan berlangganan.",
      features: [
        "Masa aktif undangan 3 hari",
        "Maksimal 50 tamu undangan",
        "Desain template dasar (Basic)",
        "Tanpa kustom musik & galeri",
        "Terdapat watermark brand Adatara"
      ]
    },
    PREMIUM: {
      price: 99000,
      name: "PAKET PREMIUM",
      sub: "Bayar Sekali (Aktif Selamanya)",
      desc: "Fitur terlengkap untuk menghadirkan undangan yang elegan dengan ornamen terbaik.",
      features: [
        "Masa aktif undangan selamanya",
        "Tamu undangan tak terbatas",
        "Bebas kustom musik latar & audio",
        "Galeri foto & video tak terbatas",
        "RSVP & amplop digital cashless",
        "Bebas watermark brand Adatara"
      ]
    },
    SULTAN: {
      price: 149000,
      name: "PAKET SULTAN",
      sub: "Bayar Sekali (Aktif Selamanya)",
      desc: "Layanan ekstra VIP untuk Anda yang menginginkan integrasi pesan WhatsApp otomatis.",
      features: [
        "Semua fitur paket PREMIUM",
        "Subdomain kustom (.adatara.id/nama)",
        "100 WhatsApp blast untuk undangan tamu",
        "Prioritas bantuan admin 24/7"
      ]
    },
    EXCLUSIVE: {
      price: 299000,
      name: "PAKET EXCLUSIVE",
      sub: "Bayar Sekali (Aktif Selamanya)",
      desc: "Layanan premium terima beres. Tim kami yang akan menginput data dan mendesain undangan Anda sepenuhnya.",
      features: [
        "Semua fitur paket SULTAN",
        "Pembuatan dibantu desainer kami",
        "Revisi tanpa batas sepuasnya",
        "WhatsApp Blast tak terbatas",
        "Kustom domain pribadi (.com/.id)"
      ]
    }
  };

  const activePackages = initialPackages || defaultPackages;
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
    ]),
    whatsapp_number: "082262278182"
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
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
              <p className="text-sm sm:text-base opacity-75 max-w-xl leading-relaxed mb-4 lg:mb-8 font-medium custom-hero-subtitle">
                {settings.hero_subtitle}
              </p>

              {/* CTA Buttons - Desktop Only */}
              <div className="hidden lg:flex flex-row items-center gap-2 w-full sm:w-auto justify-center">
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
              className="lg:col-span-5 flex flex-col items-center justify-center relative"
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
                className="relative w-[290px] sm:w-[315px] aspect-[9/17.5] bg-[#0c1322] rounded-[38px] p-1 shadow-2xl border-[3px] border-[#222f46] flex flex-col justify-between"
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

              {/* CTA Buttons - Mobile Only */}
              <div className="flex lg:hidden flex-row items-center gap-2 w-full max-w-[290px] sm:max-w-[315px] justify-center mt-6">
                <Link
                  href={settings.hero_cta_url}
                  className="flex-1 px-2.5 py-2.5 rounded-full font-black border transition-all text-center custom-btn-primary shadow-md shadow-black/5 text-[10px] min-[360px]:text-xs"
                >
                  {settings.hero_cta_text}
                </Link>
                <a
                  href={settings.hero_demo_url}
                  className="flex-1 px-2.5 py-2.5 rounded-full font-black border transition-all text-center custom-btn-secondary text-[10px] min-[360px]:text-xs"
                >
                  {settings.hero_demo_text}
                </a>
              </div>
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
              Buat undangan digital premium Anda sendiri dalam hitungan menit tanpa ribet dengan 4 langkah mudah.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 md:gap-8 relative">
            {/* Connecting line for desktop/tablet */}
            <div className="hidden sm:block absolute top-1/2 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-emerald-100 via-[#d4af37]/35 to-emerald-100 -translate-y-10 z-0" />

            {/* Step 1 */}
            <motion.div
              variants={itemVariants}
              className="bg-white/40 backdrop-blur-md border border-[#064e3b]/10 rounded-xl sm:rounded-3xl p-3 sm:p-8 flex flex-col items-center text-center relative z-10 hover:bg-white/70 hover:border-[#d4af37]/50 hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-[#064e3b] flex items-center justify-center text-white font-black text-xs sm:text-base shadow-md shadow-[#064e3b]/10 mb-2 sm:mb-4">
                01
              </div>
              <h3 className="text-[10px] sm:text-lg font-bold text-[#064e3b] mb-1 sm:mb-2">Pilih Template</h3>
              <p className="text-[8px] sm:text-xs text-[#064e3b]/70 font-medium leading-normal sm:leading-relaxed">
                Pilih desain undangan digital terbaik dan favorit Anda dari katalog kami.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              variants={itemVariants}
              className="bg-white/40 backdrop-blur-md border border-[#064e3b]/10 rounded-xl sm:rounded-3xl p-3 sm:p-8 flex flex-col items-center text-center relative z-10 hover:bg-white/70 hover:border-[#d4af37]/50 hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-[#064e3b] flex items-center justify-center text-white font-black text-xs sm:text-base shadow-md shadow-[#064e3b]/10 mb-2 sm:mb-4">
                02
              </div>
              <h3 className="text-[10px] sm:text-lg font-bold text-[#064e3b] mb-1 sm:mb-2">Isi Data</h3>
              <p className="text-[8px] sm:text-xs text-[#064e3b]/70 font-medium leading-normal sm:leading-relaxed">
                Lengkapi detail acara, profil mempelai, cerita cinta, dan foto terbaik Anda.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              variants={itemVariants}
              className="bg-white/40 backdrop-blur-md border border-[#064e3b]/10 rounded-xl sm:rounded-3xl p-3 sm:p-8 flex flex-col items-center text-center relative z-10 hover:bg-white/70 hover:border-[#d4af37]/50 hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-[#064e3b] flex items-center justify-center text-white font-black text-xs sm:text-base shadow-md shadow-[#064e3b]/10 mb-2 sm:mb-4">
                03
              </div>
              <h3 className="text-[10px] sm:text-lg font-bold text-[#064e3b] mb-1 sm:mb-2">Payment</h3>
              <p className="text-[8px] sm:text-xs text-[#064e3b]/70 font-medium leading-normal sm:leading-relaxed">
                Lakukan pembayaran instan untuk mengaktifkan semua fitur premium.
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              variants={itemVariants}
              className="bg-white/40 backdrop-blur-md border border-[#064e3b]/10 rounded-xl sm:rounded-3xl p-3 sm:p-8 flex flex-col items-center text-center relative z-10 hover:bg-white/70 hover:border-[#d4af37]/50 hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-[#064e3b] flex items-center justify-center text-white font-black text-xs sm:text-base shadow-md shadow-[#064e3b]/10 mb-2 sm:mb-4">
                04
              </div>
              <h3 className="text-[10px] sm:text-lg font-bold text-[#064e3b] mb-1 sm:mb-2">Selesai</h3>
              <p className="text-[8px] sm:text-xs text-[#064e3b]/70 font-medium leading-normal sm:leading-relaxed">
                Undangan siap dibagikan secara instan kepada keluarga dan kerabat.
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
          <div className="flex flex-col mb-8 text-left items-start">
            <span className="text-[10px] font-extrabold custom-text-color uppercase tracking-widest bg-[#064e3b]/5 px-4 py-1.5 rounded-full border border-[#064e3b]/10 w-max">
              Galeri Desain
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-4 custom-text-color tracking-tight leading-tight">
              Pilih Template Favorit Anda
            </h2>
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
              {filteredTemplates.map((template) => {
                const parsedJson = typeof template.template_json === "string"
                  ? JSON.parse(template.template_json)
                  : template.template_json;
                const coverData = parsedJson?.cover;
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    key={template.id}
                    className="group bg-white border custom-border-color sm:hover:border-[#d4af37]/45 sm:hover:-translate-y-1 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    {/* Badges Header Bar */}
                    <div className="px-2 py-1.5 flex items-center justify-between border-b border-[#064e3b]/5 bg-[#064e3b]/[0.02]">
                      {/* Package Tier Badge */}
                      <span className={`px-1.5 py-0.5 rounded-md text-[5.5px] font-extrabold uppercase tracking-wider border shadow-sm ${template.paket === "EXCLUSIVE"
                        ? "bg-[#800020] text-white border-[#6a001a]"
                        : template.paket === "SULTAN"
                          ? "bg-[#78350f] text-[#fef08a] border-[#b45309]/40"
                          : template.paket === "PREMIUM"
                            ? "bg-emerald-600 text-white border-emerald-700"
                            : "bg-slate-400 text-white border-slate-500"
                        }`}>
                        {template.paket || "BASIC"}
                      </span>

                      {/* Category Badge */}
                      <span className="px-1.5 py-0.5 rounded-md text-[5.5px] font-black uppercase tracking-wider bg-white text-[#064e3b] border border-[#064e3b]/10 shadow-sm">
                        {template.kategori || "—"}
                      </span>
                    </div>

                    <div
                      className="w-full h-44 sm:h-52 md:h-60 lg:h-64 overflow-hidden relative flex items-center justify-center p-2.5"
                      style={{ backgroundColor: `${settings.text_color}08` }}
                    >
                      {/* Background Image of the catalog card container (only fallback if no live preview data) */}
                      {!coverData && template.image && (
                        <img
                          src={getSafeThumbnail(template.image)}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-700 ease-out sm:group-hover:scale-105"
                        />
                      )}

                      {/* Cover Preview Zoom Wrapper in 9:16 aspect ratio */}
                      <div className="h-full aspect-[9/16] relative overflow-hidden bg-white shadow-sm border border-[#064e3b]/10 rounded-lg transition-transform duration-700 ease-out sm:group-hover:scale-[1.04] z-10">
                        {coverData ? (
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
                        )}
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
                );
              })}
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
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold custom-text-color uppercase tracking-widest bg-[#064e3b]/5 px-4 py-1.5 rounded-full border border-[#064e3b]/10">
              Fitur Unggulan
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-4 custom-text-color tracking-tight leading-tight">
              Semua yang Anda Butuhkan untuk Undangan Sempurna
            </h2>
            <p className="text-[#064e3b]/70 text-xs sm:text-sm mt-3 font-medium">
              Dengan fitur terkini yang mempermudah tamu Anda menerima, mengonfirmasi, dan merayakan kebahagiaan Anda.
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
              className="relative border border-[#064e3b]/25 rounded-xl sm:rounded-3xl p-3 sm:p-5 md:p-8 bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-md hover:border-[#064e3b]/60 hover:-translate-y-2 hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-500 group overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#064e3b]/5 hover:from-white/90 hover:to-white/70 cursor-default"
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
                Pilih & edit modul visual (Cover, Pembuka, Profil, Acara, Galeri, RSVP), teks, tata letak, warna, dan font secara instan.
              </p>
            </motion.div>

            {/* Feature Card 2 */}
            <motion.div
              variants={itemVariants}
              className="relative border border-[#064e3b]/25 rounded-xl sm:rounded-3xl p-3 sm:p-5 md:p-8 bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-md hover:border-[#064e3b]/60 hover:-translate-y-2 hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-500 group overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#064e3b]/5 hover:from-white/90 hover:to-white/70 cursor-default"
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
                Gunakan musik latar pilihan (atau MP3 sendiri) dan galeri foto premium dengan berbagai pilihan gaya tampilan modern.
              </p>
            </motion.div>

            {/* Feature Card 3 */}
            <motion.div
              variants={itemVariants}
              className="relative border border-[#064e3b]/25 rounded-xl sm:rounded-3xl p-3 sm:p-5 md:p-8 bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-md hover:border-[#064e3b]/60 hover:-translate-y-2 hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-500 group overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#064e3b]/5 hover:from-white/90 hover:to-white/70 cursor-default"
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
                Terima konfirmasi kehadiran tamu secara langsung dan pantau daftar rekapitulasi RSVP dari dashboard Anda.
              </p>
            </motion.div>

            {/* Feature Card 4 */}
            <motion.div
              variants={itemVariants}
              className="relative border border-[#064e3b]/25 rounded-xl sm:rounded-3xl p-3 sm:p-5 md:p-8 bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-md hover:border-[#064e3b]/60 hover:-translate-y-2 hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-500 group overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#064e3b]/5 hover:from-white/90 hover:to-white/70 cursor-default"
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
                Sediakan nomor rekening bank, e-wallet, atau QRIS untuk memudahkan tamu mengirimkan hadiah secara nontunai (cashless).
              </p>
            </motion.div>

            {/* Feature Card 5 */}
            <motion.div
              variants={itemVariants}
              className="relative border border-[#064e3b]/25 rounded-xl sm:rounded-3xl p-3 sm:p-5 md:p-8 bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-md hover:border-[#064e3b]/60 hover:-translate-y-2 hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-500 group overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#064e3b]/5 hover:from-white/90 hover:to-white/70 cursor-default"
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
                Peta Google Maps interaktif dan navigasi rute lengkap untuk memastikan tamu Anda tidak salah lokasi.
              </p>
            </motion.div>

            {/* Feature Card 6 */}
            <motion.div
              variants={itemVariants}
              className="relative border border-[#064e3b]/25 rounded-xl sm:rounded-3xl p-3 sm:p-5 md:p-8 bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-md hover:border-[#064e3b]/60 hover:-translate-y-2 hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-500 group overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#064e3b]/5 hover:from-white/90 hover:to-white/70 cursor-default"
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
                Penghitung waktu mundur otomatis hingga hari bahagia untuk membangkitkan antusiasme para undangan.
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
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/10 px-4 py-1.5 rounded-full border border-[#d4af37]/20">
              Paket Harga
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-4 text-white tracking-tight leading-tight">
              Pilihan Terbaik untuk Hari Bahagia Anda
            </h2>
            <p className="text-[#f5f5dc]/70 text-xs sm:text-sm mt-3 font-medium">
              Temukan paket undangan digital yang tepat dengan harga transparan dan tanpa biaya tambahan.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-8 sm:gap-4 md:gap-6 items-stretch"
          >
            {Object.keys(activePackages).map((key) => {
              const pkg = activePackages[key];
              if (!pkg) return null;

              const isPopular = pkg.badgeStyle === "emerald";
              const isBasic = pkg.badgeStyle === "slate";
              const isSultan = pkg.badgeStyle === "amber";
              const isExclusive = pkg.badgeStyle === "purple";

              const badgeText = pkg.badgeText || "";
              let badgeColorClass = "";
              if (pkg.badgeStyle === "emerald") {
                badgeColorClass = "text-emerald-300 bg-emerald-950 border border-emerald-800";
              } else if (pkg.badgeStyle === "amber") {
                badgeColorClass = "text-[#fef08a] bg-[#451a03] border border-[#78350f]";
              } else if (pkg.badgeStyle === "purple") {
                badgeColorClass = "text-[#ffe4e6] bg-[#500010] border border-[#700018]";
              } else {
                badgeColorClass = "text-slate-300 bg-slate-950 border border-slate-800";
              }

              return (
                <motion.div
                  key={key}
                  variants={itemVariants}
                  className="border rounded-xl sm:rounded-3xl p-3.5 sm:p-5 md:p-8 flex flex-col relative shadow-xl hover:-translate-y-1.5 transition-all duration-500 backdrop-blur-md bg-emerald-950/15 border-emerald-900/50 hover:border-emerald-700 hover:shadow-emerald-950/10"
                >
                  {badgeText && (
                    <div className={`absolute top-0 right-3 sm:right-8 -translate-y-1/2 text-[6px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-widest shadow-sm ${badgeColorClass}`}>
                      {badgeText}
                    </div>
                  )}

                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] sm:text-xs font-black uppercase tracking-wider shadow-sm ${isBasic ? "bg-slate-800/60 text-slate-300 border border-slate-700/40" :
                      isPopular ? "bg-emerald-900/50 text-emerald-300 border border-emerald-800/40" :
                        isSultan ? "bg-[#451a03]/80 text-[#fef08a] border border-[#78350f]/40" :
                          "bg-[#500010] text-[#ffe4e6] border border-[#700018]/50"
                      }`}>
                      {pkg.name}
                    </span>
                    <h4 className="text-base sm:text-2xl md:text-4xl font-extrabold mt-2 md:mt-4 text-emerald-400">
                      {pkg.price === 0 ? "Rp 0" : `Rp ${pkg.price.toLocaleString("id-ID")}`}
                    </h4>
                    <p className="text-[9px] sm:text-xs opacity-75 mt-0.5 md:mt-1 text-[#f5f5dc]">{pkg.sub}</p>
                    <p className="opacity-80 text-[9px] sm:text-xs md:text-sm mt-3 md:mt-6 text-[#f5f5dc]/80">{pkg.desc}</p>
                  </div>

                  <hr className="border-emerald-900/30 my-4 md:my-8" />

                  <ul className="space-y-2 md:space-y-4 flex-1 text-[9px] sm:text-xs md:text-sm text-[#f5f5dc]/90">
                    {(pkg.features || []).map((feat: string, fIdx: number) => {
                      const isCrossed = feat.startsWith("✕ ") || feat.startsWith("Tanpa ") || feat.startsWith("Terdapat ");
                      return (
                        <li key={fIdx} className={`flex items-center gap-1.5 md:gap-3 ${isCrossed ? "opacity-35" : ""}`}>
                          {isCrossed ? (
                            <span className="w-3.5 h-3.5 inline-flex items-center justify-center font-bold text-white shrink-0">✕</span>
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                          )}
                          <span>{feat}</span>
                        </li>
                      );
                    })}
                  </ul>

                  <Link
                    href={`/register?plan=${key.toLowerCase()}`}
                    className={`mt-4 md:mt-8 w-full py-2 sm:py-3 text-center rounded-lg md:rounded-xl text-[10px] sm:text-sm md:text-base font-bold transition-all border ${isBasic ? "border-emerald-700 bg-emerald-900/20 text-emerald-400 hover:bg-emerald-800/35 hover:text-emerald-200" :
                      isPopular ? "border-emerald-600 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-600/30 hover:text-emerald-200" :
                        isSultan ? "border-[#78350f] bg-[#451a03]/20 text-[#d97706] hover:bg-[#78350f]/40 hover:text-white" :
                          "border-[#700018] bg-[#500010]/20 text-[#ffe4e6] hover:bg-[#700018] hover:text-white"
                      }`}
                  >
                    {pkg.buttonText || (isBasic ? "Mulai Gratis" : "Pilih Paket")}
                  </Link>
                </motion.div>
              );
            })}
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
            className="text-center mb-8 sm:mb-16 max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-extrabold custom-text-color uppercase tracking-widest bg-[#064e3b]/5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-[#064e3b]/10">
              <HelpCircle className="w-3.5 h-3.5" /> Tanya Jawab
            </span>
            <h2 className="text-lg sm:text-4xl font-extrabold mt-3 sm:mt-4 custom-text-color tracking-tight leading-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="opacity-75 text-[10px] sm:text-sm mt-2 sm:mt-3 font-medium custom-text-color px-2 sm:px-0">
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
                    className="w-full px-4 py-3.5 sm:px-6 sm:py-5 flex items-center justify-between text-left font-bold custom-text-color transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-3 pr-4">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isOpen
                        ? "bg-[#064e3b] text-[#f5f5dc]"
                        : "bg-[#064e3b]/5 text-[#064e3b] group-hover:bg-[#064e3b]/10"
                        }`}>
                        <HelpCircle className="w-4 h-4" />
                      </span>
                      <span className="text-xs sm:text-lg font-black tracking-tight">{faq.tanya}</span>
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
                        <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-[#064e3b]/85 leading-relaxed font-medium pl-11 sm:pl-[52px]">
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

      {/* FLOATING WHATSAPP BUTTON */}
      {(() => {
        const rawWaNumber = settings?.whatsapp_number || "082262278182";
        const cleanWaNumber = rawWaNumber.replace(/\D/g, "");
        const formattedWaNumber = cleanWaNumber.startsWith("0") 
          ? "62" + cleanWaNumber.slice(1) 
          : cleanWaNumber.startsWith("8") 
            ? "62" + cleanWaNumber 
            : cleanWaNumber;
        return (
          <a
            href={`https://wa.me/${formattedWaNumber}?text=Halo%20Adatara,%20saya%20ingin%20tanya-tanya%20tentang%20undangan%20digital.`}
            target="_blank"
            rel="noopener noreferrer"
            className="group fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20ba56] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Hubungi kami melalui WhatsApp"
          >
            {/* Pulsing Outer Halo */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping group-hover:animate-none pointer-events-none" />
            
            {/* Official WhatsApp Logo SVG */}
            <svg viewBox="0 0 16 16" className="w-6 h-6 sm:w-7 sm:h-7 fill-current z-10" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
            </svg>

            {/* Hover Tooltip/Label */}
            <span className="absolute right-14 sm:right-16 top-1/2 -translate-y-1/2 bg-white text-[#064e3b] text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-full shadow-lg border border-[#064e3b]/10 whitespace-nowrap opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none hidden md:block">
              Hubungi Kami
            </span>
          </a>
        );
      })()}
    </div>
  );
}
