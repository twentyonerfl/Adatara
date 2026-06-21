"use client";

import { useState, useRef, useEffect } from "react";
import { getBgStyle, FontSettingsWidget, BackgroundWidget, SectionInput, InputField, FileUploader, ButtonSettingsWidget, CardSettingsWidget, FramedPhoto, BingkaiCoverWidget, PhotoStyleWidget } from "./BuilderWidgets";
import { KATEGORI_OPTIONS, FONT_FAMILIES, KATEGORI_EN_MAP } from "./builder-constants";
import { Plus, Trash2, Play, Pause, Search, Loader2, Music } from "lucide-react";

// ─── COVER TAB ───────────────────────────────────────────────────────────────

export function CoverForm({ data, onChange, musicLibrary, mode }: { data: any; onChange: (d: any) => void; musicLibrary: any[]; mode?: "data" | "settings" }) {
  const upd = (key: string, val: any) => onChange({ ...data, [key]: val });

  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const [playingYoutubeId, setPlayingYoutubeId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleAudio = (url: string, startSec = 0) => {
    setPlayingYoutubeId(null);

    if (playingUrl === url) {
      audioRef.current?.pause();
      setPlayingUrl(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      if (startSec > 0) {
        audio.addEventListener("loadedmetadata", () => {
          audio.currentTime = startSec;
        });
      }
      audio.play().catch(err => console.error("Audio playback error:", err));
      setPlayingUrl(url);
      audio.onended = () => {
        setPlayingUrl(null);
      };
    }
  };

  const toggleYoutube = (id: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingUrl(null);

    if (playingYoutubeId === id) {
      setPlayingYoutubeId(null);
    } else {
      setPlayingYoutubeId(id);
    }
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="space-y-4">
      {/* ── DATA SECTION ── */}
      {(!mode || mode === "data") && (
        <>
          <SectionInput label="Nama Pasangan / Acara Utama">
            <InputField
              label=""
              value={data.nama_acara || ""}
              onChange={v => upd("nama_acara", v)}
              placeholder="contoh: Aditya & Tara"
            />
          </SectionInput>
          <SectionInput label="Musik Latar">
            <div className="space-y-4">
              {/* Active selection display */}
              {data.music_url && (
                <div className="space-y-2">
                  <div className="p-2.5 bg-[#064e3b]/5 border border-[#d4af37]/20 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded bg-[#d4af37]/10 flex items-center justify-center flex-shrink-0">
                        <Music className="w-4 h-4 text-[#d4af37]" />
                      </div>
                      <div className="flex-1 min-w-0 font-sans text-left">
                        <p className="text-[8px] font-black uppercase text-[#d4af37] tracking-widest">Aktif</p>
                        <p className="text-xs font-black text-[#064e3b] truncate">{data.music_title || "Musik Latar"}</p>
                        <p className="text-[9px] font-semibold text-[#064e3b]/60 truncate mt-0.5">{data.music_artist || "Artis tidak diketahui"}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const ytId = getYoutubeId(data.music_url);
                        if (ytId) {
                          toggleYoutube(ytId);
                        } else {
                          toggleAudio(data.music_url, Number(data.music_start_second || 0));
                        }
                      }}
                      className="p-1.5 bg-[#064e3b] hover:bg-[#064e3b]/90 text-white rounded-lg border border-[#d4af37]/30 flex items-center justify-center transition-all flex-shrink-0"
                    >
                      {((playingYoutubeId && playingYoutubeId === getYoutubeId(data.music_url)) || (playingUrl && playingUrl === data.music_url)) ? (
                        <Pause className="w-3 h-3 fill-white animate-pulse" />
                      ) : (
                        <Play className="w-3 h-3 fill-white" />
                      )}
                    </button>
                  </div>

                  {/* Trim/Start Duration Field */}
                  <div className="p-3 bg-white border border-[#064e3b]/10 rounded-xl space-y-1.5 text-left">
                    <label className="text-[9px] font-black uppercase tracking-wider text-[#064e3b]/60 block">
                      Mulai dari Detik Ke-
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={data.music_start_second || 0}
                      onChange={e => {
                        const val = parseInt(e.target.value, 10) || 0;
                        upd("music_start_second", val);
                      }}
                      placeholder="Contoh: 15 (untuk mulai dari detik 15)"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#064e3b]/20 rounded-xl outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>
              )}

              {/* 2. iTunes Search */}
              <div className="p-3 bg-[#064e3b]/5 rounded-xl border border-[#064e3b]/10 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#d4af37] text-left">iTunes Music Library (30 Detik)</p>
                <ItunesMusicSearch
                  playingUrl={playingUrl}
                  toggleAudio={toggleAudio}
                  onSelect={track => {
                    onChange({
                      ...data,
                      music_library_id: "itunes-" + track.trackId,
                      music_url: track.previewUrl,
                      music_title: track.trackName,
                      music_artist: track.artistName,
                    });
                  }}
                />
              </div>

              {/* 3. YouTube Loader */}
              <div className="p-3 bg-[#064e3b]/5 rounded-xl border border-[#064e3b]/10 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#d4af37] text-left">YouTube Video / Lagu (Full)</p>
                <YoutubeMusicLoader
                  playingYoutubeId={playingYoutubeId}
                  toggleYoutube={toggleYoutube}
                  onSelect={video => {
                    onChange({
                      ...data,
                      music_library_id: "youtube-" + video.video_id,
                      music_url: `https://www.youtube.com/watch?v=${video.video_id}`,
                      music_title: video.title,
                      music_artist: video.author_name,
                    });
                  }}
                />
              </div>

              {/* 4. Local Upload */}
              <FileUploader
                label="Atau Upload Musik Kustom (mp3)"
                value={data.music_url || ""}
                onChange={v => {
                  onChange({
                    ...data,
                    music_library_id: v ? "custom-upload" : undefined,
                    music_url: v,
                    music_title: v ? "Kustom (Uploaded)" : "",
                    music_artist: v ? "Local Audio" : "",
                  });
                }}
                accept="audio/*"
                type="audio"
              />
            </div>
          </SectionInput>
        </>
      )}

      {/* ── SETTINGS SECTION ── */}
      {(!mode || mode === "settings") && (
        <>
          <FontSettingsWidget label="Setting Font Judul Acara" value={data.setting_font || {}} onChange={v => upd("setting_font", v)} />
          <FontSettingsWidget label="Setting Font Nama Acara/Pasangan" value={data.setting_nama || {}} onChange={v => upd("setting_nama", v)} />
          <ButtonSettingsWidget label="Setting Tombol Buka Undangan" value={data.setting_tombol || {}} onChange={v => upd("setting_tombol", v)} />
          <BackgroundWidget value={data.background || { type: "solid", value: "#f5f5dc" }} onChange={v => upd("background", v)} />
          <BingkaiCoverWidget label="Bingkai Garis Cover" value={data.setting_bingkai || { enabled: false }} onChange={v => upd("setting_bingkai", v)} />
        </>
      )}

      {/* Hidden YouTube player iframe */}
      {playingYoutubeId && (
        <iframe
          src={`https://www.youtube.com/embed/${playingYoutubeId}?autoplay=1&enablejsapi=1${playingYoutubeId === getYoutubeId(data.music_url) && data.music_start_second
            ? `&start=${data.music_start_second}`
            : ""
            }`}
          allow="autoplay"
          className="w-0 h-0 absolute pointer-events-none opacity-0"
        />
      )}
    </div>
  );
}

