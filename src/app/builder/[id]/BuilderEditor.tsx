"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { saveInvitationPublic, createPaymentPublic } from "./actions";
import Script from "next/script";
import {
  Sparkles,
  ArrowLeft,
  Save,
  Eye,
  Loader2,
  Share2,
  Plus,
  Trash2,
  Music,
  MapPin,
  Calendar,
  Heart,
  Clock,
  Gift,
  Info,
  ChevronRight,
  ChevronLeft,
  Copy,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  User as UserIcon,
  MessageSquare,
  Lock,
  ExternalLink,
  Upload
} from "lucide-react";

type TemplateType = {
  id: string;
  nama_template: string;
  kategori: string;
  thumbnail: string;
  deskripsi: string | null;
  template_json: any;
  paket: "BASIC" | "PREMIUM" | "SULTAN" | "EXCLUSIVE";
};

type UserType = {
  id: string;
  name: string;
  email: string;
  nomor_hp: string | null;
};

type InvitationType = {
  id: string;
  slug: string;
  user_id: string;
  template_id: string;
  data_undangan_json: any;
  status: "DRAFT" | "ACTIVE" | "INACTIVE";
  user: UserType;
  template: TemplateType;
};

type MusicType = {
  id: string;
  judul: string;
  artis: string | null;
  audio_url: string;
  durasi: number | null;
};

