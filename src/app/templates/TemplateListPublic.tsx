"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createInvitationPublic } from "./actions";
import {
  Palette,
  ArrowRight,
  X,
  Sparkles,
  Link as LinkIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Mail,
  Search,
  ChevronDown
} from "lucide-react";

import { ScaledCoverPreview } from "../dashboard/templates/BuilderTabsCoverPembuka";

type TemplateType = {
  id: string;
  nama_template: string;
  kategori: string;
  paket?: string;
  thumbnail: string;
  deskripsi: string | null;
  template_json?: any;
};

const getSafeThumbnail = (url?: string) => {
  if (!url || (!url.startsWith("http") && !url.startsWith("/") && !url.startsWith("data:image"))) {
    return "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop";
  }
  return url;
};

export function TemplateListPublic({
  templates,
  categories = ["Semua"]
}: {
  templates: TemplateType[];
  categories?: string[];
}) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedPaket, setSelectedPaket] = useState("Semua");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [paketDropdownOpen, setPaketDropdownOpen] = useState(false);

  // Guest inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nomorHp, setNomorHp] = useState("");
  const [slug, setSlug] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  const filteredTemplates = templates.filter((t) => {
    const matchesCategory = selectedCategory === "Semua" || t.kategori === selectedCategory;
    const matchesPaket = selectedPaket === "Semua" || t.paket === selectedPaket;
    const matchesSearch = t.nama_template.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.deskripsi && t.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesPaket && matchesSearch;
  });

  const handleOpenModal = (template: TemplateType) => {
    setSelectedTemplate(template);
    setName("");
    setEmail("");
    setNomorHp("");
    setSlug("");
    setErrorMessage(null);
    setSuccess(false);
  };

  const handleCloseModal = () => {
    if (loading) return;
    setSelectedTemplate(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate || !name || !email || !nomorHp || !slug) return;

    setLoading(true);
    setErrorMessage(null);

    const formattedSlug = slug.toLowerCase().trim().replace(/\s+/g, "-");

    try {
      const res = await createInvitationPublic({
        templateId: selectedTemplate.id,
        slug: formattedSlug,
        email,
        name,
        nomor_hp: nomorHp,
      });

      if (res?.error) {
        setErrorMessage(res.error);
        setLoading(false);
      } else if (res?.success && res.invitationId) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/builder/${res.invitationId}`);
        }, 1200);
      }
    } catch (err) {
      setErrorMessage("Terjadi kesalahan sistem. Silakan coba kembali.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-[#064e3b]">
      {/* Search and Category Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none opacity-50">
            <Search className="w-5 h-5 text-[#064e3b]" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari desain undangan..."
            className="w-full pl-11 pr-4 py-3 rounded-full border text-sm font-semibold transition-all outline-none bg-white/60 backdrop-blur-md border-[#064e3b]/15 focus:border-[#d4af37] focus:bg-white text-[#064e3b] shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-bold opacity-60 hover:opacity-100 transition-opacity text-[#064e3b]"
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
              className="w-full flex items-center justify-between gap-3 px-6 py-3 rounded-full border text-sm font-bold bg-white/60 backdrop-blur-md border-[#064e3b]/15 hover:border-[#d4af37] text-[#064e3b] cursor-pointer shadow-sm transition-all"
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
                  className="absolute right-0 mt-2 w-full md:w-64 max-h-72 overflow-y-auto bg-white border border-[#064e3b]/10 rounded-2xl shadow-xl z-50 p-2 scrollbar-thin"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCategoryDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedCategory === cat
                          ? "bg-[#064e3b] text-[#f5f5dc] border-[#d4af37]"
                          : "hover:bg-[#064e3b]/5 text-[#064e3b]"
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
              className="w-full flex items-center justify-between gap-3 px-6 py-3 rounded-full border text-sm font-bold bg-white/60 backdrop-blur-md border-[#064e3b]/15 hover:border-[#d4af37] text-[#064e3b] cursor-pointer shadow-sm transition-all"
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
                  className="absolute right-0 mt-2 w-full md:w-48 bg-white border border-[#064e3b]/10 rounded-2xl shadow-xl z-50 p-2"
                >
                  {["Semua", "BASIC", "PREMIUM", "SULTAN", "EXCLUSIVE"].map((tier) => (
                    <button
                      key={tier}
                      onClick={() => {
                        setSelectedPaket(tier);
                        setPaketDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedPaket === tier
                          ? "bg-[#064e3b] text-[#f5f5dc] border-[#d4af37]"
                          : "hover:bg-[#064e3b]/5 text-[#064e3b]"
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

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-16 bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-3xl">
          <Palette className="w-10 h-10 text-[#064e3b]/40 mx-auto mb-4" />
          <h4 className="text-[#064e3b] font-bold">Tidak Ada Template</h4>
          <p className="text-[#064e3b]/50 text-xs mt-1">Belum ada template yang terdaftar dalam kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredTemplates.map((template) => {
            const parsedJson = typeof template.template_json === "string" ? JSON.parse(template.template_json) : template.template_json;
            const coverData = parsedJson?.cover || {};
            const meta = { kategori: template.kategori, bahasa: coverData.bahasa || "id" };
            const hasCoverData = coverData && Object.keys(coverData).length > 0;

            return (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.4 }}
                key={template.id}
                className="group bg-white border border-[#064e3b]/10 hover:border-[#d4af37]/45 hover:-translate-y-1 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
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

                {/* Thumbnail / Live Cover Preview Container */}
                <div className="w-full h-44 sm:h-52 md:h-60 lg:h-64 overflow-hidden relative bg-[#064e3b]/5 flex items-center justify-center p-2.5">
                  {/* Background Image of the catalog card container */}
                  {template.thumbnail && (
                    <img
                      src={getSafeThumbnail(template.thumbnail)}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}

                  {/* Cover Preview Zoom Wrapper in 9:16 aspect ratio */}
                  <div className="h-full aspect-[9/16] relative overflow-hidden bg-white shadow-sm border border-[#064e3b]/10 rounded-lg transition-transform duration-700 ease-out group-hover:scale-[1.04] z-10">
                    {hasCoverData ? (
                      <ScaledCoverPreview coverData={coverData} meta={meta} />
                    ) : template.thumbnail ? (
                      <img
                        src={getSafeThumbnail(template.thumbnail)}
                        alt={template.nama_template}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#064e3b]/20"><Palette className="w-10 h-10" /></div>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-2 flex flex-col justify-between bg-white border-t border-[#064e3b]/5">
                  {/* Title */}
                  <div className="w-full text-center">
                    <h4 className="text-[10px] font-extrabold text-[#064e3b] group-hover:text-[#d4af37] transition-colors duration-300 leading-tight break-words w-full text-center py-0.5">
                      {template.nama_template}
                    </h4>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => handleOpenModal(template)}
                    className="mt-1.5 w-full py-1.5 text-center text-[8.5px] font-black rounded-md border border-[#064e3b]/15 hover:border-[#064e3b] bg-transparent text-[#064e3b] hover:bg-[#064e3b] hover:text-white flex items-center justify-center gap-1.5 transition-all shadow-sm tracking-widest uppercase"
                  >
                    Buat Undangan
                    <ArrowRight className="w-2.5 h-2.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* SLUG & GUEST FORM SELECTION MODAL */}
      <AnimatePresence>
        {selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-[#064e3b]/10 w-full max-w-lg rounded-3xl overflow-hidden relative shadow-2xl z-10 p-6 sm:p-8 text-left max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                disabled={loading}
                className="absolute top-4 right-4 p-2 text-[#064e3b]/40 hover:text-[#064e3b] rounded-lg disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>

              {success ? (
                /* Success animation state */
                <div className="flex flex-col items-center justify-center text-center py-6">
                  <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[#064e3b]">Template Dipilih!</h3>
                  <p className="text-[#064e3b]/70 text-sm mt-2">
                    Menyiapkan ruang editor untuk kustomisasi undangan Anda...
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#064e3b]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Membuka Template Builder
                  </div>
                </div>
              ) : (
                /* Form state */
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#d4af37] uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Konfirmasi Pembuatan
                    </span>
                    <h3 className="text-xl font-extrabold text-[#064e3b] mt-1">
                      Buat Undangan Baru
                    </h3>
                    <p className="text-[#064e3b]/70 text-xs">
                      Lengkapi data berikut untuk mulai mendesain <strong>{selectedTemplate.nama_template}</strong>.
                    </p>
                  </div>

                  {/* Error Alert */}
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-semibold flex items-start gap-2">
                      <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#064e3b]/85 uppercase tracking-wider mb-1.5">
                      Nama Lengkap Anda
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-4 h-4 text-[#064e3b]/40" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nama Lengkap Pembuat"
                        className="w-full pl-12 pr-4 py-2.5 bg-[#f5f5dc]/15 border border-[#064e3b]/20 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl text-sm text-[#064e3b] placeholder-[#064e3b]/30 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="block text-xs font-bold text-[#064e3b]/85 uppercase tracking-wider mb-1.5">
                      Nomor WhatsApp (Aktif)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-4 h-4 text-[#064e3b]/40" />
                      <input
                        type="tel"
                        required
                        value={nomorHp}
                        onChange={(e) => setNomorHp(e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="contoh: 081234567890"
                        className="w-full pl-12 pr-4 py-2.5 bg-[#f5f5dc]/15 border border-[#064e3b]/20 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl text-sm text-[#064e3b] placeholder-[#064e3b]/30 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-[#064e3b]/85 uppercase tracking-wider mb-1.5">
                      Alamat Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-4 h-4 text-[#064e3b]/40" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full pl-12 pr-4 py-2.5 bg-[#f5f5dc]/15 border border-[#064e3b]/20 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl text-sm text-[#064e3b] placeholder-[#064e3b]/30 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Slug Input */}
                  <div>
                    <label className="block text-xs font-bold text-[#064e3b]/85 uppercase tracking-wider mb-1.5">
                      Tentukan Tautan (Link) Undangan
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-3.5 w-4 h-4 text-[#064e3b]/40" />
                      <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        placeholder="contoh: aditya-tara"
                        className="w-full pl-12 pr-4 py-2.5 bg-[#f5f5dc]/15 border border-[#064e3b]/20 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl text-sm text-[#064e3b] placeholder-[#064e3b]/30 outline-none transition-all"
                      />
                    </div>
                    <p className="text-[10px] text-[#064e3b]/50 mt-1">
                      Hanya boleh huruf kecil, angka, dan tanda hubung (-).
                    </p>
                  </div>

                  {/* Link Preview */}
                  <div className="p-3 rounded-xl bg-[#064e3b]/5 border border-[#064e3b]/10 text-xs">
                    <span className="text-[#064e3b]/60 block font-semibold">Tampilan Link Undangan Anda:</span>
                    <span className="text-[#064e3b] font-bold break-all mt-0.5 block">
                      {typeof window !== "undefined" ? window.location.origin : ""}/{slug || "..."}
                    </span>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      disabled={loading}
                      className="flex-1 py-3 rounded-xl border border-[#064e3b]/20 bg-white text-[#064e3b]/70 hover:bg-[#064e3b]/5 font-bold text-xs cursor-pointer transition-all disabled:opacity-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !slug || !name || !email || !nomorHp}
                      className="flex-1 py-3 rounded-xl bg-[#064e3b] hover:bg-[#064e3b]/95 border border-[#d4af37] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-[#064e3b]/10 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        "Buat Undangan"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
