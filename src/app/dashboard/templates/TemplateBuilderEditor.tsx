"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Globe, ArrowLeft, Loader2, CheckCircle, AlertCircle, Sparkles,
  Layout, BookOpen, Users, Calendar, Image, Heart, Eye
} from "lucide-react";
import { createTemplate, updateTemplate, publishTemplate } from "./builder-actions";
import { defaultTemplateJson, KATEGORI_OPTIONS, KATEGORI_EN_MAP } from "./builder-constants";
import { FileUploader } from "./BuilderWidgets";
import { CoverForm, CoverPreview } from "./BuilderTabsCoverPembuka";
import { PembukaForm, PembukaPreview } from "./BuilderTabsCoverPembuka";
import { ProfilForm, ProfilPreview } from "./BuilderTabsProfilAcara";
import { AcaraForm, AcaraPreview } from "./BuilderTabsProfilAcara";
import { CeritaForm, CeritaPreview, PenutupForm, PenutupPreview } from "./BuilderTabsCeritaPenutup";

import { PaketTier } from "@prisma/client";

const TABS = [
  { id: "cover",   label: "Cover",         icon: Layout },
  { id: "pembuka", label: "Pembuka",        icon: BookOpen },
  { id: "profil",  label: "Profil",         icon: Users },
  { id: "acara",   label: "Acara",          icon: Calendar },
  { id: "cerita",  label: "Cerita & Galeri",icon: Image },
  { id: "penutup", label: "Penutup",        icon: Heart },
];

interface Props {
  templateId?: string;
  initialData?: any;
  initialName?: string;
  initialKategori?: string;
  initialPaket?: PaketTier;
  initialThumbnail?: string;
  initialDeskripsi?: string;
  initialStatus?: string;
  initialBahasa?: "id" | "en";
  musicLibrary?: any[];
  categories?: any[];
}

