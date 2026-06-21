"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Edit3, Trash2, Globe, Eye, Plus, Palette, Loader2 } from "lucide-react";
import { deleteTemplate, publishTemplate } from "./builder-actions";
import { ScaledCoverPreview } from "./BuilderTabsCoverPembuka";

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

  const categories = ["Semua", ...Array.from(new Set(templates.map((t) => t.kategori)))];

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
      <div className="flex flex-col gap-3">
        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2 bg-[#064e3b]/5 p-1.5 rounded-2xl border border-[#064e3b]/10 w-fit">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedCategory === cat
                  ? "bg-[#064e3b] text-white border border-[#d4af37] shadow-md shadow-[#064e3b]/10"
                  : "text-[#064e3b]/70 hover:text-[#064e3b]"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Paket Filter Buttons */}
        <div className="flex flex-wrap gap-2 bg-[#064e3b]/5 p-1.5 rounded-2xl border border-[#064e3b]/10 w-fit">
          {["Semua Paket", "BASIC", "PREMIUM", "SULTAN"].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedPaket(tier === "Semua Paket" ? "Semua" : tier)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${(tier === "Semua Paket" && selectedPaket === "Semua") || selectedPaket === tier
                  ? "bg-[#064e3b] text-white border border-[#d4af37] shadow-md shadow-[#064e3b]/10"
                  : "text-[#064e3b]/70 hover:text-[#064e3b]"
                }`}
            >
              {tier === "Semua Paket" ? "Semua Paket" : tier}
            </button>
          ))}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredTemplates.map(t => {
            const parsedJson = typeof t.template_json === "string" ? JSON.parse(t.template_json) : t.template_json;
            const coverData = parsedJson?.cover || {};
            const meta = { kategori: t.kategori, bahasa: coverData.bahasa || "id" };
            const hasCoverData = coverData && Object.keys(coverData).length > 0;

            return (
              <div key={t.id}
                className="group bg-white border border-[#064e3b]/5 hover:border-[#d4af37]/45 hover:-translate-y-1 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all duration-300">
                {/* Thumbnail / Live Cover Preview */}
                <div className="relative w-full aspect-square bg-[#064e3b]/5 overflow-hidden flex items-center justify-center p-2.5">
                  {/* Package Tier Badge Overlay */}
                  <div className="absolute top-2 left-2 z-20 pointer-events-none w-max">
                    <span className={`px-1.5 py-0.5 rounded-md text-[5.5px] font-extrabold uppercase tracking-wider border shadow-sm ${t.paket === "SULTAN"
                        ? "bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 text-white border-emerald-500/40 shadow-emerald-500/20"
                        : t.paket === "PREMIUM"
                          ? "bg-gradient-to-r from-amber-400 via-[#d4af37] to-yellow-500 text-white border-amber-400/40 shadow-amber-500/20"
                          : "bg-gradient-to-r from-slate-200 via-zinc-300 to-slate-400 text-slate-800 border-slate-300/40 shadow-slate-500/10"
                      }`}>
                      {t.paket || "BASIC"}
                    </span>
                  </div>

                  {/* Category Badge Overlay - Premium Glassmorphism */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-max">
                    <span className="px-2 py-0.5 rounded-full text-[6px] font-black uppercase tracking-wider bg-white/80 backdrop-blur-md text-[#064e3b] border border-white/40 shadow-sm">
                      {t.kategori || "—"}
                    </span>
                  </div>

                  {/* Cover Zoom Wrapper in 9:16 aspect ratio */}
                  <div className="h-full aspect-[9/16] relative overflow-hidden bg-white shadow-sm border border-[#064e3b]/10 rounded-lg transition-transform duration-700 ease-out group-hover:scale-[1.04]">
                    {hasCoverData ? (
                      <ScaledCoverPreview coverData={coverData} meta={meta} />
                    ) : t.thumbnail ? (
                      <img src={t.thumbnail} alt={t.nama_template} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#064e3b]/20"><Palette className="w-10 h-10" /></div>
                    )}
                  </div>
                  {/* Status Overlay */}
                  <div className="absolute top-2.5 right-2.5 z-20">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black border uppercase tracking-wider ${t.status === "PUBLISHED"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-amber-50 border-amber-200 text-amber-800"
                      }`}>{t.status}</span>
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
