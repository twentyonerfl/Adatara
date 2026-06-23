"use client";

import { useState, useEffect } from "react";
import { getBgStyle, FontSettingsWidget, BackgroundWidget, SectionInput, InputField, FileUploader, FramedPhoto, PhotoStyleWidget, CountdownSettingsWidget } from "./BuilderWidgets";
import { Plus, Trash2 } from "lucide-react";

function getMapsEmbedUrl(input?: string) {
  if (!input) return "";
  if (input.includes("<iframe")) {
    const match = input.match(/src=["']([^"']+)["']/);
    if (match && match[1]) {
      return match[1];
    }
  }
  return input.trim();
}

// ─── PROFIL TAB ───────────────────────────────────────────────────────────────

export function ProfilForm({ data, onChange, mode }: { data: any; onChange: (d: any) => void; mode?: "data" | "settings" }) {
  const upd = (key: string, val: any) => onChange({ ...data, [key]: val });
  const profils: any[] = data.profils || [];

  const addProfil = () => upd("profils", [...profils, { foto: "", bingkai: "oval", foto_width: "120px", foto_height: "120px", overlay_url: "", nama: "", keterangan: "", urutan_anak: "" }]);
  const removeProfil = (i: number) => upd("profils", profils.filter((_, idx) => idx !== i));
  const updProfil = (i: number, keyOrUpdates: string | Record<string, any>, val?: any) => {
    const next = profils.map((p, idx) => {
      if (idx === i) {
        if (typeof keyOrUpdates === "object") {
          return { ...p, ...keyOrUpdates };
        }
        return { ...p, [keyOrUpdates]: val };
      }
      return p;
    });
    upd("profils", next);
  };

  return (
    <div className="space-y-4">
      {/* ── DATA SECTION ── */}
      {(!mode || mode === "data") && (
        <>
          <SectionInput label="Ucapan Profil">
            <InputField label="Ucapan / Ayat / Quote" value={data.ucapan_profil || ""} onChange={v => upd("ucapan_profil", v)} textarea placeholder="Maha suci Allah..." />
          </SectionInput>

          <SectionInput label="Daftar Profil Undangan">
            <div className="space-y-3">
              {profils.map((p, i) => (
                <div key={i} className="p-3 bg-white border border-[#064e3b]/10 rounded-xl space-y-2 relative">
                  <button type="button" onClick={() => removeProfil(i)}
                    className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[9px] font-black uppercase text-[#d4af37]">Profil #{i + 1}</p>
                  <FileUploader
                    label="Foto Profil"
                    value={p.foto}
                    onChange={v => updProfil(i, "foto", v)}
                    accept="image/*"
                    type="image"
                  />
                  <InputField label="Nama Lengkap" value={p.nama} onChange={v => updProfil(i, "nama", v)} placeholder="Nama..." />
                  <InputField label="Keterangan" value={p.keterangan} onChange={v => updProfil(i, "keterangan", v)} placeholder="Putra/i dari Bpk. & Ibu..." />
                  <InputField label="Urutan Anak / Bersaudara" value={p.urutan_anak || ""} onChange={v => updProfil(i, "urutan_anak", v)} placeholder="Anak pertama dari tiga bersaudara..." />
                </div>
              ))}
            </div>
            <button type="button" onClick={addProfil}
              className="w-full py-2 border-2 border-dashed border-[#064e3b]/20 rounded-xl text-xs font-bold text-[#064e3b]/50 hover:border-[#d4af37] hover:text-[#d4af37] flex items-center justify-center gap-2 transition-all">
              <Plus className="w-4 h-4" /> Tambah Profil
            </button>
          </SectionInput>
        </>
      )}

      {/* ── SETTINGS SECTION ── */}
      {(!mode || mode === "settings") && (
        <>
          <SectionInput label="Setting Font Ucapan Profil">
            <FontSettingsWidget label="Setting Font Ucapan" value={data.setting_ucapan_profil || {}} onChange={v => upd("setting_ucapan_profil", v)} showAnimation showSpacing />
          </SectionInput>

          {profils.length > 0 && (
            <SectionInput label="Setting Foto & Style Tokoh Profil">
              <div className="space-y-4">
                {profils.map((p, i) => (
                  <div key={i} className="p-3.5 bg-white border border-[#064e3b]/10 rounded-xl space-y-4">
                    <div>
                      <p className="text-[9px] font-black uppercase text-[#d4af37] mb-2">Foto Profil #{i + 1} ({p.nama || "Tanpa Nama"})</p>
                      <PhotoStyleWidget
                        bingkai={p.bingkai || "oval"}
                        width={p.foto_width || "120px"}
                        height={p.foto_height || "120px"}
                        overlayUrl={p.overlay_url || ""}
                        photoScale={p.foto_scale}
                        photoX={p.foto_x}
                        photoY={p.foto_y}
                        onChange={(updates) => {
                          updProfil(i, {
                            bingkai: updates.bingkai,
                            foto_width: updates.width,
                            foto_height: updates.height,
                            overlay_url: updates.overlay_url,
                            foto_scale: updates.photo_scale,
                            foto_x: updates.photo_x,
                            foto_y: updates.photo_y
                          });
                        }}
                      />
                    </div>

                    <div className="pt-3 border-t border-[#064e3b]/10">
                      <FontSettingsWidget
                        label="Style Nama Lengkap"
                        value={p.setting_nama || {}}
                        onChange={(val) => updProfil(i, "setting_nama", val)}
                      />
                    </div>

                    <div className="pt-3 border-t border-[#064e3b]/10">
                      <FontSettingsWidget
                        label="Style Keterangan (Orang Tua)"
                        value={p.setting_keterangan || {}}
                        onChange={(val) => updProfil(i, "setting_keterangan", val)}
                      />
                    </div>

                    <div className="pt-3 border-t border-[#064e3b]/10">
                      <FontSettingsWidget
                        label="Style Urutan Anak / Bersaudara"
                        value={p.setting_urutan || {}}
                        onChange={(val) => updProfil(i, "setting_urutan", val)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionInput>
          )}

          <BackgroundWidget value={data.background || { type: "solid", value: "#fefcf6" }} onChange={v => upd("background", v)} />
        </>
      )}
    </div>
  );
}

export function ProfilPreview({ data }: { data: any }) {
  const bg = getBgStyle(data.background);
  const profils: any[] = data.profils || [];
  const isUcapanCustom = data.setting_ucapan_profil?.position === "custom";

  return (
    <div className="w-full min-h-[512px] flex flex-col items-center justify-center relative rounded-none overflow-hidden p-6 gap-5" style={bg}>
      {isUcapanCustom ? (
        <p
          className="opacity-80 whitespace-pre-wrap z-10"
          style={{
            color: data.setting_ucapan_profil?.color || "#ffffff",
            fontFamily: data.setting_ucapan_profil?.family || "Inter",
            fontSize: data.setting_ucapan_profil?.size || "12px",
            position: "absolute",
            left: `${data.setting_ucapan_profil?.x ?? 50}%`,
            top: `${data.setting_ucapan_profil?.y ?? 15}%`,
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: data.setting_ucapan_profil?.width || "90%",
            lineHeight: data.setting_ucapan_profil?.lineHeight || "1.5",
          }}
        >
          {data.ucapan_profil || "Ucapan profil belum diisi."}
        </p>
      ) : (
        <p
          className="leading-relaxed opacity-80 max-w-xs whitespace-pre-wrap z-10"
          style={{
            color: data.setting_ucapan_profil?.color || "#ffffff",
            fontFamily: data.setting_ucapan_profil?.family || "Inter",
            fontSize: data.setting_ucapan_profil?.size || "12px",
            textAlign: (data.setting_ucapan_profil?.position || "center") as any,
            lineHeight: data.setting_ucapan_profil?.lineHeight || "1.5",
          }}
        >
          {data.ucapan_profil || "Ucapan profil belum diisi."}
        </p>
      )}
      <div className={`flex gap-6 justify-center flex-wrap z-10`}>
        {profils.map((p, i) => (
          <div key={i} className="flex flex-col items-center gap-2 text-center">
            <FramedPhoto
              src={p.foto}
              bingkai={p.bingkai || "oval"}
              className="w-24 h-24"
              customWidth={p.foto_width}
              customHeight={p.foto_height}
              overlayUrl={p.overlay_url}
              photoScale={p.foto_scale}
              photoX={p.foto_x}
              photoY={p.foto_y}
            />
            <div>
              <div 
                className="text-sm font-bold" 
                style={{ 
                  fontFamily: p.setting_nama?.family || data.setting_nama_profil?.family || "Inter",
                  fontSize: p.setting_nama?.size || data.setting_nama_profil?.size || "14px",
                  color: p.setting_nama?.color || data.setting_nama_profil?.color || data.setting_ucapan_profil?.color || "#064e3b" 
                }}
              >
                {p.nama || "Nama"}
              </div>
              <div 
                className="text-[10px] opacity-70 mt-1 leading-normal" 
                style={{ 
                  fontFamily: p.setting_keterangan?.family || data.setting_keterangan_profil?.family || "Inter",
                  fontSize: p.setting_keterangan?.size || data.setting_keterangan_profil?.size || "10px",
                  color: p.setting_keterangan?.color || data.setting_keterangan_profil?.color || data.setting_ucapan_profil?.color || "#064e3b" 
                }}
              >
                {p.keterangan || "Keterangan"}
              </div>
              {p.urutan_anak && (
                <div 
                  className="text-[9px] opacity-60 italic mt-0.5 leading-normal" 
                  style={{ 
                    fontFamily: p.setting_urutan?.family || data.setting_urutan_profil?.family || "Inter",
                    fontSize: p.setting_urutan?.size || data.setting_urutan_profil?.size || "9px",
                    color: p.setting_urutan?.color || data.setting_urutan_profil?.color || data.setting_ucapan_profil?.color || "#064e3b" 
                  }}
                >
                  {p.urutan_anak}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ACARA TAB ────────────────────────────────────────────────────────────────

function Countdown({ targetDateStr, settings }: { targetDateStr: string; settings?: any }) {
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

  const styleType = settings?.type || "grid";
  const numFamily = settings?.family || "Inter";
  const numSize = settings?.size || "14px";
  const numColor = settings?.color || "#064e3b";
  const lblFamily = settings?.label_family || "Inter";
  const lblSize = settings?.label_size || "7px";
  const lblColor = settings?.label_color || "#d4af37";
  const boxBg = settings?.bg_color || "rgba(255, 255, 255, 0.8)";
  const boxBorder = settings?.border_color || "rgba(6, 78, 59, 0.1)";
  const boxRadius = styleType === "bulat" ? "9999px" : (settings?.border_radius || "12px");
  const pos = settings?.position || "center";

  const containerClass = `flex gap-2 mt-2 w-full max-w-xs mx-auto ${
    pos === "left" ? "justify-start" : pos === "right" ? "justify-end" : "justify-center"
  }`;

  const renderPlaceholder = () => {
    return ["Hari", "Jam", "Menit", "Detik"].map((label) => {
      const boxStyle: React.CSSProperties = styleType !== "minimalis" ? {
        backgroundColor: boxBg,
        borderColor: boxBorder,
        borderWidth: "1px",
        borderRadius: boxRadius,
      } : {};
      
      return (
        <div key={label} 
          className={`flex-1 flex flex-col items-center justify-center p-1.5 min-w-[50px] aspect-square ${
            styleType !== "minimalis" ? "shadow-sm border" : ""
          }`}
          style={boxStyle}
        >
          <div className="font-black leading-none" style={{ fontFamily: numFamily, fontSize: numSize, color: numColor }}>00</div>
          <div className="font-bold uppercase tracking-wider mt-1 leading-none" style={{ fontFamily: lblFamily, fontSize: lblSize, color: lblColor }}>{label}</div>
        </div>
      );
    });
  };

  if (!isMounted || !timeLeft) {
    return (
      <div className={containerClass}>
        {renderPlaceholder()}
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {Object.entries(timeLeft).map(([label, value]) => {
        const labelMap: Record<string, string> = {
          days: "Hari",
          hours: "Jam",
          minutes: "Menit",
          seconds: "Detik"
        };
        const padValue = String(value).padStart(2, "0");
        const boxStyle: React.CSSProperties = styleType !== "minimalis" ? {
          backgroundColor: boxBg,
          borderColor: boxBorder,
          borderWidth: "1px",
          borderRadius: boxRadius,
        } : {};

        return (
          <div key={label} 
            className={`flex-1 flex flex-col items-center justify-center p-1.5 min-w-[50px] aspect-square ${
              styleType !== "minimalis" ? "shadow-sm border" : ""
            }`}
            style={boxStyle}
          >
            <div className="font-black leading-none" style={{ fontFamily: numFamily, fontSize: numSize, color: numColor }}>{padValue}</div>
            <div className="font-bold uppercase tracking-wider mt-1 leading-none" style={{ fontFamily: lblFamily, fontSize: lblSize, color: lblColor }}>{labelMap[label]}</div>
          </div>
        );
      })}
    </div>
  );
}

export function AcaraForm({ data, onChange, mode }: { data: any; onChange: (d: any) => void; mode?: "data" | "settings" }) {
  const upd = (key: string, val: any) => onChange({ ...data, [key]: val });
  const acaras: any[] = data.acaras || [];

  const addAcara = () => upd("acaras", [...acaras, { nama: "", tanggal: "", jam_mulai: "08:00", jam_selesai: "10:00", alamat: "", link_maps: "", embed_maps: "" }]);
  const removeAcara = (i: number) => upd("acaras", acaras.filter((_, idx) => idx !== i));
  const updAcara = (i: number, keyOrUpdates: string | Record<string, any>, val?: any) => {
    const next = acaras.map((a, idx) => {
      if (idx === i) {
        if (typeof keyOrUpdates === "object") {
          return { ...a, ...keyOrUpdates };
        }
        return { ...a, [keyOrUpdates]: val };
      }
      return a;
    });
    upd("acaras", next);
  };

  return (
    <div className="space-y-4">
      {/* ── DATA SECTION ── */}
      {(!mode || mode === "data") && (
        <>
          <SectionInput label="Daftar Acara">
            <div className="space-y-3">
              {acaras.map((a, i) => (
                <div key={i} className="p-3 bg-white border border-[#064e3b]/10 rounded-xl space-y-2 relative">
                  <button type="button" onClick={() => removeAcara(i)} className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[9px] font-black uppercase text-[#d4af37]">Acara #{i + 1}</p>
                  <InputField label="Nama Acara" value={a.nama} onChange={v => updAcara(i, "nama", v)} placeholder="Akad Nikah..." />
                  <InputField label="Tanggal" value={a.tanggal} onChange={v => updAcara(i, "tanggal", v)} type="date" />
                  <div className="grid grid-cols-2 gap-2">
                    <InputField label="Jam Mulai" value={a.jam_mulai} onChange={v => updAcara(i, "jam_mulai", v)} placeholder="Contoh: 08:00" />
                    <div>
                      <InputField label="Jam Selesai" value={a.jam_selesai} onChange={v => updAcara(i, "jam_selesai", v)} placeholder="Contoh: 10:00 atau Selesai" />
                      <button
                        type="button"
                        onClick={() => updAcara(i, "jam_selesai", "Selesai")}
                        className="mt-1 text-[10px] font-bold text-[#d4af37] hover:underline"
                      >
                        Atur sebagai 'Selesai'
                      </button>
                    </div>
                  </div>
                  <InputField label="Alamat Lengkap" value={a.alamat} onChange={v => updAcara(i, "alamat", v)} placeholder="Jl. ..." textarea />
                  <InputField label="Link Google Maps" value={a.link_maps} onChange={v => updAcara(i, "link_maps", v)} placeholder="https://maps.google.com/..." />
                  {a.link_maps && (
                    <InputField label="Label Link Maps" value={a.link_maps_label} onChange={v => updAcara(i, "link_maps_label", v)} placeholder="Lihat di Maps →" />
                  )}
                  <InputField label="Embed Maps URL (Opsional)" value={a.embed_maps} onChange={v => updAcara(i, "embed_maps", v)} placeholder="https://www.google.com/maps/embed?..." />
                  {a.embed_maps && (
                    <div className="space-y-1 mt-1 p-2 bg-[#064e3b]/5 rounded-lg border border-[#064e3b]/10">
                      <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-0.5">Tinggi Maps Embed: {a.embed_maps_height ?? 112}px</label>
                      <div className="flex items-center gap-2">
                        <input type="range" min="80" max="400" step="10" value={a.embed_maps_height ?? 112}
                          onChange={e => updAcara(i, "embed_maps_height", parseInt(e.target.value))}
                          className="flex-1 accent-[#d4af37] h-1" />
                        <span className="text-[9px] font-bold text-[#064e3b]">{a.embed_maps_height ?? 112}px</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addAcara}
              className="w-full py-2 border-2 border-dashed border-[#064e3b]/20 rounded-xl text-xs font-bold text-[#064e3b]/50 hover:border-[#d4af37] hover:text-[#d4af37] flex items-center justify-center gap-2 transition-all">
              <Plus className="w-4 h-4" /> Tambah Acara
            </button>
          </SectionInput>

          <SectionInput label="Pengaturan Hitung Mundur (Countdown)">
            <div className="p-3 bg-white border border-[#064e3b]/10 rounded-xl space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!data.countdown_aktif}
                  onChange={e => upd("countdown_aktif", e.target.checked)}
                  className="w-4 h-4 accent-[#064e3b] cursor-pointer"
                />
                <span className="text-xs font-bold text-[#064e3b]">Aktifkan Hitung Mundur</span>
              </label>

              {data.countdown_aktif && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#064e3b]/60 block">
                    Pilih Acara Sebagai Target
                  </label>
                  <select
                    value={data.countdown_acara_index ?? 0}
                    onChange={e => upd("countdown_acara_index", parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#064e3b]/20 rounded-xl outline-none focus:border-[#d4af37] text-[#064e3b] cursor-pointer font-bold"
                  >
                    {acaras.map((a, i) => (
                      <option key={i} value={i}>
                        Acara #{i + 1}: {a.nama || "Tanpa Nama"} ({a.tanggal || "Tanpa Tanggal"})
                      </option>
                    ))}
                    {acaras.length === 0 && (
                      <option value={0}>Belum ada acara ditambahkan</option>
                    )}
                  </select>
                </div>
              )}
            </div>
          </SectionInput>
        </>
      )}

      {/* ── SETTINGS SECTION ── */}
      {(!mode || mode === "settings") && (
        <>
          {data.countdown_aktif && (
            <SectionInput label="Setting Style Hitung Mundur">
              <CountdownSettingsWidget
                label="Style Countdown"
                value={data.setting_countdown || {}}
                onChange={(val) => upd("setting_countdown", val)}
              />
            </SectionInput>
          )}

          {acaras.length > 0 && (
            <SectionInput label="Setting Style Acara">
              <div className="space-y-4">
                {acaras.map((a, i) => (
                  <div key={i} className="p-3.5 bg-white border border-[#064e3b]/10 rounded-xl space-y-4">
                    <p className="text-[9px] font-black uppercase text-[#d4af37]">Acara #{i + 1} ({a.nama || "Tanpa Nama"})</p>
                    
                    <div className="pt-2">
                      <FontSettingsWidget
                        label="Style Nama Acara"
                        value={a.setting_nama || {}}
                        onChange={(val) => updAcara(i, "setting_nama", val)}
                      />
                    </div>

                    <div className="pt-3 border-t border-[#064e3b]/10">
                      <FontSettingsWidget
                        label="Style Tanggal Acara"
                        value={a.setting_tanggal || {}}
                        onChange={(val) => updAcara(i, "setting_tanggal", val)}
                      />
                    </div>

                    <div className="pt-3 border-t border-[#064e3b]/10">
                      <FontSettingsWidget
                        label="Style Jam (Waktu) Acara"
                        value={a.setting_jam || {}}
                        onChange={(val) => updAcara(i, "setting_jam", val)}
                      />
                    </div>

                    <div className="pt-3 border-t border-[#064e3b]/10">
                      <FontSettingsWidget
                        label="Style Alamat Lengkap"
                        value={a.setting_alamat || {}}
                        onChange={(val) => updAcara(i, "setting_alamat", val)}
                      />
                    </div>

                    <div className="pt-3 border-t border-[#064e3b]/10">
                      <label className="text-[9px] font-bold uppercase text-[#064e3b]/60 block mb-1">Style Card Acara</label>
                      <select
                        value={a.setting_card?.type || "glass"}
                        onChange={e => updAcara(i, "setting_card", { ...a.setting_card, type: e.target.value })}
                        className="w-full px-2 py-1.5 text-[10px] bg-white border border-[#064e3b]/20 rounded-lg outline-none font-bold cursor-pointer text-[#064e3b]"
                      >
                        <option value="glass">Kaca (Glassmorphism)</option>
                        <option value="outline">Garis (Outline)</option>
                        <option value="solid">Solid (Putih)</option>
                        <option value="none">Tanpa Card (Polos)</option>
                      </select>
                    </div>

                    <div className="pt-3 border-t border-[#064e3b]/10">
                      <label className="text-[9px] font-extrabold uppercase tracking-wider text-[#064e3b]/60 block mb-1.5">Label Link Google Maps</label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={a.link_maps_label || ""}
                          onChange={e => updAcara(i, "link_maps_label", e.target.value)}
                          placeholder="Lihat di Maps →"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#064e3b]/20 rounded-lg outline-none focus:border-[#d4af37] text-[#064e3b] placeholder-[#064e3b]/30 font-medium"
                        />
                        <FontSettingsWidget
                          label="Style Teks Label"
                          value={a.setting_link_maps || {}}
                          onChange={(val) => updAcara(i, "setting_link_maps", val)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionInput>
          )}

          <BackgroundWidget value={data.background || { type: "solid", value: "#f5f5dc" }} onChange={v => upd("background", v)} />
        </>
      )}
    </div>
  );
}

function getEventElementStyle(settingItem: any, defaultStyle: { size: string, color: string, family: string, position?: string }) {
  const family = settingItem?.family || defaultStyle.family;
  const size = settingItem?.size || defaultStyle.size;
  const color = settingItem?.color || defaultStyle.color;
  
  const styles: React.CSSProperties = {
    fontFamily: family,
    fontSize: size,
    color: color,
  };
  
  const pos = settingItem?.position || defaultStyle.position || "left";
  if (pos === "custom") {
    styles.position = "absolute";
    styles.left = `${settingItem?.x ?? 50}%`;
    styles.top = `${settingItem?.y ?? 50}%`;
    styles.transform = "translate(-50%, -50%)";
    styles.whiteSpace = "nowrap";
  } else {
    styles.textAlign = pos as any;
  }
  return styles;
}

function formatIndonesianDate(dateStr?: string) {
  try {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  } catch (e) {
    return dateStr || "";
  }
}

function formatEventTime(jamMulai?: string, jamSelesai?: string) {
  if (!jamMulai && !jamSelesai) return "";
  const start = jamMulai || "";
  const end = jamSelesai || "";
  
  if (end.toLowerCase() === "selesai") {
    return `${start} WIB – Selesai`;
  }
  
  if (start && end) {
    return `${start} – ${end} WIB`;
  }
  
  return `${start || end} WIB`;
}

export function AcaraPreview({ data }: { data: any }) {
  const bg = getBgStyle(data.background);
  const acaras: any[] = data.acaras || [];
  return (
    <div className="w-full min-h-[512px] rounded-none overflow-hidden p-6 space-y-3" style={bg}>
      {data.countdown_aktif && (() => {
        const idx = data.countdown_acara_index ?? 0;
        const targetEvent = acaras[idx];
        if (!targetEvent || !targetEvent.tanggal) return null;
        
        let timePart = "00:00";
        if (targetEvent.jam_mulai) {
          const match = targetEvent.jam_mulai.match(/([0-1]?[0-9]|2[0-3]):[0-5][0-9]/);
          if (match) {
            timePart = match[0];
          }
        }
        const targetDateTime = `${targetEvent.tanggal}T${timePart}`;
        const pos = data.setting_countdown?.position || "center";
        const alignClass = pos === "left" ? "text-left" : pos === "right" ? "text-right" : "text-center";
        return (
          <div className={`space-y-1.5 py-2 ${alignClass}`}>
            <div className="text-[10px] font-black uppercase tracking-wider opacity-60 text-white">
              Hitung Mundur Acara
            </div>
            <Countdown targetDateStr={targetDateTime} settings={data.setting_countdown} />
          </div>
        );
      })()}

      <div className="text-center mb-4">
        <div className="text-xs font-black uppercase tracking-wider opacity-60 text-white">Jadwal & Lokasi</div>
        <div className="w-8 h-0.5 bg-[#d4af37] mx-auto mt-2" />
      </div>

      {acaras.map((a, i) => {
        const cardStyle = a.setting_card?.type || "glass";
        let cardClass = "relative space-y-1.5 ";
        if (cardStyle === "none") {
          cardClass += "p-0 bg-transparent border-none min-h-0";
        } else {
          cardClass += "min-h-[140px] ";
          if (cardStyle === "outline") {
            cardClass += "p-4 bg-transparent border border-[#064e3b]/20 rounded-xl";
          } else if (cardStyle === "solid") {
            cardClass += "p-4 bg-white border border-slate-100 rounded-xl shadow-sm";
          } else {
            cardClass += "p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/80";
          }
        }

        return (
          <div key={i} className={cardClass}>
            <div 
              className="text-sm font-black" 
              style={getEventElementStyle(a.setting_nama, data.setting_nama_acara || { size: "14px", color: "#064e3b", family: "Inter", position: "left" })}
            >
              {a.nama || "Nama Acara"}
            </div>
            {a.tanggal && (
              <div 
                className="text-xs font-semibold"
                style={getEventElementStyle(a.setting_tanggal, data.setting_tanggal_acara || { size: "12px", color: "#064e3b", family: "Inter", position: "left" })}
              >
                {formatIndonesianDate(a.tanggal)}
              </div>
            )}
            {(a.jam_mulai || a.jam_selesai) && (
              <div 
                className="text-xs"
                style={getEventElementStyle(a.setting_jam, data.setting_jam_acara || { size: "11px", color: "#064e3b", family: "Inter", position: "left" })}
              >
                {formatEventTime(a.jam_mulai, a.jam_selesai)}
              </div>
            )}
            {a.alamat && (
              <div 
                className="text-[10px] leading-relaxed"
                style={getEventElementStyle(a.setting_alamat, data.setting_alamat_acara || data.setting_jam_acara || { size: "10px", color: "#064e3b", family: "Inter", position: "left" })}
              >
                {a.alamat}
              </div>
            )}
            {a.embed_maps && (
              <div 
                className="w-full rounded-lg overflow-hidden mt-1 border border-[#064e3b]/10"
                style={{ height: a.embed_maps_height ? `${a.embed_maps_height}px` : "112px" }}
              >
                <iframe
                  src={getMapsEmbedUrl(a.embed_maps)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                />
              </div>
            )}
            {a.link_maps && (
              <div 
                className="mt-1"
                style={getEventElementStyle(a.setting_link_maps, data.setting_link_maps_acara || { size: "10px", color: "#d4af37", family: "Inter", position: "left" })}
              >
                <a href={a.link_maps} target="_blank" className="font-bold hover:underline">
                  {a.link_maps_label || "Lihat di Maps →"}
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
