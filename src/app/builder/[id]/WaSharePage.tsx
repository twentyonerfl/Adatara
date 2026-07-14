"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Send,
  Copy,
  Users,
  Eye,
  CheckCircle,
  Sparkles,
  ArrowLeft,
  User,
  ExternalLink,
  MessageSquare,
  FileText
} from "lucide-react";

interface Props {
  invitation: {
    id: string;
    slug: string;
    status: string;
    data_undangan_json: any;
    template?: {
      nama_template?: string;
      kategori?: string;
    } | null;
    user?: {
      name?: string | null;
      email?: string | null;
    } | null;
  };
}

export default function WaSharePage({ invitation }: Props) {
  const [guestName, setGuestName] = useState("");
  const [linkType, setLinkType] = useState<"path" | "query">("path");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Batch states
  const [batchInput, setBatchInput] = useState("");
  const [batchResults, setBatchResults] = useState<
    Array<{ name: string; url: string; waUrl: string }>
  >([]);

  const getBaseUrl = () =>
    typeof window !== "undefined"
      ? window.location.origin
      : "https://adatara.my.id";

  const primaryInvitationUrl = `${getBaseUrl()}/${invitation.slug}`;

  const customGuestUrl = guestName.trim()
    ? linkType === "query"
      ? `${primaryInvitationUrl}?to=${encodeURIComponent(guestName.trim())}`
      : `${primaryInvitationUrl}/${encodeURIComponent(
          guestName.trim().replace(/ /g, "+")
        )}`
    : primaryInvitationUrl;

  const data = invitation.data_undangan_json || {};
  const coupleName =
    data.cover?.nama_acara ||
    data.penutup?.tertanda ||
    invitation.slug ||
    "Mempelai";

  const shareTextMessage = `*Undangan Pernikahan ${coupleName}*\n\nKepada Yth. Bpk/Ibu/Saudara/i\n*${
    guestName.trim() || "Tamu Undangan"
  }*\n\nTanpa mengurangi rasa hormat, kami mengundang Anda untuk menghadiri acara pernikahan kami:\n\nLink Undangan:\n${customGuestUrl}\n\nTerima kasih.`;

  const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    shareTextMessage
  )}`;

  const handleCopyLink = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleGenerateBatch = () => {
    const names = batchInput
      .split("\n")
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    const results = names.map((name) => {
      const gUrl =
        linkType === "query"
          ? `${primaryInvitationUrl}?to=${encodeURIComponent(name)}`
          : `${primaryInvitationUrl}/${encodeURIComponent(
              name.replace(/ /g, "+")
            )}`;

      const msg = `*Undangan Pernikahan ${coupleName}*\n\nKepada Yth. Bpk/Ibu/Saudara/i\n*${name}*\n\nTanpa mengurangi rasa hormat, kami mengundang Anda untuk menghadiri acara pernikahan kami:\n\nLink Undangan:\n${gUrl}\n\nTerima kasih.`;
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        msg
      )}`;
      return { name, url: gUrl, waUrl };
    });

    setBatchResults(results);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fefcf6] text-[#064e3b] font-sans pb-16">
      {/* TOP HEADER */}
      <header className="sticky top-0 bg-[#064e3b] text-white px-4 py-3 sm:px-6 sm:py-4 shadow-md flex items-center justify-between z-30 border-b border-[#d4af37]/20">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/dashboard/invitations"
            className="p-2 hover:bg-white/10 rounded-xl transition-all shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-[#d4af37]" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-sm sm:text-lg tracking-widest text-[#d4af37] shrink-0">
                ADATARA
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                {invitation.template?.kategori || "Pernikahan"}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-white/80 truncate max-w-[200px] sm:max-w-none">
              {coupleName} ({invitation.slug})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={primaryInvitationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-[#d4af37] hover:bg-[#c49f27] text-[#064e3b] rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md"
          >
            <Eye className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Buka Undangan Live</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-8 flex-1 flex flex-col gap-6">
        {/* BANNER STATUS */}
        <div className="bg-white border-2 border-emerald-500/30 rounded-3xl p-6 shadow-xl flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center border border-emerald-300 shadow-sm shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-emerald-900 flex items-center gap-2">
                Generator Undangan & Share WhatsApp 🟢
              </h1>
              <p className="text-xs text-slate-500">
                Undangan siap dibagikan kepada keluarga & sahabat via WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* CARD GENERATOR SINGLE TAMU */}
        <div className="bg-white border border-[#064e3b]/15 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <Send className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-base font-black text-[#064e3b] uppercase tracking-wider">
              1. Generator Tamu Perorangan
            </h2>
          </div>

          <div className="space-y-4">
            {/* Input Nama Tamu */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-[#064e3b]/80 block">
                Nama Tamu Undangan:
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#064e3b]/40" />
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Masukkan Nama Tamu (contoh: Budi & Istri / Keluarga Pak Hermawan)"
                  className="w-full pl-10 pr-4 py-3 bg-[#f5f5dc]/20 border border-[#064e3b]/20 focus:border-[#d4af37] rounded-2xl text-sm text-[#064e3b] outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Opsi Link Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-[#064e3b]/80 block">
                Format Tautan (URL):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLinkType("path")}
                  className={`py-2 px-3 border rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                    linkType === "path"
                      ? "bg-[#064e3b] text-white border-[#d4af37]"
                      : "bg-white text-[#064e3b] border-[#064e3b]/15 hover:bg-[#064e3b]/5"
                  }`}
                >
                  Sub-Route (/{guestName ? encodeURIComponent(guestName.replace(/ /g, "+")) : "Nama"})
                </button>
                <button
                  type="button"
                  onClick={() => setLinkType("query")}
                  className={`py-2 px-3 border rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                    linkType === "query"
                      ? "bg-[#064e3b] text-white border-[#d4af37]"
                      : "bg-white text-[#064e3b] border-[#064e3b]/15 hover:bg-[#064e3b]/5"
                  }`}
                >
                  Query Param (?to={guestName ? encodeURIComponent(guestName) : "Nama"})
                </button>
              </div>
            </div>

            {/* Preview Tautan Generated */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 block">
                Link Hasil Generate:
              </span>
              <p className="text-xs font-mono font-bold text-[#064e3b] truncate select-all">
                {customGuestUrl}
              </p>
            </div>

            {/* Preview Draft WhatsApp */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-[#064e3b]/80 flex items-center justify-between">
                <span>Preview Pesan WhatsApp:</span>
                <button
                  type="button"
                  onClick={() => handleCopyText(shareTextMessage)}
                  className="text-[10px] font-bold text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3 h-3" />
                  {copiedText ? "Tersalin!" : "Salin Teks Pesan"}
                </button>
              </label>
              <textarea
                readOnly
                rows={5}
                value={shareTextMessage}
                className="w-full p-3 bg-emerald-950 text-emerald-100 font-mono text-xs rounded-2xl border border-emerald-800 outline-none resize-none leading-relaxed select-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={waShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-4 bg-[#25d366] hover:bg-[#20ba5a] text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Kirim Ke WhatsApp 🟢
              </a>
              <button
                type="button"
                onClick={() => handleCopyLink(customGuestUrl)}
                className="py-3.5 px-4 bg-[#064e3b] hover:bg-[#064e3b]/95 text-white border border-[#d4af37] rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <Copy className="w-4 h-4 text-[#d4af37]" />
                {copiedLink ? "Link Tersalin!" : "Salin Link Tamu"}
              </button>
            </div>
          </div>
        </div>

        {/* CARD GENERATOR BANYAK TAMU (BATCH) */}
        <div className="bg-white border border-[#064e3b]/15 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <Users className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-base font-black text-[#064e3b] uppercase tracking-wider">
              2. Generator Banyak Tamu (Batch Massal)
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-[#064e3b]/80 block">
                Daftar Nama Tamu (Satu Nama Per Baris):
              </label>
              <textarea
                rows={5}
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
                placeholder={"Contoh:\nBudi Santoso\nAni & Suami\nKeluarga Besar Hermawan\nBapak H. Ahmad"}
                className="w-full p-4 bg-[#f5f5dc]/20 border border-[#064e3b]/20 focus:border-[#d4af37] rounded-2xl text-xs text-[#064e3b] outline-none transition-all leading-relaxed"
              />
            </div>

            <button
              type="button"
              onClick={handleGenerateBatch}
              className="w-full py-3 bg-[#064e3b] hover:bg-[#064e3b]/95 text-white border border-[#d4af37] rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              Generate Tautan Tamu Massal (
              {
                batchInput
                  .split("\n")
                  .map((n) => n.trim())
                  .filter((n) => n.length > 0).length
              }{" "}
              Tamu)
            </button>

            {batchResults.length > 0 && (
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <span className="text-xs font-black uppercase text-[#064e3b] block">
                  Daftar Tautan Tamu Berhasil Dibuat ({batchResults.length}):
                </span>

                <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto pr-1">
                  {batchResults.map((item, idx) => (
                    <div
                      key={idx}
                      className="py-3 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-[#064e3b] truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] font-mono text-slate-500 truncate select-all">
                          {item.url}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(item.url);
                            alert(`Link untuk ${item.name} telah disalin!`);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#064e3b] border rounded-xl text-[10px] font-bold cursor-pointer"
                        >
                          Salin Link
                        </button>
                        <a
                          href={item.waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#25d366] hover:bg-[#20ba5a] text-white rounded-xl text-[10px] font-black flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" /> WA
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
    </div>
  );
}