export default function TemplateBuilderEditor({
  templateId, initialData, initialName = "", initialKategori = "",
  initialPaket = "BASIC",
  initialThumbnail = "", initialDeskripsi = "", initialStatus = "DRAFT",
  initialBahasa = "id", musicLibrary = [], categories = []
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("cover");

  // Meta fields
  const [namaTemplate, setNamaTemplate] = useState(initialName);
  const [kategori, setKategori] = useState(initialKategori);
  const [paket, setPaket] = useState<PaketTier>(initialPaket);
  const [thumbnail, setThumbnail] = useState(initialThumbnail);
  const [deskripsi, setDeskripsi] = useState(initialDeskripsi);
  const [bahasa, setBahasa] = useState<"id" | "en">(initialBahasa);
  const [status, setStatus] = useState(initialStatus);

  // Section data
  const base = initialData || defaultTemplateJson;
  const [coverData, setCoverData]   = useState<any>({ ...base.cover, kategori: initialKategori });
  const [pembukaData, setPembukaData] = useState<any>(base.pembuka || {});
  const [profilData, setProfilData] = useState<any>(base.profil || {});
  const [acaraData, setAcaraData]   = useState<any>(base.acara || {});
  const [ceritaData, setCeritaData] = useState<any>(base.cerita || {});
  const [penutupData, setPenutupData] = useState<any>(base.penutup || {});

  // UI state
  const [saveStatus, setSaveStatus] = useState<"idle"|"saving"|"saved"|"error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const buildJson = () => ({
    cover: { ...coverData, kategori, bahasa },
    pembuka: pembukaData,
    profil: profilData,
    acara: acaraData,
    cerita: ceritaData,
    penutup: penutupData,
  });

  const handleSave = async () => {
    if (!namaTemplate.trim()) { setErrorMsg("Nama template wajib diisi."); setSaveStatus("error"); return; }
    setSaveStatus("saving");
    setErrorMsg("");
    startTransition(async () => {
      const payload = { nama_template: namaTemplate, kategori, paket, thumbnail, deskripsi, template_json: buildJson() };
      const res = templateId ? await updateTemplate(templateId, payload) : await createTemplate(payload);
      if (res.error) { setSaveStatus("error"); setErrorMsg(res.error); }
      else {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
        if (!templateId && (res as any).id) router.replace(`/dashboard/templates/edit/${(res as any).id}`);
      }
    });
  };

  const handlePublish = async () => {
    if (!templateId) { await handleSave(); return; }
    setSaveStatus("saving");
    startTransition(async () => {
      const res = await publishTemplate(templateId);
      if (res.error) { setSaveStatus("error"); setErrorMsg(res.error); }
      else { 
        setSaveStatus("saved"); 
        setStatus("PUBLISHED");
        setTimeout(() => setSaveStatus("idle"), 2000); 
      }
    });
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#f5f5dc] text-[#064e3b]">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:wght@300;400;600;700&family=Great+Vibes&family=Inter:wght@300;400;600;700;900&family=Lato:wght@300;400;700&family=Outfit:wght@300;400;600;700;900&family=Pinyon+Script&family=Playfair+Display:wght@400;600;700;900&family=Poppins:wght@300;400;600;700;900&family=Roboto:wght@300;400;500;700&family=Sacramento&display=swap" rel="stylesheet" />
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-20 bg-[#f5f5dc]/95 backdrop-blur-sm border-b border-[#064e3b]/10 px-6 py-3 flex items-center gap-4 flex-wrap">
        <button onClick={() => router.push("/dashboard/templates")}
          className="p-2 hover:bg-[#064e3b]/10 rounded-xl text-[#064e3b] transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Name & Kategori & Paket */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <input value={namaTemplate} onChange={e => setNamaTemplate(e.target.value)} placeholder="Nama Template..."
            className="text-lg font-black bg-transparent border-b-2 border-[#064e3b]/20 focus:border-[#d4af37] outline-none px-1 py-0.5 w-44 text-[#064e3b] placeholder-[#064e3b]/30 transition-colors" />

          <select
            value={kategori}
            onChange={e => { setKategori(e.target.value); setCoverData((p: any) => ({ ...p, kategori: e.target.value })); }}
            className="text-xs font-black bg-white border border-[#064e3b]/20 rounded-xl px-3 py-1.5 outline-none focus:border-[#d4af37] text-[#064e3b] max-w-[150px]"
          >
            <option value="">-- Kategori --</option>
            {(categories.length > 0 ? categories.map(c => c.nama) : KATEGORI_OPTIONS).map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>

          <select
            value={paket}
            onChange={e => setPaket(e.target.value as PaketTier)}
            className="text-xs font-black bg-white border border-[#064e3b]/20 rounded-xl px-3 py-1.5 outline-none focus:border-[#d4af37] text-[#064e3b] w-[120px]"
          >
            <option value="BASIC">BASIC</option>
            <option value="PREMIUM">PREMIUM</option>
            <option value="SULTAN">SULTAN</option>
            <option value="EXCLUSIVE">EXCLUSIVE</option>
          </select>
        </div>


        {/* Language Pill Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#064e3b]/40">Lang</span>
          <div className="flex bg-[#064e3b]/8 border border-[#064e3b]/15 rounded-xl p-0.5 gap-0.5">
            <button
              type="button"
              onClick={() => { setBahasa("id"); setCoverData((p: any) => ({ ...p, bahasa: "id" })); }}
              className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${
                bahasa === "id"
                  ? "bg-[#064e3b] text-white shadow-sm"
                  : "text-[#064e3b]/50 hover:text-[#064e3b]"
              }`}
            >
              ID
            </button>
            <button
              type="button"
              onClick={() => { setBahasa("en"); setCoverData((p: any) => ({ ...p, bahasa: "en" })); }}
              className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${
                bahasa === "en"
                  ? "bg-[#d4af37] text-white shadow-sm"
                  : "text-[#064e3b]/50 hover:text-[#064e3b]"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase tracking-wider ${
            status === "PUBLISHED" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-amber-50 border-amber-200 text-amber-800"
          }`}>{status}</span>
          
          {status === "PUBLISHED" && templateId && (
            <a 
              href={`/demo/${templateId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-white border border-[#064e3b]/20 text-[#064e3b] hover:text-white hover:bg-[#064e3b] rounded-xl transition-all shadow-sm flex items-center justify-center"
              title="Lihat Hasil Undangan"
            >
              <Eye className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Alerts */}
        {saveStatus === "error" && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl">
            <AlertCircle className="w-4 h-4" />{errorMsg}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={isPending}
            className={`px-4 py-2 rounded-xl text-xs font-black border flex items-center gap-2 transition-all ${
              saveStatus === "saved" ? "bg-emerald-600 text-white border-emerald-700" : "bg-white border-[#064e3b]/20 text-[#064e3b] hover:bg-[#064e3b]/5"
            } disabled:opacity-50`}>
            {saveStatus === "saving" ? <Loader2 className="w-4 h-4 animate-spin" /> : saveStatus === "saved" ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saveStatus === "saving" ? "Menyimpan..." : saveStatus === "saved" ? "Tersimpan!" : "Simpan Draft"}
          </button>
          <button onClick={handlePublish} disabled={isPending}
            className="px-4 py-2 rounded-xl text-xs font-black bg-[#064e3b] hover:bg-[#064e3b]/90 text-white border border-[#d4af37] flex items-center gap-2 shadow-lg shadow-[#064e3b]/10 disabled:opacity-50">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4 text-[#d4af37]" />}
            Publish
          </button>
        </div>
      </header>

      {/* ── TAB NAV ── */}
      <div className="sticky top-[61px] z-10 bg-[#f5f5dc] border-b border-[#064e3b]/10 px-6 flex gap-1 overflow-x-auto">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-black whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-[#d4af37] text-[#064e3b]"
                  : "border-transparent text-[#064e3b]/40 hover:text-[#064e3b]/70"
              }`}>
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── MAIN SPLIT PANE ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* COLUMN 1: Data Form (Left) */}
        <div className="w-full md:w-[32%] lg:w-[28%] border-r border-[#064e3b]/10 overflow-y-auto p-4 space-y-4 bg-[#f5f5dc]">
          {/* Thumbnail & Deskripsi (always visible) */}
          <div className="p-3 bg-white rounded-2xl border border-[#064e3b]/10 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Info Template
            </p>
            <FileUploader value={thumbnail} onChange={setThumbnail} accept="image/*" type="image" label="Thumbnail (Gambar Cover Template)" />
            <textarea value={deskripsi} onChange={e => setDeskripsi(e.target.value)} placeholder="Deskripsi singkat template..." rows={2}
              className="w-full px-3 py-2 text-xs bg-[#f5f5dc] border border-[#064e3b]/20 rounded-xl outline-none focus:border-[#d4af37] text-[#064e3b] placeholder-[#064e3b]/30 resize-none" />
          </div>

          <div className="border-b border-[#064e3b]/10 pb-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#064e3b] opacity-80">1. PENGISIAN DATA FORM</p>
          </div>

          {/* Active Tab Form: DATA ONLY */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              {activeTab === "cover"   && <CoverForm   data={coverData}   onChange={setCoverData}   musicLibrary={musicLibrary} mode="data" />}
              {activeTab === "pembuka" && <PembukaForm data={pembukaData} onChange={setPembukaData} mode="data" />}
              {activeTab === "profil"  && <ProfilForm  data={profilData}  onChange={setProfilData} mode="data" />}
              {activeTab === "acara"   && <AcaraForm   data={acaraData}   onChange={setAcaraData} mode="data" />}
              {activeTab === "cerita"  && <CeritaForm  data={ceritaData}  onChange={setCeritaData} mode="data" />}
              {activeTab === "penutup" && <PenutupForm data={penutupData} onChange={setPenutupData} mode="data" />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* COLUMN 2: Styling & Settings Form (Middle) */}
        <div className="hidden md:block md:w-[34%] lg:w-[32%] border-r border-[#064e3b]/10 overflow-y-auto p-4 space-y-4 bg-[#f5f5dc]">
          <div className="border-b border-[#064e3b]/10 pb-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#d4af37]">2. PENGATURAN & TAMPILAN (STYLING)</p>
          </div>

          {/* Active Tab Form: SETTINGS/STYLING ONLY */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              {activeTab === "cover"   && <CoverForm   data={coverData}   onChange={setCoverData}   musicLibrary={musicLibrary} mode="settings" />}
              {activeTab === "pembuka" && <PembukaForm data={pembukaData} onChange={setPembukaData} mode="settings" />}
              {activeTab === "profil"  && <ProfilForm  data={profilData}  onChange={setProfilData} mode="settings" />}
              {activeTab === "acara"   && <AcaraForm   data={acaraData}   onChange={setAcaraData} mode="settings" />}
              {activeTab === "cerita"  && <CeritaForm  data={ceritaData}  onChange={setCeritaData} mode="settings" />}
              {activeTab === "penutup" && <PenutupForm data={penutupData} onChange={setPenutupData} mode="settings" />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* COLUMN 3: Live Preview HP (Centered inside its area) */}
        <div className="hidden md:flex flex-1 bg-[#064e3b]/5 items-start justify-center p-4 overflow-y-auto">
          <div className="w-[320px] sticky top-6">
            {/* Phone Frame */}
            <div className="relative bg-[#1a1a1a] rounded-[40px] p-3 shadow-2xl border-4 border-[#333]">
              {/* Screen */}
              <div className="rounded-[30px] overflow-y-auto bg-white animate-fade-in w-[288px] h-[512px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:none">
                <AnimatePresence mode="wait">
                  <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    {activeTab === "cover"   && <CoverPreview   data={coverData}   meta={{ kategori, bahasa }} />}
                    {activeTab === "pembuka" && <PembukaPreview data={pembukaData} coverData={coverData} bahasa={bahasa} />}
                    {activeTab === "profil"  && <ProfilPreview  data={profilData} />}
                    {activeTab === "acara"   && <AcaraPreview   data={acaraData} />}
                    {activeTab === "cerita"  && <CeritaPreview  data={ceritaData} />}
                    {activeTab === "penutup" && <PenutupPreview data={penutupData} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            {/* Label */}
            <p className="text-center text-[10px] font-black text-[#064e3b]/40 uppercase tracking-widest mt-4">Live Preview</p>
          </div>
        </div>
      </div>
    </div>
  );
}
