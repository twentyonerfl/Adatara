"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveInvitation } from "../actions";
import {
  Sparkles,
  ArrowLeft,
  Save,
  Eye,
  Loader2,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  Share2,
  Type,
  Paintbrush,
  Compass,
  Activity,
  Plus,
  Trash2,
  Music,
  MapPin,
  Calendar,
  Heart,
  PlusCircle,
  Clock,
  Gift,
  HelpCircle,
  Info,
  ChevronRight,
  User as UserIcon,
  MessageSquare,
  Copy,
  ChevronDown
} from "lucide-react";
import { FramedPhoto, PhotoStyleWidget } from "../../templates/BuilderWidgets";

type TemplateType = {
  id: string;
  nama_template: string;
  kategori: string;
  thumbnail: string;
  deskripsi: string | null;
  template_json: any;
};

type InvitationType = {
  id: string;
  slug: string;
  user_id: string;
  template_id: string;
  data_undangan_json: any;
  status: "DRAFT" | "ACTIVE" | "INACTIVE";
};

type MusicType = {
  id: string;
  judul: string;
  artis: string | null;
  audio_url: string;
  durasi: number | null;
};

// --- PRESETS FOR CULTURAL ORNAMENTS ---
const culturalOrnaments = [
  {
    id: "pucuk-rebung",
    name: "Pucuk Rebung",
    svg: (
      <svg className="w-full h-8 text-current" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 20L15 5L20 20M30 20L35 5L40 20M50 20L55 5L60 20M70 20L75 5L80 20M90 20L95 5L100 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 20L15 10L25 20M25 20L35 10L45 20M45 20L55 10L65 20M65 20L75 10L85 20M85 20L95 10L105 20" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    )
  },
  {
    id: "pintu-aceh",
    name: "Pintu Aceh",
    svg: (
      <svg className="w-full h-8 text-current" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 2C40 2 38 12 38 20H62C62 12 60 2 50 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="50" cy="9" r="3" stroke="currentColor" strokeWidth="1" />
        <path d="M44 20C44 16 46 14 50 14C54 14 56 16 56 20" stroke="currentColor" strokeWidth="1" />
        <path d="M20 20C25 15 35 15 40 20M60 20C65 15 75 15 80 20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: "gorga-batak",
    name: "Gorga Batak",
    svg: (
      <svg className="w-full h-8 text-current" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 10C10 2 20 18 30 10C40 2 50 18 60 10C70 2 80 18 90 10C95 6 98 10 100 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M0 15C5 15 8 11 12 8C16 5 22 5 26 9C30 13 36 13 40 9C44 5 50 5 54 9C58 13 64 13 68 9C72 5 78 5 82 9C86 13 92 13 96 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <circle cx="42" cy="12" r="1.5" fill="currentColor" />
        <circle cx="72" cy="12" r="1.5" fill="currentColor" />
      </svg>
    )
  },
  {
    id: "mandalika",
    name: "Mandalika",
    svg: (
      <svg className="w-full h-8 text-current" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="50" cy="10" r="4" stroke="currentColor" strokeWidth="1" />
        <path d="M50 0V20M40 10H60M43 3L57 17M43 17L57 3" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="20" cy="10" r="5" stroke="currentColor" strokeWidth="1" />
        <circle cx="80" cy="10" r="5" stroke="currentColor" strokeWidth="1" />
      </svg>
    )
  }
];

// --- PRESETS FOR INDONESIAN MOTIFS ---
const indonesianMotifs = [
  {
    id: "mega-mendung",
    name: "Mega Mendung",
    region: "CIREBON STYLE",
    svg: (
      <svg className="w-8 h-8 text-[#064e3b]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 18C4 15 7 13 10 14C12 11 16 11 18 13C21 10 26 11 28 14C29 16 29 19 27 21C25 23 21 23 19 21C17 23 13 23 11 21C8 23 5 22 4 18Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 18C8 16 10 15 12 16C13 14 16 14 17 15C19 13 22 14 23 16" stroke="currentColor" strokeWidth="1" />
      </svg>
    )
  },
  {
    id: "parang-rusak",
    name: "Parang Rusak",
    region: "CENTRAL JAVA",
    svg: (
      <svg className="w-8 h-8 text-[#064e3b]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 26L26 6M10 28L28 10M4 22L22 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M9 13C7 15 7 18 9 20C11 22 14 22 16 20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M17 5C15 7 15 10 17 12C19 14 22 14 24 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: "kawung",
    name: "Kawung",
    region: "YOGYAKARTA",
    svg: (
      <svg className="w-8 h-8 text-[#064e3b]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1" />
        <path d="M16 6C12 10 12 22 16 26" stroke="currentColor" strokeWidth="1.2" />
        <path d="M16 6C20 10 20 22 16 26" stroke="currentColor" strokeWidth="1.2" />
        <path d="M6 16C10 12 22 12 26 16" stroke="currentColor" strokeWidth="1.2" />
        <path d="M6 16C10 20 22 20 26 16" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="16" cy="16" r="1.5" fill="currentColor" />
      </svg>
    )
  },
  {
    id: "sido-mukti",
    name: "Sido Mukti",
    region: "SOLO STYLE",
    svg: (
      <svg className="w-8 h-8 text-[#064e3b]" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="6" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 16H26M16 6V26" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M10 12L16 16L22 12M10 20L16 16L22 20" stroke="currentColor" strokeWidth="1" />
      </svg>
    )
  }
];

function getFontStyles(val?: any) {
  if (!val) return {};
  const styles: React.CSSProperties = {
    fontFamily: val.family,
    color: val.color,
    fontSize: val.size,
  };

  if (val.position === "custom") {
    styles.position = "absolute";
    styles.left = `${val.x ?? 50}%`;
    styles.top = `${val.y ?? 50}%`;
    styles.transform = "translate(-50%, -50%)";
    styles.whiteSpace = "nowrap";
  } else if (val.position) {
    styles.textAlign = val.position as any;
  }
  return styles;
}

function getTargetDateTime(tanggal: string, jamStr?: string) {
  if (!tanggal) return "";
  let timeStr = "00:00";
  if (jamStr) {
    const match = jamStr.match(/(\d{2})[.:](\d{2})/);
    if (match) {
      timeStr = `${match[1]}:${match[2]}`;
    }
  }
  return `${tanggal}T${timeStr}`;
}

function getMapsEmbedUrl(input?: string) {
  if (!input) return "";
  if (input.includes("iframe")) {
    const match = input.match(/src="([^"]+)"/);
    return match ? match[1] : "";
  }
  return input;
}

function Countdown({ targetDateStr }: { targetDateStr: string }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!targetDateStr || !isMounted) return;
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDateStr) - +new Date();
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateStr, isMounted]);

  if (!isMounted || !timeLeft) {
    return (
      <div className="grid grid-cols-4 gap-2 text-center max-w-xs mx-auto mt-2">
        {["Hari", "Jam", "Menit", "Detik"].map((label) => (
          <div key={label} className="bg-white/80 backdrop-blur-sm rounded-xl p-1.5 border border-[#064e3b]/10">
            <div className="text-sm font-black text-[#064e3b]">00</div>
            <div className="text-[7px] font-bold uppercase tracking-wider text-[#d4af37]">{label}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 text-center max-w-xs mx-auto mt-2">
      {Object.entries(timeLeft).map(([label, value]) => {
        const labelMap: Record<string, string> = {
          days: "Hari",
          hours: "Jam",
          minutes: "Menit",
          seconds: "Detik"
        };
        const padValue = String(value).padStart(2, "0");
        return (
          <div key={label} className="bg-white/80 backdrop-blur-sm rounded-xl p-1.5 border border-[#064e3b]/10">
            <div className="text-sm font-black text-[#064e3b]">{padValue}</div>
            <div className="text-[7px] font-bold uppercase tracking-wider text-[#d4af37]">{labelMap[label]}</div>
          </div>
        );
      })}
    </div>
  );
}

export function BuilderEditor({
  invitation,
  musicList
}: {
  invitation: InvitationType & { template: TemplateType };
  musicList: MusicType[];
}) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"cover" | "pembuka" | "profil" | "acara" | "cerita" | "penutup">("cover");
  const [status, setStatus] = useState<"DRAFT" | "ACTIVE" | "INACTIVE">(invitation.status);
  const [data, setData] = useState<any>(invitation.data_undangan_json);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Left sidebar active tab
  const [leftTab, setLeftTab] = useState<"components" | "layers" | "assets">("components");

  // Right sidebar properties active tab
  const [rightPanelTab, setRightPanelTab] = useState<"typography" | "appearance" | "ornaments" | "animations">("typography");

  // Phone preview zoom/frame settings
  const [viewportMode, setViewportMode] = useState<"mobile" | "tablet" | "desktop">("mobile");

  // Temporary Inputs
  const [tempProfileName, setTempProfileName] = useState("");
  const [tempProfileDesc, setTempProfileDesc] = useState("");
  const [tempProfileUrutan, setTempProfileUrutan] = useState("");
  const [tempProfileFoto, setTempProfileFoto] = useState("");
  const [tempProfileBingkai, setTempProfileBingkai] = useState("oval");
  const [activeProfileEditIdx, setActiveProfileEditIdx] = useState<number | null>(null);

  const [tempEventName, setTempEventName] = useState("");
  const [tempEventDate, setTempEventDate] = useState("");
  const [tempEventTime, setTempEventTime] = useState("");
  const [tempEventTimeEnd, setTempEventTimeEnd] = useState("");
  const [tempEventIsSelesaiCustom, setTempEventIsSelesaiCustom] = useState(false);
  const [tempEventTimeEndCustom, setTempEventTimeEndCustom] = useState("Selesai");
  const [tempEventAddress, setTempEventAddress] = useState("");
  const [tempEventMaps, setTempEventMaps] = useState("");
  const [tempEventEmbedMaps, setTempEventEmbedMaps] = useState("");
  const [tempEventEmbedMapsHeight, setTempEventEmbedMapsHeight] = useState(112);
  const [tempEventLinkMapsLabel, setTempEventLinkMapsLabel] = useState("");
  const [tempEventCardType, setTempEventCardType] = useState("glass");

  const [tempStoryTitle, setTempStoryTitle] = useState("");
  const [tempStoryDate, setTempStoryDate] = useState("");
  const [tempStoryContent, setTempStoryContent] = useState("");

  const [tempGaleriUrl, setTempGaleriUrl] = useState("");

  const [tempBankName, setTempBankName] = useState("");
  const [tempBankAccount, setTempBankAccount] = useState("");
  const [tempBankOwner, setTempBankOwner] = useState("");

  const [selectedFontKey, setSelectedFontKey] = useState<string | null>(null);

  // Sync scroll of the live mobile view
  const previewScrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionName: string) => {
    if (previewScrollContainerRef.current) {
      const targetElement = document.getElementById(`preview-${sectionName}`);
      if (targetElement) {
        previewScrollContainerRef.current.scrollTo({
          top: targetElement.offsetTop - 50,
          behavior: "smooth"
        });
      }
    }
  };

  useEffect(() => {
    scrollToSection(activeSection);
    setSelectedFontKey(null);
  }, [activeSection]);

  // General Update Handler
  const updateData = (section: string, key: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  // Typography/Font Update Handler
  const updateFont = (section: string, fontKey: string, property: string, value: any) => {
    setData((prev: any) => {
      const sectionData = prev[section] || {};
      const fontData = sectionData[fontKey] || {};
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [fontKey]: {
            ...fontData,
            [property]: value
          }
        }
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const res = await saveInvitation(invitation.id, data, status);
      if (res?.error) {
        setSaveError(res.error);
      } else {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (err) {
      setSaveError("Terjadi kesalahan koneksi.");
    } finally {
      setSaving(false);
    }
  };

  // Profile management
  const addProfile = () => {
    if (!tempProfileName) return;
    const currentList = data.profil?.profils || [];
    updateData("profil", "profils", [
      ...currentList,
      {
        nama: tempProfileName,
        keterangan: tempProfileDesc,
        urutan_anak: tempProfileUrutan,
        foto: tempProfileFoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200",
        bingkai: tempProfileBingkai,
        foto_width: "120px",
        foto_height: "120px",
        overlay_url: ""
      }
    ]);
    setTempProfileName("");
    setTempProfileDesc("");
    setTempProfileUrutan("");
    setTempProfileFoto("");
  };

  const removeProfile = (idx: number) => {
    const currentList = data.profil?.profils || [];
    updateData("profil", "profils", currentList.filter((_: any, i: number) => i !== idx));
  };

  // Event management
  const addEvent = () => {
    if (!tempEventName || !tempEventDate) return;
    const currentList = data.acara?.acaras || [];
    updateData("acara", "acaras", [
      ...currentList,
      {
        nama: tempEventName,
        tanggal: tempEventDate,
        jam: tempEventTime,
        jam_mulai: tempEventTime,
        jam_selesai: tempEventTimeEnd,
        is_selesai_custom: tempEventIsSelesaiCustom,
        jam_selesai_custom: tempEventTimeEndCustom,
        alamat: tempEventAddress,
        link_maps: tempEventMaps,
        embed_maps: tempEventEmbedMaps,
        embed_maps_height: tempEventEmbedMapsHeight,
        link_maps_label: tempEventLinkMapsLabel,
        setting_card: { type: tempEventCardType }
      }
    ]);
    setTempEventName("");
    setTempEventDate("");
    setTempEventTime("");
    setTempEventTimeEnd("");
    setTempEventIsSelesaiCustom(false);
    setTempEventTimeEndCustom("Selesai");
    setTempEventAddress("");
    setTempEventMaps("");
    setTempEventEmbedMaps("");
    setTempEventEmbedMapsHeight(112);
    setTempEventLinkMapsLabel("");
    setTempEventCardType("glass");
  };

  const removeEvent = (idx: number) => {
    const currentList = data.acara?.acaras || [];
    updateData("acara", "acaras", currentList.filter((_: any, i: number) => i !== idx));
  };

  // Story management
  const addStory = () => {
    if (!tempStoryTitle || !tempStoryContent) return;
    const currentList = data.cerita?.ceritas || [];
    updateData("cerita", "ceritas", [
      ...currentList,
      {
        judul: tempStoryTitle,
        waktu: tempStoryDate,
        isi: tempStoryContent
      }
    ]);
    setTempStoryTitle("");
    setTempStoryDate("");
    setTempStoryContent("");
  };

  const removeStory = (idx: number) => {
    const currentList = data.cerita?.ceritas || [];
    updateData("cerita", "ceritas", currentList.filter((_: any, i: number) => i !== idx));
  };

  // Gallery management
  const addGalleryImage = () => {
    if (!tempGaleriUrl) return;
    const currentList = data.cerita?.galeris || [];
    updateData("cerita", "galeris", [...currentList, tempGaleriUrl]);
    setTempGaleriUrl("");
  };

  const removeGalleryImage = (idx: number) => {
    const currentList = data.cerita?.galeris || [];
    updateData("cerita", "galeris", currentList.filter((_: any, i: number) => i !== idx));
  };

  // Cashless Bank management
  const addBank = () => {
    if (!tempBankName || !tempBankAccount) return;
    const currentList = data.penutup?.amplops || [];
    updateData("penutup", "amplops", [
      ...currentList,
      {
        bank: tempBankName,
        nomor_rekening: tempBankAccount,
        atas_nama: tempBankOwner
      }
    ]);
    setTempBankName("");
    setTempBankAccount("");
    setTempBankOwner("");
  };

  const removeBank = (idx: number) => {
    const currentList = data.penutup?.amplops || [];
    updateData("penutup", "amplops", currentList.filter((_: any, i: number) => i !== idx));
  };

  const getFontOptions = () => {
    switch (activeSection) {
      case "cover":
        return [
          { key: "setting_nama", label: "Nama Pasangan / Acara" },
          { key: "setting_font", label: "Header (Kategori)" }
        ];
      case "pembuka":
        return [
          { key: "setting_ucapan", label: "Kalimat Pembuka" },
          { key: "setting_kategori", label: "Kategori Acara" },
          { key: "setting_nama", label: "Nama Pasangan / Acara" }
        ];
      case "profil":
        return [
          { key: "setting_ucapan_profil", label: "Kalimat Pengantar" },
          { key: "setting_nama_profil", label: "Nama Lengkap Tokoh" },
          { key: "setting_keterangan_profil", label: "Keterangan Tokoh" },
          { key: "setting_urutan_profil", label: "Urutan Anak / Bersaudara" }
        ];
      case "acara":
        return [
          { key: "setting_nama_acara", label: "Nama Acara" },
          { key: "setting_tanggal_acara", label: "Tanggal Acara" },
          { key: "setting_jam_acara", label: "Waktu/Jam Acara" },
          { key: "setting_alamat_acara", label: "Alamat Acara" },
          { key: "setting_link_maps_acara", label: "Link Maps Acara" }
        ];
      case "cerita":
        return [
          { key: "setting_head_cerita", label: "Header Cerita Kita" },
          { key: "setting_head_galeri", label: "Header Galeri Foto" },
          { key: "setting_judul_cerita", label: "Judul Cerita" },
          { key: "setting_waktu_cerita", label: "Waktu/Tanggal Cerita" },
          { key: "setting_isi_cerita", label: "Isi Cerita" }
        ];
      default:
        return [];
    }
  };

  // Helper to resolve font settings based on active section
  const getSectionFontConfig = () => {
    const defaultKeys: Record<string, string> = {
      cover: "setting_nama",
      pembuka: "setting_ucapan",
      profil: "setting_nama_profil",
      acara: "setting_nama_acara",
      cerita: "setting_judul_cerita",
      penutup: "setting_nama"
    };
    const key = selectedFontKey || defaultKeys[activeSection] || "setting_nama_profil";
    const sectionData = data[activeSection] || {};
    return { key: key as any, data: sectionData[key] || {} };
  };

  const fontConfig = getSectionFontConfig();

  // Helper to render Cultural Ornaments on Preview
  const renderOrnament = (sectionName: string) => {
    const activeOrnamentId = data[sectionName]?.ornament;
    if (!activeOrnamentId) return null;
    const orn = culturalOrnaments.find(o => o.id === activeOrnamentId);
    if (!orn) return null;
    return (
      <div className="w-full py-2 flex justify-center text-[#d4af37] opacity-80 z-10 pointer-events-none">
        {orn.svg}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f5f5dc] text-[#064e3b] font-sans">
      {/* Dynamic Font Loader */}
      <link
        href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Outfit:wght@100..900&family=Inter:wght@100..900&family=Sacramento&family=Pinyon+Script&display=swap"
        rel="stylesheet"
      />

      {/* 1. TOP HEADER BAR */}
      <header className="px-6 py-3 border-b border-[#064e3b]/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 bg-[#f5f5dc]">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-1.5 hover:bg-[#064e3b]/10 rounded-xl text-[#064e3b] transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black tracking-tight text-[#064e3b] leading-none">
                {invitation.template.nama_template || "Batik Keraton Premium"}
              </h2>
              <span className="text-[10px] font-bold bg-[#064e3b]/10 text-[#064e3b] px-2 py-0.5 rounded-full">
                {invitation.template.kategori}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#064e3b]/60 block mt-1">
              /{invitation.slug} • Draft saved just now
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Select */}
          <div className="flex items-center gap-2 bg-[#f5f5dc] border border-[#064e3b]/20 rounded-xl px-3 py-1.5 text-xs font-bold text-[#064e3b]">
            <span className="opacity-60 text-[10px] uppercase tracking-wider">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="bg-transparent text-[#064e3b] border-none outline-none font-bold cursor-pointer"
            >
              <option value="DRAFT" className="bg-[#f5f5dc]">DRAF</option>
              <option value="ACTIVE" className="bg-[#f5f5dc]">PUBLISH (AKTIF)</option>
              <option value="INACTIVE" className="bg-[#f5f5dc]">NON-AKTIF</option>
            </select>
          </div>

          {/* Public Link Preview */}
          <Link
            href={`/${invitation.slug}`}
            target="_blank"
            className="px-4 py-2 rounded-xl border border-[#064e3b]/20 bg-[#f5f5dc] hover:bg-[#064e3b]/10 text-[#064e3b] text-xs font-extrabold flex items-center gap-1.5 transition-all"
          >
            <Eye className="w-4 h-4 text-[#064e3b]" />
            Preview
          </Link>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all border border-[#064e3b]/20 ${saveSuccess
                ? "bg-emerald-700 text-white border-emerald-800"
                : "bg-[#064e3b] hover:bg-[#064e3b]/90 text-white"
              }`}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : saveSuccess ? (
              <>
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </header>

      {/* Save Error Notification */}
      {saveError && (
        <div className="bg-rose-500/10 border-b border-rose-900/30 text-rose-700 text-xs font-bold py-2 px-6 text-center">
          {saveError}
        </div>
      )}

      {/* 2. THREE-COLUMN WORKSPACE BODY */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">

        {/* COLUMN 1: LEFT SIDEBAR (Width: 320px) */}
        <aside className="w-full lg:w-76 border-b lg:border-b-0 lg:border-r border-[#064e3b]/10 flex flex-col min-h-0 bg-[#f5f5dc] shrink-0">
          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 border-b border-[#064e3b]/10 bg-[#f5f5dc] p-1 gap-1 shrink-0">
            {["components", "layers", "assets"].map((tab) => (
              <button
                key={tab}
                onClick={() => setLeftTab(tab as any)}
                className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${leftTab === tab
                    ? "bg-[#064e3b] text-[#f5f5dc]"
                    : "text-[#064e3b]/60 hover:text-[#064e3b] hover:bg-[#064e3b]/5"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Left panel scrollable assets */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
            {leftTab === "components" && (
              <>
                {/* Layout Blocks Section */}
                <div className="space-y-3">
                  <span className="text-[10px] font-extrabold text-[#064e3b]/60 uppercase tracking-widest block">
                    Layout Blocks
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "cover", label: "Hero Section", icon: "🖼️" },
                      { id: "pembuka", label: "Pembukaan", icon: "📖" },
                      { id: "profil", label: "Love Story / Profil", icon: "❤️" },
                      { id: "acara", label: "Acara / Jadwal", icon: "📅" },
                      { id: "cerita", label: "Gallery / Cerita", icon: "📷" },
                      { id: "penutup", label: "RSVP Form & Kado", icon: "🎁" }
                    ].map((block) => (
                      <button
                        key={block.id}
                        onClick={() => setActiveSection(block.id as any)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all cursor-pointer ${activeSection === block.id
                            ? "bg-[#064e3b]/10 border-[#d4af37] shadow-sm shadow-[#d4af37]/20"
                            : "bg-[#f5f5dc] border-[#064e3b]/10 hover:border-[#064e3b]/30"
                          }`}
                      >
                        <span className="text-xl">{block.icon}</span>
                        <span className="text-[10px] font-extrabold text-[#064e3b] leading-tight">
                          {block.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>


                {/* Form Pengisian Data (Sesuai Active Section) */}
                <div className="p-3.5 bg-white border border-[#064e3b]/10 rounded-2xl space-y-4 shadow-sm text-left">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5 border-b border-[#064e3b]/10 pb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> Data: {activeSection === "cover" ? "Hero / Cover" : activeSection.toUpperCase()}
                  </p>
                                <div className="space-y-5">

                {/* 1. COVER CONTENT */}
                {activeSection === "cover" && (
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-[#d4af37] border-b border-[#064e3b]/10 pb-1">Cover Settings</h4>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold uppercase opacity-75">Nama Pasangan / Acara Utama</label>
                      <input
                        type="text"
                        value={data.cover?.nama_acara || ""}
                        onChange={(e) => updateData("cover", "nama_acara", e.target.value)}
                        placeholder="contoh: Aditya & Tara"
                        className="w-full px-3 py-2 bg-[#f5f5dc] border border-[#064e3b]/20 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl text-xs text-[#064e3b] placeholder-[#064e3b]/30 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold uppercase opacity-75">Audio Background (Musik)</label>
                      <select
                        value={data.cover?.music_url || ""}
                        onChange={(e) => updateData("cover", "music_url", e.target.value)}
                        className="w-full px-3 py-2 bg-[#f5f5dc] border border-[#064e3b]/20 rounded-xl text-xs text-[#064e3b] focus:border-[#d4af37] outline-none"
                      >
                        <option value="">Tanpa Musik Latar</option>
                        {musicList.map((m) => (
                          <option key={m.id} value={m.audio_url}>
                            {m.judul} - {m.artis}
                          </option>
                        ))}
                      </select>
                    </div>

                    {data.cover?.music_url && (
                      <div className="space-y-2">
                        <label className="block text-[10px] font-extrabold uppercase opacity-75">Mulai Lagu Dari Detik Ke-</label>
                        <input
                          type="number"
                          min={0}
                          value={data.cover?.music_start_second || 0}
                          onChange={(e) => updateData("cover", "music_start_second", parseInt(e.target.value, 10) || 0)}
                          placeholder="Contoh: 15 (untuk mulai dari detik 15)"
                          className="w-full px-3 py-2 bg-[#f5f5dc] border border-[#064e3b]/20 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl text-xs text-[#064e3b] outline-none"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* 2. PEMBUKA CONTENT */}
                {activeSection === "pembuka" && (
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-[#d4af37] border-b border-[#064e3b]/10 pb-1">Pembukaan Settings</h4>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold uppercase opacity-75">Kalimat Pembuka</label>
                      <textarea
                        value={data.pembuka?.ucapan || ""}
                        onChange={(e) => updateData("pembuka", "ucapan", e.target.value)}
                        rows={5}
                        placeholder="Tulis kalimat selamat datang dan doa..."
                        className="w-full px-3 py-2 bg-[#f5f5dc] border border-[#064e3b]/20 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl text-xs text-[#064e3b] placeholder-[#064e3b]/30 outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold uppercase opacity-75">Foto Pembuka (URL)</label>
                      <input
                        type="text"
                        value={data.pembuka?.foto_pembuka || ""}
                        onChange={(e) => updateData("pembuka", "foto_pembuka", e.target.value)}
                        placeholder="Masukkan URL foto pembuka..."
                        className="w-full px-3 py-2 bg-[#f5f5dc] border border-[#064e3b]/20 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl text-xs text-[#064e3b] placeholder-[#064e3b]/30 outline-none transition-all"
                      />
                    </div>

                    {data.pembuka?.foto_pembuka && (
                      <div className="space-y-2">
                        <PhotoStyleWidget
                          bingkai={data.pembuka.foto_setting?.bingkai || "oval"}
                          width={data.pembuka.foto_setting?.width || "120px"}
                          height={data.pembuka.foto_setting?.height || "120px"}
                          overlayUrl={data.pembuka.foto_setting?.overlay_url || ""}
                          onChange={(updates) => updateData("pembuka", "foto_setting", {
                            ...(data.pembuka.foto_setting || {}),
                            bingkai: updates.bingkai,
                            width: updates.width,
                            height: updates.height,
                            overlay_url: updates.overlay_url,
                          })}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* 3. PROFIL CONTENT */}
                {activeSection === "profil" && (
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-[#d4af37] border-b border-[#064e3b]/10 pb-1">Daftar Tokoh/Profil</h4>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold uppercase opacity-75">Pengantar Profil</label>
                      <input
                        type="text"
                        value={data.profil?.ucapan_profil || ""}
                        onChange={(e) => updateData("profil", "ucapan_profil", e.target.value)}
                        placeholder="Maha suci Allah..."
                        className="w-full px-3 py-2 bg-[#f5f5dc] border border-[#064e3b]/20 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl text-xs text-[#064e3b] placeholder-[#064e3b]/30 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold uppercase opacity-75">Profil Terdaftar ({data.profil?.profils?.length || 0})</label>
                      <div className="space-y-2">
                        {data.profil?.profils?.map((prof: any, idx: number) => {
                          const isEditing = activeProfileEditIdx === idx;
                          return (
                            <div key={idx} className="p-2.5 bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-xl space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <img src={prof.foto} className="w-8 h-8 object-cover rounded-full bg-[#064e3b]/10 shrink-0" alt="" />
                                  <div className="overflow-hidden">
                                    <h5 className="font-bold truncate text-[#064e3b] text-left">{prof.nama}</h5>
                                    <p className="text-[9px] text-[#064e3b]/60 truncate text-left">{prof.keterangan}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => setActiveProfileEditIdx(isEditing ? null : idx)}
                                    className="px-2 py-1 bg-[#064e3b]/10 hover:bg-[#064e3b]/20 text-[#064e3b] text-[10px] font-black rounded-lg transition-all"
                                  >
                                    {isEditing ? "Tutup" : "Edit"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      removeProfile(idx);
                                      if (isEditing) setActiveProfileEditIdx(null);
                                    }}
                                    className="p-1.5 text-rose-600 hover:bg-rose-500/10 rounded-lg cursor-pointer shrink-0"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {isEditing && (
                                <div className="pt-2 border-t border-[#064e3b]/10 space-y-2 text-left">
                                  <div>
                                    <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Nama Lengkap</label>
                                    <input
                                      type="text"
                                      value={prof.nama}
                                      onChange={e => {
                                        const newList = [...data.profil.profils];
                                        newList[idx] = { ...prof, nama: e.target.value };
                                        updateData("profil", "profils", newList);
                                      }}
                                      className="w-full px-2.5 py-1.5 bg-white border border-[#064e3b]/20 focus:border-[#d4af37] rounded-lg text-xs font-bold outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Keterangan</label>
                                    <input
                                      type="text"
                                      value={prof.keterangan}
                                      onChange={e => {
                                        const newList = [...data.profil.profils];
                                        newList[idx] = { ...prof, keterangan: e.target.value };
                                        updateData("profil", "profils", newList);
                                      }}
                                      className="w-full px-2.5 py-1.5 bg-white border border-[#064e3b]/20 focus:border-[#d4af37] rounded-lg text-xs font-bold outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Anak Ke / Bersaudara</label>
                                    <input
                                      type="text"
                                      value={prof.urutan_anak || ""}
                                      onChange={e => {
                                        const newList = [...data.profil.profils];
                                        newList[idx] = { ...prof, urutan_anak: e.target.value };
                                        updateData("profil", "profils", newList);
                                      }}
                                      placeholder="Anak pertama dari tiga bersaudara..."
                                      className="w-full px-2.5 py-1.5 bg-white border border-[#064e3b]/20 focus:border-[#d4af37] rounded-lg text-xs font-bold outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Foto URL</label>
                                    <input
                                      type="text"
                                      value={prof.foto}
                                      onChange={e => {
                                        const newList = [...data.profil.profils];
                                        newList[idx] = { ...prof, foto: e.target.value };
                                        updateData("profil", "profils", newList);
                                      }}
                                      className="w-full px-2.5 py-1.5 bg-white border border-[#064e3b]/20 focus:border-[#d4af37] rounded-lg text-xs font-bold outline-none"
                                    />
                                  </div>

                                  <PhotoStyleWidget
                                    bingkai={prof.bingkai || "oval"}
                                    width={prof.foto_width || "120px"}
                                    height={prof.foto_height || "120px"}
                                    overlayUrl={prof.overlay_url || ""}
                                    onChange={updates => {
                                      const newList = [...data.profil.profils];
                                      newList[idx] = {
                                        ...prof,
                                        bingkai: updates.bingkai,
                                        foto_width: updates.width,
                                        foto_height: updates.height,
                                        overlay_url: updates.overlay_url
                                      };
                                      updateData("profil", "profils", newList);
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Form tambah profil */}
                    <div className="bg-[#064e3b]/5 border border-[#064e3b]/10 p-3 rounded-xl space-y-3">
                      <span className="font-bold text-[10px] block">Tambah Profil</span>
                      <input
                        type="text"
                        value={tempProfileName}
                        onChange={(e) => setTempProfileName(e.target.value)}
                        placeholder="Nama Lengkap"
                        className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        value={tempProfileDesc}
                        onChange={(e) => setTempProfileDesc(e.target.value)}
                        placeholder="Keterangan (e.g. Putra dari Bpk...)"
                        className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        value={tempProfileUrutan}
                        onChange={(e) => setTempProfileUrutan(e.target.value)}
                        placeholder="Anak Ke / Bersaudara"
                        className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        value={tempProfileFoto}
                        onChange={(e) => setTempProfileFoto(e.target.value)}
                        placeholder="Foto URL (https://...)"
                        className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg text-xs"
                      />
                      <select
                        value={tempProfileBingkai}
                        onChange={(e) => setTempProfileBingkai(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg text-xs text-[#064e3b]"
                      >
                        <option value="oval">Oval (Tradisional)</option>
                        <option value="kotak">Kotak (Minimalis)</option>
                        <option value="bulat">Bulat (Modern)</option>
                      </select>
                      <button
                        type="button"
                        onClick={addProfile}
                        className="w-full py-2 rounded-lg bg-[#064e3b] hover:bg-[#064e3b]/90 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Tambah Tokoh
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. ACARA CONTENT */}
                {activeSection === "acara" && (
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-[#d4af37] border-b border-[#064e3b]/10 pb-1">Jadwal Acara</h4>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold uppercase opacity-75">Daftar Acara Terdaftar ({data.acara?.acaras?.length || 0})</label>
                      <div className="space-y-2">
                        {data.acara?.acaras?.map((evt: any, idx: number) => (
                          <div key={idx} className="p-2.5 bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-xl flex items-start justify-between">
                            <div>
                              <h5 className="font-bold text-[#064e3b]">{evt.nama}</h5>
                              <p className="text-[9px] text-[#064e3b]/60 mt-0.5">
                                {evt.tanggal} • {evt.jam || (evt.jam_mulai ? `${evt.jam_mulai}${evt.is_selesai_custom ? ` - ${evt.jam_selesai_custom || "Selesai"}` : (evt.jam_selesai ? ` - ${evt.jam_selesai}` : "")}` : "")}
                              </p>
                              <p className="text-[9px] text-[#064e3b]/50 mt-0.5 line-clamp-1">{evt.alamat}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeEvent(idx)}
                              className="p-1.5 text-rose-600 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Form tambah acara */}
                    <div className="bg-[#064e3b]/5 border border-[#064e3b]/10 p-3 rounded-xl space-y-3">
                      <span className="font-bold text-[10px] block">Tambah Acara Baru</span>
                      <input
                        type="text"
                        value={tempEventName}
                        onChange={(e) => setTempEventName(e.target.value)}
                        placeholder="Nama Acara (e.g. Akad Nikah)"
                        className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg text-xs"
                      />
                      <input
                        type="date"
                        value={tempEventDate}
                        onChange={(e) => setTempEventDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg text-xs text-[#064e3b]"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold uppercase opacity-60">Jam Mulai</label>
                          <input
                            type="text" placeholder="Contoh: 08:00"
                            value={tempEventTime}
                            onChange={(e) => setTempEventTime(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold uppercase opacity-60">Jam Selesai</label>
                          {!tempEventIsSelesaiCustom ? (
                            <input
                              type="text" placeholder="Contoh: 10:00"
                              value={tempEventTimeEnd}
                              onChange={(e) => setTempEventTimeEnd(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg text-xs"
                            />
                          ) : (
                            <input
                              type="text"
                              value={tempEventTimeEndCustom}
                              onChange={(e) => setTempEventTimeEndCustom(e.target.value)}
                              placeholder="Selesai"
                              className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg text-xs"
                            />
                          )}
                        </div>
                      </div>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempEventIsSelesaiCustom}
                          onChange={e => setTempEventIsSelesaiCustom(e.target.checked)}
                          className="w-3.5 h-3.5 accent-[#064e3b] cursor-pointer"
                        />
                        <span className="text-[9px] font-bold text-[#064e3b]/70">Gunakan Teks Kustom / 'Selesai'</span>
                      </label>
                      <input
                        type="text"
                        value={tempEventAddress}
                        onChange={(e) => setTempEventAddress(e.target.value)}
                        placeholder="Alamat Venue"
                        className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        value={tempEventMaps}
                        onChange={(e) => setTempEventMaps(e.target.value)}
                        placeholder="Link Google Maps"
                        className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg text-xs"
                      />
                      {tempEventMaps && (
                        <input
                          type="text"
                          value={tempEventLinkMapsLabel}
                          onChange={(e) => setTempEventLinkMapsLabel(e.target.value)}
                          placeholder="Label Link Maps (e.g. Lihat di Maps →)"
                          className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg text-xs"
                        />
                      )}
                      <input
                        type="text"
                        value={tempEventEmbedMaps}
                        onChange={(e) => setTempEventEmbedMaps(e.target.value)}
                        placeholder="Embed Maps URL (Optional iframe src)"
                        className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg text-xs"
                      />
                      {tempEventEmbedMaps && (
                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold uppercase opacity-60">Tinggi Maps Embed: {tempEventEmbedMapsHeight}px</label>
                          <input
                            type="range" min="80" max="400" step="10"
                            value={tempEventEmbedMapsHeight}
                            onChange={(e) => setTempEventEmbedMapsHeight(parseInt(e.target.value))}
                            className="w-full accent-[#d4af37] h-1"
                          />
                        </div>
                      )}
                      <div className="space-y-1">
                        <label className="text-[9px] font-extrabold uppercase opacity-60">Style Card Acara</label>
                        <select
                          value={tempEventCardType}
                          onChange={(e) => setTempEventCardType(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg text-xs text-[#064e3b] font-bold"
                        >
                          <option value="glass">Kaca (Glassmorphism)</option>
                          <option value="outline">Garis (Outline)</option>
                          <option value="solid">Solid (Putih)</option>
                          <option value="none">Tanpa Card (Polos)</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={addEvent}
                        className="w-full py-2 rounded-lg bg-[#064e3b] hover:bg-[#064e3b]/90 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Tambah Acara
                      </button>
                    </div>

                    {/* Pengaturan Hitung Mundur */}
                    <div className="bg-[#064e3b]/5 border border-[#064e3b]/10 p-3 rounded-xl space-y-3">
                      <span className="font-bold text-[10px] block text-[#d4af37] uppercase tracking-wider">Pengaturan Hitung Mundur (Countdown)</span>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!data.acara?.countdown_aktif}
                          onChange={e => updateData("acara", "countdown_aktif", e.target.checked)}
                          className="w-4 h-4 accent-[#064e3b] cursor-pointer"
                        />
                        <span className="text-xs font-bold text-[#064e3b]">Aktifkan Hitung Mundur</span>
                      </label>

                      {data.acara?.countdown_aktif && (
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-extrabold uppercase tracking-wider text-[#064e3b]/60 block">
                            Pilih Acara Sebagai Target
                          </label>
                          <select
                            value={data.acara?.countdown_acara_index ?? 0}
                            onChange={e => updateData("acara", "countdown_acara_index", parseInt(e.target.value))}
                            className="w-full px-2.5 py-1.5 text-xs bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg outline-none focus:border-[#d4af37] text-[#064e3b] cursor-pointer font-bold"
                          >
                            {(data.acara?.acaras || []).map((a: any, i: number) => (
                              <option key={i} value={i}>
                                Acara #{i + 1}: {a.nama || "Tanpa Nama"} ({a.tanggal || "Tanpa Tanggal"})
                              </option>
                            ))}
                            {(data.acara?.acaras || []).length === 0 && (
                              <option value={0}>Belum ada acara ditambahkan</option>
                            )}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. CERITA & GALERI CONTENT */}
                {activeSection === "cerita" && (
                  <div className="space-y-5">

                    {/* Story moments */}
                    <div className="space-y-3">
                      <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-[#d4af37] border-b border-[#064e3b]/10 pb-1">Cerita Cinta</h4>
                      <div className="space-y-2">
                        {data.cerita?.ceritas?.map((story: any, idx: number) => (
                          <div key={idx} className="p-2.5 bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-xl flex items-start justify-between">
                            <div>
                              <h5 className="font-bold text-[#064e3b]">{story.judul}</h5>
                              <p className="text-[9px] text-[#064e3b]/60">{story.waktu}</p>
                              <p className="text-[9px] text-[#064e3b]/50 line-clamp-2 leading-relaxed mt-0.5">{story.isi}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeStory(idx)}
                              className="p-1.5 text-rose-600 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add Story moment */}
                      <div className="bg-[#064e3b]/5 border border-[#064e3b]/10 p-3 rounded-xl space-y-3">
                        <span className="font-bold text-[10px] block">Tambah Kisah Momen</span>
                        <input
                          type="text"
                          value={tempStoryTitle}
                          onChange={(e) => setTempStoryTitle(e.target.value)}
                          placeholder="Judul (e.g. Pertama Bertemu)"
                          className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          value={tempStoryDate}
                          onChange={(e) => setTempStoryDate(e.target.value)}
                          placeholder="Waktu/Periode (e.g. Maret 2024)"
                          className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg text-xs"
                        />
                        <textarea
                          value={tempStoryContent}
                          onChange={(e) => setTempStoryContent(e.target.value)}
                          rows={3}
                          placeholder="Ceritakan momen indah ini..."
                          className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg text-xs resize-none"
                        />
                        <button
                          type="button"
                          onClick={addStory}
                          className="w-full py-2 rounded-lg bg-[#064e3b] hover:bg-[#064e3b]/90 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          Tambah Kisah
                        </button>
                      </div>
                    </div>

                    <hr className="border-[#064e3b]/10" />

                    {/* Album Gallery images */}
                    <div className="space-y-3">
                      <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-[#d4af37] border-b border-[#064e3b]/10 pb-1">Galeri Foto</h4>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-extrabold uppercase opacity-75">Layout Style</label>
                        <select
                          value={data.cerita?.galeri_layout || "grid"}
                          onChange={(e) => updateData("cerita", "galeri_layout", e.target.value)}
                          className="w-full px-3 py-2 bg-[#f5f5dc] border border-[#064e3b]/20 rounded-xl text-xs text-[#064e3b] outline-none"
                        >
                          <option value="grid">Grid (Kotak-kotak)</option>
                          <option value="masonry">Masonry (Estetik)</option>
                          <option value="carousel">Carousel (Geser)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-extrabold uppercase opacity-75">Foto Terdaftar ({data.cerita?.galeris?.length || 0})</label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {data.cerita?.galeris?.map((img: string, idx: number) => (
                            <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-[#064e3b]/15 bg-[#064e3b]/5">
                              <img src={img} className="w-full h-full object-cover" alt="" />
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(idx)}
                                className="absolute inset-0 bg-rose-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-200 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Add Gallery image URL */}
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          value={tempGaleriUrl}
                          onChange={(e) => setTempGaleriUrl(e.target.value)}
                          placeholder="Masukkan URL Foto Baru..."
                          className="flex-1 px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/20 rounded-lg text-xs"
                        />
                        <button
                          type="button"
                          onClick={addGalleryImage}
                          className="px-3 py-1.5 bg-[#064e3b] hover:bg-[#064e3b]/90 text-white font-bold rounded-lg text-xs cursor-pointer"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>

                  </div>
                )}

                {/* 6. PENUTUP & KADO CONTENT */}
                {activeSection === "penutup" && (
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-[#d4af37] border-b border-[#064e3b]/10 pb-1">Penutupan & RSVP</h4>

                    {/* Toggles */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[9px] block">Form RSVP</span>
                          <span className="text-[7.5px] opacity-60">Status Kehadiran</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={data.penutup?.rsvp_aktif || false}
                          onChange={(e) => updateData("penutup", "rsvp_aktif", e.target.checked)}
                          className="w-4 h-4 accent-[#064e3b] cursor-pointer"
                        />
                      </div>

                      <div className="p-2.5 bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[9px] block">Wall Ucapan</span>
                          <span className="text-[7.5px] opacity-60">Komentar Tamu</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={data.penutup?.ucapan_aktif || false}
                          onChange={(e) => updateData("penutup", "ucapan_aktif", e.target.checked)}
                          className="w-4 h-4 accent-[#064e3b] cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold uppercase opacity-75">Pesan Penutup</label>
                      <textarea
                        value={data.penutup?.pesan_penutup || ""}
                        onChange={(e) => updateData("penutup", "pesan_penutup", e.target.value)}
                        rows={3}
                        placeholder="Merupakan kebahagiaan bagi kami..."
                        className="w-full px-3 py-2 bg-[#f5f5dc] border border-[#064e3b]/20 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl text-xs text-[#064e3b] outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="block text-[9px] font-extrabold uppercase opacity-75">Salam Penutup</label>
                        <input
                          type="text"
                          value={data.penutup?.salam || ""}
                          onChange={(e) => updateData("penutup", "salam", e.target.value)}
                          placeholder="Wassalamualaikum..."
                          className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/15 rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[9px] font-extrabold uppercase opacity-75">Tertanda</label>
                        <input
                          type="text"
                          value={data.penutup?.tertanda || ""}
                          onChange={(e) => updateData("penutup", "tertanda", e.target.value)}
                          placeholder="Aditya & Tara"
                          className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/15 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <hr className="border-[#064e3b]/10" />

                    {/* Cashless accounts list */}
                    <div className="space-y-3">
                      <h5 className="font-extrabold text-[10px] uppercase opacity-75">Amplop Cashless / Rekening</h5>
                      <div className="space-y-2">
                        {data.penutup?.amplops?.map((gift: any, idx: number) => (
                          <div key={idx} className="p-2.5 bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-xl flex items-center justify-between">
                            <div>
                              <span className="font-bold text-[#064e3b] text-xs">{gift.bank} - {gift.nomor_rekening}</span>
                              <p className="text-[9px] text-[#064e3b]/60">A/N: {gift.atas_nama}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeBank(idx)}
                              className="p-1.5 text-rose-600 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add Cashless Account form */}
                      <div className="bg-[#064e3b]/5 border border-[#064e3b]/10 p-3 rounded-xl space-y-3">
                        <span className="font-bold text-[9px] block">Tambah Rekening Baru</span>
                        <input
                          type="text"
                          value={tempBankName}
                          onChange={(e) => setTempBankName(e.target.value)}
                          placeholder="Nama Bank/e-Wallet (e.g. BCA, OVO)"
                          className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          value={tempBankAccount}
                          onChange={(e) => setTempBankAccount(e.target.value)}
                          placeholder="Nomor Rekening"
                          className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          value={tempBankOwner}
                          onChange={(e) => setTempBankOwner(e.target.value)}
                          placeholder="Nama Pemilik Rekening"
                          className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/10 rounded-lg text-xs"
                        />
                        <button
                          type="button"
                          onClick={addBank}
                          className="w-full py-2 rounded-lg bg-[#064e3b] hover:bg-[#064e3b]/90 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          Tambah Rekening
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
                </div>
  
                {/* Cultural Motifs Section */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-extrabold text-[#064e3b]/60 uppercase tracking-widest block">
                    Indonesian Motifs
                  </span>
                  <div className="space-y-2">
                    {indonesianMotifs.map((motif) => (
                      <div
                        key={motif.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-[#064e3b]/10 bg-[#f5f5dc] group hover:border-[#064e3b]/30 transition-all cursor-pointer"
                        onClick={() => {
                          // Allow setting default background styles based on motif
                          if (motif.id === "mega-mendung") {
                            updateData(activeSection, "background", { type: "solid", value: "#064e3b" });
                          } else if (motif.id === "parang-rusak") {
                            updateData(activeSection, "background", { type: "solid", value: "#381a04" });
                          } else {
                            updateData(activeSection, "background", { type: "solid", value: "#f5f5dc" });
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#064e3b]/5 flex items-center justify-center shrink-0">
                            {motif.svg}
                          </div>
                          <div>
                            <h5 className="text-[11px] font-black text-[#064e3b] leading-tight">{motif.name}</h5>
                            <span className="text-[9px] font-bold text-[#064e3b]/50 block mt-0.5">{motif.region}</span>
                          </div>
                        </div>
                        <div className="text-[#064e3b]/30 group-hover:text-[#064e3b]/60 cursor-grab">
                          <span className="text-lg">⋮⋮</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {leftTab === "layers" && (
              <div className="text-center py-8 text-xs text-[#064e3b]/60 font-medium">
                <p>Layers Panel is active.</p>
                <div className="mt-4 space-y-2 text-left bg-[#064e3b]/5 p-3 rounded-lg text-[10px]">
                  <p className="font-bold">Active Section Order:</p>
                  <p>1. Cover (Hero)</p>
                  <p>2. Pembuka (Intro)</p>
                  <p>3. Profil (Tokoh)</p>
                  <p>4. Acara (Jadwal)</p>
                  <p>5. Cerita & Galeri (Media)</p>
                  <p>6. Penutup & RSVP (Kado)</p>
                </div>
              </div>
            )}

            {leftTab === "assets" && (
              <div className="text-center py-8 text-xs text-[#064e3b]/60 font-medium">
                <p>Assets Library</p>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="border border-[#064e3b]/10 p-2 rounded-lg text-center">
                    <span className="text-2xl block mb-1">🎵</span>
                    <span className="text-[9px] font-bold">{musicList.length} Tracks</span>
                  </div>
                  <div className="border border-[#064e3b]/10 p-2 rounded-lg text-center">
                    <span className="text-2xl block mb-1">🖼️</span>
                    <span className="text-[9px] font-bold">Default Images</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Left panel bottom info */}
          <div className="p-3 border-t border-[#064e3b]/10 bg-[#f5f5dc] flex items-center justify-between gap-2 shrink-0">
            <button className="p-2 bg-[#064e3b]/5 hover:bg-[#064e3b]/10 rounded-lg text-[#064e3b] transition-all cursor-pointer">
              <HelpCircle className="w-4 h-4" />
            </button>
            <button className="flex-1 py-2 bg-[#d4af37] hover:bg-[#d4af37]/90 text-white font-extrabold text-[10px] rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer uppercase tracking-wider">
              <Plus className="w-3.5 h-3.5" />
              Custom Import
            </button>
          </div>
        </aside>

        {/* COLUMN 2: MIDDLE CANVAS (Flex-1) */}
        <main className="flex-1 flex flex-col min-h-0 bg-[#eaeaec] relative overflow-hidden">

          {/* Top coordinate scale ruler */}
          <div className="h-6 border-b border-[#064e3b]/10 bg-[#f5f5dc]/60 flex items-center text-[8px] font-bold text-[#064e3b]/50 select-none relative shrink-0">
            <div className="absolute left-6 h-full w-[1px] bg-[#064e3b]/15" />
            <div className="pl-8 flex w-full justify-between pr-8">
              <span>0</span>
              <span>100</span>
              <span>200</span>
              <span>300</span>
              <span>400</span>
              <span>500</span>
              <span>600</span>
              <span>700</span>
              <span>800</span>
            </div>
          </div>

          {/* Canvas Main Body (Dotted Grid background) */}
          <div
            className="flex-1 flex items-center justify-center p-6 overflow-y-auto relative"
            style={{
              backgroundImage: "radial-gradient(#064e3b 0.6px, #f5f5dc 0.6px)",
              backgroundSize: "16px 16px"
            }}
          >
            {/* FIGMA-STYLE EDIT SELECTION CORNER NODES */}
            <div className="relative p-2 rounded-[42px] transition-all duration-300">

              {/* Corner selection handles */}
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white border border-[#d4af37] rounded-full z-30 shadow" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border border-[#d4af37] rounded-full z-30 shadow" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-white border border-[#d4af37] rounded-full z-30 shadow" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white border border-[#d4af37] rounded-full z-30 shadow" />

              {/* Viewport Frame Container */}
              <div className={`relative rounded-[36px] border-[5px] border-[#064e3b] bg-slate-950 shadow-2xl flex flex-col overflow-hidden shrink-0 transition-all duration-300 ${viewportMode === "mobile"
                  ? "w-[330px] h-[610px]"
                  : viewportMode === "tablet"
                    ? "w-[480px] h-[640px]"
                    : "w-[640px] h-[580px]"
                }`}>
                {/* Simulated content frame */}
                <div
                  id="mobile-preview-container"
                  ref={previewScrollContainerRef}
                  className="flex-1 overflow-y-auto relative bg-[#f5f5dc] text-[#064e3b] flex flex-col font-sans select-none scrollbar-none"
                >

                  {/* PREVIEW: COVER SECTION */}
                  <div
                    id="preview-cover"
                    className={`min-h-full flex flex-col justify-between p-6 relative overflow-hidden text-center border-b-2 border-dashed ${activeSection === "cover" ? "border-[#d4af37] bg-[#064e3b]/5" : "border-transparent"
                      }`}
                    style={{
                      background: data.cover?.background?.type === "image"
                        ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.55)), url(${data.cover?.background?.value}) center/cover no-repeat`
                        : data.cover?.background?.type === "gradient"
                          ? data.cover?.background?.value
                          : data.cover?.background?.value || "#064e3b"
                    }}
                  >
                    {/* Cover Border Frame */}
                    {data.cover?.setting_bingkai?.enabled && (
                      <div
                        className="absolute pointer-events-none z-20"
                        style={{
                          top: data.cover.setting_bingkai.padding || "16px",
                          bottom: data.cover.setting_bingkai.padding || "16px",
                          left: data.cover.setting_bingkai.padding || "16px",
                          right: data.cover.setting_bingkai.padding || "16px",
                          borderWidth: data.cover.setting_bingkai.width || "2px",
                          borderStyle: data.cover.setting_bingkai.style || "solid",
                          borderColor: data.cover.setting_bingkai.color || "#d4af37",
                          borderRadius: data.cover.setting_bingkai.radius || "12px",
                        }}
                      />
                    )}
                    <div />
                    <div className="my-auto py-10 space-y-6">
                      {renderOrnament("cover")}
                      <span className="text-[10px] font-extrabold tracking-widest text-[#d4af37] uppercase block">
                        UNDANGAN {invitation.template.kategori}
                      </span>

                      <h1
                        style={{
                          fontSize: data.cover?.setting_nama?.size || "40px",
                          color: data.cover?.setting_nama?.color || "#ffffff",
                          fontFamily: data.cover?.setting_nama?.family || "Inter"
                        }}
                        className="leading-tight break-words drop-shadow-md px-2"
                      >
                        {data.cover?.nama_acara || "Aditya & Tara"}
                      </h1>

                      <div className="space-y-1.5 pt-4 flex flex-col items-center">
                        <span className="text-[9px] text-[#f5f5dc]/75 block font-semibold">Kepada Yth. Bpk/Ibu/Saudara/i</span>
                        <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-bold text-white shadow-sm">
                          Tamu Undangan
                        </div>
                      </div>
                    </div>

                    <div className="pb-6">
                      <button
                        type="button"
                        className="px-6 py-2.5 rounded-full text-[10px] font-black bg-[#d4af37] text-white shadow-lg animate-bounce flex items-center gap-1.5 mx-auto uppercase tracking-wider"
                      >
                        <Heart className="w-3 h-3 fill-white text-white" />
                        Buka Undangan
                      </button>
                    </div>
                  </div>

                  {/* PREVIEW: PEMBUKA SECTION */}
                  <div
                    id="preview-pembuka"
                    className={`p-6 text-center flex flex-col justify-center gap-6 min-h-[300px] border-b border-dashed ${activeSection === "pembuka" ? "border-[#d4af37] bg-[#064e3b]/5" : "border-[#064e3b]/10"
                      }`}
                    style={{
                      background: data.pembuka?.background?.type === "image"
                        ? `linear-gradient(rgba(245, 245, 220, 0.9), rgba(245, 245, 220, 0.9)), url(${data.pembuka?.background?.value}) center/cover no-repeat`
                        : data.pembuka?.background?.type === "gradient"
                          ? data.pembuka?.background?.value
                          : undefined
                    }}
                  >
                    {renderOrnament("pembuka")}

                    <div
                      style={{
                        fontSize: data.pembuka?.setting_kategori?.size || "12px",
                        color: data.pembuka?.setting_kategori?.color || "#064e3b",
                        fontFamily: data.pembuka?.setting_kategori?.family || "Inter"
                      }}
                      className="font-bold opacity-60 text-xs"
                    >
                      {invitation?.template?.kategori || "Kategori Acara"}
                    </div>

                    <div
                      style={{
                        fontSize: data.pembuka?.setting_nama?.size || "24px",
                        color: data.pembuka?.setting_nama?.color || "#064e3b",
                        fontFamily: data.pembuka?.setting_nama?.family || "Inter"
                      }}
                      className="font-bold text-2xl"
                    >
                      {data.cover?.nama_acara || "Nama Pasangan"}
                    </div>

                    {data.pembuka?.foto_pembuka && (
                      <div className="mx-auto flex justify-center">
                        <FramedPhoto
                          src={data.pembuka.foto_pembuka}
                          bingkai={data.pembuka.foto_setting?.bingkai || "oval"}
                          className="w-36 h-36"
                          customWidth={data.pembuka.foto_setting?.width}
                          customHeight={data.pembuka.foto_setting?.height}
                          overlayUrl={data.pembuka.foto_setting?.overlay_url}
                          photoScale={data.pembuka.foto_setting?.photo_scale}
                          photoX={data.pembuka.foto_setting?.photo_x}
                          photoY={data.pembuka.foto_setting?.photo_y}
                        />
                      </div>
                    )}

                    <p
                      style={{
                        color: data.pembuka?.setting_ucapan?.color || "#064e3b",
                        fontFamily: data.pembuka?.setting_ucapan?.family || "Inter"
                      }}
                      className="text-[11px] leading-relaxed italic max-w-xs mx-auto"
                    >
                      {data.pembuka?.ucapan || "Kalimat pembuka..."}
                    </p>
                  </div>

                  {/* PREVIEW: PROFIL SECTION */}
                  <div
                    id="preview-profil"
                    className={`p-6 text-center space-y-6 border-b border-dashed relative ${activeSection === "profil" ? "border-[#d4af37] bg-[#064e3b]/5" : "border-[#064e3b]/10"
                      }`}
                    style={{
                      background: data.profil?.background?.type === "image"
                        ? `linear-gradient(rgba(245, 245, 220, 0.9), rgba(245, 245, 220, 0.9)), url(${data.profil?.background?.value}) center/cover no-repeat`
                        : data.profil?.background?.type === "gradient"
                          ? data.profil?.background?.value
                          : undefined
                    }}
                  >
                    {renderOrnament("profil")}
                    <span className="text-[9px] font-extrabold text-[#d4af37] uppercase tracking-widest block">
                      Kami Yang Berbahagia
                    </span>
                    {data.profil?.setting_ucapan_profil?.position === "custom" ? (
                      <p
                        className="opacity-80 whitespace-pre-wrap z-10"
                        style={{
                          color: data.profil?.setting_ucapan_profil?.color || "#064e3b",
                          fontFamily: data.profil?.setting_ucapan_profil?.family || "Inter",
                          fontSize: data.profil?.setting_ucapan_profil?.size || "10px",
                          position: "absolute",
                          left: `${data.profil?.setting_ucapan_profil?.x ?? 50}%`,
                          top: `${data.profil?.setting_ucapan_profil?.y ?? 15}%`,
                          transform: "translate(-50%, -50%)",
                          textAlign: "center",
                          width: data.profil?.setting_ucapan_profil?.width || "90%",
                          lineHeight: data.profil?.setting_ucapan_profil?.lineHeight || "1.5",
                        }}
                      >
                        {data.profil?.ucapan_profil || "Maha suci Allah..."}
                      </p>
                    ) : (
                      <p
                        className="leading-relaxed opacity-80 max-w-xs whitespace-pre-wrap z-10 mx-auto"
                        style={{
                          color: data.profil?.setting_ucapan_profil?.color || "#064e3b",
                          fontFamily: data.profil?.setting_ucapan_profil?.family || "Inter",
                          fontSize: data.profil?.setting_ucapan_profil?.size || "10px",
                          textAlign: (data.profil?.setting_ucapan_profil?.position || "center") as any,
                          lineHeight: data.profil?.setting_ucapan_profil?.lineHeight || "1.5",
                        }}
                      >
                        {data.profil?.ucapan_profil || "Maha suci Allah..."}
                      </p>
                    )}

                    <div className="space-y-6 pt-2">
                      {data.profil?.profils?.map((prof: any, idx: number) => (
                        <div key={idx} className="flex flex-col items-center">
                          <FramedPhoto
                            src={prof.foto}
                            bingkai={prof.bingkai || "oval"}
                            className="w-24 h-24"
                            customWidth={prof.foto_width}
                            customHeight={prof.foto_height}
                            overlayUrl={prof.overlay_url}
                            photoScale={prof.foto_scale}
                            photoX={prof.foto_x}
                            photoY={prof.foto_y}
                          />
                          <div className="relative w-full min-h-[80px] mt-2">
                            <div style={getFontStyles(data.profil?.setting_nama_profil || { size: "12px", color: "#ffffff", family: "Inter", position: "center" })} className="font-extrabold">
                              {prof.nama}
                            </div>
                            <div style={getFontStyles(data.profil?.setting_keterangan_profil || { size: "9px", color: "#ffffff", family: "Inter", position: "center" })} className="mt-1 max-w-[180px] mx-auto leading-normal">
                              {prof.keterangan}
                            </div>
                            {prof.urutan_anak && (
                              <div style={getFontStyles(data.profil?.setting_urutan_profil || { size: "8px", color: "#ffffff", family: "Inter", position: "center" })} className="mt-1 max-w-[180px] mx-auto leading-normal italic">
                                {prof.urutan_anak}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PREVIEW: ACARA SECTION */}
                  <div
                    id="preview-acara"
                    className={`p-6 text-center space-y-6 border-b border-dashed ${activeSection === "acara" ? "border-[#d4af37] bg-[#064e3b]/5" : "border-[#064e3b]/10"
                      }`}
                    style={{
                      background: data.acara?.background?.type === "image"
                        ? `linear-gradient(rgba(245, 245, 220, 0.9), rgba(245, 245, 220, 0.9)), url(${data.acara?.background?.value}) center/cover no-repeat`
                        : data.acara?.background?.type === "gradient"
                          ? data.acara?.background?.value
                          : undefined
                    }}
                  >
                    {renderOrnament("acara")}

                    <div className="space-y-4 text-left">
                      {data.acara?.countdown_aktif && (() => {
                        const idx = data.acara.countdown_acara_index ?? 0;
                        const targetEvent = data.acara.acaras?.[idx];
                        if (!targetEvent || !targetEvent.tanggal) return null;
                        const targetDateTime = getTargetDateTime(targetEvent.tanggal, targetEvent.jam || targetEvent.jam_mulai);
                        return (
                          <div className="bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-xl p-3.5 space-y-1.5 text-center">
                            <div className="text-[9px] font-black uppercase tracking-wider opacity-60 text-white">
                              Hitung Mundur Acara
                            </div>
                            <Countdown targetDateStr={targetDateTime} />
                          </div>
                        );
                      })()}

                      <div className="text-center">
                        <span className="text-[9px] font-extrabold text-white uppercase tracking-widest block mb-2">
                          Waktu & Tempat
                        </span>
                      </div>

                      {data.acara?.acaras?.map((evt: any, idx: number) => {
                        const endJam = evt.is_selesai_custom ? (evt.jam_selesai_custom || "Selesai") : evt.jam_selesai;
                        
                        let timeDisplay = "";
                        if (evt.jam) {
                          timeDisplay = evt.jam;
                        } else if (evt.jam_mulai || endJam) {
                          const start = evt.jam_mulai || "";
                          const end = endJam || "";
                          if (end.toLowerCase() === "selesai") {
                            timeDisplay = `${start} WIB – Selesai`;
                          } else if (start && end) {
                            timeDisplay = `${start} – ${end} WIB`;
                          } else {
                            timeDisplay = `${start || end} WIB`;
                          }
                        }

                        let formattedDate = "";
                        if (evt.tanggal) {
                          try {
                            const date = new Date(evt.tanggal);
                            if (!isNaN(date.getTime())) {
                              formattedDate = date.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
                            } else {
                              formattedDate = evt.tanggal;
                            }
                          } catch (e) {
                            formattedDate = evt.tanggal;
                          }
                        }

                        const cardStyle = evt.setting_card?.type || "glass";
                        let cardClass = "relative space-y-2 min-h-[140px] ";
                        if (cardStyle === "none") {
                          cardClass += "p-0 bg-transparent border-none";
                        } else if (cardStyle === "outline") {
                          cardClass += "p-3.5 bg-transparent border border-[#064e3b]/20 rounded-xl";
                        } else if (cardStyle === "solid") {
                          cardClass += "p-3.5 bg-white border border-slate-100 rounded-xl shadow-sm";
                        } else {
                          cardClass += "p-3.5 bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-xl";
                        }

                        return (
                          <div key={idx} className={cardClass}>
                            <h5 style={getFontStyles(data.acara?.setting_nama_acara || { size: "14px", color: "#ffffff", family: "Inter", position: "left" })} className="font-extrabold pb-1.5 flex items-center gap-1.5 border-b border-[#064e3b]/10">
                              <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                              {evt.nama}
                            </h5>
                            <div className="space-y-1 mt-1">
                              {formattedDate && (
                                <p style={getFontStyles(data.acara?.setting_tanggal_acara || { size: "11px", color: "#ffffff", family: "Inter", position: "left" })} className="font-semibold">
                                  Tanggal: {formattedDate}
                                </p>
                              )}
                              {timeDisplay && (
                                <p style={getFontStyles(data.acara?.setting_jam_acara || { size: "10px", color: "#ffffff", family: "Inter", position: "left" })}>
                                  Pukul: {timeDisplay}
                                </p>
                              )}
                              <p style={getFontStyles(data.acara?.setting_alamat_acara || { size: "9px", color: "#064e3b", family: "Inter", position: "left" })} className="leading-normal mt-1">
                                Lokasi: {evt.alamat}
                              </p>
                              {evt.embed_maps && (
                                <div 
                                  className="w-full rounded-lg overflow-hidden mt-1 border border-[#064e3b]/10"
                                  style={{ height: evt.embed_maps_height ? `${evt.embed_maps_height}px` : "112px" }}
                                >
                                  <iframe
                                    src={getMapsEmbedUrl(evt.embed_maps)}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={false}
                                    loading="lazy"
                                  />
                                </div>
                              )}
                              {evt.link_maps && (
                                <div 
                                  className="mt-1"
                                  style={getFontStyles(data.acara?.setting_link_maps_acara || { size: "10px", color: "#d4af37", family: "Inter", position: "left" })}
                                >
                                  <a href={evt.link_maps} target="_blank" className="font-bold hover:underline">
                                    {evt.link_maps_label || "Lihat di Maps →"}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* PREVIEW: CERITA & GALERI SECTION */}
                  <div
                    id="preview-cerita"
                    className={`p-6 text-center space-y-6 border-b border-dashed ${activeSection === "cerita" ? "border-[#d4af37] bg-[#064e3b]/5" : "border-[#064e3b]/10"
                      }`}
                    style={{
                      background: data.cerita?.background?.type === "image"
                        ? `linear-gradient(rgba(245, 245, 220, 0.9), rgba(245, 245, 220, 0.9)), url(${data.cerita?.background?.value}) center/cover no-repeat`
                        : data.cerita?.background?.type === "gradient"
                          ? data.cerita?.background?.value
                          : undefined
                    }}
                  >
                    {renderOrnament("cerita")}
                    {data.cerita?.ceritas?.length > 0 && (
                      <>
                        <span style={getFontStyles(data.cerita?.setting_head_cerita || { size: "18px", color: "#ffffff", family: "Inter", position: "center" })} className="font-extrabold uppercase tracking-widest block">
                          Kisah Perjalanan
                        </span>

                        <div className="space-y-4 text-left relative pl-5 border-l border-dashed border-[#d4af37]/50 ml-1">
                          {data.cerita.ceritas.map((st: any, idx: number) => (
                            <div key={idx} className="relative pb-1">
                              <div className="absolute -left-[25.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#d4af37] ring-4 ring-[#d4af37]/15 border border-white" />
                              <div className="bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-xl p-2.5 space-y-1 relative">
                                <div className="flex items-baseline justify-between gap-2 border-b border-[#064e3b]/5 pb-1 mb-1">
                                  <h6 style={getFontStyles(data.cerita?.setting_judul_cerita || { size: "12px", color: "#ffffff", family: "Inter", position: "left" })} className="font-bold">{st.judul}</h6>
                                  <span style={getFontStyles(data.cerita?.setting_waktu_cerita || { size: "8px", color: "#ffffff", family: "Inter", position: "left" })} className="block font-semibold shrink-0 text-[8px] opacity-75">{st.waktu}</span>
                                </div>
                                <p style={getFontStyles(data.cerita?.setting_isi_cerita || { size: "9.5px", color: "#ffffff", family: "Inter", position: "left" })} className="leading-normal">{st.isi}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {data.cerita?.galeris?.length > 0 && (
                      <>
                        <span style={getFontStyles(data.cerita?.setting_head_galeri || { size: "18px", color: "#ffffff", family: "Inter", position: "center" })} className="font-extrabold uppercase tracking-widest block pt-3">
                          Galeri Foto
                        </span>

                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          {data.cerita.galeris.map((img: string, idx: number) => (
                            <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-[#064e3b]/5 border border-[#064e3b]/10">
                              <img src={img} className="w-full h-full object-cover" alt="" />
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* PREVIEW: PENUTUP SECTION */}
                  <div
                    id="preview-penutup"
                    className={`p-6 text-center space-y-6 pb-12 border-b border-dashed ${activeSection === "penutup" ? "border-[#d4af37] bg-[#064e3b]/5" : "border-transparent"
                      }`}
                    style={{
                      background: data.penutup?.background?.type === "image"
                        ? `linear-gradient(rgba(245, 245, 220, 0.9), rgba(245, 245, 220, 0.9)), url(${data.penutup?.background?.value}) center/cover no-repeat`
                        : data.penutup?.background?.type === "gradient"
                          ? data.penutup?.background?.value
                          : undefined
                    }}
                  >
                    {renderOrnament("penutup")}
                    <span className="text-[9px] font-extrabold text-[#d4af37] uppercase tracking-widest block">
                      Ungkapan Terima Kasih
                    </span>

                    <p className="text-[10px] text-[#064e3b]/70 italic leading-relaxed px-1">
                      {data.penutup?.pesan_penutup}
                    </p>

                    <div className="space-y-1 text-[#064e3b]/80 text-[10px]">
                      <p>{data.penutup?.salam}</p>
                      <p className="font-extrabold mt-3">Kami yang berbahagia,</p>
                      <p className="font-black text-xs text-[#d4af37]">{data.penutup?.tertanda}</p>
                    </div>

                    {/* Cashless Digital Gifts Preview */}
                    {data.penutup?.amplops?.length > 0 && (
                      <div className="pt-4 space-y-2 border-t border-[#064e3b]/10">
                        <span className="text-[8px] font-bold text-[#064e3b]/60 uppercase tracking-widest block">
                          Amplop Digital / Kado
                        </span>
                        <div className="space-y-2">
                          {data.penutup.amplops.map((gift: any, idx: number) => (
                            <div key={idx} className="p-3 bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-xl text-left relative">
                              <span className="text-[8px] font-black text-[#d4af37] block uppercase">{gift.bank}</span>
                              <span className="text-[#064e3b] text-xs font-black block mt-0.5 tracking-wide">{gift.nomor_rekening}</span>
                              <span className="text-[9px] text-[#064e3b]/60 block">A/N: {gift.atas_nama}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Floating Canvas Footer Toolbar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#f5f5dc] border border-[#064e3b]/20 px-5 py-2.5 rounded-full shadow-lg flex items-center gap-6 z-10">
            <div className="flex items-center gap-1">
              <button className="p-1.5 hover:bg-[#064e3b]/5 rounded-lg text-[#064e3b] transition-all cursor-pointer">
                <Undo2 className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-[#064e3b]/5 rounded-lg text-[#064e3b] transition-all cursor-pointer opacity-50">
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            <div className="w-[1px] h-4 bg-[#064e3b]/20" />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewportMode("desktop")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewportMode === "desktop" ? "bg-[#064e3b] text-[#f5f5dc]" : "text-[#064e3b]/60 hover:text-[#064e3b]"
                  }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewportMode("tablet")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewportMode === "tablet" ? "bg-[#064e3b] text-[#f5f5dc]" : "text-[#064e3b]/60 hover:text-[#064e3b]"
                  }`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewportMode("mobile")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewportMode === "mobile" ? "bg-[#064e3b] text-[#f5f5dc]" : "text-[#064e3b]/60 hover:text-[#064e3b]"
                  }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <div className="w-[1px] h-4 bg-[#064e3b]/20" />

            <button className="p-1.5 hover:bg-[#064e3b]/5 rounded-lg text-[#064e3b] transition-all cursor-pointer">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </main>

        {/* COLUMN 3: RIGHT PROPERTIES SIDEBAR (Width: 360px) */}
        <aside className="w-full lg:w-90 border-t lg:border-t-0 lg:border-l border-[#064e3b]/10 flex flex-col min-h-0 bg-[#f5f5dc] shrink-0">

          {/* Header Title properties */}
          <div className="px-4 py-3 border-b border-[#064e3b]/10 flex items-center justify-between shrink-0 bg-[#f5f5dc]">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#064e3b] flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#d4af37]" />
              Properties
            </h3>
            <span className="text-[9px] font-black uppercase bg-[#064e3b]/10 text-[#064e3b] px-2 py-0.5 rounded">
              {activeSection} selected
            </span>
          </div>

          {/* Properties sub-tabs */}
          <div className="grid grid-cols-4 border-b border-[#064e3b]/10 bg-[#f5f5dc]/50 p-1 shrink-0 gap-0.5">
            {[
              { id: "typography", icon: <Type className="w-4 h-4" />, label: "Type" },
              { id: "appearance", icon: <Paintbrush className="w-4 h-4" />, label: "Style" },
              { id: "ornaments", icon: <Compass className="w-4 h-4" />, label: "Ornament" },
              { id: "animations", icon: <Activity className="w-4 h-4" />, label: "Anim" }
            ].map((subTab) => (
              <button
                key={subTab.id}
                onClick={() => setRightPanelTab(subTab.id as any)}
                title={subTab.label}
                className={`py-1.5 flex flex-col items-center justify-center rounded-lg transition-all cursor-pointer ${rightPanelTab === subTab.id
                    ? "bg-[#064e3b] text-[#f5f5dc]"
                    : "text-[#064e3b]/60 hover:text-[#064e3b] hover:bg-[#064e3b]/5"
                  }`}
              >
                {subTab.icon}
                <span className="text-[7.5px] font-bold mt-0.5 uppercase tracking-tighter">{subTab.label}</span>
              </button>
            ))}
          </div>

          {/* Scrollable inputs wrapper */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs text-[#064e3b]">


            {/* TAB: TYPOGRAPHY CONTROLS */}
            {rightPanelTab === "typography" && (
              <div className="space-y-4">
                <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-[#d4af37] border-b border-[#064e3b]/10 pb-1">Typography Properties</h4>

                {/* Element Selector if multiple options exist */}
                {(() => {
                  const options = getFontOptions();
                  if (options.length <= 1) return null;
                  return (
                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold uppercase opacity-75">Elemen Teks yang Diedit</label>
                      <select
                        value={fontConfig.key}
                        onChange={(e) => setSelectedFontKey(e.target.value)}
                        className="w-full px-3 py-2 bg-[#f5f5dc] border border-[#064e3b]/20 rounded-xl text-xs text-[#064e3b] outline-none font-bold"
                      >
                        {options.map((opt) => (
                          <option key={opt.key} value={opt.key}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  );
                })()}

                <div className="space-y-2">
                  <label className="block text-[10px] font-extrabold uppercase opacity-75 font-bold">Font Family (Jenis Huruf)</label>
                  <select
                    value={fontConfig.data.family || "Inter"}
                    onChange={(e) => updateFont(activeSection, fontConfig.key, "family", e.target.value)}
                    className="w-full px-3 py-2 bg-[#f5f5dc] border border-[#064e3b]/20 rounded-xl text-xs text-[#064e3b] outline-none"
                  >
                    <option value="Playfair Display">Playfair Display (Elegant)</option>
                    <option value="Alex Brush">Alex Brush (Calligraphy)</option>
                    <option value="Great Vibes">Great Vibes (Romantic)</option>
                    <option value="Sacramento">Sacramento (Sweet)</option>
                    <option value="Pinyon Script">Pinyon Script (Classic)</option>
                    <option value="Inter">Inter (Minimalis)</option>
                    <option value="Outfit">Outfit (Clean)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-extrabold uppercase opacity-75">Font Size (Ukuran: {fontConfig.data.size || "36px"})</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="12"
                      max="80"
                      value={parseInt(fontConfig.data.size) || 36}
                      onChange={(e) => updateFont(activeSection, fontConfig.key, "size", `${e.target.value}px`)}
                      className="flex-1 accent-[#d4af37] h-1 bg-[#064e3b]/10 rounded-full appearance-none cursor-pointer"
                    />
                    <span className="font-bold shrink-0 w-10 text-right">{fontConfig.data.size || "36px"}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-extrabold uppercase opacity-75">Warna Huruf (Text Color)</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={fontConfig.data.color || "#064e3b"}
                      onChange={(e) => updateFont(activeSection, fontConfig.key, "color", e.target.value)}
                      className="w-8 h-8 bg-transparent border border-[#064e3b]/20 rounded-lg cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={fontConfig.data.color || "#064e3b"}
                      onChange={(e) => updateFont(activeSection, fontConfig.key, "color", e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/20 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-extrabold uppercase opacity-75">Posisi (Alignment)</label>
                  <select
                    value={fontConfig.data.position || "center"}
                    onChange={(e) => updateFont(activeSection, fontConfig.key, "position", e.target.value)}
                    className="w-full px-3 py-2 bg-[#f5f5dc] border border-[#064e3b]/20 rounded-xl text-xs text-[#064e3b] outline-none"
                  >
                    <option value="left">Kiri</option>
                    <option value="center">Tengah</option>
                    <option value="right">Kanan</option>
                    <option value="custom">Custom (X, Y)</option>
                  </select>
                </div>

                {fontConfig.data.position === "custom" && (
                  <div className="p-3 bg-[#064e3b]/5 border border-[#064e3b]/10 rounded-xl space-y-3">
                    <div className="space-y-1">
                      <label className="block text-[8px] font-extrabold uppercase opacity-60">Posisi X ({fontConfig.data.x ?? 50}%)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={fontConfig.data.x ?? 50}
                          onChange={(e) => updateFont(activeSection, fontConfig.key, "x", parseInt(e.target.value))}
                          className="flex-1 accent-[#d4af37] h-1"
                        />
                        <span className="text-[9px] font-bold text-[#064e3b]">{fontConfig.data.x ?? 50}%</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[8px] font-extrabold uppercase opacity-60">Posisi Y ({fontConfig.data.y ?? 50}%)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={fontConfig.data.y ?? 50}
                          onChange={(e) => updateFont(activeSection, fontConfig.key, "y", parseInt(e.target.value))}
                          className="flex-1 accent-[#d4af37] h-1"
                        />
                        <span className="text-[9px] font-bold text-[#064e3b]">{fontConfig.data.y ?? 50}%</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-[10px] font-extrabold uppercase opacity-75">Animasi Masuk (Entrance Animation)</label>
                  <select
                    value={fontConfig.data.animation || "none"}
                    onChange={(e) => updateFont(activeSection, fontConfig.key, "animation", e.target.value)}
                    className="w-full px-3 py-2 bg-[#f5f5dc] border border-[#064e3b]/20 rounded-xl text-xs text-[#064e3b] outline-none"
                  >
                    <option value="none">Tanpa Animasi</option>
                    <option value="fade-in">Fade In</option>
                    <option value="slide-up">Slide Up</option>
                    <option value="zoom-in">Zoom In</option>
                    <option value="bounce">Bounce</option>
                  </select>
                </div>
              </div>
            )}

            {/* TAB: APPEARANCE (STYLE) CONTROLS */}
            {rightPanelTab === "appearance" && (
              <div className="space-y-4">
                <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-[#d4af37] border-b border-[#064e3b]/10 pb-1">Background Appearance</h4>

                <div className="space-y-3">
                  <label className="block text-[10px] font-extrabold uppercase opacity-75">Tipe Latar Belakang</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["solid", "gradient", "image"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          const val = type === "solid" ? "#f5f5dc" : type === "gradient" ? "linear-gradient(to bottom, #f5f5dc, #e1dcb9)" : "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200";
                          updateData(activeSection, "background", { type, value: val });
                        }}
                        className={`py-1.5 rounded-lg text-[10px] font-bold border capitalize transition-all cursor-pointer ${data[activeSection]?.background?.type === type
                            ? "bg-[#064e3b] border-[#064e3b] text-white"
                            : "bg-[#f5f5dc] border-[#064e3b]/15 text-[#064e3b]/60 hover:text-[#064e3b]"
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1 pt-1">
                    <label className="block text-[9px] font-semibold opacity-60">
                      {data[activeSection]?.background?.type === "image" ? "Gambar URL" : "Warna Hex / CSS Gradient"}
                    </label>
                    <input
                      type="text"
                      value={data[activeSection]?.background?.value || ""}
                      onChange={(e) => {
                        updateData(activeSection, "background", {
                          type: data[activeSection]?.background?.type || "solid",
                          value: e.target.value
                        });
                      }}
                      placeholder={
                        data[activeSection]?.background?.type === "image"
                          ? "Masukkan URL Gambar (https://...)"
                          : "e.g. #f5f5dc / linear-gradient(...)"
                      }
                      className="w-full px-3 py-2 bg-[#f5f5dc] border border-[#064e3b]/20 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl text-xs outline-none"
                    />
                  </div>
                </div>

                {activeSection === "cover" && (
                  <div className="pt-4 mt-4 border-t border-[#064e3b]/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-[#d4af37]">Garis Bingkai Cover</h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.cover?.setting_bingkai?.enabled || false}
                          onChange={(e) => {
                            const current = data.cover?.setting_bingkai || {};
                            updateData("cover", "setting_bingkai", { ...current, enabled: e.target.checked });
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#064e3b]"></div>
                      </label>
                    </div>

                    {data.cover?.setting_bingkai?.enabled && (
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase opacity-75 block">Ketebalan</label>
                          <select
                            value={data.cover?.setting_bingkai?.width || "2px"}
                            onChange={(e) => {
                              const current = data.cover?.setting_bingkai || {};
                              updateData("cover", "setting_bingkai", { ...current, width: e.target.value });
                            }}
                            className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/20 rounded-lg text-xs outline-none"
                          >
                            <option value="1px">1px</option>
                            <option value="2px">2px</option>
                            <option value="3px">3px</option>
                            <option value="4px">4px</option>
                            <option value="5px">5px</option>
                            <option value="6px">6px</option>
                            <option value="8px">8px</option>
                            <option value="10px">10px</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase opacity-75 block">Gaya Garis</label>
                          <select
                            value={data.cover?.setting_bingkai?.style || "solid"}
                            onChange={(e) => {
                              const current = data.cover?.setting_bingkai || {};
                              updateData("cover", "setting_bingkai", { ...current, style: e.target.value });
                            }}
                            className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/20 rounded-lg text-xs outline-none"
                          >
                            <option value="solid">Solid (Polos)</option>
                            <option value="double">Double (Ganda)</option>
                            <option value="dashed">Dashed (Putus-putus)</option>
                            <option value="dotted">Dotted (Titik-titik)</option>
                            <option value="groove">Groove (Ukiran)</option>
                            <option value="ridge">Ridge (Timbul)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase opacity-75 block">Jarak dari Tepi</label>
                          <select
                            value={data.cover?.setting_bingkai?.padding || "16px"}
                            onChange={(e) => {
                              const current = data.cover?.setting_bingkai || {};
                              updateData("cover", "setting_bingkai", { ...current, padding: e.target.value });
                            }}
                            className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/20 rounded-lg text-xs outline-none"
                          >
                            <option value="8px">8px</option>
                            <option value="12px">12px</option>
                            <option value="16px">16px</option>
                            <option value="20px">20px</option>
                            <option value="24px">24px</option>
                            <option value="28px">28px</option>
                            <option value="32px">32px</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase opacity-75 block">Radius Sudut</label>
                          <select
                            value={data.cover?.setting_bingkai?.radius || "12px"}
                            onChange={(e) => {
                              const current = data.cover?.setting_bingkai || {};
                              updateData("cover", "setting_bingkai", { ...current, radius: e.target.value });
                            }}
                            className="w-full px-2.5 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/20 rounded-lg text-xs outline-none"
                          >
                            <option value="0px">Tajam (0px)</option>
                            <option value="8px">Bulat Kecil (8px)</option>
                            <option value="12px">Bulat Sedang (12px)</option>
                            <option value="16px">Bulat Besar (16px)</option>
                            <option value="20px">Bulat Extra (20px)</option>
                            <option value="24px">Sangat Bulat (24px)</option>
                          </select>
                        </div>

                        <div className="col-span-2 space-y-1">
                          <label className="text-[9px] font-bold uppercase opacity-75 block">Warna Garis</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={data.cover?.setting_bingkai?.color || "#d4af37"}
                              onChange={(e) => {
                                const current = data.cover?.setting_bingkai || {};
                                updateData("cover", "setting_bingkai", { ...current, color: e.target.value });
                              }}
                              className="w-8 h-8 bg-transparent border border-[#064e3b]/20 rounded-lg cursor-pointer shrink-0"
                            />
                            <input
                              type="text"
                              value={data.cover?.setting_bingkai?.color || "#d4af37"}
                              onChange={(e) => {
                                const current = data.cover?.setting_bingkai || {};
                                updateData("cover", "setting_bingkai", { ...current, color: e.target.value });
                              }}
                              className="flex-1 px-3 py-1.5 bg-[#f5f5dc] border border-[#064e3b]/20 rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB: CULTURAL ORNAMENTS CONTROLS */}
            {rightPanelTab === "ornaments" && (
              <div className="space-y-4">
                <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-[#d4af37] border-b border-[#064e3b]/10 pb-1">Cultural Ornaments</h4>
                <p className="text-[10px] text-[#064e3b]/60 leading-normal">Pilih motif hiasan nusantara untuk mempercantik bagian atas atau bawah section ini.</p>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => updateData(activeSection, "ornament", null)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${!data[activeSection]?.ornament
                        ? "bg-[#064e3b]/10 border-[#d4af37] font-bold"
                        : "bg-[#f5f5dc] border-[#064e3b]/10 hover:border-[#064e3b]/30"
                      }`}
                  >
                    <div className="h-8 flex items-center justify-center text-[10px] text-[#064e3b]/40">None</div>
                    <span className="text-[10px] block mt-1 font-extrabold">Tanpa Hiasan</span>
                  </button>

                  {culturalOrnaments.map((orn) => (
                    <button
                      key={orn.id}
                      onClick={() => updateData(activeSection, "ornament", orn.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${data[activeSection]?.ornament === orn.id
                          ? "bg-[#064e3b]/10 border-[#d4af37] font-bold text-[#d4af37]"
                          : "bg-[#f5f5dc] border-[#064e3b]/10 hover:border-[#064e3b]/30"
                        }`}
                    >
                      <div className="h-8 flex items-center justify-center overflow-hidden">
                        {orn.svg}
                      </div>
                      <span className="text-[10px] block mt-1 font-extrabold text-[#064e3b]">
                        {orn.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: ANIMATIONS CONTROLS */}
            {rightPanelTab === "animations" && (
              <div className="space-y-4">
                <h4 className="font-extrabold text-[11px] uppercase tracking-wider text-[#d4af37] border-b border-[#064e3b]/10 pb-1">Animations (Framer Motion)</h4>

                <div className="space-y-2">
                  <label className="block text-[10px] font-extrabold uppercase opacity-75">Entrance Effect (Animasi Masuk)</label>
                  <select
                    value={data[activeSection]?.animation?.entrance || "fade-in"}
                    onChange={(e) => {
                      updateData(activeSection, "animation", {
                        ...data[activeSection]?.animation,
                        entrance: e.target.value
                      });
                    }}
                    className="w-full px-3 py-2 bg-[#f5f5dc] border border-[#064e3b]/20 rounded-xl text-xs text-[#064e3b] outline-none"
                  >
                    <option value="fade-in">Fade In (Lembut)</option>
                    <option value="slide-up">Slide Up (Mengambang)</option>
                    <option value="zoom-in">Zoom In (Membesar)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-extrabold uppercase opacity-75">Duration (Durasi: {data[activeSection]?.animation?.duration || "1.2s"})</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.1"
                      value={parseFloat(data[activeSection]?.animation?.duration) || 1.2}
                      onChange={(e) => {
                        updateData(activeSection, "animation", {
                          ...data[activeSection]?.animation,
                          duration: `${e.target.value}s`
                        });
                      }}
                      className="flex-1 accent-[#d4af37] h-1 bg-[#064e3b]/10 rounded-full appearance-none cursor-pointer"
                    />
                    <span className="font-bold shrink-0 w-8 text-right">{data[activeSection]?.animation?.duration || "1.2s"}</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Reset settings button bottom */}
          <div className="p-3 border-t border-[#064e3b]/10 bg-[#f5f5dc] shrink-0">
            <button
              onClick={() => {
                if (confirm("Apakah Anda yakin ingin mereset perubahan section ini?")) {
                  // Reset key data models to initial DB values
                  setData(invitation.data_undangan_json);
                }
              }}
              className="w-full py-2 bg-[#064e3b]/5 hover:bg-[#064e3b]/10 border border-[#064e3b]/20 rounded-lg text-[#064e3b] font-extrabold text-[10px] uppercase tracking-wider text-center transition-all cursor-pointer"
            >
              Reset Settings
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}
