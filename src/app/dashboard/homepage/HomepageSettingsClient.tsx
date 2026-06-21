"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateHomepageSettings } from "./homepage-actions";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Save, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Image as ImageIcon, 
  Smartphone, 
  Layout, 
  Paintbrush, 
  Upload, 
  Check, 
  Loader2,
  ArrowRight,
  HelpCircle,
  ExternalLink,
  Palette
} from "lucide-react";

interface EmulatorCover {
  image_url: string;
  badge?: string;
  title?: string;
  subtitle?: string;
}

interface HomepageSettings {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  hero_cta_url: string;
  hero_demo_text: string;
  hero_demo_url: string;
  bg_color: string;
  text_color: string;
  accent_color: string;
  bg_image?: string | null;
  bg_gradient: boolean;
  bg_pattern_opacity: number;
  bg_pattern_blur: number;
  bg_overlay_opacity: number;
  hero_title_font?: string | null;
  hero_title_color?: string | null;
  hero_title_size?: number | null;
  hero_title_align?: string | null;
  hero_subtitle_font?: string | null;
  hero_subtitle_color?: string | null;
  hero_subtitle_size?: number | null;
  hero_subtitle_align?: string | null;
  stats_bg_color?: string | null;
  emulator_covers: string; // JSON string
}

