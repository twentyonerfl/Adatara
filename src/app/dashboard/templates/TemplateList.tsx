"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createInvitation } from "./actions";
import { 
  Palette, 
  ArrowRight, 
  X, 
  Sparkles, 
  Link as LinkIcon, 
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";

import { ScaledCoverPreview } from "./BuilderTabsCoverPembuka";

type TemplateType = {
  id: string;
  nama_template: string;
  kategori: string;
  thumbnail: string;
  deskripsi: string | null;
  template_json?: any;
};

export function TemplateList({ templates }: { templates: TemplateType[] }) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const categories = ["Semua", ...Array.from(new Set(templates.map((t) => t.kategori)))];

  const filteredTemplates = selectedCategory === "Semua"
    ? templates
    : templates.filter((t) => t.kategori === selectedCategory);

  const handleOpenModal = (template: TemplateType) => {
    setSelectedTemplate(template);
    setSlug("");
    setErrorMessage(null);
    setSuccess(false);
  };

  const handleCloseModal = () => {
    if (loading) return;
    setSelectedTemplate(null);
    setSlug("");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate || !slug) return;

    setLoading(true);
    setErrorMessage(null);

    const formattedSlug = slug.toLowerCase().trim().replace(/\s+/g, "-");

    try {
      const res = await createInvitation({
        templateId: selectedTemplate.id,
        slug: formattedSlug,
      });

      if (res?.error) {
        setErrorMessage(res.error);
        setLoading(false);
      } else if (res?.success && res.invitationId) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/dashboard/builder/${res.invitationId}`);
        }, 1200);
      }
    } catch (err) {
      setErrorMessage("Terjadi kesalahan sistem. Silakan coba kembali.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-[#064e3b]">
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2 bg-[#064e3b]/5 p-1.5 rounded-2xl border border-[#064e3b]/10 w-fit">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#064e3b] text-white border border-[#d4af37] shadow-md shadow-[#064e3b]/10"
                : "text-[#064e3b]/70 hover:text-[#064e3b]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-16 bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-3xl">
          <Palette className="w-10 h-10 text-[#064e3b]/40 mx-auto mb-4" />
          <h4 className="text-[#064e3b] font-bold">Tidak Ada Template</h4>
          <p className="text-[#064e3b]/50 text-xs mt-1">Belum ada template yang terdaftar dalam kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredTemplates.map((template) => {
            const parsedJson = typeof template.template_json === "string" ? JSON.parse(template.template_json) : template.template_json;
            const coverData = parsedJson?.cover || {};
            const meta = { kategori: template.kategori, bahasa: coverData.bahasa || "id" };
            const hasCoverData = coverData && Object.keys(coverData).length > 0;

            return (
              <div
                key={template.id}
                className="group bg-white border border-[#064e3b]/5 hover:border-[#d4af37]/35 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 shadow-sm hover:shadow-md"
              >
                {/* Thumbnail / Live Cover Preview */}
                <div className="w-full aspect-[9/16] overflow-hidden relative bg-[#064e3b]/10">
                  {hasCoverData ? (
                    <ScaledCoverPreview coverData={coverData} meta={meta} />
                  ) : template.thumbnail ? (
                    <img
                      src={template.thumbnail}
                      alt={template.nama_template}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#064e3b]/20"><Palette className="w-10 h-10" /></div>
                  )}
                </div>

                {/* Body */}
                <div className="p-3 flex flex-col flex-1 text-left">
                  {/* Title & Category Badge Row */}
                  <div className="flex items-start justify-between gap-1 min-w-0">
                    <h4 className="text-[11px] font-black text-[#064e3b] group-hover:text-[#d4af37] transition-colors leading-tight flex-1 break-words">
                      {template.nama_template}
                    </h4>
                    <span className="px-1 py-0.5 rounded bg-[#064e3b]/5 text-[#d4af37]/90 border border-[#d4af37]/15 text-[6.5px] font-extrabold uppercase tracking-wider whitespace-nowrap flex-shrink-0 mt-0.5">
                      {template.kategori}
                    </span>
                  </div>

                  <p className="text-[#064e3b]/60 text-[9.5px] mt-1.5 line-clamp-1 leading-normal flex-1">
                    {template.deskripsi || "Tidak ada deskripsi."}
                  </p>

                  {/* Action */}
                  <button
                    onClick={() => handleOpenModal(template)}
                    className="mt-3 w-full py-1.5 bg-[#064e3b] hover:bg-[#064e3b]/95 border border-[#d4af37] text-white font-black text-[9px] flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm shadow-[#064e3b]/5 tracking-wider uppercase rounded-lg"
                  >
                    Gunakan Template
                    <ArrowRight className="w-2.5 h-2.5 text-[#d4af37]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SLUG SELECTION MODAL */}
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
              className="bg-white border border-[#064e3b]/10 w-full max-w-md rounded-3xl overflow-hidden relative shadow-2xl z-10 p-6 sm:p-8 text-left"
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
                  <h3 className="text-xl font-bold text-[#064e3b]">Undangan Dibuat!</h3>
                  <p className="text-[#064e3b]/70 text-sm mt-2">
                    Menyiapkan ruang editor untuk kustomisasi Anda...
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#064e3b]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Membuka Template Builder
                  </div>
                </div>
              ) : (
                /* Form state */
                <form onSubmit={handleCreate} className="space-y-6">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#d4af37] uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Konfirmasi Pembuatan
                    </span>
                    <h3 className="text-xl font-extrabold text-[#064e3b] mt-1.5">
                      Buat Undangan Baru
                    </h3>
                    <p className="text-[#064e3b]/70 text-xs mt-1">
                      Anda memilih desain <strong>{selectedTemplate.nama_template}</strong>.
                    </p>
                  </div>

                  {/* Error Alert */}
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-semibold flex items-start gap-2">
                      <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Slug Input */}
                  <div>
                    <label className="block text-xs font-bold text-[#064e3b]/85 uppercase tracking-wider mb-2">
                      Tentukan Tautan (Link) Undangan
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-3.5 w-4.5 h-4.5 text-[#064e3b]/40" />
                      <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        placeholder="contoh: aditya-tara"
                        className="w-full pl-12 pr-4 py-3 bg-[#f5f5dc]/15 border border-[#064e3b]/20 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl text-sm text-[#064e3b] placeholder-[#064e3b]/30 outline-none transition-all"
                      />
                    </div>
                    {/* Help hint */}
                    <p className="text-[10px] text-[#064e3b]/50 mt-2">
                      Hanya boleh huruf kecil, angka, dan tanda hubung (-).
                    </p>
                  </div>

                  {/* Link Preview */}
                  <div className="p-4 rounded-xl bg-[#064e3b]/5 border border-[#064e3b]/10 text-xs">
                    <span className="text-[#064e3b]/60 block font-semibold">Tampilan Link Undangan Anda:</span>
                    <span className="text-[#064e3b] font-bold break-all mt-1 block">
                      {window.location.origin}/u/{slug || "..."}
                    </span>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3">
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
                      disabled={loading || !slug}
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