export function BuilderEditor({
  invitation,
  musicList
}: {
  invitation: InvitationType;
  musicList: MusicType[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"DRAFT" | "ACTIVE" | "INACTIVE">(invitation.status);
  const [data, setData] = useState<any>(invitation.data_undangan_json || {});
  
  // Contacts/Default Info States
  const [contactName, setContactName] = useState(invitation.user.name || "");
  const [contactPhone, setContactPhone] = useState(invitation.user.nomor_hp || "");
  const [contactEmail, setContactEmail] = useState(invitation.user.email || "");
  const [invitationSlug, setInvitationSlug] = useState(invitation.slug || "");

  // Wizard Navigation
  const [activeStep, setActiveStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Manage view toggle: show editing form inside active screen
  const [showActiveEditForm, setShowActiveEditForm] = useState(false);

  // Checkout states
  const [selectedPackage, setSelectedPackage] = useState<"SILVER" | "GOLD" | "PLATINUM">("GOLD");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Guest Link Generator State
  const [guestNameInput, setGuestNameInput] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Map PaketTier to package names
  useEffect(() => {
    if (invitation.template.paket === "BASIC") {
      setSelectedPackage("SILVER");
    } else if (invitation.template.paket === "PREMIUM") {
      setSelectedPackage("GOLD");
    } else if (invitation.template.paket === "SULTAN" || invitation.template.paket === "EXCLUSIVE") {
      setSelectedPackage("PLATINUM");
    }
  }, [invitation.template.paket]);

  // Ensure JSON sections exist
  useEffect(() => {
    const updated = { ...data };
    let changed = false;

    if (!updated.cover) {
      updated.cover = { nama_acara: "", music_url: "", background: { type: "image", value: "" } };
      changed = true;
    }
    if (!updated.pembuka) {
      updated.pembuka = { ucapan: "", tanggal_acara: "", foto_pembuka: "" };
      changed = true;
    }
    if (!updated.profil) {
      updated.profil = { ucapan_profil: "", profils: [] };
      changed = true;
    }
    if (!updated.acara) {
      updated.acara = { acaras: [] };
      changed = true;
    }
    if (!updated.cerita) {
      updated.cerita = { ceritas: [], galeris: [] };
      changed = true;
    }
    if (!updated.penutup) {
      updated.penutup = { amplops: [], rsvp_aktif: true, ucapan_aktif: true, pesan_penutup: "", salam: "", tertanda: "" };
      changed = true;
    }

    // Initialize Profiles if empty based on category
    const isWedding = ["pernikahan", "lamaran & pertunangan", "resepsi pernikahan"].includes(
      invitation.template.kategori.toLowerCase()
    );
    const requiredProfileCount = isWedding ? 2 : 1;

    if (!updated.profil.profils || updated.profil.profils.length < requiredProfileCount) {
      const current = updated.profil.profils || [];
      const newProfiles = [...current];
      for (let i = current.length; i < requiredProfileCount; i++) {
        newProfiles.push({
          nama: "",
          nama_panggilan: "",
          keterangan: isWedding 
            ? (i === 0 ? "Putra dari Bpk. X & Ibu Y" : "Putri dari Bpk. A & Ibu B")
            : "Putra/i dari Bpk. X & Ibu Y",
          urutan_anak: "",
          foto: "",
          bingkai: "oval"
        });
      }
      updated.profil.profils = newProfiles;
      changed = true;
    }

    // Initialize Acaras if empty
    if (!updated.acara.acaras || updated.acara.acaras.length === 0) {
      updated.acara.acaras = [
        { nama: isWedding ? "Akad Nikah" : "Acara Utama", tanggal: "", jam_mulai: "08:00", jam_selesai: "10:00", alamat: "", link_maps: "", embed_maps: "" }
      ];
      if (isWedding) {
        updated.acara.acaras.push({
          nama: "Resepsi Pernikahan", tanggal: "", jam_mulai: "11:00", jam_selesai: "13:00", alamat: "", link_maps: "", embed_maps: ""
        });
      }
      changed = true;
    }

    if (changed) {
      setData(updated);
    }
  }, [data, invitation.template.kategori]);

  // Handle direct modifications in data structure
  const updateNestedVal = (section: string, key: string, val: any) => {
    setData((prev: any) => {
      const next = { ...prev };
      if (!next[section]) next[section] = {};
      next[section][key] = val;
      return next;
    });
  };

  const handleProfileChange = (idx: number, key: string, val: any) => {
    setData((prev: any) => {
      const next = { ...prev };
      if (!next.profil) next.profil = { profils: [] };
      if (!next.profil.profils) next.profil.profils = [];
      const list = [...next.profil.profils];
      if (list[idx]) {
        list[idx] = { ...list[idx], [key]: val };
      }
      next.profil.profils = list;
      return next;
    });
  };

  // Auto-generate Cover Nama Acara & Penutup Tertanda based on profiles nickname
  useEffect(() => {
    const profs = data?.profil?.profils || [];
    if (profs.length > 0) {
      const isWedding = ["pernikahan", "lamaran & pertunangan", "resepsi pernikahan"].includes(
        invitation.template.kategori.toLowerCase()
      );
      if (isWedding && profs[0] && profs[1]) {
        const nickname1 = profs[0].nama_panggilan || profs[0].nama || "";
        const nickname2 = profs[1].nama_panggilan || profs[1].nama || "";
        const combined = nickname1 && nickname2 ? `${nickname1} & ${nickname2}` : "";
        if (combined) {
          if (data?.cover?.nama_acara !== combined) {
            updateNestedVal("cover", "nama_acara", combined);
          }
          if (data?.penutup?.tertanda !== combined) {
            updateNestedVal("penutup", "tertanda", combined);
          }
        }
      } else if (profs[0]) {
        const nickname = profs[0].nama_panggilan || profs[0].nama || "";
        if (nickname) {
          if (data?.cover?.nama_acara !== nickname) {
            updateNestedVal("cover", "nama_acara", nickname);
          }
          if (data?.penutup?.tertanda !== nickname) {
            updateNestedVal("penutup", "tertanda", nickname);
          }
        }
      }
    }
  }, [data?.profil?.profils]);

  // Save to DB (Draft/Active state save action)
  const saveDraft = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    try {
      const res = await saveInvitationPublic(invitation.id, data, status);
      if (res?.error) {
        setSaveError(res.error);
      } else {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      setSaveError("Gagal terhubung ke server.");
    } finally {
      setSaving(false);
    }
  };

  // Image Upload handler
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const handleFileUpload = async (file: File, callback: (url: string) => void, fieldId: string) => {
    setUploadingField(fieldId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("invitationId", invitation.id);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const resJson = await res.json();
      if (resJson.error) {
        alert("Gagal upload: " + resJson.error);
      } else if (resJson.url) {
        callback(resJson.url);
      }
    } catch (err) {
      alert("Error uploading file.");
    } finally {
      setUploadingField(null);
    }
  };

  // checkout execution
  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      // Save draft first
      await saveInvitationPublic(invitation.id, data, status);

      const res = await createPaymentPublic(invitation.id, selectedPackage);
      if (res?.error) {
        setCheckoutError(res.error);
        setCheckoutLoading(false);
        return;
      }

      if (res?.token && (window as any).snap) {
        (window as any).snap.pay(res.token, {
          onSuccess: function (result: any) {
            setCheckoutSuccess(true);
            setCheckoutLoading(false);
            setTimeout(() => {
              window.location.reload();
            }, 1200);
          },
          onPending: function (result: any) {
            setCheckoutError("Menunggu pembayaran di Midtrans Snap...");
            setCheckoutLoading(false);
          },
          onError: function (result: any) {
            setCheckoutError("Pembayaran gagal. Silakan coba lagi.");
            setCheckoutLoading(false);
          },
          onClose: function () {
            setCheckoutError("Pembayaran dibatalkan oleh pengguna.");
            setCheckoutLoading(false);
          }
        });
      } else {
        setCheckoutError("Sistem pembayaran Midtrans Snap gagal dimuat. Coba refresh halaman.");
        setCheckoutLoading(false);
      }
    } catch (err) {
      console.error(err);
      setCheckoutError("Kesalahan sistem dalam memproses pembayaran.");
      setCheckoutLoading(false);
    }
  };

  const steps = [
    { name: "Informasi Dasar", icon: Info },
    { name: "Cover & Musik", icon: Music },
    { name: "Profil Pasangan / Tokoh", icon: Heart },
    { name: "Rangkaian Acara", icon: Calendar },
    { name: "Cerita & Galeri", icon: Sparkles },
    { name: "RSVP & Hadiah", icon: Gift },
    ...(status === "DRAFT" ? [{ name: "Aktivasi Pembayaran", icon: Lock }] : [])
  ];

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      saveDraft();
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  // Generated Link Calculations
  const getBaseUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}`;
    }
    return "";
  };
  const primaryInvitationUrl = `${getBaseUrl()}/${invitationSlug}`;
  const customGuestUrl = guestNameInput
    ? `${primaryInvitationUrl}?to=${encodeURIComponent(guestNameInput.trim())}`
    : primaryInvitationUrl;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getWhatsAppShareLink = () => {
    const textMessage = `Kepada Yth. ${guestNameInput || "Tamu Undangan"},\n\nTanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara kami.\n\nBerikut adalah link undangan digital kami:\n${customGuestUrl}\n\nMerupakan suatu kehormatan bagi kami jika Bapak/Ibu/Saudara/i berkenan hadir.\n\nTerima kasih.`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(textMessage)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fefcf6] text-[#064e3b] font-sans pb-16">
      {/* Midtrans Snap Scripts */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""}
        strategy="lazyOnload"
      />

      {/* TOP NAV BAR */}
      <header className="sticky top-0 bg-[#064e3b] text-white px-6 py-4 shadow-md flex items-center justify-between z-30 border-b border-[#d4af37]/20">
        <div className="flex items-center gap-3">
          <Link href="/templates" className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-widest text-[#d4af37]">ADATARA</span>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                {invitation.template.kategori}
              </span>
            </div>
            <p className="text-xs text-white/70">Mendesain: {invitation.template.nama_template}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Real-time Preview Link */}
          <a
            href={primaryInvitationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-all"
          >
            <Eye className="w-4 h-4" />
            Lihat Hasil
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>

          {/* Quick Save Draft */}
          <button
            onClick={saveDraft}
            disabled={saving}
            className="px-4 py-2 bg-[#d4af37] hover:bg-[#c49f27] text-white rounded-xl text-xs font-black border border-[#d4af37] flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Simpan Perubahan
          </button>
        </div>
      </header>

      {/* GLOBAL TOAST & NOTIFICATION */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#064e3b] text-[#f5f5dc] border border-[#d4af37] px-5 py-3 rounded-full flex items-center gap-2 shadow-2xl font-black text-xs"
          >
            <CheckCircle className="w-4.5 h-4.5 text-[#d4af37]" />
            Perubahan Anda Berhasil Disimpan!
          </motion.div>
        )}
        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-2xl flex items-center gap-2 shadow-2xl font-semibold text-xs"
          >
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            {saveError}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto w-full px-4 pt-6 flex-1 flex flex-col gap-6">

        {/* ACTIVE / PAID INVITATION PANEL */}
        {status === "ACTIVE" && (
          <div className="bg-white border-2 border-emerald-500/20 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-200 shadow-sm">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-emerald-800 flex items-center gap-1.5">
                    Undangan Anda Aktif! 🟢
                  </h2>
                  <p className="text-xs text-slate-500">Undangan online siap dibagikan kepada tamu undangan.</p>
                </div>
              </div>

              <button
                onClick={() => setShowActiveEditForm(!showActiveEditForm)}
                className="px-4 py-2 border border-[#064e3b]/20 hover:border-[#064e3b] text-[#064e3b] rounded-xl text-xs font-bold transition-all bg-white"
              >
                {showActiveEditForm ? "Tutup Form Editor" : "Ubah / Sunting Data Undangan"}
              </button>
            </div>

            {/* Link Generators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Primary Link card */}
              <div className="bg-[#fefcf6] border border-[#064e3b]/10 rounded-2xl p-4 space-y-2">
                <span className="text-[10px] font-black uppercase text-[#d4af37] tracking-wider block">Link Undangan Utama</span>
                <p className="text-xs font-black text-[#064e3b] truncate select-all">{primaryInvitationUrl}</p>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => copyToClipboard(primaryInvitationUrl)}
                    className="flex-1 py-2 bg-[#064e3b] hover:bg-[#064e3b]/95 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Salin Link Utama
                  </button>
                  <a
                    href={primaryInvitationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 border border-[#064e3b]/20 hover:border-[#064e3b] text-[#064e3b] rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all bg-white"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Buka Undangan
                  </a>
                </div>
              </div>

              {/* Guest Customized Link card */}
              <div className="bg-white border border-[#064e3b]/10 rounded-2xl p-4 space-y-3">
                <span className="text-[10px] font-black uppercase text-[#d4af37] tracking-wider block">Generator Undangan Tamu</span>
                
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-[#064e3b]/40" />
                  <input
                    type="text"
                    value={guestNameInput}
                    onChange={(e) => setGuestNameInput(e.target.value)}
                    placeholder="Masukkan Nama Tamu (misal: Budi & Istri)"
                    className="w-full pl-9 pr-4 py-2 bg-[#f5f5dc]/20 border border-[#064e3b]/10 focus:border-[#d4af37] rounded-xl text-xs text-[#064e3b] outline-none"
                  />
                </div>

                <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] truncate">
                  <span className="text-slate-400 font-semibold block">Generated Link:</span>
                  <span className="font-mono text-slate-700">{customGuestUrl}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(customGuestUrl)}
                    className="flex-1 py-2 bg-white border border-[#064e3b]/20 hover:border-[#064e3b] text-[#064e3b] rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedLink ? "Tersalin!" : "Salin Link"}
                  </button>
                  <a
                    href={getWhatsAppShareLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-[#25d366] hover:bg-[#20ba5a] text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Share WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INVITATION EDIT WIZARD OR FORM (Shown if draft or if edit toggle is clicked) */}
        {(status === "DRAFT" || showActiveEditForm) && (
          <div className="bg-white border border-[#064e3b]/10 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            
            {/* LEFT BAR STEPS LIST */}
            <div className="w-full md:w-64 bg-[#064e3b]/5 border-r border-[#064e3b]/10 p-4 space-y-1">
              <div className="px-3 py-2 border-b border-[#064e3b]/10 mb-2">
                <span className="text-[10px] font-black uppercase text-[#d4af37] tracking-widest block">Langkah Pengerjaan</span>
                <span className="text-xs font-bold text-[#064e3b]">Lengkapi & Aktifkan</span>
              </div>
              {steps.map((st, idx) => {
                const Icon = st.icon;
                return (
                  <button
                    key={st.name}
                    onClick={() => setActiveStep(idx)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                      activeStep === idx
                        ? "bg-[#064e3b] text-[#f5f5dc] border-[#d4af37]"
                        : "hover:bg-[#064e3b]/5 text-[#064e3b]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${activeStep === idx ? "text-[#d4af37]" : "opacity-60"}`} />
                    <span>{st.name}</span>
                  </button>
                );
              })}
            </div>

            {/* RIGHT SIDE WIZARD STEP FORMS */}
            <div className="flex-1 p-6 sm:p-8 space-y-6">
              
              {/* STEP 1: INFORMASI DASAR */}
              {activeStep === 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-black text-[#064e3b] flex items-center gap-2">
                      <Info className="w-5 h-5 text-[#d4af37]" />
                      Informasi Pembuat & Tautan
                    </h3>
                    <p className="text-xs text-slate-500">Data pemilik undangan dan link slug kustom.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5">Nama Pembuat</label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5">WhatsApp Pembuat</label>
                      <input
                        type="text"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5">Alamat Email</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider mb-1.5">Tautan Kustom (Slug URL)</label>
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
                        <span className="opacity-50 font-semibold">adatara.id/</span>
                        <input
                          type="text"
                          value={invitationSlug}
                          onChange={(e) => setInvitationSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                          className="bg-transparent border-none outline-none font-bold text-[#064e3b] flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: COVER & MUSIK */}
              {activeStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-black text-[#064e3b] flex items-center gap-2">
                      <Music className="w-5 h-5 text-[#d4af37]" />
                      Cover Undangan & Musik Latar
                    </h3>
                    <p className="text-xs text-slate-500">Unggah cover vertical 9:16 dan pilih audio background.</p>
                  </div>

                  {/* Cover Background File Upload */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-wider">Foto Cover Utama (Aspek Rasio 9:16)</label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {data?.cover?.background?.value ? (
                        <div className="w-24 h-40 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group shrink-0">
                          <img
                            src={data.cover.background.value}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => updateNestedVal("cover", "background", { type: "image", value: "" })}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-black transition-all cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      ) : (
                        <label className="w-full sm:w-64 h-40 border-2 border-dashed border-[#064e3b]/20 hover:border-[#d4af37] rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-[#064e3b]/5 text-center p-4">
                          <Upload className="w-8 h-8 text-[#064e3b]/40" />
                          <span className="text-xs font-bold text-[#064e3b]">Pilih / Seret Foto Cover (9:16)</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                handleFileUpload(f, (url) => {
                                  updateNestedVal("cover", "background", { type: "image", value: url });
                                }, "cover-bg");
                              }
                            }}
                          />
                        </label>
                      )}

                      <div className="text-xs text-slate-500 space-y-1">
                        <p className="font-bold text-[#064e3b]">Rekomendasi Foto:</p>
                        <p>• Gunakan orientasi tegak (portrait) aspek rasio 9:16</p>
                        <p>• Format berkas JPEG, PNG, atau WEBP maks 5MB</p>
                        {uploadingField === "cover-bg" && (
                          <div className="text-[#d4af37] font-black flex items-center gap-1.5 pt-2">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Mengunggah foto cover...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                   {/* Background Music Selector */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Pilih Musik Latar</label>
                      <p className="text-[11px] text-slate-500">Masukkan tautan video atau lagu dari YouTube sebagai musik latar undangan Anda.</p>
                    </div>

                    <div className="max-w-md">
                      <label className="block text-[9px] font-bold text-slate-400 mb-1">Lagu YouTube (Masukkan URL)</label>
                      <input
                        type="text"
                        value={data?.cover?.music_url?.includes("youtube") ? data.cover.music_url : ""}
                        onChange={(e) => {
                          const url = e.target.value.trim();
                          if (url) {
                            setData((prev: any) => ({
                              ...prev,
                              cover: {
                                ...prev.cover,
                                music_url: url,
                                music_title: "Musik Kustom YouTube",
                                music_artist: "YouTube Video"
                              }
                            }));
                          } else {
                            updateNestedVal("cover", "music_url", "");
                          }
                        }}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PROFIL PASANGAN / TOKOH */}
              {activeStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-black text-[#064e3b] flex items-center gap-2">
                      <Heart className="w-5 h-5 text-[#d4af37]" />
                      Profil Pasangan / Tokoh Utama
                    </h3>
                    <p className="text-xs text-slate-500">Tentukan kutipan profil, nama lengkap, foto formal 3:4, dan keterangan keluarga.</p>
                  </div>

                  {/* Dynamic Profile Fields */}
                  <div className="space-y-6">
                    {(data?.profil?.profils || []).map((p: any, idx: number) => {
                      const isWedding = ["pernikahan", "lamaran & pertunangan", "resepsi pernikahan"].includes(
                        invitation.template.kategori.toLowerCase()
                      );
                      const profileRoleLabel = isWedding 
                        ? (idx === 0 ? "Pria (Mempelai Laki-laki)" : "Wanita (Mempelai Perempuan)")
                        : "Profil Utama / Tokoh";

                      return (
                        <div key={idx} className="bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-2xl p-4 sm:p-5 space-y-4">
                          <span className="text-[10px] font-black uppercase text-[#d4af37] tracking-widest block">
                            {profileRoleLabel}
                          </span>

                          <div className="flex flex-col sm:flex-row gap-4 items-start">
                            {/* Profile Image 3:4 */}
                            <div className="flex flex-col items-center gap-2 shrink-0">
                              {p.foto ? (
                                <div className="w-20 h-28 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm relative group">
                                  <img
                                    src={p.foto}
                                    alt="Foto profil preview"
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleProfileChange(idx, "foto", "")}
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold cursor-pointer"
                                  >
                                    Hapus
                                  </button>
                                </div>
                              ) : (
                                <label className="w-20 h-28 border-2 border-dashed border-[#064e3b]/20 hover:border-[#d4af37] rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all bg-white text-center">
                                  <Upload className="w-5 h-5 text-[#064e3b]/40" />
                                  <span className="text-[8px] font-bold text-slate-400">Upload 3:4</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const f = e.target.files?.[0];
                                      if (f) {
                                        handleFileUpload(f, (url) => {
                                          handleProfileChange(idx, "foto", url);
                                        }, `profile-${idx}`);
                                      }
                                    }}
                                  />
                                </label>
                              )}
                              {uploadingField === `profile-${idx}` && (
                                <span className="text-[9px] text-[#d4af37] font-bold animate-pulse">Uploading...</span>
                              )}
                            </div>

                            {/* Text inputs */}
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                              <div>
                                <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Nama Lengkap</label>
                                <input
                                  type="text"
                                  value={p.nama || ""}
                                  onChange={(e) => handleProfileChange(idx, "nama", e.target.value)}
                                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#d4af37]"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Nama Panggilan</label>
                                <input
                                  type="text"
                                  value={p.nama_panggilan || ""}
                                  onChange={(e) => handleProfileChange(idx, "nama_panggilan", e.target.value)}
                                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#d4af37]"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Keterangan (Putra/i dari Bpk & Ibu)</label>
                                <input
                                  type="text"
                                  value={p.keterangan || ""}
                                  onChange={(e) => handleProfileChange(idx, "keterangan", e.target.value)}
                                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#d4af37]"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Urutan Anak (contoh: Putra Pertama)</label>
                                <input
                                  type="text"
                                  value={p.urutan_anak || ""}
                                  onChange={(e) => handleProfileChange(idx, "urutan_anak", e.target.value)}
                                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#d4af37]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: RANGKAIAN ACARA */}
              {activeStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-black text-[#064e3b] flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#d4af37]" />
                      Rangkaian Acara Undangan
                    </h3>
                    <p className="text-xs text-slate-500">Kelola detail rangkaian acara seperti Akad Nikah, Resepsi, Pemberkatan, dll.</p>
                  </div>

                  <div className="space-y-6">
                    {(data?.acara?.acaras || []).map((a: any, idx: number) => (
                      <div key={idx} className="border border-slate-200 rounded-2xl p-4 sm:p-5 relative bg-white space-y-4">
                        <button
                          type="button"
                          onClick={() => {
                            const list = [...(data?.acara?.acaras || [])];
                            updateNestedVal("acara", "acaras", list.filter((_, i) => i !== idx));
                          }}
                          className="absolute top-4 right-4 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>

                        <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-2">
                          <Clock className="w-4 h-4 text-[#d4af37]" />
                          <span className="text-xs font-black uppercase text-[#064e3b]">Rangkaian Acara #{idx + 1}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-3">
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Nama Acara</label>
                            <input
                              type="text"
                              value={a.nama || ""}
                              onChange={(e) => {
                                const list = [...(data?.acara?.acaras || [])];
                                list[idx] = { ...list[idx], nama: e.target.value };
                                updateNestedVal("acara", "acaras", list);
                              }}
                              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#d4af37]"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Tanggal Acara</label>
                            <input
                              type="date"
                              value={a.tanggal || ""}
                              onChange={(e) => {
                                const list = [...(data?.acara?.acaras || [])];
                                list[idx] = { ...list[idx], tanggal: e.target.value };
                                updateNestedVal("acara", "acaras", list);
                              }}
                              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#d4af37]"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Jam Mulai</label>
                            <input
                              type="time"
                              value={a.jam_mulai || ""}
                              onChange={(e) => {
                                const list = [...(data?.acara?.acaras || [])];
                                list[idx] = { ...list[idx], jam_mulai: e.target.value };
                                updateNestedVal("acara", "acaras", list);
                              }}
                              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#d4af37]"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Jam Selesai</label>
                            <input
                              type="time"
                              value={a.jam_selesai || ""}
                              onChange={(e) => {
                                const list = [...(data?.acara?.acaras || [])];
                                list[idx] = { ...list[idx], jam_selesai: e.target.value };
                                updateNestedVal("acara", "acaras", list);
                              }}
                              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#d4af37]"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Alamat Lengkap Venue</label>
                            <textarea
                              rows={2}
                              value={a.alamat || ""}
                              onChange={(e) => {
                                const list = [...(data?.acara?.acaras || [])];
                                list[idx] = { ...list[idx], alamat: e.target.value };
                                updateNestedVal("acara", "acaras", list);
                              }}
                              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#d4af37]"
                            />
                          </div>

                          <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Link Share Google Maps (Optional)</label>
                              <input
                                type="text"
                                value={a.link_maps || ""}
                                onChange={(e) => {
                                  const list = [...(data?.acara?.acaras || [])];
                                  list[idx] = { ...list[idx], link_maps: e.target.value };
                                  updateNestedVal("acara", "acaras", list);
                                }}
                                placeholder="https://maps.google.com/..."
                                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#d4af37]"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Embed Iframe Link Maps (Optional)</label>
                              <input
                                type="text"
                                value={a.embed_maps || ""}
                                onChange={(e) => {
                                  const list = [...(data?.acara?.acaras || [])];
                                  list[idx] = { ...list[idx], embed_maps: e.target.value };
                                  updateNestedVal("acara", "acaras", list);
                                }}
                                placeholder="https://www.google.com/maps/embed?pb=..."
                                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#d4af37]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        const list = [...(data?.acara?.acaras || [])];
                        list.push({
                          nama: "Acara Tambahan", tanggal: "", jam_mulai: "19:00", jam_selesai: "21:00", alamat: "", link_maps: "", embed_maps: ""
                        });
                        updateNestedVal("acara", "acaras", list);
                      }}
                      className="w-full py-3 border-2 border-dashed border-[#064e3b]/20 hover:border-[#d4af37] text-[#064e3b] hover:text-[#d4af37] rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition-all bg-[#064e3b]/5"
                    >
                      <Plus className="w-4 h-4" />
                      Tambah Rangkaian Acara Baru
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: CERITA & GALERI */}
              {activeStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-black text-[#064e3b] flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#d4af37]" />
                      Cerita Kisah Cinta & Galeri Foto
                    </h3>
                    <p className="text-xs text-slate-500">Menceritakan timeline kenalan/perjalanan cinta, dan membagikan foto-foto mesra.</p>
                  </div>

                  {/* Stories list */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-[#d4af37] tracking-wider block">Timeline Cerita Kita</span>
                    
                    {(data?.cerita?.ceritas || []).map((c: any, idx: number) => (
                      <div key={idx} className="p-4 border border-slate-200 rounded-xl relative space-y-3 bg-slate-50/50">
                        <button
                          type="button"
                          onClick={() => {
                            const list = [...(data?.cerita?.ceritas || [])];
                            updateNestedVal("cerita", "ceritas", list.filter((_, i) => i !== idx));
                          }}
                          className="absolute top-3 right-3 p-1 text-red-400 hover:text-red-600 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">Judul Cerita</label>
                            <input
                              type="text"
                              value={c.judul || ""}
                              onChange={(e) => {
                                const list = [...(data?.cerita?.ceritas || [])];
                                list[idx] = { ...list[idx], judul: e.target.value };
                                updateNestedVal("cerita", "ceritas", list);
                              }}
                              className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#d4af37]"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">Waktu / Tanggal (contoh: Januari 2024)</label>
                            <input
                              type="text"
                              value={c.waktu || ""}
                              onChange={(e) => {
                                const list = [...(data?.cerita?.ceritas || [])];
                                list[idx] = { ...list[idx], waktu: e.target.value };
                                updateNestedVal("cerita", "ceritas", list);
                              }}
                              className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#d4af37]"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">Kisah Cerita</label>
                            <textarea
                              rows={2}
                              value={c.isi || ""}
                              onChange={(e) => {
                                const list = [...(data?.cerita?.ceritas || [])];
                                list[idx] = { ...list[idx], isi: e.target.value };
                                updateNestedVal("cerita", "ceritas", list);
                              }}
                              className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#d4af37]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        const list = [...(data?.cerita?.ceritas || [])];
                        list.push({ judul: "", waktu: "", isi: "" });
                        updateNestedVal("cerita", "ceritas", list);
                      }}
                      className="w-full py-2 border border-dashed border-[#064e3b]/25 rounded-xl text-xs font-bold text-[#064e3b]/70 hover:border-[#d4af37] flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Tambah Cerita Baru
                    </button>
                  </div>

                  {/* Album Galleries */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-black uppercase text-[#d4af37] tracking-wider block">Album Foto Undangan</span>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(data?.cerita?.galeris || []).map((imgUrl: string, idx: number) => (
                        <div key={idx} className="aspect-square bg-slate-100 border border-slate-200 rounded-xl overflow-hidden relative group shadow-sm">
                          <img
                            src={imgUrl}
                            alt="Galeri item"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...(data?.cerita?.galeris || [])];
                              updateNestedVal("cerita", "galeris", list.filter((_, i) => i !== idx));
                            }}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-black transition-all cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      ))}

                      {/* Photo Uploader Box */}
                      <label className="aspect-square border-2 border-dashed border-[#064e3b]/20 hover:border-[#d4af37] bg-[#064e3b]/5 text-[#064e3b] rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all text-center p-2">
                        <Upload className="w-6 h-6 text-[#064e3b]/40" />
                        <span className="text-[10px] font-bold">Tambah Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              handleFileUpload(f, (url) => {
                                const list = [...(data?.cerita?.galeris || [])];
                                list.push(url);
                                updateNestedVal("cerita", "galeris", list);
                              }, "gallery-add");
                            }
                          }}
                        />
                      </label>
                    </div>

                    {uploadingField === "gallery-add" && (
                      <p className="text-xs text-[#d4af37] font-black animate-pulse flex items-center gap-1.5">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sedang mengunggah foto ke galeri...
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 6: RSVP & HADIAH */}
              {activeStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-black text-[#064e3b] flex items-center gap-2">
                      <Gift className="w-5 h-5 text-[#d4af37]" />
                      RSVP, Amplop Digital & Penutup
                    </h3>
                    <p className="text-xs text-slate-500">Konfirmasi kehadiran tamu, kado digital (amplop bank/e-wallet), dan kalimat salam penutup.</p>
                  </div>

                  {/* Switch RSVP & Ucapan */}
                  <div className="flex flex-wrap gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!data?.penutup?.rsvp_aktif}
                        onChange={(e) => updateNestedVal("penutup", "rsvp_aktif", e.target.checked)}
                        className="w-4.5 h-4.5 accent-[#064e3b] cursor-pointer"
                      />
                      <span className="text-xs font-bold">Aktifkan RSVP (Konfirmasi Kehadiran)</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!data?.penutup?.ucapan_aktif}
                        onChange={(e) => updateNestedVal("penutup", "ucapan_aktif", e.target.checked)}
                        className="w-4.5 h-4.5 accent-[#064e3b] cursor-pointer"
                      />
                      <span className="text-xs font-bold">Aktifkan Kolom Doa & Ucapan Tamu</span>
                    </label>
                  </div>

                  {/* Amplop / Bank Digital */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-[#d4af37] tracking-wider block">Special Gift (Amplop Digital)</span>
                    
                    {(data?.penutup?.amplops || []).map((a: any, idx: number) => (
                      <div key={idx} className="p-3.5 border border-slate-200 rounded-xl relative bg-white grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const list = [...(data?.penutup?.amplops || [])];
                            updateNestedVal("penutup", "amplops", list.filter((_, i) => i !== idx));
                          }}
                          className="absolute -top-2.5 -right-2.5 p-1 bg-red-50 hover:bg-red-100 text-red-500 rounded-full border border-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div>
                          <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">Nama Bank / E-Wallet</label>
                          <input
                            type="text"
                            value={a.bank || ""}
                            onChange={(e) => {
                              const list = [...(data?.penutup?.amplops || [])];
                              list[idx] = { ...list[idx], bank: e.target.value };
                              updateNestedVal("penutup", "amplops", list);
                            }}
                            placeholder="contoh: BCA / Mandiri / GoPay"
                            className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#d4af37]"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">Nomor Rekening</label>
                          <input
                            type="text"
                            value={a.nomor_rekening || ""}
                            onChange={(e) => {
                              const list = [...(data?.penutup?.amplops || [])];
                              list[idx] = { ...list[idx], nomor_rekening: e.target.value };
                              updateNestedVal("penutup", "amplops", list);
                            }}
                            placeholder="1234567890"
                            className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#d4af37]"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black uppercase text-slate-400 mb-1">Nama Pemilik Rekening</label>
                          <input
                            type="text"
                            value={a.atas_nama || ""}
                            onChange={(e) => {
                              const list = [...(data?.penutup?.amplops || [])];
                              list[idx] = { ...list[idx], atas_nama: e.target.value };
                              updateNestedVal("penutup", "amplops", list);
                            }}
                            placeholder="Atas Nama"
                            className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#d4af37]"
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        const list = [...(data?.penutup?.amplops || [])];
                        list.push({ bank: "", nomor_rekening: "", atas_nama: "" });
                        updateNestedVal("penutup", "amplops", list);
                      }}
                      className="w-full py-2 border border-dashed border-[#064e3b]/25 rounded-xl text-xs font-bold text-[#064e3b]/70 hover:border-[#d4af37] flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Tambah Rekening Hadiah Baru
                    </button>
                  </div>

                  {/* Closing Messages */}
                  <div className="grid grid-cols-1 gap-3 pt-4 border-t border-slate-100">
                    <div>
                      <label className="block text-[9px] font-black uppercase text-[#064e3b] mb-1">Pesan Penutup</label>
                      <textarea
                        rows={2}
                        value={data?.penutup?.pesan_penutup || ""}
                        onChange={(e) => updateNestedVal("penutup", "pesan_penutup", e.target.value)}
                        placeholder="Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-[#064e3b] mb-1">Salam Penutup</label>
                      <input
                        type="text"
                        value={data?.penutup?.salam || ""}
                        onChange={(e) => updateNestedVal("penutup", "salam", e.target.value)}
                        placeholder="Wassalamu'alaikum Warahmatullahi Wabarakatuh"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#d4af37]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-[#064e3b] mb-1">Nama Pembuat / Yang Mengundang (Tertanda)</label>
                      <input
                        type="text"
                        value={data?.penutup?.tertanda || ""}
                        onChange={(e) => updateNestedVal("penutup", "tertanda", e.target.value)}
                        placeholder="Keluarga Besar Bpk. X & Keluarga Besar Bpk. Y"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: AKTIVASI PEMBAYARAN */}
              {activeStep === 6 && status === "DRAFT" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-black text-[#064e3b] flex items-center gap-2">
                      <Lock className="w-5 h-5 text-[#d4af37]" />
                      Aktivasi & Pembayaran Undangan
                    </h3>
                    <p className="text-xs text-slate-500">Selesaikan aktivasi agar undangan online Anda aktif selamanya dan bisa dikirim ke tamu.</p>
                  </div>

                  {/* Selected Package display */}
                  <div className="p-6 bg-[#064e3b] border-2 border-[#d4af37] text-white rounded-3xl space-y-4 shadow-xl">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#d4af37] bg-white/10 px-3 py-1 rounded-full border border-white/10">
                      Rencana Paket Template Pilihan
                    </span>
                    <div>
                      <h4 className="text-2xl font-black text-[#d4af37]">
                        Paket {selectedPackage}
                      </h4>
                      <p className="text-xs text-white/70 mt-1">Menggunakan template: {invitation.template.nama_template}</p>
                    </div>

                    <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] opacity-75 uppercase block font-semibold">Total Biaya Aktivasi:</span>
                        <span className="text-2xl font-black text-white">
                          {selectedPackage === "SILVER" ? "Rp 49.000" : selectedPackage === "GOLD" ? "Rp 99.000" : "Rp 149.000"}
                        </span>
                      </div>

                      <button
                        onClick={handleCheckout}
                        disabled={checkoutLoading}
                        className="px-6 py-3 bg-[#d4af37] hover:bg-[#c49f27] text-[#064e3b] hover:text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-black/10 disabled:opacity-50"
                      >
                        {checkoutLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Menghubungi Payment Gateway...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 animate-pulse" />
                            Bayar & Aktifkan Sekarang
                          </>
                        )}
                      </button>
                    </div>

                    {checkoutError && (
                      <div className="bg-red-500/20 border border-red-500/40 text-red-100 p-3.5 rounded-xl text-xs flex items-start gap-2">
                        <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                        <span>{checkoutError}</span>
                      </div>
                    )}

                    {checkoutSuccess && (
                      <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-100 p-3.5 rounded-xl text-xs flex items-start gap-2 font-black animate-pulse">
                        <CheckCircle className="w-4.5 h-4.5 shrink-0" />
                        <span>Pembayaran Berhasil! Mengaktifkan undangan...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* BOTTOM NAVIGATION ACTION BAR */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={activeStep === 0}
                  className="px-4 py-2 border border-[#064e3b]/20 hover:border-[#064e3b] text-[#064e3b] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all bg-white disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Sebelumnya
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={saveDraft}
                    disabled={saving}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#064e3b] rounded-xl text-xs font-bold transition-all border border-slate-200"
                  >
                    Simpan Draf
                  </button>

                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={activeStep === steps.length - 1}
                    className="px-5 py-2 bg-[#064e3b] hover:bg-[#064e3b]/95 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Selanjutnya
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
