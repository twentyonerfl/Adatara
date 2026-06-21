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
  thumbnail: string;
  deskripsi: string | null;
  status: "DRAFT" | "PUBLISHED";
  created_at: Date;
  template_json: any;
};

export default function AdminTemplateList({ templates: initial }: { templates: Template[] }) {
  const [templates, setTemplates] = useState<Template[]>(initial);
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(t => {
            const parsedJson = typeof t.template_json === "string" ? JSON.parse(t.template_json) : t.template_json;
            const coverData = parsedJson?.cover || {};
            const meta = { kategori: t.kategori, bahasa: coverData.bahasa || "id" };
            const hasCoverData = coverData && Object.keys(coverData).length > 0;

            return (
              <div key={t.id}
                className="bg-white border border-[#064e3b]/10 hover:border-[#d4af37]/40 rounded-3xl overflow-hidden flex flex-col shadow-sm transition-all group">
                {/* Thumbnail / Live Cover Preview */}
                <div className="relative w-full aspect-[9/16] bg-[#064e3b]/10 overflow-hidden">
                  {hasCoverData ? (
                    <ScaledCoverPreview coverData={coverData} meta={meta} />
                  ) : t.thumbnail ? (
                    <img src={t.thumbnail} alt={t.nama_template} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#064e3b]/20"><Palette className="w-10 h-10" /></div>
                  )}
                  {/* Overlays */}
                  <div className="absolute top-3 left-3 flex gap-2 z-20">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black text-white bg-[#064e3b] border border-[#d4af37] uppercase tracking-wider">
                      {t.kategori || "—"}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 z-20">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${
                      t.status === "PUBLISHED"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-amber-50 border-amber-200 text-amber-800"
                    }`}>{t.status}</span>
                  </div>
                </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1 gap-3">
                <div>
                  <h4 className="text-base font-black text-[#064e3b]">{t.nama_template}</h4>
                  <p className="text-[11px] text-[#064e3b]/60 mt-1 line-clamp-2 leading-relaxed">
                    {t.deskripsi || "Tidak ada deskripsi."}
                  </p>
                </div>

                <div className="text-[10px] text-[#064e3b]/40 font-semibold">
                  Dibuat: {new Date(t.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-3 border-t border-[#064e3b]/10">
                  <Link href={`/dashboard/templates/edit/${t.id}`}
                    className="flex-1 py-2 rounded-xl bg-[#064e3b] hover:bg-[#064e3b]/90 border border-[#d4af37] text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all">
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </Link>

                  {t.status === "DRAFT" && (
                    <button onClick={() => handlePublish(t.id)} disabled={loadingId === t.id}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all disabled:opacity-50">
                      {loadingId === t.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                      Publish
                    </button>
                  )}

                  <button onClick={() => handleDelete(t.id, t.nama_template)} disabled={loadingId === t.id}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all disabled:opacity-50">
                    {loadingId === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
