"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, X, Loader2, FileVideo, Play, Pause } from "lucide-react";
import { FONT_FAMILIES, ANIMATION_OPTIONS, BINGKAI_OPTIONS } from "./builder-constants";

interface FontSettings {
  size: string;
  color: string;
  family: string;
  position: string;
  x?: number;
  y?: number;
  animation?: string;
  width?: string;
  lineHeight?: string;
}

interface BgSettings {
  type: string;
  value: string;
  gradient_to?: string;
  direction?: string;
}

export function FontSettingsWidget({
  label, value, onChange, showAnimation = false, showSpacing = false,
}: {
  label: string;
  value: FontSettings;
  onChange: (v: FontSettings) => void;
  showAnimation?: boolean;
  showSpacing?: boolean;
}) {
  const safeVal = {
    size: value?.size || "12px",
    color: value?.color || "#ffffff",
    family: value?.family || "Inter",
    position: value?.position || "center",
    x: value?.x ?? 50,
    y: value?.y ?? 50,
    animation: value?.animation || "none",
    width: value?.width || "100%",
    lineHeight: value?.lineHeight || "1.5",
  };

  const sizeVal = parseInt(safeVal.size) || 12;

  return (
    <div className="space-y-2 p-3 bg-[#064e3b]/5 rounded-xl border border-[#064e3b]/10">
      <p className="text-[10px] font-black uppercase tracking-wider text-[#d4af37]">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Ukuran</label>
          <div className="flex gap-1 items-center">
            <input type="range" min="10" max="120" value={sizeVal}
              onChange={e => onChange({ ...safeVal, size: e.target.value + "px" })}
              className="flex-1 accent-[#d4af37] h-1" />
            <span className="text-[9px] font-bold w-8 text-right">{safeVal.size}</span>
          </div>
        </div>
        <div>
          <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Warna</label>
          <input type="color" value={safeVal.color}
            onChange={e => onChange({ ...safeVal, color: e.target.value })}
            className="w-full h-7 rounded cursor-pointer border border-[#064e3b]/20" />
        </div>
        <div>
          <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Font</label>
          <select value={safeVal.family} onChange={e => onChange({ ...safeVal, family: e.target.value })}
            className="w-full px-2 py-1 text-[10px] bg-white border border-[#064e3b]/20 rounded-lg outline-none">
            {FONT_FAMILIES.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Posisi</label>
          <select value={safeVal.position} onChange={e => onChange({ ...safeVal, position: e.target.value, x: safeVal.x, y: safeVal.y })}
            className="w-full px-2 py-1 text-[10px] bg-white border border-[#064e3b]/20 rounded-lg outline-none">
            <option value="left">Kiri</option>
            <option value="center">Tengah</option>
            <option value="right">Kanan</option>
            <option value="custom">Custom (X, Y)</option>
          </select>
        </div>

        {safeVal.position === "custom" && (
          <div className="col-span-2 grid grid-cols-2 gap-3 mt-1.5 p-2.5 bg-[#064e3b]/5 rounded-xl border border-[#064e3b]/10">
            <div>
              <label className="text-[8px] font-black uppercase text-[#064e3b]/50 block mb-0.5">Posisi X (%)</label>
              <div className="flex items-center gap-1.5">
                <input type="range" min="0" max="100" value={safeVal.x}
                  onChange={e => onChange({ ...safeVal, x: parseInt(e.target.value) })}
                  className="flex-1 accent-[#d4af37] h-1" />
                <span className="text-[9px] font-bold w-6 text-right text-[#064e3b]">{safeVal.x}%</span>
              </div>
            </div>
            <div>
              <label className="text-[8px] font-black uppercase text-[#064e3b]/50 block mb-0.5">Posisi Y (%)</label>
              <div className="flex items-center gap-1.5">
                <input type="range" min="0" max="100" value={safeVal.y}
                  onChange={e => onChange({ ...safeVal, y: parseInt(e.target.value) })}
                  className="flex-1 accent-[#d4af37] h-1" />
                <span className="text-[9px] font-bold w-6 text-right text-[#064e3b]">{safeVal.y}%</span>
              </div>
            </div>
          </div>
        )}
        {showAnimation && (
          <div className="col-span-2">
            <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Animasi</label>
            <select value={safeVal.animation} onChange={e => onChange({ ...safeVal, animation: e.target.value })}
              className="w-full px-2 py-1 text-[10px] bg-white border border-[#064e3b]/20 rounded-lg outline-none">
              {ANIMATION_OPTIONS.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
        )}
        {showSpacing && (
          <>
            <div>
              <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Lebar Text</label>
              <div className="flex gap-1 items-center">
                <input 
                  type="range" 
                  min="40" 
                  max="100" 
                  value={parseInt(safeVal.width) || 100}
                  onChange={e => onChange({ ...safeVal, width: e.target.value + "%" })}
                  className="flex-1 accent-[#d4af37] h-1" 
                />
                <span className="text-[9px] font-bold w-8 text-right">{safeVal.width}</span>
              </div>
            </div>
            <div>
              <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Jarak Baris</label>
              <div className="flex gap-1 items-center">
                <input 
                  type="range" 
                  min="0.8" 
                  max="2.5" 
                  step="0.1" 
                  value={parseFloat(safeVal.lineHeight) || 1.5}
                  onChange={e => onChange({ ...safeVal, lineHeight: e.target.value })}
                  className="flex-1 accent-[#d4af37] h-1" 
                />
                <span className="text-[9px] font-bold w-8 text-right">{safeVal.lineHeight}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function BackgroundWidget({
  label = "Background", value, onChange,
}: {
  label?: string;
  value: BgSettings;
  onChange: (v: BgSettings) => void;
}) {
  return (
    <div className="space-y-2 p-3 bg-[#064e3b]/5 rounded-xl border border-[#064e3b]/10">
      <p className="text-[10px] font-black uppercase tracking-wider text-[#d4af37]">{label}</p>
      <div className="flex gap-1 flex-wrap">
        {["solid", "gradient", "image", "video"].map(type => (
          <button key={type} type="button"
            onClick={() => onChange({ ...value, type })}
            className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border transition-all ${
              value.type === type ? "bg-[#064e3b] text-white border-[#d4af37]" : "bg-white text-[#064e3b]/60 border-[#064e3b]/20"
            }`}>
            {type}
          </button>
        ))}
      </div>
      {value.type === "solid" && (
        <div className="flex items-center gap-2">
          <input type="color" value={value.value}
            onChange={e => onChange({ ...value, value: e.target.value })}
            className="w-10 h-8 rounded cursor-pointer border border-[#064e3b]/20" />
          <span className="text-[10px] font-bold text-[#064e3b]/60">{value.value}</span>
        </div>
      )}
      {value.type === "gradient" && (
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <input type="color" value={value.value} onChange={e => onChange({ ...value, value: e.target.value })}
              className="w-10 h-7 rounded cursor-pointer border border-[#064e3b]/20" />
            <span className="text-[9px] font-bold">→</span>
            <input type="color" value={value.gradient_to || "#ffffff"} onChange={e => onChange({ ...value, gradient_to: e.target.value })}
              className="w-10 h-7 rounded cursor-pointer border border-[#064e3b]/20" />
          </div>
          <select value={value.direction || "to bottom"} onChange={e => onChange({ ...value, direction: e.target.value })}
            className="w-full px-2 py-1 text-[10px] bg-white border border-[#064e3b]/20 rounded-lg outline-none">
            <option value="to bottom">Atas ke Bawah</option>
            <option value="to right">Kiri ke Kanan</option>
            <option value="to bottom right">Diagonal</option>
          </select>
        </div>
      )}
      {value.type === "image" && (
        <FileUploader
          value={value.value}
          onChange={v => onChange({ ...value, value: v })}
          accept="image/*"
          type="image"
        />
      )}
      {value.type === "video" && (
        <FileUploader
          value={value.value}
          onChange={v => onChange({ ...value, value: v })}
          accept="video/*"
          type="video"
        />
      )}
    </div>
  );
}

export function FileUploader({
  label,
  value,
  onChange,
  accept = "image/*",
  type = "image",
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  accept?: string;
  type?: "image" | "video" | "audio";
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value) return;

    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(value);
      audioRef.current.play().catch(err => {
        console.error("Audio playback error:", err);
      });
      setPlaying(true);
      audioRef.current.onended = () => {
        setPlaying(false);
      };
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    // Batas ukuran file 4.5MB untuk kompatibilitas Vercel
    const MAX_SIZE = 4.5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError("Ukuran file terlalu besar. Maksimal ukuran file adalah 4.5 MB.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let errMsg = "Gagal mengunggah file";
        try {
          const errData = await res.json();
          errMsg = errData.error || errMsg;
        } catch {
          try {
            errMsg = await res.text() || errMsg;
          } catch {}
        }
        throw new Error(errMsg);
      }

      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan saat mengunggah";
      setError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (accept.includes("image") && !file.type.startsWith("image/")) {
      setError("Hanya diperbolehkan mengunggah file gambar.");
      return;
    }
    if (accept.includes("video") && !file.type.startsWith("video/")) {
      setError("Hanya diperbolehkan mengunggah file video.");
      return;
    }
    if (accept.includes("audio") && !file.type.startsWith("audio/")) {
      setError("Hanya diperbolehkan mengunggah file audio.");
      return;
    }

    await uploadFile(file);
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-[9px] font-black uppercase tracking-wider text-[#064e3b]/60 block">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative border border-[#064e3b]/10 bg-white rounded-xl p-3 flex items-center gap-3 group">
          {type === "image" && (
            <div className="w-12 h-12 rounded-lg bg-[#064e3b]/5 overflow-hidden flex-shrink-0 border border-[#064e3b]/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          {type === "video" && (
            <div className="w-12 h-12 rounded-lg bg-[#064e3b]/5 overflow-hidden flex-shrink-0 border border-[#064e3b]/10 flex items-center justify-center">
              <FileVideo className="w-5 h-5 text-[#064e3b]/40" />
            </div>
          )}
          {type === "audio" && (
            <button
              type="button"
              onClick={togglePlay}
              className="w-12 h-12 rounded-lg bg-[#064e3b]/10 hover:bg-[#064e3b]/20 flex items-center justify-center flex-shrink-0 border border-[#d4af37]/30 transition-all text-[#d4af37] relative group/audio"
            >
              {playing ? (
                <Pause className="w-5 h-5 fill-[#d4af37] text-[#d4af37] animate-pulse" />
              ) : (
                <Play className="w-5 h-5 fill-[#d4af37] text-[#d4af37]" />
              )}
            </button>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-[#064e3b]/40 uppercase tracking-widest text-left">
              Uploaded File
            </p>
            <p className="text-xs font-semibold text-[#064e3b] truncate text-left" title={value}>
              {value.substring(value.lastIndexOf("/") + 1)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onChange("")}
            className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg border border-transparent hover:border-red-200 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#064e3b]/20 hover:border-[#d4af37] bg-white rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group min-h-[90px]"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />

          {isUploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-[#d4af37]" />
              <span className="text-[10px] font-bold text-[#064e3b]/60 uppercase tracking-wider text-center">
                Mengunggah file...
              </span>
            </>
          ) : (
            <>
              <UploadCloud className="w-6 h-6 text-[#064e3b]/30 group-hover:text-[#d4af37] transition-colors" />
              <div className="space-y-0.5">
                <p className="text-[11px] font-black text-[#064e3b]">
                  Klik untuk upload atau drag file
                </p>
                <p className="text-[9px] text-[#064e3b]/40 font-semibold uppercase">
                  {type === "image" ? "PNG, JPG, JPEG, WEBP" : type === "video" ? "MP4, WEBM" : "MP3, WAV"}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1">
          {error}
        </p>
      )}
    </div>
  );
}

export function SectionInput({ label, className = "", children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-xs font-black uppercase tracking-wider text-[#064e3b]/70 border-b border-[#064e3b]/10 pb-2">{label}</h4>
      {children}
    </div>
  );
}

export function InputField({ label, value, onChange, placeholder = "", type = "text", textarea = false }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; textarea?: boolean;
}) {
  const cls = "w-full px-3 py-2 text-xs bg-white border border-[#064e3b]/20 rounded-xl outline-none focus:border-[#d4af37] text-[#064e3b] placeholder-[#064e3b]/30";
  return (
    <div>
      <label className="text-[9px] font-black uppercase tracking-wider text-[#064e3b]/60 block mb-1">{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className={cls} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
    </div>
  );
}

export function getBgStyle(bg: BgSettings): React.CSSProperties {
  if (!bg) return { backgroundColor: "#f5f5dc" };
  if (bg.type === "solid") return { backgroundColor: bg.value };
  if (bg.type === "gradient") return { background: `linear-gradient(${bg.direction || "to bottom"}, ${bg.value}, ${bg.gradient_to || "#fff"})` };
  if (bg.type === "image") return { backgroundImage: `url(${bg.value})`, backgroundSize: "cover", backgroundPosition: "center" };
  return { backgroundColor: "#f5f5dc" };
}

export const getClipPath = (bingkai: string) => {
  switch (bingkai) {
    case "kubah": // Arch / Kubah
      return "polygon(0% 100%, 0% 45%, 5% 30%, 12% 18%, 22% 8%, 35% 2%, 50% 0%, 65% 2%, 78% 8%, 88% 18%, 95% 30%, 100% 45%, 100% 100%)";
    case "bulat": // Circle
      return "circle(50% at 50% 50%)";
    case "oval": // Oval
      return "ellipse(48% 48% at 50% 50%)";
    case "hexagon": // Hexagon
      return "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";
    case "daun": // Leaf
      return "polygon(50% 0%, 85% 15%, 100% 50%, 85% 85%, 50% 100%, 15% 85%, 0% 50%, 15% 15%)";
    case "perisai": // Shield
      return "polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)";
    case "kotak-rounded": // Rounded Square
      return "inset(0% 0% round 24px)";
    case "kotak": // Sharp Square
      return "inset(0% 0% round 0px)";
    default:
      return "none";
  }
};

export const getOverlayPresetUrl = (presetId: string) => {
  switch (presetId) {
    case "overlay-1": // Elegant Gold Thin
      return "https://i.ibb.co.com/zV8Qz3n/gold-thin-frame.png";
    case "overlay-2": // Vintage Classic
      return "https://i.ibb.co.com/c6Fz5p6/vintage-frame.png";
    case "overlay-3": // Floral Corner
      return "https://i.ibb.co.com/k2gX6D9/floral-frame.png";
    default:
      return "";
  }
};

export function FramedPhoto({
  src,
  bingkai,
  className = "w-32 h-32",
  borderColor = "#d4af37",
  customWidth,
  customHeight,
  overlayUrl,
  photoScale,
  photoX,
  photoY,
}: {
  src: string;
  bingkai: string;
  className?: string;
  borderColor?: string;
  customWidth?: string;
  customHeight?: string;
  overlayUrl?: string;
  photoScale?: number;
  photoX?: number;
  photoY?: number;
}) {
  const isOverlay = bingkai && (bingkai.startsWith("overlay") || bingkai === "custom");
  const finalOverlayUrl = bingkai === "custom" ? overlayUrl : getOverlayPresetUrl(bingkai);

  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: customWidth || undefined,
    height: customHeight || undefined,
    aspectRatio: (!customWidth && !customHeight) ? "1/1" : undefined,
  };

  if (!src) {
    return (
      <div 
        className={`${!customWidth && !customHeight ? className : ""} flex items-center justify-center bg-[#064e3b]/10 text-[#064e3b]/40 text-xs font-bold rounded-xl`}
        style={containerStyle}
      >
        Foto
      </div>
    );
  }

  if (isOverlay) {
    return (
      <div 
        className={`${!customWidth && !customHeight ? className : ""} relative overflow-hidden rounded-xl`}
        style={containerStyle}
      >
        {/* Main Photo */}
        <img 
          src={src} 
          alt="" 
          className="absolute object-cover rounded-xl" 
          style={{
            width: `${photoScale || 100}%`,
            height: `${photoScale || 100}%`,
            left: `calc(50% + ${photoX || 0}px)`,
            top: `calc(50% + ${photoY || 0}px)`,
            transform: "translate(-50%, -50%)",
          }}
        />
        {/* Overlay Frame */}
        {finalOverlayUrl && (
          <img 
            src={finalOverlayUrl} 
            alt="" 
            className="absolute inset-0 w-full h-full object-fill pointer-events-none z-10" 
          />
        )}
      </div>
    );
  }

  const clipPath = getClipPath(bingkai);

  if (clipPath === "none") {
    const isNone = bingkai === "none";
    return (
      <div 
        className={`${!customWidth && !customHeight ? className : ""} relative overflow-hidden rounded-xl ${isNone ? "" : "shadow-lg"}`}
        style={containerStyle}
      >
        <img 
          src={src} 
          alt="" 
          className="absolute object-cover" 
          style={{
            width: `${photoScale || 100}%`,
            height: `${photoScale || 100}%`,
            left: `calc(50% + ${photoX || 0}px)`,
            top: `calc(50% + ${photoY || 0}px)`,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    );
  }

  return (
    <div 
      className={`${!customWidth && !customHeight ? className : ""} flex items-center justify-center p-[2.5px] relative`}
      style={{
        ...containerStyle,
        background: `linear-gradient(135deg, ${borderColor} 0%, #fff9e6 50%, ${borderColor} 100%)`,
        clipPath: clipPath,
        WebkitClipPath: clipPath,
      }}
    >
      <div 
        className="w-full h-full bg-slate-950 overflow-hidden flex items-center justify-center relative"
        style={{
          clipPath: clipPath,
          WebkitClipPath: clipPath,
        }}
      >
        <img 
          src={src} 
          alt="" 
          className="absolute object-cover" 
          style={{
            width: `${photoScale || 100}%`,
            height: `${photoScale || 100}%`,
            left: `calc(50% + ${photoX || 0}px)`,
            top: `calc(50% + ${photoY || 0}px)`,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    </div>
  );
}

export function BingkaiWidget({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[9px] font-black uppercase tracking-wider text-[#064e3b]/60 block mb-1">Bingkai Foto</label>
      <div className="flex gap-1 flex-wrap">
        {BINGKAI_OPTIONS.map(b => (
          <button key={b} type="button" onClick={() => onChange(b)}
            className={`px-2 py-1 rounded-lg text-[9px] font-black border transition-all ${value === b ? "bg-[#064e3b] text-white border-[#d4af37]" : "bg-white text-[#064e3b]/60 border-[#064e3b]/20"}`}>
            {b}
          </button>
        ))}
      </div>
    </div>
  );
}

interface ButtonSettings {
  text: string;
  size: string;
  color: string;
  bg_color: string;
  border_color: string;
  family: string;
  position: string;
  x?: number;
  y?: number;
}

export function ButtonSettingsWidget({
  label, value, onChange,
}: {
  label: string;
  value: ButtonSettings;
  onChange: (v: ButtonSettings) => void;
}) {
  const safeVal = {
    text: value.text || "Buka Undangan",
    size: value.size || "12px",
    color: value.color || "#ffffff",
    bg_color: value.bg_color || "transparent",
    border_color: value.border_color || "#ffffff",
    family: value.family || "Inter",
    position: value.position || "center",
    x: value.x ?? 50,
    y: value.y ?? 65,
  };

  return (
    <div className="space-y-3 p-3 bg-[#064e3b]/5 rounded-xl border border-[#064e3b]/10 text-left">
      <p className="text-[10px] font-black uppercase tracking-wider text-[#d4af37]">{label}</p>
      
      <div className="space-y-2">
        <div>
          <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Teks Tombol</label>
          <input
            type="text"
            value={safeVal.text}
            onChange={e => onChange({ ...safeVal, text: e.target.value })}
            placeholder="Buka Undangan"
            className="w-full px-2.5 py-1.5 text-[11px] font-bold bg-white border border-[#064e3b]/20 rounded-lg outline-none focus:border-[#d4af37]"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Ukuran Font</label>
            <div className="flex gap-1 items-center">
              <input type="range" min="8" max="40" value={parseInt(safeVal.size)}
                onChange={e => onChange({ ...safeVal, size: e.target.value + "px" })}
                className="flex-1 accent-[#d4af37] h-1" />
              <span className="text-[9px] font-bold w-8 text-right text-[#064e3b]">{safeVal.size}</span>
            </div>
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Font Family</label>
            <select value={safeVal.family} onChange={e => onChange({ ...safeVal, family: e.target.value })}
              className="w-full px-2 py-1 text-[10px] bg-white border border-[#064e3b]/20 rounded-lg outline-none">
              {FONT_FAMILIES.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Warna Teks</label>
            <input type="color" value={safeVal.color}
              onChange={e => onChange({ ...safeVal, color: e.target.value })}
              className="w-full h-7 rounded cursor-pointer border border-[#064e3b]/20" />
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Background</label>
            <div className="flex gap-1 items-center">
              <input type="color" value={safeVal.bg_color === "transparent" ? "#064e3b" : safeVal.bg_color}
                onChange={e => onChange({ ...safeVal, bg_color: e.target.value })}
                disabled={safeVal.bg_color === "transparent"}
                className="flex-1 h-7 rounded cursor-pointer border border-[#064e3b]/20 disabled:opacity-40" />
              <button
                type="button"
                onClick={() => onChange({ ...safeVal, bg_color: safeVal.bg_color === "transparent" ? "#064e3b" : "transparent" })}
                className={`px-2 py-1 text-[8px] font-black border rounded-lg uppercase whitespace-nowrap ${safeVal.bg_color === "transparent" ? "bg-[#064e3b] text-white border-[#d4af37]" : "bg-white text-[#064e3b]/60 border-[#064e3b]/20"}`}
              >
                Transparan
              </button>
            </div>
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Warna Border</label>
            <div className="flex gap-1 items-center">
              <input type="color" value={safeVal.border_color === "transparent" ? "#ffffff" : safeVal.border_color}
                onChange={e => onChange({ ...safeVal, border_color: e.target.value })}
                disabled={safeVal.border_color === "transparent"}
                className="flex-1 h-7 rounded cursor-pointer border border-[#064e3b]/20 disabled:opacity-40" />
              <button
                type="button"
                onClick={() => onChange({ ...safeVal, border_color: safeVal.border_color === "transparent" ? "#ffffff" : "transparent" })}
                className={`px-2 py-1 text-[8px] font-black border rounded-lg uppercase whitespace-nowrap ${safeVal.border_color === "transparent" ? "bg-[#064e3b] text-white border-[#d4af37]" : "bg-white text-[#064e3b]/60 border-[#064e3b]/20"}`}
              >
                Transparan
              </button>
            </div>
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Posisi</label>
            <select value={safeVal.position} onChange={e => onChange({ ...safeVal, position: e.target.value })}
              className="w-full px-2 py-1 text-[10px] bg-white border border-[#064e3b]/20 rounded-lg outline-none">
              <option value="left">Kiri</option>
              <option value="center">Tengah</option>
              <option value="right">Kanan</option>
              <option value="custom">Custom (X, Y)</option>
            </select>
          </div>
        </div>

        {safeVal.position === "custom" && (
          <div className="grid grid-cols-2 gap-3 p-2 bg-[#064e3b]/5 rounded-lg border border-[#064e3b]/10">
            <div>
              <label className="text-[8px] font-black uppercase text-[#064e3b]/50 block mb-0.5">Posisi X (%)</label>
              <div className="flex items-center gap-1.5">
                <input type="range" min="0" max="100" value={safeVal.x}
                  onChange={e => onChange({ ...safeVal, x: parseInt(e.target.value) })}
                  className="flex-1 accent-[#d4af37] h-1" />
                <span className="text-[9px] font-bold w-6 text-right text-[#064e3b]">{safeVal.x}%</span>
              </div>
            </div>
            <div>
              <label className="text-[8px] font-black uppercase text-[#064e3b]/50 block mb-0.5">Posisi Y (%)</label>
              <div className="flex items-center gap-1.5">
                <input type="range" min="0" max="100" value={safeVal.y}
                  onChange={e => onChange({ ...safeVal, y: parseInt(e.target.value) })}
                  className="flex-1 accent-[#d4af37] h-1" />
                <span className="text-[9px] font-bold w-6 text-right text-[#064e3b]">{safeVal.y}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export interface CardSettings {
  enabled: boolean;
  glassmorphism?: boolean;
  bg_color: string;
  border_color: string;
  border_radius: string;
  padding: string;
  shadow: string;
  width?: string;
  height?: string;
}

export function CardSettingsWidget({
  label, value, onChange,
}: {
  label: string;
  value: CardSettings;
  onChange: (v: CardSettings) => void;
}) {
  const safeVal = {
    enabled: value.enabled ?? false,
    glassmorphism: value.glassmorphism ?? false,
    bg_color: value.bg_color || "#ffffff",
    border_color: value.border_color || "#d4af37",
    border_radius: value.border_radius || "16px",
    padding: value.padding || "24px",
    shadow: value.shadow || "none",
    width: value.width || "auto",
    height: value.height || "auto",
  };

  return (
    <div className="space-y-3 p-3 bg-[#064e3b]/5 rounded-xl border border-[#064e3b]/10 text-left">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-wider text-[#d4af37]">{label}</p>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={safeVal.enabled}
            onChange={e => onChange({ ...safeVal, enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#064e3b]"></div>
        </label>
      </div>

      {safeVal.enabled && (
        <div className="space-y-2 pt-2 border-t border-[#064e3b]/10">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 flex items-center gap-2 pb-1 border-b border-[#064e3b]/5">
              <input
                type="checkbox"
                id="glassmorphism-checkbox"
                checked={safeVal.glassmorphism}
                onChange={e => onChange({ ...safeVal, glassmorphism: e.target.checked })}
                className="rounded text-[#064e3b] focus:ring-[#d4af37] border-gray-300 accent-[#d4af37]"
              />
              <label htmlFor="glassmorphism-checkbox" className="text-[9px] font-black uppercase text-[#064e3b]/80 cursor-pointer">
                Aktifkan Glassmorphism (Efek Kaca Transparan & Blur)
              </label>
            </div>

            {!safeVal.glassmorphism && (
              <>
                <div>
                  <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Background Card</label>
                  <div className="flex gap-1 items-center">
                    <input type="color" value={safeVal.bg_color === "transparent" ? "#ffffff" : safeVal.bg_color}
                      onChange={e => onChange({ ...safeVal, bg_color: e.target.value })}
                      disabled={safeVal.bg_color === "transparent"}
                      className="flex-1 h-7 rounded cursor-pointer border border-[#064e3b]/20 disabled:opacity-40" />
                    <button
                      type="button"
                      onClick={() => onChange({ ...safeVal, bg_color: safeVal.bg_color === "transparent" ? "#ffffff" : "transparent" })}
                      className={`px-2 py-1 text-[8px] font-black border rounded-lg uppercase whitespace-nowrap ${safeVal.bg_color === "transparent" ? "bg-[#064e3b] text-white border-[#d4af37]" : "bg-white text-[#064e3b]/60 border-[#064e3b]/20"}`}
                    >
                      Transparan
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Warna Border</label>
                  <div className="flex gap-1 items-center">
                    <input type="color" value={safeVal.border_color === "transparent" ? "#d4af37" : safeVal.border_color}
                      onChange={e => onChange({ ...safeVal, border_color: e.target.value })}
                      disabled={safeVal.border_color === "transparent"}
                      className="flex-1 h-7 rounded cursor-pointer border border-[#064e3b]/20 disabled:opacity-40" />
                    <button
                      type="button"
                      onClick={() => onChange({ ...safeVal, border_color: safeVal.border_color === "transparent" ? "#d4af37" : "transparent" })}
                      className={`px-2 py-1 text-[8px] font-black border rounded-lg uppercase whitespace-nowrap ${safeVal.border_color === "transparent" ? "bg-[#064e3b] text-white border-[#d4af37]" : "bg-white text-[#064e3b]/60 border-[#064e3b]/20"}`}
                    >
                      Transparan
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Lebar Card (Width)</label>
              <select value={safeVal.width.endsWith("%") || safeVal.width === "auto" ? safeVal.width : "custom"} onChange={e => {
                const val = e.target.value;
                onChange({ ...safeVal, width: val === "custom" ? "320px" : val });
              }}
                className="w-full px-2 py-1 text-[10px] bg-white border border-[#064e3b]/20 rounded-lg outline-none mb-1.5">
                <option value="auto">Auto (Sesuai Konten)</option>
                <option value="100%">Penuh (100%)</option>
                <option value="90%">Default (90%)</option>
                <option value="custom">Kustom (px)</option>
              </select>
              {safeVal.width !== "auto" && safeVal.width !== "100%" && safeVal.width !== "90%" && (
                <div className="flex gap-1 items-center">
                  <input 
                    type="range" 
                    min="100" 
                    max="450" 
                    value={parseInt(safeVal.width) || 320}
                    onChange={e => onChange({ ...safeVal, width: e.target.value + "px" })}
                    className="flex-1 accent-[#d4af37] h-1" 
                  />
                  <span className="text-[9px] font-bold w-10 text-right">{safeVal.width}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Tinggi Card (Height)</label>
              <select value={safeVal.height === "auto" ? "auto" : "custom"} onChange={e => {
                const val = e.target.value;
                onChange({ ...safeVal, height: val === "custom" ? "300px" : val });
              }}
                className="w-full px-2 py-1 text-[10px] bg-white border border-[#064e3b]/20 rounded-lg outline-none mb-1.5">
                <option value="auto">Auto (Sesuai Konten)</option>
                <option value="custom">Kustom (px)</option>
              </select>
              {safeVal.height !== "auto" && (
                <div className="flex gap-1 items-center">
                  <input 
                    type="range" 
                    min="50" 
                    max="600" 
                    value={parseInt(safeVal.height) || 300}
                    onChange={e => onChange({ ...safeVal, height: e.target.value + "px" })}
                    className="flex-1 accent-[#d4af37] h-1" 
                  />
                  <span className="text-[9px] font-bold w-10 text-right">{safeVal.height}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Radius Sudut (Border Radius)</label>
              <select value={safeVal.border_radius} onChange={e => onChange({ ...safeVal, border_radius: e.target.value })}
                className="w-full px-2 py-1 text-[10px] bg-white border border-[#064e3b]/20 rounded-lg outline-none">
                <option value="0px">Tajam (0px)</option>
                <option value="8px">Rounded Kecil (8px)</option>
                <option value="16px">Rounded Sedang (16px)</option>
                <option value="24px">Rounded Besar (24px)</option>
                <option value="32px">Rounded Extra (32px)</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Padding Dalam</label>
              <select value={safeVal.padding} onChange={e => onChange({ ...safeVal, padding: e.target.value })}
                className="w-full px-2 py-1 text-[10px] bg-white border border-[#064e3b]/20 rounded-lg outline-none">
                <option value="12px">Sempit (12px)</option>
                <option value="20px">Sedang (20px)</option>
                <option value="32px">Lebar (32px)</option>
                <option value="48px">Sangat Lebar (48px)</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Shadow (Bayangan)</label>
              <select value={safeVal.shadow} onChange={e => onChange({ ...safeVal, shadow: e.target.value })}
                className="w-full px-2 py-1 text-[10px] bg-white border border-[#064e3b]/20 rounded-lg outline-none">
                <option value="none">Tanpa Bayangan</option>
                <option value="0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)">Halus</option>
                <option value="0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)">Sedang</option>
                <option value="0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)">Tebal</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export interface BingkaiCoverSettings {
  enabled: boolean;
  width: string;
  color: string;
  style: string;
  padding: string;
  radius: string;
}

export function BingkaiCoverWidget({
  label = "Garis Bingkai Cover", value, onChange,
}: {
  label?: string;
  value: BingkaiCoverSettings;
  onChange: (v: BingkaiCoverSettings) => void;
}) {
  const safeVal: BingkaiCoverSettings = {
    enabled: value?.enabled ?? false,
    width: value?.width || "2px",
    color: value?.color || "#d4af37",
    style: value?.style || "solid",
    padding: value?.padding || "16px",
    radius: value?.radius || "12px",
  };

  return (
    <div className="space-y-3 p-3 bg-[#064e3b]/5 rounded-xl border border-[#064e3b]/10 text-left">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-wider text-[#d4af37]">{label}</p>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={safeVal.enabled}
            onChange={e => onChange({ ...safeVal, enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#064e3b]"></div>
        </label>
      </div>

      {safeVal.enabled && (
        <div className="space-y-2 pt-2 border-t border-[#064e3b]/10">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Ketebalan</label>
              <select value={safeVal.width} onChange={e => onChange({ ...safeVal, width: e.target.value })}
                className="w-full px-2 py-1 text-[10px] bg-white border border-[#064e3b]/20 rounded-lg outline-none">
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

            <div>
              <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Gaya Garis</label>
              <select value={safeVal.style} onChange={e => onChange({ ...safeVal, style: e.target.value })}
                className="w-full px-2 py-1 text-[10px] bg-white border border-[#064e3b]/20 rounded-lg outline-none">
                <option value="solid">Solid (Polos)</option>
                <option value="double">Double (Ganda)</option>
                <option value="dashed">Dashed (Putus-putus)</option>
                <option value="dotted">Dotted (Titik-titik)</option>
                <option value="groove">Groove (Ukiran)</option>
                <option value="ridge">Ridge (Timbul)</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Jarak dari Tepi (Padding)</label>
              <select value={safeVal.padding} onChange={e => onChange({ ...safeVal, padding: e.target.value })}
                className="w-full px-2 py-1 text-[10px] bg-white border border-[#064e3b]/20 rounded-lg outline-none">
                <option value="8px">8px</option>
                <option value="12px">12px</option>
                <option value="16px">16px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
                <option value="28px">28px</option>
                <option value="32px">32px</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Radius Sudut (Border Radius)</label>
              <select value={safeVal.radius} onChange={e => onChange({ ...safeVal, radius: e.target.value })}
                className="w-full px-2 py-1 text-[10px] bg-white border border-[#064e3b]/20 rounded-lg outline-none">
                <option value="0px">Tajam (0px)</option>
                <option value="8px">Bulat Kecil (8px)</option>
                <option value="12px">Bulat Sedang (12px)</option>
                <option value="16px">Bulat Besar (16px)</option>
                <option value="20px">Bulat Extra (20px)</option>
                <option value="24px">Sangat Bulat (24px)</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Warna Garis</label>
              <input type="color" value={safeVal.color}
                onChange={e => onChange({ ...safeVal, color: e.target.value })}
                className="w-full h-8 rounded cursor-pointer border border-[#064e3b]/20" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PhotoStyleWidget({
  bingkai,
  width,
  height,
  overlayUrl,
  photoScale,
  photoX,
  photoY,
  onChange,
}: {
  bingkai: string;
  width: string;
  height: string;
  overlayUrl: string;
  photoScale?: number;
  photoX?: number;
  photoY?: number;
  onChange: (updates: { bingkai: string; width: string; height: string; overlay_url: string; photo_scale: number; photo_x: number; photo_y: number }) => void;
}) {
  const safeBingkai = bingkai || "oval";
  const safeWidth = width || "120px";
  const safeHeight = height || "120px";
  const safeOverlayUrl = overlayUrl || "";
  const safePhotoScale = photoScale ?? 100;
  const safePhotoX = photoX ?? 0;
  const safePhotoY = photoY ?? 0;

  const isCustomOverlay = safeBingkai === "custom";

  return (
    <div className="space-y-3 p-3 bg-[#064e3b]/5 rounded-xl border border-[#064e3b]/10 text-left">
      <div>
        <label className="text-[9px] font-black uppercase tracking-wider text-[#064e3b]/60 block mb-1">Bentuk / Bingkai Foto</label>
        <div className="flex gap-1 flex-wrap mb-2">
          {BINGKAI_OPTIONS.map(b => (
            <button key={b} type="button" onClick={() => onChange({ bingkai: b, width: safeWidth, height: safeHeight, overlay_url: safeOverlayUrl, photo_scale: safePhotoScale, photo_x: safePhotoX, photo_y: safePhotoY })}
              className={`px-1.5 py-0.5 rounded text-[8px] font-black border transition-all ${safeBingkai === b ? "bg-[#064e3b] text-white border-[#d4af37]" : "bg-white text-[#064e3b]/60 border-[#064e3b]/20"}`}>
              {b}
            </button>
          ))}
        </div>
      </div>

      {isCustomOverlay && (
        <div className="space-y-2">
          <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Bingkai PNG Kustom (Upload/URL)</label>
          <FileUploader 
            value={safeOverlayUrl}
            onChange={(url) => onChange({ bingkai: safeBingkai, width: safeWidth, height: safeHeight, overlay_url: url, photo_scale: safePhotoScale, photo_x: safePhotoX, photo_y: safePhotoY })}
            accept="image/png"
          />
          <input
            type="text"
            value={safeOverlayUrl}
            onChange={e => onChange({ bingkai: safeBingkai, width: safeWidth, height: safeHeight, overlay_url: e.target.value, photo_scale: safePhotoScale, photo_x: safePhotoX, photo_y: safePhotoY })}
            placeholder="Atau tempel URL gambar kustom di sini..."
            className="w-full px-2.5 py-1.5 text-[10px] font-bold bg-white border border-[#064e3b]/20 rounded-lg outline-none focus:border-[#d4af37]"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Lebar Bingkai (Width)</label>
          <div className="flex gap-1 items-center">
            <input 
              type="range" 
              min="50" 
              max="300" 
              value={parseInt(safeWidth) || 120}
              onChange={e => onChange({ bingkai: safeBingkai, width: e.target.value + "px", height: safeHeight, overlay_url: safeOverlayUrl, photo_scale: safePhotoScale, photo_x: safePhotoX, photo_y: safePhotoY })}
              className="flex-1 accent-[#d4af37] h-1" 
            />
            <span className="text-[9px] font-bold w-10 text-right">{safeWidth}</span>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Tinggi Bingkai (Height)</label>
          <div className="flex gap-1 items-center">
            <input 
              type="range" 
              min="50" 
              max="300" 
              value={parseInt(safeHeight) || 120}
              onChange={e => onChange({ bingkai: safeBingkai, width: safeWidth, height: e.target.value + "px", overlay_url: safeOverlayUrl, photo_scale: safePhotoScale, photo_x: safePhotoX, photo_y: safePhotoY })}
              className="flex-1 accent-[#d4af37] h-1" 
            />
            <span className="text-[9px] font-bold w-10 text-right">{safeHeight}</span>
          </div>
        </div>

        <div className="col-span-2 border-t border-[#064e3b]/10 pt-2 mt-1">
          <label className="text-[9px] font-black uppercase tracking-wider text-[#064e3b]/60 block mb-1">Pengaturan Foto di Dalam Bingkai</label>
        </div>

        <div className="col-span-2">
          <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Skala Foto ({safePhotoScale}%)</label>
          <div className="flex gap-1 items-center">
            <input 
              type="range" 
              min="10" 
              max="200" 
              value={safePhotoScale}
              onChange={e => onChange({ bingkai: safeBingkai, width: safeWidth, height: safeHeight, overlay_url: safeOverlayUrl, photo_scale: parseInt(e.target.value), photo_x: safePhotoX, photo_y: safePhotoY })}
              className="flex-1 accent-[#d4af37] h-1" 
            />
            <span className="text-[9px] font-bold w-10 text-right">{safePhotoScale}%</span>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Geser Foto X ({safePhotoX}px)</label>
          <div className="flex gap-1 items-center">
            <input 
              type="range" 
              min="-100" 
              max="100" 
              value={safePhotoX}
              onChange={e => onChange({ bingkai: safeBingkai, width: safeWidth, height: safeHeight, overlay_url: safeOverlayUrl, photo_scale: safePhotoScale, photo_x: parseInt(e.target.value), photo_y: safePhotoY })}
              className="flex-1 accent-[#d4af37] h-1" 
            />
            <span className="text-[9px] font-bold w-10 text-right">{safePhotoX}px</span>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Geser Foto Y ({safePhotoY}px)</label>
          <div className="flex gap-1 items-center">
            <input 
              type="range" 
              min="-100" 
              max="100" 
              value={safePhotoY}
              onChange={e => onChange({ bingkai: safeBingkai, width: safeWidth, height: safeHeight, overlay_url: safeOverlayUrl, photo_scale: safePhotoScale, photo_x: safePhotoX, photo_y: parseInt(e.target.value) })}
              className="flex-1 accent-[#d4af37] h-1" 
            />
            <span className="text-[9px] font-bold w-10 text-right">{safePhotoY}px</span>
          </div>
        </div>
      </div>
    </div>
  );
}


