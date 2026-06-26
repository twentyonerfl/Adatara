"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Edit3, Trash2, Globe, Eye, Plus, Palette, Loader2, ChevronDown } from "lucide-react";
import { deleteTemplate, publishTemplate } from "./builder-actions";
import { ScaledCoverPreview } from "./BuilderTabsCoverPembuka";
import { motion, AnimatePresence } from "framer-motion";
import { KATEGORI_OPTIONS } from "./builder-constants";

const getSafeThumbnail = (url?: string) => {
  if (!url || (!url.startsWith("http") && !url.startsWith("/") && !url.startsWith("data:image"))) {
    return "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop";
  }
  return url;
};

type Template = {
  id: string;
  nama_template: string;
  kategori: string;
  paket?: string;
  thumbnail: string;
  deskripsi: string | null;
  status: "DRAFT" | "PUBLISHED";
  created_at: Date;
  template_json: any;
};

export default function AdminTemplateList({ templates: initial }: { templates: Template[] }) {
  const [templates, setTemplates] = useState<Template[]>(initial);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedPaket, setSelectedPaket] = useState("Semua");
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [paketDropdownOpen, setPaketDropdownOpen] = useState(false);

  const categories = ["Semua", ...KATEGORI_OPTIONS];

  const filteredTemplates = templates.filter((t) => {
    const matchesCategory = selectedCategory === "Semua" || t.kategori === selectedCategory;
    const matchesPaket = selectedPaket === "Semua" || t.paket === selectedPaket;
    return matchesCategory && matchesPaket;
  });

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Hapus template "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    setLoadingId(id);
    startTransition(async () => {
      const res = await deleteTemplate(id);
      if (res.error) setError(res.error);
      else setTemplates(prev => prev.filter(t => t.id !== id));
      setLoadingId(null);
    });
  };

  const handlePublish = (id: string) => {
    setLoadingId(id);
    startTransition(async () => {
      const res = await publishTemplate(id);
      if (res.error) setError(res.error);
      else setTemplates(prev => prev.map(t => t.id === id ? { ...t, status: "PUBLISHED" } : t));
      setLoadingId(null);
    });
  };

  return (
    <div className="space-y-6 text-[#064e3b]">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Dropdown */}
        <div className="relative min-w-[200px]">
          <button
            onClick={() => {
              setCategoryDropdownOpen(!categoryDropdownOpen);
              setPaketDropdownOpen(false);
            }}
            className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-[#064e3b]/15 text-xs font-bold bg-[#064e3b]/5 hover:border-[#064e3b] text-[#064e3b] transition-all cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Kategori: {selectedCategory}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${categoryDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {categoryDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setCategoryDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-56 max-h-60 overflow-y-auto bg-white border border-[#064e3b]/10 rounded-xl shadow-xl z-50 p-1.5 scrollbar-thin"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCategoryDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedCategory === cat
                          ? "bg-[#064e3b] text-white"
                          : "hover:bg-[#064e3b]/5 text-[#064e3b]"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Paket Dropdown */}
        <div className="relative min-w-[180px]">
          <button
            onClick={() => {
              setPaketDropdownOpen(!paketDropdownOpen);
              setCategoryDropdownOpen(false);
            }}
            className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-[#064e3b]/15 text-xs font-bold bg-[#064e3b]/5 hover:border-[#064e3b] text-[#064e3b] transition-all cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-[#d4af37] font-black">✦</span>
              <span>Paket: {selectedPaket === "Semua" ? "Semua Paket" : selectedPaket}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${paketDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {paketDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setPaketDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-48 bg-white border border-[#064e3b]/10 rounded-xl shadow-xl z-50 p-1.5"
                >
                  {["Semua Paket", "BASIC", "PREMIUM", "SULTAN", "EXCLUSIVE"].map((tier) => (
                    <button
                      key={tier}
                      onClick={() => {
                        setSelectedPaket(tier === "Semua Paket" ? "Semua" : tier);
                        setPaketDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${(tier === "Semua Paket" && selectedPaket === "Semua") || selectedPaket === tier
                          ? "bg-[#064e3b] text-white"
                          : "hover:bg-[#064e3b]/5 text-[#064e3b]"
                        }`}
                    >
                      {tier === "Semua Paket" ? "Semua Paket" : tier}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white border border-[#064e3b]/10 rounded-3xl p-16 text-center flex flex-col items-center">
          <Palette className="w-12 h-12 text-[#d4af37] mb-4" />
          <h3 className="text-lg font-black">Belum Ada Template</h3>
          <p className="text-xs text-[#064e3b]/60 mt-2 max-w-xs">
            Mulai membuat template pertama Anda menggunakan Template Builder.
          </p>
          <Link href="/dashboard/templates/new"
            className="mt-6 px-5 py-2.5 bg-[#064e3b] text-white border border-[#d4af37] text-xs font-black rounded-xl inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Buat Template Baru
          </Link>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-16 bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-3xl">
          <Palette className="w-10 h-10 text-[#064e3b]/40 mx-auto mb-4" />
          <h4 className="text-[#064e3b] font-bold">Tidak Ada Template</h4>
          <p className="text-[#064e3b]/50 text-xs mt-1">Belum ada template yang terdaftar dalam filter ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredTemplates.map(t => {
            const parsedJson = typeof t.template_json === "string" ? JSON.parse(t.template_json) : t.template_json;
            const coverData = parsedJson?.cover || {};
            const meta = { kategori: t.kategori, bahasa: coverData.bahasa || "id" };
            const hasCoverData = coverData && Object.keys(coverData).length > 0;

            return (
              <div key={t.id}
                className="group bg-white border border-[#064e3b]/5 hover:border-[#d4af37]/45 hover:-translate-y-1 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all duration-300">
                {/* Badges Header Bar */}
                <div className="px-2 py-1.5 flex items-center justify-between border-b border-[#064e3b]/5 bg-[#064e3b]/[0.02]">
                  {/* Package Tier Badge */}
                  <span className={`px-1.5 py-0.5 rounded-md text-[5.5px] font-extrabold uppercase tracking-wider border shadow-sm ${t.paket === "EXCLUSIVE"
                      ? "bg-[#800020] text-white border-[#6a001a]"
                      : t.paket === "SULTAN"
                        ? "bg-[#78350f] text-[#fef08a] border-[#b45309]/40"
                        : t.paket === "PREMIUM"
                          ? "bg-emerald-600 text-white border-emerald-700"
                          : "bg-slate-400 text-white border-slate-500"
                    }`}>
                    {t.paket || "BASIC"}
                  </span>

                  <div className="flex items-center gap-1">
                    {/* Category Badge */}
                    <span className="px-1.5 py-0.5 rounded-md text-[5.5px] font-black uppercase tracking-wider bg-white text-[#064e3b] border border-[#064e3b]/10 shadow-sm">
                      {t.kategori || "—"}
                    </span>

                    {/* Status Badge */}
                    <span className={`px-1.5 py-0.5 rounded-md text-[5.5px] font-extrabold border uppercase tracking-wider ${t.status === "PUBLISHED"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-amber-50 border-amber-200 text-amber-800"
                      }`}>{t.status}</span>
                  </div>
                </div>

                {/* Thumbnail / Live Cover Preview */}
                <div className="relative w-full h-44 sm:h-52 md:h-60 lg:h-64 bg-[#064e3b]/5 overflow-hidden flex items-center justify-center p-2.5">
                  {/* Background Image of the catalog card container */}
                  {t.thumbnail && (
                    <img
                      src={getSafeThumbnail(t.thumbnail)}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}

                  {/* Cover Zoom Wrapper in 9:16 aspect ratio */}
                  <div className="h-full aspect-[9/16] relative overflow-hidden bg-white shadow-sm border border-[#064e3b]/10 rounded-lg transition-transform duration-700 ease-out group-hover:scale-[1.04] z-10">
                    {hasCoverData ? (
                      <ScaledCoverPreview coverData={coverData} meta={meta} />
                    ) : t.thumbnail ? (
                      <img src={getSafeThumbnail(t.thumbnail)} alt={t.nama_template} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#064e3b]/20"><Palette className="w-10 h-10" /></div>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-2 flex flex-col justify-between bg-white border-t border-[#064e3b]/5">
                  <div className="w-full text-center">
                    {/* Title */}
                    <h4 className="text-[10px] font-extrabold text-[#064e3b] group-hover:text-[#d4af37] transition-colors duration-300 leading-tight break-words w-full py-0.5">{t.nama_template}</h4>
                  </div>

                  <div className="text-[8px] text-[#064e3b]/40 font-semibold mt-1 w-full text-center">
                    {new Date(t.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 mt-1.5 pt-1.5 border-t border-[#064e3b]/10 w-full">
                    <Link href={`/dashboard/templates/edit/${t.id}`}
                      className="flex-1 py-1 border border-[#064e3b]/15 hover:border-[#064e3b] bg-transparent text-[#064e3b] hover:bg-[#064e3b] hover:text-white rounded-md text-[8px] font-black flex items-center justify-center gap-1 transition-all duration-300">
                      <Edit3 className="w-2.5 h-2.5" />
                      Edit
                    </Link>

                    {t.status === "DRAFT" && (
                      <button onClick={() => handlePublish(t.id)} disabled={loadingId === t.id}
                        className="flex-1 py-1 border border-emerald-600/20 hover:border-emerald-600 bg-transparent text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-md text-[8px] font-black flex items-center justify-center gap-1 transition-all duration-300 disabled:opacity-50">
                        {loadingId === t.id ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Globe className="w-2.5 h-2.5" />}
                        Publish
                      </button>
                    )}

                    <button onClick={() => handleDelete(t.id, t.nama_template)} disabled={loadingId === t.id}
                      className="p-1 rounded bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all disabled:opacity-50">
                      {loadingId === t.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