function hexToRgba(hex: string, alpha: number) {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function HomepageSettingsClient({
  initialSettings
}: {
  initialSettings: HomepageSettings;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"hero" | "background" | "emulator">("hero");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [heroTitle, setHeroTitle] = useState(initialSettings.hero_title);
  const [heroSubtitle, setHeroSubtitle] = useState(initialSettings.hero_subtitle);
  const [heroCtaText, setHeroCtaText] = useState(initialSettings.hero_cta_text);
  const [heroCtaUrl, setHeroCtaUrl] = useState(initialSettings.hero_cta_url);
  const [heroDemoText, setHeroDemoText] = useState(initialSettings.hero_demo_text);
  const [heroDemoUrl, setHeroDemoUrl] = useState(initialSettings.hero_demo_url);

  const [bgColor, setBgColor] = useState(initialSettings.bg_color);
  const [textColor, setTextColor] = useState(initialSettings.text_color);
  const [accentColor, setAccentColor] = useState(initialSettings.accent_color);
  const [bgImage, setBgImage] = useState(initialSettings.bg_image || "");
  const [bgGradient, setBgGradient] = useState(initialSettings.bg_gradient);
  const [bgPatternOpacity, setBgPatternOpacity] = useState(initialSettings.bg_pattern_opacity ?? 0.3);
  const [bgPatternBlur, setBgPatternBlur] = useState(initialSettings.bg_pattern_blur ?? 0);
  const [bgOverlayOpacity, setBgOverlayOpacity] = useState(initialSettings.bg_overlay_opacity ?? 0.2);
  const [statsBgColor, setStatsBgColor] = useState(initialSettings.stats_bg_color || "#064e3b");

  // Title Typography states
  const [heroTitleFont, setHeroTitleFont] = useState(initialSettings.hero_title_font || "Playfair Display");
  const [heroTitleColor, setHeroTitleColor] = useState(initialSettings.hero_title_color || "#064e3b");
  const [heroTitleSize, setHeroTitleSize] = useState(initialSettings.hero_title_size || 56);
  const [heroTitleAlign, setHeroTitleAlign] = useState(initialSettings.hero_title_align || "left");

  // Subtitle Typography states
  const [heroSubtitleFont, setHeroSubtitleFont] = useState(initialSettings.hero_subtitle_font || "Inter");
  const [heroSubtitleColor, setHeroSubtitleColor] = useState(initialSettings.hero_subtitle_color || "#064e3b");
  const [heroSubtitleSize, setHeroSubtitleSize] = useState(initialSettings.hero_subtitle_size || 16);
  const [heroSubtitleAlign, setHeroSubtitleAlign] = useState(initialSettings.hero_subtitle_align || "left");

  // Emulator slides state
  const parsedCovers: EmulatorCover[] = (() => {
    try {
      return JSON.parse(initialSettings.emulator_covers);
    } catch {
      return [];
    }
  })();
  const [covers, setCovers] = useState<EmulatorCover[]>(parsedCovers);
  const [activeSlidePreviewIdx, setActiveSlidePreviewIdx] = useState(0);

  // Upload states
  const [bgUploading, setBgUploading] = useState(false);
  const [slideUploadingIdx, setSlideUploadingIdx] = useState<number | null>(null);

  // Handlers for slide list
  const handleAddSlide = () => {
    const newSlide: EmulatorCover = {
      image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
      badge: "SLIDE PREVIEW BARU",
      title: "Desain Premium Anda",
      subtitle: "Tambahkan detail menarik untuk memikat calon pengguna Anda."
    };
    setCovers([...covers, newSlide]);
    setActiveSlidePreviewIdx(covers.length); // switch preview to new slide
  };

  const handleDeleteSlide = (index: number) => {
    if (covers.length <= 1) {
      alert("Minimal harus ada 1 slide untuk emulator.");
      return;
    }
    const newCovers = covers.filter((_, idx) => idx !== index);
    setCovers(newCovers);
    setActiveSlidePreviewIdx(Math.max(0, index - 1));
  };

  const handleMoveSlide = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === covers.length - 1) return;

    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const newCovers = [...covers];
    const temp = newCovers[index];
    newCovers[index] = newCovers[targetIdx];
    newCovers[targetIdx] = temp;
    setCovers(newCovers);
    setActiveSlidePreviewIdx(targetIdx);
  };

  const handleUpdateSlideField = (index: number, field: keyof EmulatorCover, value: string) => {
    const newCovers = [...covers];
    newCovers[index] = {
      ...newCovers[index],
      [field]: value
    };
    setCovers(newCovers);
  };

  // Image Upload helper
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Gagal mengunggah file");
    }

    const data = await res.json();
    return data.url;
  };

  const handleBgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBgUploading(true);
    setMessage(null);
    try {
      const url = await uploadImage(file);
      setBgImage(url);
      setMessage({ type: "success", text: "Background image berhasil diunggah!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Gagal mengunggah background image." });
    } finally {
      setBgUploading(false);
    }
  };

  const handleSlideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSlideUploadingIdx(index);
    setMessage(null);
    try {
      const url = await uploadImage(file);
      handleUpdateSlideField(index, "image_url", url);
      setMessage({ type: "success", text: `Gambar Slide ${index + 1} berhasil diunggah!` });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Gagal mengunggah gambar slide." });
    } finally {
      setSlideUploadingIdx(null);
    }
  };

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    // Validate covers
    if (covers.length === 0) {
      setMessage({ type: "error", text: "Minimal harus ada satu slide di emulator." });
      setSaving(false);
      return;
    }

    for (let i = 0; i < covers.length; i++) {
      if (!covers[i].image_url) {
        setMessage({ type: "error", text: `Gambar Slide ${i + 1} tidak boleh kosong.` });
        setSaving(false);
        return;
      }
    }

    try {
      const result = await updateHomepageSettings({
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        hero_cta_text: heroCtaText,
        hero_cta_url: heroCtaUrl,
        hero_demo_text: heroDemoText,
        hero_demo_url: heroDemoUrl,
        bg_color: bgColor,
        text_color: textColor,
        accent_color: accentColor,
        bg_image: bgImage,
        bg_gradient: bgGradient,
        bg_pattern_opacity: bgPatternOpacity,
        bg_pattern_blur: bgPatternBlur,
        bg_overlay_opacity: bgOverlayOpacity,
        stats_bg_color: statsBgColor,
        hero_title_font: heroTitleFont,
        hero_title_color: heroTitleColor,
        hero_title_size: heroTitleSize,
        hero_title_align: heroTitleAlign,
        hero_subtitle_font: heroSubtitleFont,
        hero_subtitle_color: heroSubtitleColor,
        hero_subtitle_size: heroSubtitleSize,
        hero_subtitle_align: heroSubtitleAlign,
        emulator_covers: JSON.stringify(covers)
      });

      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Pengaturan beranda berhasil disimpan!" });
        router.refresh();
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Terjadi kesalahan saat menyimpan data." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 text-[#064e3b]">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#064e3b]/10 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <Layout className="w-8 h-8 text-[#d4af37]" />
            Kustom Halaman Beranda (Landing Page)
          </h1>
          <p className="text-sm text-[#064e3b]/70 mt-1">
            Sesuaikan konten hero, latar belakang, dan isi dari smartphone emulator mockup secara real-time.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-black bg-[#064e3b] hover:bg-[#064e3b]/95 text-white border border-[#d4af37] shadow-lg disabled:opacity-50 transition-all uppercase tracking-wider cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin text-[#d4af37]" /> : <Save className="w-4 h-4 text-[#d4af37]" />}
          Simpan Perubahan
        </button>
      </div>

      {/* Alert message */}
      {message && (
        <div className={`p-4 rounded-xl border text-sm font-bold flex items-center gap-3 ${
          message.type === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          <div className={`w-2 h-2 rounded-full ${message.type === "success" ? "bg-emerald-500" : "bg-red-500"}`} />
          {message.text}
        </div>
      )}

      {/* Tabs list */}
      <div className="flex border-b border-[#064e3b]/10 gap-1 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab("hero")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-black tracking-wider uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "hero"
              ? "border-[#d4af37] text-[#064e3b] bg-white/40"
              : "border-transparent text-[#064e3b]/60 hover:text-[#064e3b]"
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#d4af37]" />
          1. Hero & Tombol
        </button>
        <button
          onClick={() => setActiveTab("background")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-black tracking-wider uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "background"
              ? "border-[#d4af37] text-[#064e3b] bg-white/40"
              : "border-transparent text-[#064e3b]/60 hover:text-[#064e3b]"
          }`}
        >
          <Paintbrush className="w-4 h-4 text-[#d4af37]" />
          2. Warna & Latar Belakang
        </button>
        <button
          onClick={() => setActiveTab("emulator")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-black tracking-wider uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "emulator"
              ? "border-[#d4af37] text-[#064e3b] bg-white/40"
              : "border-transparent text-[#064e3b]/60 hover:text-[#064e3b]"
          }`}
        >
          <Smartphone className="w-4 h-4 text-[#d4af37]" />
          3. Emulator Slider ({covers.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Forms Area (Left 7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-[#064e3b]/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          
          {/* TAB 1: HERO SETTINGS */}
          {activeTab === "hero" && (
            <div className="space-y-5">
              <h3 className="text-base font-black border-b border-[#064e3b]/10 pb-2">Kustom Konten Hero Utama</h3>
              
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[#064e3b]/60">Judul Utama (Heading)</label>
                <textarea
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-[#064e3b]/10 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none text-sm font-semibold bg-[#f5f5dc]/10 text-[#064e3b]"
                  placeholder="Ketik judul utama di sini..."
                />
                <p className="text-[10px] text-[#064e3b]/40">Gunakan tag `<span className="text-[#d4af37] font-bold">{"<span className=\"text-[#d4af37]\">...</span>"}</span>` jika Anda ingin memberikan warna emas pada teks tertentu.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-[#064e3b]/60">Sub-Judul (Subtitle)</label>
                <textarea
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[#064e3b]/10 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none text-sm font-medium bg-[#f5f5dc]/10 text-[#064e3b]"
                  placeholder="Ketik deskripsi sub-judul di sini..."
                />
              </div>

              {/* Typography Settings Sub-sections */}
              <div className="border-t border-[#064e3b]/10 pt-5 space-y-5">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#064e3b]/80 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-[#d4af37]" />
                  Tipografi Judul Utama (Heading)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title Font */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-[#064e3b]/60">Gaya Font Heading</label>
                    <select
                      value={heroTitleFont}
                      onChange={(e) => setHeroTitleFont(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#064e3b]/10 text-xs font-semibold outline-none focus:border-[#d4af37] bg-white text-[#064e3b]"
                    >
                      <optgroup label="Serif (Elegan & Klasik)">
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Cinzel">Cinzel</option>
                        <option value="Cormorant Garamond">Cormorant Garamond</option>
                        <option value="Lora">Lora</option>
                      </optgroup>
                      <optgroup label="Sans-Serif (Modern & Bersih)">
                        <option value="Inter">Inter</option>
                        <option value="Outfit">Outfit</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                      </optgroup>
                      <optgroup label="Script / Aksent (Romantis)">
                        <option value="Great Vibes">Great Vibes</option>
                        <option value="Pinyon Script">Pinyon Script</option>
                        <option value="Playball">Playball</option>
                      </optgroup>
                    </select>
                  </div>

                  {/* Title Alignment */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-[#064e3b]/60">Posisi Teks Heading</label>
                    <div className="grid grid-cols-3 gap-1 bg-[#064e3b]/5 p-0.5 rounded-lg">
                      {(["left", "center", "right"] as const).map((align) => (
                        <button
                          key={align}
                          type="button"
                          onClick={() => setHeroTitleAlign(align)}
                          className={`py-1 text-[10px] font-black uppercase rounded transition-all cursor-pointer ${
                            heroTitleAlign === align
                              ? "bg-white text-[#064e3b] shadow-sm"
                              : "text-[#064e3b]/60 hover:text-[#064e3b]"
                          }`}
                        >
                          {align === "left" ? "Kiri" : align === "center" ? "Tengah" : "Kanan"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title Color */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-[#064e3b]/60">Warna Font Heading</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={heroTitleColor}
                        onChange={(e) => setHeroTitleColor(e.target.value)}
                        className="w-10 h-8 rounded border border-[#064e3b]/10 cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={heroTitleColor}
                        onChange={(e) => setHeroTitleColor(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-[#064e3b]/10 text-xs font-semibold outline-none focus:border-[#d4af37] font-mono text-[#064e3b]"
                      />
                    </div>
                  </div>

                  {/* Title Font Size */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase text-[#064e3b]/60">Ukuran Font Heading</label>
                      <span className="text-[10px] font-black bg-[#d4af37]/10 text-[#064e3b] px-1.5 py-0.5 rounded">{heroTitleSize}px</span>
                    </div>
                    <input
                      type="range"
                      min={24}
                      max={80}
                      step={2}
                      value={heroTitleSize}
                      onChange={(e) => setHeroTitleSize(Number(e.target.value))}
                      className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#d4af37] bg-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-[#064e3b]/10 pt-5 space-y-5">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#064e3b]/80 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-[#d4af37]" />
                  Tipografi Sub-Judul (Subtitle)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Subtitle Font */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-[#064e3b]/60">Gaya Font Subtitle</label>
                    <select
                      value={heroSubtitleFont}
                      onChange={(e) => setHeroSubtitleFont(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#064e3b]/10 text-xs font-semibold outline-none focus:border-[#d4af37] bg-white text-[#064e3b]"
                    >
                      <optgroup label="Sans-Serif (Modern & Bersih)">
                        <option value="Inter">Inter</option>
                        <option value="Outfit">Outfit</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                      </optgroup>
                      <optgroup label="Serif (Elegan & Klasik)">
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Cinzel">Cinzel</option>
                        <option value="Cormorant Garamond">Cormorant Garamond</option>
                        <option value="Lora">Lora</option>
                      </optgroup>
                    </select>
                  </div>

                  {/* Subtitle Alignment */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-[#064e3b]/60">Posisi Teks Subtitle</label>
                    <div className="grid grid-cols-3 gap-1 bg-[#064e3b]/5 p-0.5 rounded-lg">
                      {(["left", "center", "right"] as const).map((align) => (
                        <button
                          key={align}
                          type="button"
                          onClick={() => setHeroSubtitleAlign(align)}
                          className={`py-1 text-[10px] font-black uppercase rounded transition-all cursor-pointer ${
                            heroSubtitleAlign === align
                              ? "bg-white text-[#064e3b] shadow-sm"
                              : "text-[#064e3b]/60 hover:text-[#064e3b]"
                          }`}
                        >
                          {align === "left" ? "Kiri" : align === "center" ? "Tengah" : "Kanan"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#064e3b]">
                  {/* Subtitle Color */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-[#064e3b]/60">Warna Font Subtitle</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={heroSubtitleColor}
                        onChange={(e) => setHeroSubtitleColor(e.target.value)}
                        className="w-10 h-8 rounded border border-[#064e3b]/10 cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={heroSubtitleColor}
                        onChange={(e) => setHeroSubtitleColor(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-[#064e3b]/10 text-xs font-semibold outline-none focus:border-[#d4af37] font-mono text-[#064e3b]"
                      />
                    </div>
                  </div>

                  {/* Subtitle Font Size */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase text-[#064e3b]/60">Ukuran Font Subtitle</label>
                      <span className="text-[10px] font-black bg-[#d4af37]/10 text-[#064e3b] px-1.5 py-0.5 rounded">{heroSubtitleSize}px</span>
                    </div>
                    <input
                      type="range"
                      min={12}
                      max={28}
                      step={1}
                      value={heroSubtitleSize}
                      onChange={(e) => setHeroSubtitleSize(Number(e.target.value))}
                      className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#d4af37] bg-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#064e3b]/5 pt-5">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-[#064e3b]/60">Label Tombol CTA (Utama)</label>
                  <input
                    type="text"
                    value={heroCtaText}
                    onChange={(e) => setHeroCtaText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#064e3b]/10 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none text-sm font-bold bg-[#f5f5dc]/10 text-[#064e3b]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-[#064e3b]/60">Link Tombol CTA (Utama)</label>
                  <input
                    type="text"
                    value={heroCtaUrl}
                    onChange={(e) => setHeroCtaUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#064e3b]/10 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none text-sm font-semibold bg-[#f5f5dc]/10 text-[#064e3b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-[#064e3b]/60">Label Tombol Demo (Kedua)</label>
                  <input
                    type="text"
                    value={heroDemoText}
                    onChange={(e) => setHeroDemoText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#064e3b]/10 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none text-sm font-bold bg-[#f5f5dc]/10 text-[#064e3b]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-[#064e3b]/60">Link Tombol Demo (Kedua)</label>
                  <input
                    type="text"
                    value={heroDemoUrl}
                    onChange={(e) => setHeroDemoUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#064e3b]/10 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none text-sm font-semibold bg-[#f5f5dc]/10 text-[#064e3b]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BACKGROUND SETTINGS */}
          {activeTab === "background" && (
            <div className="space-y-5">
              <h3 className="text-base font-black border-b border-[#064e3b]/10 pb-2">Kustom Warna & Latar Belakang</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Page Background */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-[#064e3b]/60 block tracking-wider">
                    Background Hero
                  </label>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl border border-[#064e3b]/15 shadow-sm relative overflow-hidden transition-all hover:scale-105 hover:shadow-md cursor-pointer shrink-0"
                      style={{ backgroundColor: bgColor }}
                    >
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150"
                      />
                    </div>
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#064e3b]/15 text-xs font-bold font-mono outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] bg-white text-[#064e3b]"
                    />
                  </div>
                </div>

                {/* 2. Accent Color */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-[#064e3b]/60 block tracking-wider">
                    Warna Accent / Emas
                  </label>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl border border-[#064e3b]/15 shadow-sm relative overflow-hidden transition-all hover:scale-105 hover:shadow-md cursor-pointer shrink-0"
                      style={{ backgroundColor: accentColor }}
                    >
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150"
                      />
                    </div>
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#064e3b]/15 text-xs font-bold font-mono outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] bg-white text-[#064e3b]"
                    />
                  </div>
                </div>

                {/* 3. Stats Section Background */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-[#064e3b]/60 block tracking-wider">
                    Background Statistik
                  </label>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl border border-[#064e3b]/15 shadow-sm relative overflow-hidden transition-all hover:scale-105 hover:shadow-md cursor-pointer shrink-0"
                      style={{ backgroundColor: statsBgColor }}
                    >
                      <input
                        type="color"
                        value={statsBgColor}
                        onChange={(e) => setStatsBgColor(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150"
                      />
                    </div>
                    <input
                      type="text"
                      value={statsBgColor}
                      onChange={(e) => setStatsBgColor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#064e3b]/15 text-xs font-bold font-mono outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] bg-white text-[#064e3b]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-[#064e3b]/5 pt-4">
                <label className="text-xs font-black uppercase text-[#064e3b]/60 block">Gambar Pola / Background Latar Belakang (Opsional)</label>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                  <input
                    type="text"
                    value={bgImage}
                    onChange={(e) => setBgImage(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#064e3b]/10 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none text-sm font-semibold bg-[#f5f5dc]/10 text-[#064e3b]"
                    placeholder="Contoh: https://example.com/pattern.png atau unggah di sebelah kanan"
                  />
                  <div className="relative flex items-center justify-center">
                    <input
                      type="file"
                      id="bg-upload-input"
                      accept="image/*"
                      onChange={handleBgImageUpload}
                      className="hidden"
                      disabled={bgUploading}
                    />
                    <label
                      htmlFor="bg-upload-input"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-white hover:bg-[#064e3b]/5 border border-[#064e3b]/20 text-[#064e3b] cursor-pointer transition-all shadow-sm whitespace-nowrap"
                    >
                      {bgUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#d4af37]" />
                      ) : (
                        <Upload className="w-4 h-4 text-[#d4af37]" />
                      )}
                      Unggah Pola
                    </label>
                  </div>
                </div>
                {bgImage && (
                  <div className="flex items-center gap-3 mt-2 p-2 bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-xl max-w-sm">
                    <img src={bgImage} alt="Background Pattern Preview" className="w-12 h-12 object-cover rounded-lg border bg-[#f5f5dc]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-[#064e3b]/60 font-bold truncate">{bgImage}</p>
                      <button onClick={() => setBgImage("")} className="text-[9px] font-black text-red-600 uppercase hover:underline">Hapus Pola</button>
                    </div>
                  </div>
                )}
              </div>

              {bgImage && (
                <div className="space-y-4 border-t border-[#064e3b]/5 pt-4">
                  <h4 className="text-xs font-black uppercase text-[#064e3b]/80">Efek Layer & Pola (Custom)</h4>
                  
                  {/* Pattern Opacity Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-[#064e3b]/60">TRANSPARANSI POLA GAMBAR</span>
                      <span className="text-[#064e3b] font-mono">{Math.round(bgPatternOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={bgPatternOpacity}
                      onChange={(e) => setBgPatternOpacity(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-[#064e3b]/10 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
                    />
                  </div>

                  {/* Pattern Blur Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-[#064e3b]/60">EFEK BLUR LATAR BELAKANG</span>
                      <span className="text-[#064e3b] font-mono">{bgPatternBlur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="1"
                      value={bgPatternBlur}
                      onChange={(e) => setBgPatternBlur(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-[#064e3b]/10 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
                    />
                  </div>

                  {/* Overlay Gradient Opacity Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-[#064e3b]/60">TRANSPARANSI GRADASI BLEND LAYER</span>
                      <span className="text-[#064e3b] font-mono">{Math.round(bgOverlayOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={bgOverlayOpacity}
                      onChange={(e) => setBgOverlayOpacity(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-[#064e3b]/10 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
                    />
                    <p className="text-[10px] text-[#064e3b]/40">Mengatur seberapa pekat warna latar dasar menyelimuti pola di bagian atas, bergradasi mulus ke 100% warna dasar di bagian bawah.</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 border-t border-[#064e3b]/5 pt-4 select-none">
                <input
                  type="checkbox"
                  id="bg-gradient-checkbox"
                  checked={bgGradient}
                  onChange={(e) => setBgGradient(e.target.checked)}
                  className="w-4.5 h-4.5 accent-[#064e3b] cursor-pointer"
                />
                <label htmlFor="bg-gradient-checkbox" className="text-xs font-black uppercase text-[#064e3b]/80 cursor-pointer">
                  Aktifkan Efek Glow Gradasi di Latar Belakang (Golden/Green blur spheres)
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: EMULATOR SLIDER SETTINGS */}
          {activeTab === "emulator" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#064e3b]/10 pb-2">
                <h3 className="text-base font-black">Kelola Slide Emulator</h3>
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black bg-[#064e3b]/5 hover:bg-[#064e3b]/10 border border-[#064e3b]/20 text-[#064e3b] transition-all uppercase tracking-wider cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
                  Tambah Slide
                </button>
              </div>

              <div className="space-y-4">
                {covers.map((slide, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-2xl p-4 sm:p-5 transition-all space-y-4 ${
                      activeSlidePreviewIdx === idx
                        ? "bg-[#064e3b]/5 border-[#d4af37]"
                        : "bg-white border-[#064e3b]/10 hover:border-[#064e3b]/20"
                    }`}
                  >
                    {/* Slide Header */}
                    <div className="flex items-center justify-between gap-3">
                      <span
                        onClick={() => setActiveSlidePreviewIdx(idx)}
                        className="text-xs font-black uppercase text-[#064e3b] hover:text-[#d4af37] transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <Smartphone className="w-4 h-4 text-[#d4af37]" />
                        Slide {idx + 1}
                        {activeSlidePreviewIdx === idx && (
                          <span className="px-1.5 py-0.5 rounded bg-[#d4af37]/25 text-[#064e3b] text-[8px] font-black tracking-widest uppercase ml-1">Aktif di Preview</span>
                        )}
                      </span>

                      {/* Reordering and Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveSlide(idx, "up")}
                          className="p-1 hover:bg-[#064e3b]/10 text-[#064e3b]/60 disabled:opacity-30 rounded transition-colors"
                          title="Pindahkan ke atas"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === covers.length - 1}
                          onClick={() => handleMoveSlide(idx, "down")}
                          className="p-1 hover:bg-[#064e3b]/10 text-[#064e3b]/60 disabled:opacity-30 rounded transition-colors"
                          title="Pindahkan ke bawah"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSlide(idx)}
                          className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors ml-1"
                          title="Hapus Slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Slide Form Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      {/* Image Preview & Upload (Left 4 columns) */}
                      <div className="sm:col-span-4 flex flex-col items-center justify-center border border-[#064e3b]/10 rounded-xl p-3 bg-[#f5f5dc]/10 relative group">
                        {slide.image_url ? (
                          <img
                            src={slide.image_url}
                            alt={`Preview Cover ${idx + 1}`}
                            className="w-full aspect-[9/16] object-cover rounded-lg shadow-sm"
                          />
                        ) : (
                          <div className="w-full aspect-[9/16] bg-slate-100 flex flex-col items-center justify-center rounded-lg text-slate-400">
                            <ImageIcon className="w-8 h-8 mb-2" />
                            <span className="text-[10px] font-bold">Belum Ada Gambar</span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center flex-col p-2">
                          <input
                            type="file"
                            id={`slide-upload-${idx}`}
                            accept="image/*"
                            onChange={(e) => handleSlideImageUpload(e, idx)}
                            className="hidden"
                            disabled={slideUploadingIdx !== null}
                          />
                          <label
                            htmlFor={`slide-upload-${idx}`}
                            className="flex items-center gap-1.5 px-3 py-2 rounded bg-white hover:bg-slate-100 text-[#064e3b] text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-md"
                          >
                            {slideUploadingIdx === idx ? (
                              <Loader2 className="w-3 h-3 animate-spin text-[#d4af37]" />
                            ) : (
                              <Upload className="w-3 h-3 text-[#d4af37]" />
                            )}
                            Ganti Cover
                          </label>
                        </div>
                      </div>

                      {/* Text inputs (Right 8 columns) */}
                      <div className="sm:col-span-8 space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-[#064e3b]/60">Label Lencana (Badge)</label>
                          <input
                            type="text"
                            value={slide.badge || ""}
                            onChange={(e) => handleUpdateSlideField(idx, "badge", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-[#064e3b]/10 text-xs font-semibold outline-none focus:border-[#d4af37]"
                            placeholder="Contoh: GALERI DESAIN PREMIUM"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-[#064e3b]/60">Judul Utama (Title)</label>
                          <input
                            type="text"
                            value={slide.title || ""}
                            onChange={(e) => handleUpdateSlideField(idx, "title", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-[#064e3b]/10 text-xs font-bold outline-none focus:border-[#d4af37]"
                            placeholder="Contoh: Pilih Desain Eksklusif Anda"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-[#064e3b]/60">Sub-Judul (Subtitle / Deskripsi)</label>
                          <textarea
                            value={slide.subtitle || ""}
                            onChange={(e) => handleUpdateSlideField(idx, "subtitle", e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg border border-[#064e3b]/10 text-xs font-medium outline-none focus:border-[#d4af37]"
                            placeholder="Ketik deskripsi singkat untuk mockup di sini..."
                          />
                        </div>

                        <div className="space-y-1 pt-1">
                          <label className="text-[10px] font-black uppercase text-[#064e3b]/60">Atau Gunakan Direct URL Gambar</label>
                          <input
                            type="text"
                            value={slide.image_url}
                            onChange={(e) => handleUpdateSlideField(idx, "image_url", e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-[#064e3b]/10 text-[10px] font-mono outline-none focus:border-[#d4af37]"
                            placeholder="https://example.com/cover.jpg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Preview Pane (Right 5 Cols) */}
        <div className="lg:col-span-5 sticky top-28 space-y-6">
          <div className="bg-white border border-[#064e3b]/10 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#064e3b]/80 border-b border-[#064e3b]/10 pb-2">
              Pratinjau Live Latar Belakang & Emulator
            </h3>

            {/* LIVE DYNAMIC BACKGROUND CANVAS PREVIEW */}
            <div 
              className="w-full rounded-2xl border p-5 relative overflow-hidden transition-all shadow-inner min-h-[480px] flex flex-col justify-between"
              style={{
                backgroundColor: bgColor,
                color: textColor,
                borderColor: `${textColor}1a`
              }}
            >
              {/* 1. Dynamic Background Pattern Layer */}
              {bgImage && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: bgPatternOpacity,
                    filter: bgPatternBlur ? `blur(${bgPatternBlur}px)` : "none",
                    transform: bgPatternBlur ? "scale(1.08)" : "none",
                    zIndex: 0
                  }}
                />
              )}

              {/* 2. Dynamic Gradient Blend Layer */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(to bottom, 
                    ${hexToRgba(bgColor || "#f5f5dc", bgOverlayOpacity)} 0%, 
                    ${bgColor || "#f5f5dc"} 100%)`,
                  zIndex: 1
                }}
              />

              {/* 3. Dynamic Glow Spheres */}
              {bgGradient && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
                  <div 
                    className="absolute -top-10 -left-10 w-44 h-44 blur-2xl rounded-full opacity-30" 
                    style={{ backgroundColor: accentColor }}
                  />
                  <div 
                    className="absolute top-1/4 -right-10 w-48 h-48 blur-2xl rounded-full opacity-20" 
                    style={{ backgroundColor: accentColor }}
                  />
                </div>
              )}

              {/* Contents Area (Above background layers) */}
              <div className="relative space-y-4 text-center flex flex-col items-center justify-between h-full" style={{ zIndex: 10 }}>
                {/* Simulated Heading & Texts */}
                <div className={`space-y-1.5 max-w-[280px] w-full flex flex-col ${
                  heroTitleAlign === "center" 
                    ? "items-center text-center" 
                    : heroTitleAlign === "right" 
                    ? "items-end text-right" 
                    : "items-start text-left"
                }`}>
                  <h4 
                    className="font-bold tracking-tight leading-tight"
                    style={{ 
                      color: heroTitleColor,
                      fontFamily: heroTitleFont,
                      fontSize: `${Math.max(12, Math.round(heroTitleSize / 3))}px`,
                      textAlign: heroTitleAlign as any,
                      textShadow: "0 1px 2px rgba(0,0,0,0.06)"
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: heroTitle.replace(/text-accent/g, "font-black").replace(/class="text-\[#d4af37\]"/g, `style="color: ${accentColor}"`) 
                    }}
                  />
                  <p 
                    className="opacity-75 font-medium line-clamp-2 leading-relaxed"
                    style={{ 
                      color: heroSubtitleColor,
                      fontFamily: heroSubtitleFont,
                      fontSize: `${Math.max(8, Math.round(heroSubtitleSize / 1.8))}px`,
                      textAlign: heroSubtitleAlign as any,
                      textShadow: "0 0.5px 1px rgba(0,0,0,0.04)"
                    }}
                  >
                    {heroSubtitle}
                  </p>
                  
                  {/* Mock CTA buttons in preview */}
                  <div className="flex gap-2 justify-center pt-1">
                    <span 
                      className="px-3 py-1 rounded-md text-[8px] font-black tracking-wider uppercase border"
                      style={{ 
                        backgroundColor: "#064e3b", 
                        color: bgColor, 
                        borderColor: accentColor + "80" 
                      }}
                    >
                      {heroCtaText}
                    </span>
                    <span 
                      className="px-3 py-1 rounded-md text-[8px] font-black tracking-wider uppercase border"
                      style={{ 
                        backgroundColor: "transparent", 
                        color: "#064e3b", 
                        borderColor: "#064e3b33" 
                      }}
                    >
                      {heroDemoText}
                    </span>
                  </div>
                </div>

                {/* Smartphone Emulator Shell with subtle float animation */}
                <motion.div 
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative w-[185px] aspect-[9/18.5] bg-[#0c1322] rounded-[32px] p-1.5 shadow-2xl border-[3px] border-[#222f46] flex flex-col justify-between mt-3"
                >
                  
                  {/* Notch */}
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-[#0c1322] rounded-full z-30 flex items-center justify-between px-2">
                    <div className="w-1 h-1 rounded-full bg-slate-900" />
                    <div className="w-4 h-0.5 bg-slate-800 rounded-full" />
                  </div>

                  {/* Inner Screen Container */}
                  <div className="w-full h-full rounded-[24px] overflow-hidden border border-black/10 relative flex flex-col bg-[#f5f5dc]"
                    style={{ backgroundColor: bgColor }}
                  >

                    {/* Active Slide Preview */}
                    {covers[activeSlidePreviewIdx] ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-3 text-center relative overflow-hidden select-none"
                        style={{
                          background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.65)), url(${covers[activeSlidePreviewIdx].image_url}) center/cover no-repeat`
                        }}
                      >
                        {/* Decorative border */}
                        <div className="absolute top-1.5 left-1.5 w-8 h-8 border-t border-l pointer-events-none" style={{ borderColor: accentColor + "33" }} />
                        <div className="absolute bottom-1.5 right-1.5 w-8 h-8 border-b border-r pointer-events-none" style={{ borderColor: accentColor + "33" }} />
                        
                        <div className="space-y-1.5 max-w-[130px] my-auto relative z-10 text-white">
                          {covers[activeSlidePreviewIdx].badge && (
                            <div className="inline-block px-1.5 py-0.25 rounded text-[5px] font-bold tracking-widest uppercase"
                              style={{ backgroundColor: accentColor + "1a", border: `1px solid ${accentColor}26`, color: accentColor }}
                            >
                              {covers[activeSlidePreviewIdx].badge}
                            </div>
                          )}

                          {covers[activeSlidePreviewIdx].title && (
                            <h2 className="text-[10px] font-bold font-serif leading-tight">
                              {covers[activeSlidePreviewIdx].title}
                            </h2>
                          )}

                          {covers[activeSlidePreviewIdx].subtitle && (
                            <p className="text-[7px] opacity-80 leading-relaxed font-medium">
                              {covers[activeSlidePreviewIdx].subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-[9px] font-bold text-[#064e3b]/40">
                        Belum ada slide
                      </div>
                    )}

                    {/* Navigation dots on preview */}
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-20">
                      {covers.map((_, i) => (
                        <span
                          key={i}
                          onClick={() => setActiveSlidePreviewIdx(i)}
                          className={`w-1 h-1 rounded-full cursor-pointer transition-all ${
                            activeSlidePreviewIdx === i 
                              ? "w-2.5 bg-white" 
                              : "bg-white/40 hover:bg-white/60"
                          }`}
                        />
                      ))}
                    </div>

                  </div>
                </motion.div>
              </div>
            </div>

            {/* Colors and texts summary */}
            <div className="border-t border-[#064e3b]/10 pt-4 space-y-2">
              <span className="text-[10px] font-black uppercase text-[#064e3b]/50">Palet Warna Terpilih</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: bgColor }} title="Bg Color" />
                <div className="w-6 h-6 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: accentColor }} title="Accent Color" />
                <span className="text-[10px] font-semibold text-[#064e3b]/60">
                  Bg: {bgColor} • Emas: {accentColor}
                </span>
              </div>
            </div>

          </div>

          {/* Quick Guidance Box */}
          <div className="bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-3xl p-5 text-xs text-[#064e3b]/80 space-y-3">
            <h4 className="font-black uppercase tracking-wider flex items-center gap-1.5 text-xs">
              <HelpCircle className="w-4 h-4 text-[#d4af37]" />
              Panduan Cepat
            </h4>
            <ul className="list-disc pl-4 space-y-1.5 font-medium leading-relaxed">
              <li>Pilih tab <strong>Hero & Tombol</strong> untuk mengubah teks utama dan links.</li>
              <li>Pilih tab <strong>Warna & Latar Belakang</strong> untuk mengganti background, warna font, dan warna tombol emas secara keseluruhan.</li>
              <li>Pilih tab <strong>Emulator Slider</strong> untuk menambah/menyusun ulang cover bergambar di layar HP mockup.</li>
              <li>Gunakan <strong>Simpan Perubahan</strong> setelah Anda selesai memodifikasi.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