export function CoverPreview({ 
  data, 
  meta, 
  onOpen, 
  guestName 
}: { 
  data: any; 
  meta: any; 
  onOpen?: () => void; 
  guestName?: string; 
}) {
  const bg = getBgStyle(data.background);
  const fontTitle = data.setting_font || {};
  const fontNama = data.setting_nama || {};
  const btn = data.setting_tombol || {};

  const isTitleCustom = fontTitle.position === "custom";
  const isNamaCustom = fontNama.position === "custom";
  const isBtnCustom = btn.position === "custom";

  // Tentukan label kategori sesuai bahasa yang dipilih
  const bahasa: "id" | "en" = meta.bahasa ?? data.bahasa ?? "id";
  const kategoriId = meta.kategori || data.kategori || "";
  const kategoriLabel = bahasa === "en"
    ? ((KATEGORI_EN_MAP[kategoriId] ?? kategoriId) || "Digital")
    : (kategoriId || "Digital");
  const displayKategori = bahasa === "en" ? kategoriLabel : `Undangan ${kategoriLabel}`;

  return (
    <div className="w-full h-full min-h-[512px] flex flex-col items-center justify-center relative overflow-hidden rounded-2xl"
      style={bg}>
      {data.background?.type === "video" && data.background?.value && (
        <video 
          key={data.background.value}
          src={data.background.value}
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Cover Border Frame */}
      {data.setting_bingkai?.enabled && (
        <div
          className="absolute pointer-events-none z-20"
          style={{
            top: data.setting_bingkai.padding || "16px",
            bottom: data.setting_bingkai.padding || "16px",
            left: data.setting_bingkai.padding || "16px",
            right: data.setting_bingkai.padding || "16px",
            borderWidth: data.setting_bingkai.width || "2px",
            borderStyle: data.setting_bingkai.style || "solid",
            borderColor: data.setting_bingkai.color || "#d4af37",
            borderRadius: data.setting_bingkai.radius || "12px",
          }}
        />
      )}

      {/* Absolute positioned custom elements */}
      {isTitleCustom && (
        <div
          style={{
            fontSize: fontTitle.size,
            color: fontTitle.color,
            fontFamily: fontTitle.family,
            lineHeight: 1.2,
            position: "absolute",
            left: `${fontTitle.x ?? 50}%`,
            top: `${fontTitle.y ?? 35}%`,
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: "90%",
          }}
          className="font-bold z-10"
        >
          {displayKategori}
        </div>
      )}

      {isNamaCustom && (
        <div
          style={{
            fontSize: fontNama.size,
            color: fontNama.color,
            fontFamily: fontNama.family,
            lineHeight: 1.2,
            position: "absolute",
            left: `${fontNama.x ?? 50}%`,
            top: `${fontNama.y ?? 48}%`,
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: "90%",
          }}
          className="font-bold z-10"
        >
          {data.nama_acara || "Nama & Nama"}
        </div>
      )}

      {/* ── GRUP TAMU & TOMBOL (CUSTOM ABSOLUTE) ── */}
      {isBtnCustom && (
        <div
          style={{
            position: "absolute",
            left: `${btn.x ?? 50}%`,
            top: `${btn.y ?? 65}%`,
            transform: "translate(-50%, -50%)",
            width: "90%",
          }}
          className="flex flex-col items-center text-center gap-2.5 z-10"
        >
          <div className="space-y-1 flex flex-col items-center">
            <span className="text-[10px] opacity-75 block font-medium" style={{ color: fontTitle.color }}>
              Kepada Yth. Bpk/Ibu/Saudara/i
            </span>
            <div className="inline-block px-3.5 py-1 bg-white/10 backdrop-blur-sm border rounded-xl text-[11px] font-bold shadow-sm"
              style={{ color: fontTitle.color, borderColor: fontTitle.color && fontTitle.color.startsWith("#") ? fontTitle.color + '20' : 'rgba(255,255,255,0.2)' }}
            >
              {guestName || "Tamu Undangan"}
            </div>
          </div>
          <button
            onClick={onOpen}
            style={{
              fontSize: btn.size || "12px",
              color: btn.color || (fontTitle.color || "#ffffff"),
              backgroundColor: btn.bg_color || "transparent",
              borderColor: btn.border_color || (fontTitle.color || "#ffffff"),
              borderWidth: btn.border_color === "transparent" ? "0px" : "2px",
              fontFamily: btn.family || "Inter",
            }}
            className="px-6 py-2 rounded-full font-bold z-10 whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 transition-all"
          >
            {btn.text || "Buka Undangan"}
          </button>
        </div>
      )}

      {/* Normal flex container for remaining/non-custom elements */}
      <div className="relative z-10 flex flex-col items-center text-center p-4 w-full gap-2">
        {!isTitleCustom && (
          <div style={{ fontSize: fontTitle.size, color: fontTitle.color, fontFamily: fontTitle.family, textAlign: fontTitle.position as any, lineHeight: 1.2 }} className="font-bold">
            {displayKategori}
          </div>
        )}
        {!isNamaCustom && (
          <div style={{ fontSize: fontNama.size, color: fontNama.color, fontFamily: fontNama.family, textAlign: fontNama.position as any, lineHeight: 1.2 }} className="font-bold">
            {data.nama_acara || "Nama & Nama"}
          </div>
        )}

        {/* ── GRUP TAMU & TOMBOL (NORMAL ALIGNED) ── */}
        {!isBtnCustom && (
          <div
            style={{
              width: "100%",
            }}
            className={`mt-1 flex flex-col gap-2 ${btn.position === "left" ? "items-start text-left"
                : btn.position === "right" ? "items-end text-right"
                  : "items-center text-center"
              }`}
          >
            <div className={`space-y-1 flex flex-col ${btn.position === "left" ? "items-start"
                : btn.position === "right" ? "items-end"
                  : "items-center"
              }`}>
              <span className="text-[10px] opacity-75 block font-medium" style={{ color: fontTitle.color }}>
                Kepada Yth. Bpk/Ibu/Saudara/i
              </span>
              <div className="inline-block px-3.5 py-1 bg-white/10 backdrop-blur-sm border rounded-xl text-[11px] font-bold shadow-sm"
                style={{ color: fontTitle.color, borderColor: fontTitle.color && fontTitle.color.startsWith("#") ? fontTitle.color + '20' : 'rgba(255,255,255,0.2)' }}
              >
                {guestName || "Tamu Undangan"}
              </div>
            </div>
            <button
              onClick={onOpen}
              style={{
                fontSize: btn.size || "12px",
                color: btn.color || (fontTitle.color || "#ffffff"),
                backgroundColor: btn.bg_color || "transparent",
                borderColor: btn.border_color || (fontTitle.color || "#ffffff"),
                borderWidth: btn.border_color === "transparent" ? "0px" : "2px",
                fontFamily: btn.family || "Inter",
              }}
              className="px-6 py-1.5 rounded-full font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              {btn.text || "Buka Undangan"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PEMBUKA TAB ──────────────────────────────────────────────────────────────

export function PembukaForm({ data, onChange, mode }: { data: any; onChange: (d: any) => void; mode?: "data" | "settings" }) {
  const upd = (key: string, val: any) => onChange({ ...data, [key]: val });
  return (
    <div className="space-y-4">
      {/* ── DATA SECTION ── */}
      {(!mode || mode === "data") && (
        <>
          <SectionInput label="Ucapan Pembuka">
            <InputField label="Teks Ucapan" value={data.ucapan || ""} onChange={v => upd("ucapan", v)} placeholder="Dengan memohon rahmat..." textarea />
          </SectionInput>
          <SectionInput label="Tanggal Acara">
            <InputField label="Tanggal" value={data.tanggal_acara || ""} onChange={v => upd("tanggal_acara", v)} type="date" />
          </SectionInput>
          <SectionInput label="Foto Pembuka (Opsional)">
            <FileUploader
              label="Foto Pembuka"
              value={data.foto_pembuka || ""}
              onChange={v => upd("foto_pembuka", v)}
              accept="image/*"
              type="image"
            />
          </SectionInput>
        </>
      )}

      {/* ── SETTINGS SECTION ── */}
      {(!mode || mode === "settings") && (
        <>
          <SectionInput label="Kategori Acara">
            <FontSettingsWidget label="Setting Font Kategori" value={data.setting_kategori || {}} onChange={v => upd("setting_kategori", v)} showAnimation />
          </SectionInput>
          <SectionInput label="Nama Acara / Pasangan">
            <FontSettingsWidget label="Setting Font Nama" value={data.setting_nama || {}} onChange={v => upd("setting_nama", v)} showAnimation />
          </SectionInput>
          <SectionInput label="Setting Font Ucapan Pembuka">
            <FontSettingsWidget label="Setting Font Ucapan" value={data.setting_ucapan || {}} onChange={v => upd("setting_ucapan", v)} showAnimation showSpacing />
          </SectionInput>
          <SectionInput label="Setting Font Tanggal Acara">
            <FontSettingsWidget label="Setting Font Tanggal" value={data.setting_tanggal || {}} onChange={v => upd("setting_tanggal", v)} showAnimation />
          </SectionInput>
          {data.foto_pembuka && (
            <SectionInput label="Setting Foto Pembuka">
              <div className="space-y-2">
                <PhotoStyleWidget
                  bingkai={data.foto_setting?.bingkai || "oval"}
                  width={data.foto_setting?.width || "120px"}
                  height={data.foto_setting?.height || "120px"}
                  overlayUrl={data.foto_setting?.overlay_url || ""}
                  onChange={(updates) => upd("foto_setting", {
                    ...(data.foto_setting || {}),
                    bingkai: updates.bingkai,
                    width: updates.width,
                    height: updates.height,
                    overlay_url: updates.overlay_url,
                  })}
                />
                <div>
                  <label className="text-[9px] font-black uppercase text-[#064e3b]/60 block mb-1">Animasi</label>
                  <select value={data.foto_setting?.animation || "fade-in"} onChange={e => upd("foto_setting", { ...(data.foto_setting || {}), animation: e.target.value })}
                    className="w-full px-2 py-1 text-[10px] bg-white border border-[#064e3b]/20 rounded-lg outline-none font-bold">
                    {["none", "fade-in", "slide-up", "zoom-in"].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
              </div>
            </SectionInput>
          )}
          <CardSettingsWidget label="Setting Style Card / Bingkai Pembuka" value={data.setting_card || {}} onChange={v => upd("setting_card", v)} />
          <BackgroundWidget value={data.background || { type: "solid", value: "#ffffff" }} onChange={v => upd("background", v)} />
        </>
      )}
    </div>
  );
}

export function PembukaPreview({ data, coverData, bahasa }: { data: any; coverData: any; bahasa?: "id" | "en" }) {
  const bg = getBgStyle(data.background);
  const card = data.setting_card || {};

  // Tentukan label kategori sesuai bahasa
  const activeBahasa: "id" | "en" = bahasa ?? data.bahasa ?? coverData?.bahasa ?? "id";
  const kategoriId = coverData?.kategori || "";
  const kategoriLabel = activeBahasa === "en"
    ? ((KATEGORI_EN_MAP[kategoriId] ?? kategoriId) || "Kategori Acara")
    : (kategoriId || "Kategori Acara");

  const fontKategori = data.setting_kategori || {};
  const fontNama = data.setting_nama || {};
  const fontTanggal = data.setting_tanggal || {};
  const fontUcapan = data.setting_ucapan || {};

  const isKategoriCustom = fontKategori.position === "custom";
  const isNamaCustom = fontNama.position === "custom";
  const isTanggalCustom = fontTanggal.position === "custom";
  const isUcapanCustom = fontUcapan.position === "custom";

  const cardStyles: React.CSSProperties = card.enabled
    ? {
      backgroundColor: card.glassmorphism
        ? "rgba(255, 255, 255, 0.1)"
        : (card.bg_color || "#ffffff"),
      backdropFilter: card.glassmorphism ? "blur(12px)" : undefined,
      WebkitBackdropFilter: card.glassmorphism ? "blur(12px)" : undefined,
      borderColor: card.glassmorphism
        ? "rgba(255, 255, 255, 0.2)"
        : (card.border_color || "#d4af37"),
      borderWidth: (card.glassmorphism || card.border_color !== "transparent") ? "1px" : "0px",
      borderRadius: card.border_radius || "16px",
      padding: card.padding || "24px",
      boxShadow: card.shadow || "none",
      width: card.width || "90%",
      minHeight: card.height || "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1rem",
      textAlign: "center",
    }
    : {};

  const content = (
    <>
      {!isKategoriCustom && (
        <div
          style={{
            fontSize: fontKategori.size || "12px",
            color: fontKategori.color || "#ffffff",
            fontFamily: fontKategori.family || "Inter",
            textAlign: (fontKategori.position || "center") as any,
          }}
          className="font-bold opacity-60"
        >
          {kategoriLabel}
        </div>
      )}
      {!isNamaCustom && (
        <div
          style={{
            fontSize: fontNama.size || "24px",
            color: fontNama.color || "#ffffff",
            fontFamily: fontNama.family || "Inter",
            textAlign: (fontNama.position || "center") as any,
          }}
          className="font-bold"
        >
          {coverData?.nama_acara || "Nama Pasangan"}
        </div>
      )}
      {!isTanggalCustom && data.tanggal_acara && (
        <div 
          style={{ 
            fontSize: fontTanggal.size || "12px",
            color: fontTanggal.color || "#ffffff",
            fontFamily: fontTanggal.family || "Inter",
            textAlign: (fontTanggal.position || "center") as any,
          }}
          className="text-sm font-bold"
        >
          {(() => {
            const d = new Date(data.tanggal_acara);
            if (isNaN(d.getTime())) return "";
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}.${month}.${year}`;
          })()}
        </div>
      )}
      {data.foto_pembuka && (
        <FramedPhoto
          src={data.foto_pembuka}
          bingkai={data.foto_setting?.bingkai || "oval"}
          className="w-32 h-32"
          customWidth={data.foto_setting?.width}
          customHeight={data.foto_setting?.height}
          overlayUrl={data.foto_setting?.overlay_url}
        />
      )}
      {!isUcapanCustom && (
        <p
          className="opacity-80 whitespace-pre-wrap"
          style={{
            color: fontUcapan.color || "#ffffff",
            fontFamily: fontUcapan.family || "Inter",
            fontSize: fontUcapan.size || "12px",
            textAlign: (fontUcapan.position || "center") as any,
            width: fontUcapan.width || "100%",
            lineHeight: fontUcapan.lineHeight || "1.5",
          }}
        >
          {data.ucapan || "Ucapan pembuka belum diisi."}
        </p>
      )}
    </>
  );

  return (
    <div className="w-full h-full min-h-[512px] flex flex-col items-center justify-center relative rounded-2xl overflow-hidden p-6 gap-4" style={bg}>
      {data.background?.type === "video" && data.background?.value && (
        <video 
          key={data.background.value}
          src={data.background.value}
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}

      {/* Absolute positioned custom elements */}
      {isKategoriCustom && (
        <div
          style={{
            fontSize: fontKategori.size || "12px",
            color: fontKategori.color || "#ffffff",
            fontFamily: fontKategori.family || "Inter",
            position: "absolute",
            left: `${fontKategori.x ?? 50}%`,
            top: `${fontKategori.y ?? 20}%`,
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: "90%",
            zIndex: 10,
          }}
          className="font-bold opacity-60"
        >
          {kategoriLabel}
        </div>
      )}

      {isNamaCustom && (
        <div
          style={{
            fontSize: fontNama.size || "24px",
            color: fontNama.color || "#ffffff",
            fontFamily: fontNama.family || "Inter",
            position: "absolute",
            left: `${fontNama.x ?? 50}%`,
            top: `${fontNama.y ?? 40}%`,
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: "90%",
            zIndex: 10,
          }}
          className="font-bold"
        >
          {coverData?.nama_acara || "Nama Pasangan"}
        </div>
      )}

      {isTanggalCustom && data.tanggal_acara && (
        <div
          style={{
            fontSize: fontTanggal.size || "12px",
            color: fontTanggal.color || "#ffffff",
            fontFamily: fontTanggal.family || "Inter",
            position: "absolute",
            left: `${fontTanggal.x ?? 50}%`,
            top: `${fontTanggal.y ?? 55}%`,
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: "90%",
            zIndex: 10,
          }}
          className="text-sm font-bold"
        >
          {(() => {
            const d = new Date(data.tanggal_acara);
            if (isNaN(d.getTime())) return "";
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}.${month}.${year}`;
          })()}
        </div>
      )}

      {isUcapanCustom && (
        <p
          className="opacity-80 whitespace-pre-wrap"
          style={{
            color: fontUcapan.color || "#ffffff",
            fontFamily: fontUcapan.family || "Inter",
            fontSize: fontUcapan.size || "12px",
            position: "absolute",
            left: `${fontUcapan.x ?? 50}%`,
            top: `${fontUcapan.y ?? 75}%`,
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: fontUcapan.width || "90%",
            lineHeight: fontUcapan.lineHeight || "1.5",
            zIndex: 10,
          }}
        >
          {data.ucapan || "Ucapan pembuka belum diisi."}
        </p>
      )}

      <div className="relative z-10 w-full flex flex-col items-center justify-center gap-4">
        {card.enabled ? (
          <div style={cardStyles}>
            {content}
          </div>
        ) : (
          content
        )}
      </div>
    </div>
  );
}

interface Track {
  previewUrl: string;
  trackName: string;
  artistName: string;
  artworkUrl100?: string;
  artworkUrl60?: string;
  trackId: number;
}

function ItunesMusicSearch({
  playingUrl,
  toggleAudio,
  onSelect,
}: {
  playingUrl: string | null;
  toggleAudio: (url: string) => void;
  onSelect: (track: Track) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/itunes-search?term=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Gagal mengambil data dari iTunes");
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Gagal melakukan pencarian.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 font-sans">
      <form onSubmit={handleSearch} className="flex gap-1.5">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari lagu / artis di iTunes..."
            className="w-full pl-7 pr-2.5 py-1.5 text-[10px] bg-white border border-[#064e3b]/20 rounded-lg outline-none focus:border-[#d4af37] text-[#064e3b] placeholder-[#064e3b]/30"
          />
          <Search className="w-3 h-3 text-[#064e3b]/30 absolute left-2 top-1/2 -translate-y-1/2" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1.5 bg-[#064e3b] hover:bg-[#064e3b]/90 text-white border border-[#d4af37] text-[10px] font-black rounded-lg inline-flex items-center gap-1 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Cari"}
        </button>
      </form>

      {error && (
        <p className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg px-2 py-0.5">
          {error}
        </p>
      )}

      {results.length > 0 && (
        <div className="max-h-48 overflow-y-auto space-y-1 border border-[#064e3b]/10 rounded-lg p-1.5 bg-white/40">
          {results.map((track: Track) => {
            const isPlaying = playingUrl === track.previewUrl;
            return (
              <div
                key={track.trackId}
                onClick={() => onSelect({
                  previewUrl: track.previewUrl,
                  trackName: track.trackName,
                  artistName: track.artistName,
                  artworkUrl100: track.artworkUrl100,
                  artworkUrl60: track.artworkUrl60,
                  trackId: track.trackId
                })}
                className="p-1.5 hover:bg-[#064e3b]/5 rounded flex items-center justify-between gap-2 cursor-pointer transition-all border border-transparent hover:border-[#064e3b]/5 group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative w-8 h-8 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                    {track.artworkUrl60 ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={track.artworkUrl60} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Music className="w-3.5 h-3.5 text-[#064e3b]/30" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAudio(track.previewUrl);
                      }}
                      className="absolute inset-0 bg-black/30 hover:bg-black/55 flex items-center justify-center transition-all"
                    >
                      {isPlaying ? (
                        <Pause className="w-3 h-3 text-white fill-white animate-pulse" />
                      ) : (
                        <Play className="w-3 h-3 text-white fill-white" />
                      )}
                    </button>
                  </div>

                  <div className="text-left min-w-0 font-sans">
                    <p className="text-[10px] font-black text-[#064e3b] truncate leading-tight">{track.trackName}</p>
                    <p className="text-[9px] font-semibold text-[#064e3b]/60 truncate mt-0.5">{track.artistName}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="px-2 py-0.5 bg-[#064e3b]/5 hover:bg-[#064e3b] text-[#064e3b] hover:text-white border border-[#064e3b]/10 text-[8px] font-black rounded transition-all"
                >
                  Pilih
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface YoutubeVideoMeta {
  video_id: string;
  title: string;
  author_name: string;
  thumbnail_url: string;
}

function YoutubeMusicLoader({
  playingYoutubeId,
  toggleYoutube,
  onSelect,
}: {
  playingYoutubeId: string | null;
  toggleYoutube: (id: string) => void;
  onSelect: (video: YoutubeVideoMeta) => void;
}) {
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedVideo, setLoadedVideo] = useState<YoutubeVideoMeta | null>(null);

  const handleLoad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setLoading(true);
    setError(null);
    setLoadedVideo(null);
    try {
      const res = await fetch(`/api/youtube-meta?url=${encodeURIComponent(inputUrl)}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal memuat detail video YouTube");
      }
      const data = await res.json();
      setLoadedVideo(data);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Gagal memuat link YouTube.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const isPlaying = loadedVideo && playingYoutubeId === loadedVideo.video_id;

  return (
    <div className="space-y-3 font-sans">
      <form onSubmit={handleLoad} className="flex gap-1.5">
        <input
          type="text"
          value={inputUrl}
          onChange={e => setInputUrl(e.target.value)}
          placeholder="Paste link video YouTube (https://...)"
          className="w-full px-2.5 py-1.5 text-[10px] bg-white border border-[#064e3b]/20 rounded-lg outline-none focus:border-[#d4af37] text-[#064e3b] placeholder-[#064e3b]/30"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1.5 bg-[#064e3b] hover:bg-[#064e3b]/90 text-white border border-[#d4af37] text-[10px] font-black rounded-lg inline-flex items-center gap-1 transition-all disabled:opacity-50 flex-shrink-0"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Muat"}
        </button>
      </form>

      {error && (
        <p className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg px-2 py-0.5">
          {error}
        </p>
      )}

      {loadedVideo && (
        <div className="p-2 border border-[#064e3b]/10 bg-white rounded-lg flex items-center justify-between gap-2.5 group">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="relative w-12 h-9 rounded overflow-hidden bg-gray-100 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={loadedVideo.thumbnail_url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleYoutube(loadedVideo.video_id);
                }}
                className="absolute inset-0 bg-black/35 hover:bg-black/55 flex items-center justify-center transition-all"
              >
                {isPlaying ? (
                  <Pause className="w-3 h-3 text-white fill-white animate-pulse" />
                ) : (
                  <Play className="w-3 h-3 text-white fill-white" />
                )}
              </button>
            </div>

            <div className="text-left min-w-0 font-sans">
              <p className="text-[10px] font-black text-[#064e3b] truncate leading-tight">{loadedVideo.title}</p>
              <p className="text-[9px] font-semibold text-[#064e3b]/60 truncate mt-0.5">{loadedVideo.author_name}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelect(loadedVideo)}
            className="px-2 py-0.5 bg-[#064e3b] hover:bg-[#064e3b]/90 text-white border border-[#d4af37] text-[8px] font-black rounded transition-all flex-shrink-0"
          >
            Pilih
          </button>
        </div>
      )}
    </div>
  );
}

export function ScaledCoverPreview({ coverData, meta }: { coverData: any; meta: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [hasMeasured, setHasMeasured] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.getBoundingClientRect().width;
        // The original design width is 288px
        setScale(width / 288);
        setHasMeasured(true);
      }
    };

    updateScale();
    
    // Set up ResizeObserver to handle layout/resize changes
    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, []);

  const data = coverData || {};
  const activeMeta = meta || {};

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full select-none pointer-events-none rounded-t-2xl overflow-hidden">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:wght@300;400;600;700&family=Great+Vibes&family=Inter:wght@300;400;600;700;900&family=Lato:wght@300;400;700&family=Outfit:wght@300;400;600;700;900&family=Pinyon+Script&family=Playfair+Display:wght@400;600;700;900&family=Poppins:wght@300;400;600;700;900&family=Roboto:wght@300;400;500;700&family=Sacramento&display=swap" rel="stylesheet" />
      <div 
        className="absolute top-0 left-0 origin-top-left transition-opacity duration-300"
        style={{
          width: "288px",
          height: "512px",
          transform: `scale(${scale})`,
          opacity: hasMeasured ? 1 : 0,
        }}
      >
        <CoverPreview data={data} meta={activeMeta} />
      </div>
    </div>
  );
}

