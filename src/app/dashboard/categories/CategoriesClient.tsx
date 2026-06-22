"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { 
  Layers, 
  Palette, 
  ArrowRight,
  FolderOpen,
  Tag,
  Plus,
  Trash2,
  Loader2
} from "lucide-react";
import { createCategory, deleteCategory } from "./category-actions";

type CategoryGroup = {
  id: string;
  nama: string;
  count: number;
  items: Array<{ id: string; nama_template: string }>;
};

const descriptions: Record<string, string> = {
  "Pernikahan": "Template elegan bertema floral, klasik, jawa, modern, rustik, dan romantis.",
  "Ulang Tahun": "Desain ceria, neon party, anak-anak, remaja, dan formal minimalis.",
  "Syukuran": "Nuansa teduh bernafas aqiqah, selamatan, pengajian, dan syukuran rumah.",
  "Acara Bisnis": "Gaya profesional untuk seminar, webinar, konferensi, dan gala dinner."
};

export default function CategoriesClient({ initialGroups }: { initialGroups: CategoryGroup[] }) {
  const [groups, setGroups] = useState<CategoryGroup[]>(initialGroups);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    setError(null);
    setSuccess(null);
    startTransition(async () => {
      try {
        const res = await createCategory(trimmed);
        if (res.error) {
          setError(res.error);
        } else if (res.category) {
          setGroups(prev => [
            ...prev,
            {
              id: res.category.id,
              nama: res.category.nama,
              count: 0,
              items: []
            }
          ].sort((a, b) => a.nama.localeCompare(b.nama)));
          setNewCategoryName("");
          setSuccess(`Kategori "${trimmed}" berhasil ditambahkan.`);
        }
      } catch (err: any) {
        setError(err?.message || "Terjadi kesalahan saat menghubungi server.");
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Hapus kategori "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;

    setError(null);
    setSuccess(null);
    setLoadingId(id);
    startTransition(async () => {
      try {
        const res = await deleteCategory(id);
        if (res.error) {
          setError(res.error);
        } else {
          setGroups(prev => prev.filter(g => g.id !== id));
          setSuccess(`Kategori "${name}" berhasil dihapus.`);
        }
      } catch (err: any) {
        setError(err?.message || "Terjadi kesalahan saat menghubungi server.");
      } finally {
        setLoadingId(null);
      }
    });
  };

  return (
    <div className="space-y-8 text-[#064e3b]">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Layers className="w-3.5 h-3.5" />
            Kategori Undangan
          </span>
          <h1 className="text-3xl font-black text-[#064e3b] tracking-tight">Kategori Desain</h1>
          <p className="text-[#064e3b]/70 text-sm mt-1">
            Kelompokkan template desain berdasarkan jenis acara dan lihat ketersediaan desain aktif.
          </p>
        </div>
      </div>

      {/* FEEDBACK MESSAGES */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs font-bold transition-all">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold transition-all">
          {success}
        </div>
      )}

      <div className="space-y-6">
        {/* ADD CATEGORY CARD (HORIZONTAL BANNER) */}
        <div className="bg-white border border-[#064e3b]/10 rounded-3xl p-5 shadow-sm">
          <form onSubmit={handleCreate} className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="space-y-1 flex-1 min-w-0">
              <h3 className="text-sm font-black text-[#064e3b]">Tambah Kategori Baru</h3>
              <p className="text-[11px] text-[#064e3b]/60 mt-0.5">
                Buat kategori baru untuk dikelompokkan pada template builder cover.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full md:w-auto shrink-0">
              <input
                id="category-name"
                type="text"
                placeholder="Contoh: Walimatul Ursy, Baby Shower"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                disabled={isPending}
                className="w-full sm:w-64 text-xs font-bold bg-[#f5f5dc]/40 border border-[#064e3b]/10 focus:border-[#d4af37] outline-none rounded-xl px-4 py-2.5 text-[#064e3b] placeholder-[#064e3b]/30 transition-all"
              />
              
              <button
                type="submit"
                disabled={isPending || !newCategoryName.trim()}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-[#064e3b] hover:bg-[#064e3b]/90 disabled:opacity-50 text-white border border-[#d4af37] shadow-md transition-all uppercase tracking-wider whitespace-nowrap cursor-pointer"
              >
                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d4af37]" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-[#d4af37]" />
                )}
                Tambah Kategori
              </button>
            </div>
          </form>
        </div>

        {/* CATEGORY LIST (STACKED LONG CARDS) */}
        <div className="space-y-4">
          {groups.map((group) => (
            <div 
              key={group.id} 
              className="bg-white border border-[#064e3b]/10 rounded-3xl p-5 shadow-sm hover:border-[#d4af37]/35 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Left Column: Icon, Name, Count & Description */}
              <div className="space-y-1.5 md:max-w-[240px] w-full shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#064e3b]/5 flex items-center justify-center text-[#d4af37] shrink-0">
                    <Tag className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-[#064e3b] truncate">{group.nama}</h3>
                  <span className="text-[9px] font-black bg-[#064e3b] text-[#f5f5dc] border border-[#d4af37]/30 px-2 py-0.5 rounded-full shrink-0">
                    {group.count} Template
                  </span>
                </div>
                <p className="text-[11px] text-[#064e3b]/60 leading-relaxed font-semibold">
                  {descriptions[group.nama] || "Kumpulan pilihan template digital interaktif."}
                </p>
              </div>

              {/* Middle Column: Available Designs */}
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-black text-[#064e3b]/40 uppercase tracking-wider mb-2">Desain Tersedia:</div>
                <div className="flex flex-wrap gap-2">
                  {group.items.length > 0 ? (
                    group.items.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f5dc]/70 border border-[#064e3b]/10 rounded-xl text-xs font-bold text-[#064e3b] whitespace-nowrap"
                      >
                        <Palette className="w-3.5 h-3.5 text-[#d4af37]" />
                        {item.nama_template}
                      </div>
                    ))
                  ) : (
                    <span className="text-[11px] text-[#064e3b]/40 italic font-semibold">
                      Belum ada template aktif
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center gap-4 justify-end shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-[#064e3b]/10">
                {group.count === 0 ? (
                  <button
                    onClick={() => handleDelete(group.id, group.nama)}
                    disabled={loadingId === group.id}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50 p-1.5 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1 text-[11px] font-black cursor-pointer"
                  >
                    {loadingId === group.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    Hapus
                  </button>
                ) : (
                  <div className="w-12 h-6 hidden md:block" />
                )}

                <Link 
                  href="/dashboard/templates" 
                  className="text-xs font-black text-[#d4af37] hover:text-[#d4af37]/80 flex items-center gap-1 group transition-colors uppercase tracking-wider"
                >
                  Kelola Desain
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}

          {groups.length === 0 && (
            <div className="col-span-full bg-white border border-[#064e3b]/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
              <FolderOpen className="w-12 h-12 text-[#d4af37] mb-4" />
              <h3 className="text-lg font-black">Belum Ada Kategori</h3>
              <p className="text-xs text-[#064e3b]/70 mt-1 max-w-sm">
                Tambahkan kategori baru menggunakan panel samping untuk memulai.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
