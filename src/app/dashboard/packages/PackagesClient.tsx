"use client";

import { useState } from "react";
import { savePackagesAction } from "./actions";
import { 
  Gift, 
  CheckCircle, 
  TrendingUp, 
  Sparkles, 
  Plus, 
  Trash2, 
  Loader2, 
  Save, 
  AlertCircle,
  FolderPlus
} from "lucide-react";

interface PackageData {
  price: number;
  name: string;
  sub: string;
  desc: string;
  features: string[];
  badgeText?: string;
  badgeStyle?: string;
  buttonText?: string;
}

interface PackagesClientProps {
  initialPackages: Record<string, PackageData>;
  salesStats: Record<string, number>;
}

export default function PackagesClient({ initialPackages, salesStats }: PackagesClientProps) {
  const [packages, setPackages] = useState<Record<string, PackageData>>(initialPackages);
  const [newFeatures, setNewFeatures] = useState<Record<string, string>>({});

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Field change handler
  const handleFieldChange = (key: string, field: keyof PackageData, val: any) => {
    setPackages(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: val
      }
    }));
  };

  // Rename key handler (e.g. PREMIUM -> PLATINUM)
  const handleRenameKey = (oldKey: string, newKey: string) => {
    const formattedNewKey = newKey.toUpperCase().replace(/[^A-Z0-9_]/g, "");
    if (!formattedNewKey || formattedNewKey === oldKey) return;
    if (packages[formattedNewKey]) {
      alert(`Kode paket ${formattedNewKey} sudah digunakan.`);
      return;
    }

    setPackages(prev => {
      const copy = { ...prev };
      const val = copy[oldKey];
      delete copy[oldKey];
      copy[formattedNewKey] = val;
      return copy;
    });
  };

  // Add new feature handler
  const handleAddFeature = (key: string) => {
    const text = newFeatures[key]?.trim();
    if (!text) return;

    setPackages(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        features: [...(prev[key].features || []), text]
      }
    }));

    setNewFeatures(prev => ({
      ...prev,
      [key]: ""
    }));
  };

  // Remove feature handler
  const handleRemoveFeature = (key: string, index: number) => {
    setPackages(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        features: prev[key].features.filter((_, i) => i !== index)
      }
    }));
  };

  // Add new package handler
  const handleAddNewPackage = () => {
    const baseKey = "PAKET_BARU";
    let newKey = baseKey;
    let counter = 1;
    while (packages[newKey]) {
      newKey = `${baseKey}_${counter}`;
      counter++;
    }

    setPackages(prev => ({
      ...prev,
      [newKey]: {
        price: 99000,
        name: "PAKET BARU",
        sub: "Masa aktif selamanya",
        desc: "Deskripsi paket baru Anda...",
        features: ["Fitur contoh 1", "Fitur contoh 2"],
        badgeText: "HOT",
        badgeStyle: "slate",
        buttonText: "Pilih Paket"
      }
    }));
  };

  // Delete package handler
  const handleDeletePackage = (key: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus paket "${packages[key].name || key}" secara permanen?`)) {
      return;
    }
    setPackages(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  // Save handler
  const handleSaveAll = async () => {
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await savePackagesAction(packages);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg("Seluruh pengaturan paket berhasil diperbarui!");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      setErrorMsg("Kesalahan koneksi internet.");
    } finally {
      setSaving(false);
    }
  };

  const getCardColor = (badgeStyle?: string) => {
    switch (badgeStyle) {
      case "slate": return "border-slate-600/20 shadow-sm";
      case "emerald": return "border-[#d4af37] ring-1 ring-[#d4af37]/35 shadow-[#d4af37]/5";
      case "amber": return "border-amber-600/35 ring-1 ring-amber-600/25";
      case "purple": return "border-purple-600/35 ring-1 ring-purple-600/25";
      default: return "border-[#064e3b]/10";
    }
  };

  const getBadgeColor = (badgeStyle?: string) => {
    switch (badgeStyle) {
      case "slate": return "bg-slate-600 text-white";
      case "emerald": return "bg-emerald-700 text-white";
      case "amber": return "bg-amber-600 text-white";
      case "purple": return "bg-purple-700 text-white";
      default: return "bg-[#064e3b] text-white";
    }
  };

  return (
    <div className="space-y-8 text-[#064e3b] pb-24">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Gift className="w-3.5 h-3.5" />
            Pengaturan Layanan
          </span>
          <h1 className="text-3xl font-black text-[#064e3b] tracking-tight">Kelola Paket & Harga</h1>
          <p className="text-[#064e3b]/70 text-sm mt-1">
            Konfigurasikan harga nominal, sub-judul, deskripsi, dan butir fitur. Anda dapat mengedit, menghapus, atau menambah paket baru secara fleksibel.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleAddNewPackage}
            className="px-4 py-3 bg-white hover:bg-slate-50 text-[#064e3b] border border-[#064e3b]/20 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <FolderPlus className="w-4 h-4 text-[#d4af37]" />
            Tambah Paket
          </button>
          
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-6 py-3 bg-[#064e3b] hover:bg-[#054030] text-white border border-[#d4af37]/30 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Semua Paket
              </>
            )}
          </button>
        </div>
      </div>

      {/* STATUS MESSAGES */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm">
          <CheckCircle className="w-4.5 h-4.5" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm">
          <AlertCircle className="w-4.5 h-4.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* CARDS LISTING FOR EDIT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Object.keys(packages).map((key) => {
          const pkg = packages[key];
          if (!pkg) return null;

          return (
            <div 
              key={key} 
              className={`bg-white border rounded-3xl p-6 relative flex flex-col justify-between hover:shadow-md transition-all ${getCardColor(pkg.badgeStyle)}`}
            >
              <div className="space-y-6">
                {/* Header Info */}
                <div className="flex items-center justify-between gap-4 border-b border-[#064e3b]/10 pb-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => handleRenameKey(key, e.target.value)}
                      placeholder="KODE_PAKET"
                      title="Kode paket unik (kapital, tanpa spasi)"
                      className="px-2 py-1 bg-slate-100 focus:bg-white border border-slate-200 focus:border-[#d4af37] rounded-lg text-[10px] font-black uppercase outline-none w-28 text-center text-[#064e3b]"
                    />
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getBadgeColor(pkg.badgeStyle)}`}>
                      {pkg.name || "NAMA PAKET"}
                    </span>
                  </div>
                  
                  {/* Sales Count / Delete Option */}
                  <div className="flex items-center gap-2">
                    <div className="text-[10px] font-bold text-[#064e3b]/60 uppercase tracking-wider flex items-center gap-1.5 bg-[#064e3b]/5 px-2.5 py-1 rounded-lg">
                      <TrendingUp className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Sales: {salesStats[key] || 0}</span>
                    </div>

                    <button
                      onClick={() => handleDeletePackage(key)}
                      title="Hapus Paket Ini"
                      className="p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg cursor-pointer transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="space-y-4 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-[#064e3b]/60 mb-1">
                        Nama Tampilan Paket
                      </label>
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => handleFieldChange(key, "name", e.target.value)}
                        placeholder="Nama Paket"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#d4af37] rounded-xl text-xs font-bold text-[#064e3b] outline-none"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-[#064e3b]/60 mb-1">
                        Harga Paket (Rupiah)
                      </label>
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                        <span className="text-xs font-extrabold text-[#064e3b]/50">Rp</span>
                        <input
                          type="number"
                          min={0}
                          value={pkg.price}
                          onChange={(e) => handleFieldChange(key, "price", parseInt(e.target.value, 10) || 0)}
                          placeholder="0"
                          className="bg-transparent border-none outline-none font-bold text-[#064e3b] text-xs w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Subtitle / Active period */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-[#064e3b]/60 mb-1">
                        Sub-judul / Durasi
                      </label>
                      <input
                        type="text"
                        value={pkg.sub}
                        onChange={(e) => handleFieldChange(key, "sub", e.target.value)}
                        placeholder="Bayar Sekali (Aktif Selamanya)"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#d4af37] rounded-xl text-xs font-bold text-[#064e3b] outline-none"
                      />
                    </div>

                    {/* Button Text */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-[#064e3b]/60 mb-1">
                        Label Tombol CTA
                      </label>
                      <input
                        type="text"
                        value={pkg.buttonText || "Pilih Paket"}
                        onChange={(e) => handleFieldChange(key, "buttonText", e.target.value)}
                        placeholder="Pilih Paket"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#d4af37] rounded-xl text-xs font-bold text-[#064e3b] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Badge Text */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-[#064e3b]/60 mb-1">
                        Label Banner Atas (Badge)
                      </label>
                      <input
                        type="text"
                        value={pkg.badgeText || ""}
                        onChange={(e) => handleFieldChange(key, "badgeText", e.target.value)}
                        placeholder="e.g. Terpopuler (Opsional)"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#d4af37] rounded-xl text-xs font-bold text-[#064e3b] outline-none"
                      />
                    </div>

                    {/* Badge Style */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-[#064e3b]/60 mb-1">
                        Warna Desain Card
                      </label>
                      <select
                        value={pkg.badgeStyle || "slate"}
                        onChange={(e) => handleFieldChange(key, "badgeStyle", e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-[#d4af37] rounded-xl text-xs font-bold text-[#064e3b] outline-none cursor-pointer"
                      >
                        <option value="slate">Slate (Abu-abu / Default)</option>
                        <option value="emerald">Emerald (Hijau Emas)</option>
                        <option value="amber">Amber (Kuning Jingga)</option>
                        <option value="purple">Purple (Ungu Eksklusif)</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-[#064e3b]/60 mb-1">
                      Deskripsi Paket
                    </label>
                    <textarea
                      rows={2}
                      value={pkg.desc}
                      onChange={(e) => handleFieldChange(key, "desc", e.target.value)}
                      placeholder="Tulis penjelasan singkat paket..."
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-[#d4af37] rounded-xl text-xs font-bold text-[#064e3b] outline-none resize-none"
                    />
                  </div>

                  {/* Features List Editor */}
                  <div className="space-y-3 pt-2">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-[#064e3b]/60 border-b border-[#064e3b]/5 pb-1">
                      Butir Fitur Paket ({(pkg.features || []).length})
                    </span>

                    {/* Features list items */}
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {(pkg.features || []).map((feat, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center justify-between gap-3 p-2 bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-xl"
                        >
                          <span className="text-xs font-semibold text-[#064e3b]/80 leading-snug">
                            {feat}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(key, idx)}
                            className="p-1.5 text-red-600 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                            title="Hapus Fitur"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add new feature input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newFeatures[key] || ""}
                        onChange={(e) => setNewFeatures(prev => ({ ...prev, [key]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddFeature(key);
                          }
                        }}
                        placeholder="Tulis butir fitur baru..."
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-[#d4af37]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddFeature(key)}
                        className="px-3 py-2 bg-[#064e3b] hover:bg-[#064e3b]/90 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1 cursor-pointer transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Tambah
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
