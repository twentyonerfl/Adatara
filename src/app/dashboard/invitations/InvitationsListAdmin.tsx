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
  Link2
} from "lucide-react";
import { deleteInvitationAdmin, updateInvitationStatusAdmin } from "./actions";

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
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/builder/${inv.id}`}
                        target="_blank"
                        className="p-2 bg-[#064e3b] text-white border border-[#d4af37] rounded-xl hover:opacity-90 transition-opacity"
                        title="Buka Live Editor"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
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
    </div>
  );
}
