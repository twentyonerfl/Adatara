"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  ExternalLink, 
  Trash2, 
  Eye, 
  Check, 
  AlertCircle,
  Loader2,
  Calendar,
  Layers,
  Link2,
  Users,
  Pencil,
  Sliders,
  X,
  Save
} from "lucide-react";
import { deleteInvitationAdmin, updateInvitationStatusAdmin, updateInvitationDetailsAdmin } from "./actions";
import { DEFAULT_SHARE_TEMPLATE, formatShareText } from "@/app/dashboard/templates/builder-constants";

interface InvitationWithRelations {
  id: string;
  slug: string;
  status: "DRAFT" | "ACTIVE" | "INACTIVE";
  created_at: Date | string;
  user: {
    email: string;
    name: string;
  };
  template: {
    nama_template: string;
    kategori: string;
  };
}

export default function InvitationsListAdmin({ 
  initialInvitations 
}: { 
  initialInvitations: any[] 
}) {
  const [invitations, setInvitations] = useState<InvitationWithRelations[]>(initialInvitations);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Batch Guest Generator states
  const [selectedInvForGuests, setSelectedInvForGuests] = useState<any | null>(null);
  const [guestListInput, setGuestListInput] = useState("");
  const [linkType, setLinkType] = useState<"query" | "path">("path");
  const [shareTextTemplate, setShareTextTemplate] = useState(DEFAULT_SHARE_TEMPLATE);
  const [generatedGuests, setGeneratedGuests] = useState<Array<{ name: string; url: string; waUrl: string; waText: string }>>([]);

  // Quick Edit Modal states
  const [quickEditInv, setQuickEditInv] = useState<any | null>(null);
  const [quickSlug, setQuickSlug] = useState("");
  const [quickStatus, setQuickStatus] = useState<"DRAFT" | "ACTIVE" | "INACTIVE">("DRAFT");
  const [quickNamaAcara, setQuickNamaAcara] = useState("");
  const [quickTanggal, setQuickTanggal] = useState("");
  const [savingQuick, setSavingQuick] = useState(false);
  const [quickError, setQuickError] = useState<string | null>(null);
  const [quickSuccess, setQuickSuccess] = useState(false);

  const handleOpenQuickEdit = (inv: any) => {
    setQuickEditInv(inv);
    setQuickSlug(inv.slug || "");
    setQuickStatus(inv.status || "DRAFT");
    const dataJson = inv.data_undangan_json || {};
    setQuickNamaAcara(dataJson.cover?.nama_acara || "");
    setQuickTanggal(dataJson.pembuka?.tanggal_acara || "");
    setQuickError(null);
    setQuickSuccess(false);
  };

  const handleSaveQuickEdit = async () => {
    if (!quickEditInv) return;
    setSavingQuick(true);
    setQuickError(null);
    setQuickSuccess(false);

    try {
      const currentJson = quickEditInv.data_undangan_json || {};
      const updatedJson = {
        ...currentJson,
        cover: {
          ...(currentJson.cover || {}),
          nama_acara: quickNamaAcara
        },
        pembuka: {
          ...(currentJson.pembuka || {}),
          tanggal_acara: quickTanggal
        }
      };

      const res = await updateInvitationDetailsAdmin(quickEditInv.id, {
        slug: quickSlug,
        status: quickStatus,
        data_undangan_json: updatedJson
      });

      if (res.error) {
        setQuickError(res.error);
      } else {
        setQuickSuccess(true);
        setInvitations(prev =>
          prev.map(inv =>
            inv.id === quickEditInv.id
              ? {
                  ...inv,
                  slug: quickSlug,
                  status: quickStatus,
                  data_undangan_json: updatedJson
                }
              : inv
          )
        );
        setTimeout(() => {
          setQuickEditInv(null);
        }, 1200);
      }
    } catch (err) {
      setQuickError("Gagal memperbarui data.");
    } finally {
      setSavingQuick(false);
    }
  };

  const handleOpenGuestGenerator = (inv: any) => {
    setSelectedInvForGuests(inv);
    const dataJson = inv.data_undangan_json as any;
    const cover = dataJson?.cover || {};
    if (cover.share_text_template) {
      setShareTextTemplate(cover.share_text_template);
    } else {
      setShareTextTemplate(DEFAULT_SHARE_TEMPLATE);
    }
    setGeneratedGuests([]);
    setGuestListInput("");
  };

  const handleGenerateLinks = () => {
    if (!selectedInvForGuests) return;
    const names = guestListInput
      .split("\n")
      .map(n => n.trim())
      .filter(n => n.length > 0);
      
    const origin = typeof window !== "undefined" ? window.location.origin : "https://adatara.my.id";
    const primaryUrl = `${origin}/${selectedInvForGuests.slug}`;
    
    const results = names.map(name => {
      let url = "";
      if (linkType === "query") {
        url = `${primaryUrl}?to=${encodeURIComponent(name)}`;
      } else {
        url = `${primaryUrl}/${encodeURIComponent(name.replace(/ /g, "+"))}`;
      }
      
      const waText = formatShareText(shareTextTemplate, name, url, selectedInvForGuests);
      
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
      
      return {
        name,
        url,
        waText,
        waUrl
      };
    });
    
    setGeneratedGuests(results);
  };

  // Search Filter
  const filtered = invitations.filter(inv => {
    const term = search.toLowerCase();
    return (
      inv.slug.toLowerCase().includes(term) ||
      inv.user.email.toLowerCase().includes(term) ||
      inv.user.name.toLowerCase().includes(term) ||
      inv.template.nama_template.toLowerCase().includes(term)
    );
  });

  const handleStatusChange = async (id: string, newStatus: "DRAFT" | "ACTIVE" | "INACTIVE") => {
    setUpdatingId(id);
    setError(null);
    try {
      const res = await updateInvitationStatusAdmin(id, newStatus);
      if (res.error) {
        setError(res.error);
      } else {
        setInvitations(prev => 
          prev.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv)
        );
      }
    } catch (err) {
      setError("Kesalahan koneksi.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus undangan /${slug}? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    setUpdatingId(id);
    setError(null);
    try {
      const res = await deleteInvitationAdmin(id);
      if (res.error) {
        setError(res.error);
      } else {
        setInvitations(prev => prev.filter(inv => inv.id !== id));
      }
    } catch (err) {
      setError("Kesalahan koneksi.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Alert */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-3 w-5 h-5 text-[#064e3b]/30" />
          <input
            type="text"
            placeholder="Cari slug, email, nama pembeli..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#064e3b]/10 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-2xl text-xs text-[#064e3b] outline-none transition-all placeholder-[#064e3b]/30 font-bold"
          />
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Invitations Table */}
      <div className="bg-white border border-[#064e3b]/10 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-[#064e3b]/5 border-b border-[#064e3b]/10 text-[#064e3b] font-black uppercase tracking-wider">
                <th className="px-6 py-4">Link Undangan</th>
                <th className="px-6 py-4">Pembuat / Pelanggan</th>
                <th className="px-6 py-4">Desain Template</th>
                <th className="px-6 py-4">Tanggal Buat</th>
                <th className="px-6 py-4">Status Publik</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#064e3b]/10">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#064e3b]/5 transition-colors">
                  {/* Link / Slug */}
                  <td className="px-6 py-4 font-extrabold text-[#064e3b]">
                    <div className="flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-[#d4af37]" />
                      <Link 
                        href={`/${inv.slug}`} 
                        target="_blank" 
                        className="hover:underline flex items-center gap-1"
                      >
                        /{inv.slug}
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </Link>
                    </div>
                  </td>

                  {/* Creator */}
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <div className="font-bold">{inv.user.name}</div>
                      <div className="text-[10px] text-[#064e3b]/60">{inv.user.email}</div>
                    </div>
                  </td>

                  {/* Template */}
                  <td className="px-6 py-4 font-semibold text-[#064e3b]/80">
                    <div className="space-y-0.5">
                      <div>{inv.template.nama_template}</div>
                      <div className="text-[9px] font-black uppercase text-[#d4af37] tracking-wider">
                        {inv.template.kategori}
                      </div>
                    </div>
                  </td>

                  {/* Created At */}
                  <td className="px-6 py-4 text-[#064e3b]/60 font-medium">
                    {new Date(inv.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </td>

                  {/* Status Toggle */}
                  <td className="px-6 py-4">
                    {updatingId === inv.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-[#d4af37]" />
                    ) : (
                      <select
                        value={inv.status}
                        onChange={(e) => handleStatusChange(inv.id, e.target.value as any)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border cursor-pointer outline-none ${
                          inv.status === "ACTIVE"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : inv.status === "DRAFT"
                            ? "bg-amber-50 border-amber-200 text-amber-800"
                            : "bg-slate-100 border-slate-300 text-slate-700"
                        }`}
                      >
                        <option value="DRAFT">DRAF</option>
                        <option value="ACTIVE">AKTIF</option>
                        <option value="INACTIVE">NON-AKTIF</option>
                      </select>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/builder/${inv.id}?edit=true`}
                        target="_blank"
                        className="px-2.5 py-1.5 bg-[#064e3b] text-white border border-[#d4af37] rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1 text-[11px] font-bold shadow-sm"
                        title="Sunting / Edit Builder Undangan Keseluruhan"
                      >
                        <Pencil className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span className="hidden sm:inline">Edit Builder</span>
                      </Link>
                      <button
                        onClick={() => handleOpenQuickEdit(inv)}
                        className="p-2 bg-[#064e3b]/10 hover:bg-[#064e3b]/20 text-[#064e3b] border border-[#064e3b]/20 rounded-xl transition-all cursor-pointer"
                        title="Edit Cepat (Slug, Judul, Status)"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href={`/${inv.slug}`}
                        target="_blank"
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-[#064e3b] border border-slate-200 rounded-xl transition-all"
                        title="Lihat Pratinjau Undangan Live"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleOpenGuestGenerator(inv)}
                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-all cursor-pointer"
                        title="Generator Link Tamu & Kirim WhatsApp"
                      >
                        <Users className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(inv.id, inv.slug)}
                        disabled={updatingId === inv.id}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                        title="Hapus Undangan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-[#064e3b]/50">
                    Tidak ada data undangan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* GUEST GENERATOR MODAL */}
      {selectedInvForGuests && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white border border-[#064e3b]/10 rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#064e3b]/10 flex items-center justify-between bg-[#064e3b]/5">
              <div>
                <h3 className="font-black text-sm uppercase text-[#064e3b] tracking-wider">
                  Generator Link Tamu Undangan
                </h3>
                <p className="text-[10px] text-[#064e3b]/60 font-semibold mt-0.5">
                  Undangan: /{selectedInvForGuests.slug}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedInvForGuests(null);
                  setGeneratedGuests([]);
                  setGuestListInput("");
                }}
                className="p-1.5 hover:bg-[#064e3b]/10 rounded-lg text-[#064e3b] font-bold text-xs cursor-pointer"
              >
                ✕ Tutup
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-[#064e3b]">
              {/* Input section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Guest Names List */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-[#064e3b]/80 block">
                    Daftar Nama Tamu (Satu Nama Per Baris)
                  </label>
                  <textarea
                    rows={6}
                    value={guestListInput}
                    onChange={(e) => setGuestListInput(e.target.value)}
                    placeholder="Contoh:&#10;Budi Santoso&#10;Ani & Suami&#10;Keluarga Hermawan"
                    className="w-full p-3 bg-[#f5f5dc]/10 border border-[#064e3b]/10 focus:border-[#d4af37] rounded-2xl text-xs outline-none font-sans"
                  />
                </div>

                {/* Link Format & Template Settings */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-[#064e3b]/80 block mb-1.5">
                      Format Tautan (Link)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setLinkType("path")}
                        className={`py-2 px-3 border rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer ${
                          linkType === "path"
                            ? "bg-[#064e3b] text-white border-[#d4af37]"
                            : "bg-white text-[#064e3b] border-[#064e3b]/10 hover:bg-[#064e3b]/5"
                        }`}
                      >
                        Sub-Route (/Nama)
                      </button>
                      <button
                        type="button"
                        onClick={() => setLinkType("query")}
                        className={`py-2 px-3 border rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer ${
                          linkType === "query"
                            ? "bg-[#064e3b] text-white border-[#d4af37]"
                            : "bg-white text-[#064e3b] border-[#064e3b]/10 hover:bg-[#064e3b]/5"
                        }`}
                      >
                        Query (?to=Nama)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-[#064e3b]/80 block">
                      Format Pesan WhatsApp
                    </label>
                    <textarea
                      rows={4}
                      value={shareTextTemplate}
                      onChange={(e) => setShareTextTemplate(e.target.value)}
                      placeholder="Gunakan {nama} dan {link}..."
                      className="w-full p-2.5 bg-[#f5f5dc]/10 border border-[#064e3b]/10 focus:border-[#d4af37] rounded-xl text-[10px] outline-none font-sans"
                    />
                    <p className="text-[8px] text-[#064e3b]/40 mt-1 font-semibold">* Tag {"{nama}"} & {"{link}"} diganti otomatis.</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleGenerateLinks}
                className="w-full py-3 bg-[#064e3b] hover:bg-[#064e3b]/95 text-white border border-[#d4af37] rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
              >
                Generate Tautan Tamu ({guestListInput.split("\n").filter(n => n.trim().length > 0).length} Tamu)
              </button>

              {/* Output Results */}
              {generatedGuests.length > 0 && (
                <div className="space-y-2 border-t border-[#064e3b]/10 pt-4">
                  <span className="text-[10px] font-black uppercase text-[#064e3b]/80 block">
                    Hasil Tautan Tamu ({generatedGuests.length})
                  </span>
                  <div className="divide-y divide-[#064e3b]/5 max-h-[300px] overflow-y-auto pr-1">
                    {generatedGuests.map((g, idx) => (
                      <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="font-extrabold text-[#064e3b] truncate">{g.name}</div>
                          <div className="text-[10px] font-mono text-[#064e3b]/60 truncate select-all">{g.url}</div>
                        </div>
                        <div className="flex gap-1.5 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(g.url);
                              alert(`Tautan untuk ${g.name} telah disalin!`);
                            }}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-wide transition-colors cursor-pointer"
                          >
                            Salin Link
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(g.waText);
                              alert(`Pesan WA untuk ${g.name} telah disalin!`);
                            }}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-wide transition-colors cursor-pointer"
                          >
                            Salin WA
                          </button>
                          <a
                            href={g.waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 bg-[#25d366] hover:bg-[#20ba5a] text-white rounded-lg text-[9px] font-black uppercase tracking-wide flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            Kirim WA
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QUICK EDIT MODAL */}
      {quickEditInv && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white border border-[#064e3b]/10 rounded-3xl w-full max-w-lg shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#064e3b]/10 flex items-center justify-between bg-[#064e3b]/5">
              <div>
                <h3 className="font-black text-sm uppercase text-[#064e3b] tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#d4af37]" />
                  Sunting Cepat Undangan
                </h3>
                <p className="text-[10px] text-[#064e3b]/60 font-semibold mt-0.5">
                  Pelanggan: {quickEditInv.user.name} ({quickEditInv.user.email})
                </p>
              </div>
              <button
                onClick={() => setQuickEditInv(null)}
                className="p-1.5 hover:bg-[#064e3b]/10 rounded-lg text-[#064e3b] font-bold text-xs cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <div className="p-6 space-y-4 text-[#064e3b]">
              {quickError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{quickError}</span>
                </div>
              )}
              {quickSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Data undangan berhasil diperbarui!</span>
                </div>
              )}

              {/* Slug URL */}
              <div>
                <label className="text-[10px] font-black uppercase text-[#064e3b]/80 block mb-1">
                  Slug Tautan Undangan (URL)
                </label>
                <div className="flex items-center gap-1 bg-[#f5f5dc]/20 border border-[#064e3b]/10 rounded-xl px-3 py-2 text-xs">
                  <span className="opacity-50 font-semibold">/</span>
                  <input
                    type="text"
                    value={quickSlug}
                    onChange={(e) => setQuickSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    className="bg-transparent border-none outline-none font-bold text-[#064e3b] flex-1"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-[10px] font-black uppercase text-[#064e3b]/80 block mb-1">
                  Status Publikasi
                </label>
                <select
                  value={quickStatus}
                  onChange={(e) => setQuickStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-[#064e3b]/10 focus:border-[#d4af37] rounded-xl text-xs font-bold outline-none cursor-pointer"
                >
                  <option value="DRAFT">DRAF</option>
                  <option value="ACTIVE">AKTIF</option>
                  <option value="INACTIVE">NON-AKTIF</option>
                </select>
              </div>

              {/* Judul Acara / Nama Pasangan */}
              <div>
                <label className="text-[10px] font-black uppercase text-[#064e3b]/80 block mb-1">
                  Nama Pasangan / Judul Acara
                </label>
                <input
                  type="text"
                  value={quickNamaAcara}
                  onChange={(e) => setQuickNamaAcara(e.target.value)}
                  placeholder="contoh: Aditya & Tara"
                  className="w-full px-3 py-2 bg-white border border-[#064e3b]/10 focus:border-[#d4af37] rounded-xl text-xs font-semibold outline-none"
                />
              </div>

              {/* Tanggal Utama */}
              <div>
                <label className="text-[10px] font-black uppercase text-[#064e3b]/80 block mb-1">
                  Tanggal Utama Acara
                </label>
                <input
                  type="date"
                  value={quickTanggal}
                  onChange={(e) => setQuickTanggal(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#064e3b]/10 focus:border-[#d4af37] rounded-xl text-xs font-semibold outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3 border-t border-[#064e3b]/10">
                <button
                  type="button"
                  onClick={() => setQuickEditInv(null)}
                  className="flex-1 py-2.5 border border-[#064e3b]/20 hover:bg-[#064e3b]/5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveQuickEdit}
                  disabled={savingQuick}
                  className="flex-1 py-2.5 bg-[#064e3b] hover:bg-[#064e3b]/95 text-white border border-[#d4af37] rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {savingQuick ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
