"use client";

import { getBgStyle, BackgroundWidget, SectionInput, InputField, FileUploader, FontSettingsWidget } from "./BuilderWidgets";
import { GALERI_LAYOUT_OPTIONS } from "./builder-constants";
import { Plus, Trash2 } from "lucide-react";

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

// ─── CERITA & GALERI TAB ──────────────────────────────────────────────────────

export function CeritaForm({ data, onChange, mode }: { data: any; onChange: (d: any) => void; mode?: "data" | "settings" }) {
  const upd = (key: string, val: any) => onChange({ ...data, [key]: val });
  const ceritas: any[] = data.ceritas || [];
  const galeris: string[] = data.galeris || [];

  const addCerita = () => upd("ceritas", [...ceritas, { judul: "", waktu: "", isi: "" }]);
  const removeCerita = (i: number) => upd("ceritas", ceritas.filter((_, idx) => idx !== i));
  const updCerita = (i: number, key: string, val: string) => upd("ceritas", ceritas.map((c, idx) => idx === i ? { ...c, [key]: val } : c));
  const addGaleri = () => upd("galeris", [...galeris, ""]);
  const removeGaleri = (i: number) => upd("galeris", galeris.filter((_, idx) => idx !== i));
  const updGaleri = (i: number, val: string) => upd("galeris", galeris.map((g, idx) => idx === i ? val : g));

  return (
    <div className="space-y-4">
      {/* ── DATA SECTION ── */}
      {(!mode || mode === "data") && (
        <>
          <SectionInput label="Timeline Cerita">
            <div className="space-y-4">
              {ceritas.map((c, i) => (
                <div key={i} className="p-4 bg-white/45 backdrop-blur-md border border-white/75 border-l-[3px] border-l-[#d4af37]/80 rounded-2xl space-y-3 relative shadow-[0_8px_30px_-5px_rgba(6,78,59,0.03)] hover:bg-white/60 hover:shadow-[0_12px_30px_-5px_rgba(6,78,59,0.06)] transition-all duration-300">
                  <div className="flex justify-between items-center border-b border-[#064e3b]/5 pb-2 mb-0.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#d4af37] bg-[#064e3b]/5 px-2 py-0.5 rounded-md">Cerita #{i + 1}</span>
                    <button type="button" onClick={() => removeCerita(i)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50/50 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-wider text-[#064e3b]/60 block mb-1">Judul Cerita</label>
                    <input 
                      type="text" 
                      value={c.judul} 
                      onChange={e => updCerita(i, "judul", e.target.value)} 
                      placeholder="Awal Pertemuan..." 
                      className="w-full px-3 py-2 text-xs bg-white/60 border border-[#064e3b]/15 rounded-xl outline-none focus:border-[#d4af37] text-[#064e3b] placeholder-[#064e3b]/30 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-wider text-[#064e3b]/60 block mb-1">Waktu / Tanggal</label>
                    <input 
                      type="text" 
                      value={c.waktu} 
                      onChange={e => updCerita(i, "waktu", e.target.value)} 
                      placeholder="Januari 2024" 
                      className="w-full px-3 py-2 text-xs bg-white/60 border border-[#064e3b]/15 rounded-xl outline-none focus:border-[#d4af37] text-[#064e3b] placeholder-[#064e3b]/30 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-wider text-[#064e3b]/60 block mb-1">Isi Cerita</label>
                    <textarea 
                      value={c.isi} 
                      onChange={e => updCerita(i, "isi", e.target.value)} 
                      placeholder="Ceritakan momen ini..." 
                      rows={3} 
                      className="w-full px-3 py-2 text-xs bg-white/60 border border-[#064e3b]/15 rounded-xl outline-none focus:border-[#d4af37] text-[#064e3b] placeholder-[#064e3b]/30 resize-none transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={addCerita}
              className="w-full py-2 border-2 border-dashed border-[#064e3b]/15 rounded-xl text-xs font-bold text-[#064e3b]/50 hover:border-[#d4af37] hover:text-[#d4af37] flex items-center justify-center gap-2 transition-all duration-300 bg-white/20 hover:bg-white/40">
              <Plus className="w-4 h-4" /> Tambah Cerita
            </button>
          </SectionInput>

          <SectionInput label="Galeri Foto">
            <div className="space-y-3">
              {galeris.map((g, i) => (
                <div key={i} className="p-3 bg-white border border-[#064e3b]/10 rounded-xl space-y-2 relative">
                  <button type="button" onClick={() => removeGaleri(i)} className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[9px] font-black uppercase text-[#d4af37]">Foto #{i + 1}</p>
                  <FileUploader
                    value={g}
                    onChange={v => updGaleri(i, v)}
                    accept="image/*"
                    type="image"
                  />
                </div>
              ))}
            </div>
            <button type="button" onClick={addGaleri}
              className="w-full py-2 border-2 border-dashed border-[#064e3b]/20 rounded-xl text-xs font-bold text-[#064e3b]/50 hover:border-[#d4af37] hover:text-[#d4af37] flex items-center justify-center gap-2 transition-all">
              <Plus className="w-4 h-4" /> Tambah Foto Galeri
            </button>
          </SectionInput>
        </>
      )}

      {/* ── SETTINGS SECTION ── */}
      {(!mode || mode === "settings") && (
        <>
          <SectionInput label="Desain & Tipografi Cerita">
            <div className="space-y-4">
              <FontSettingsWidget 
                label="Setting Header 'Cerita Kita'" 
                value={data.setting_head_cerita || { size: "18px", color: "#ffffff", family: "Inter", position: "center" }} 
                onChange={v => upd("setting_head_cerita", v)} 
                showAnimation 
              />
              <FontSettingsWidget 
                label="Setting Font Judul Cerita" 
                value={data.setting_judul_cerita || { size: "14px", color: "#ffffff", family: "Inter", position: "left" }} 
                onChange={v => upd("setting_judul_cerita", v)} 
                showAnimation 
              />
              <FontSettingsWidget 
                label="Setting Font Waktu Cerita" 
                value={data.setting_waktu_cerita || { size: "10px", color: "#ffffff", family: "Inter", position: "left" }} 
                onChange={v => upd("setting_waktu_cerita", v)} 
                showAnimation 
              />
              <FontSettingsWidget 
                label="Setting Font Isi Cerita" 
                value={data.setting_isi_cerita || { size: "11px", color: "#ffffff", family: "Inter", position: "left" }} 
                onChange={v => upd("setting_isi_cerita", v)} 
                showAnimation 
              />
            </div>
          </SectionInput>

          <BackgroundWidget label="Background Cerita" value={data.background_cerita || { type: "solid", value: "#fefcf6" }} onChange={v => upd("background_cerita", v)} />

          <SectionInput label="Gaya & Struktur Cerita">
            <div className="space-y-3.5">
              <div>
                <label className="text-[9px] font-black uppercase text-[#064e3b]/60 block mb-1.5 font-bold">Gaya Kartu Cerita</label>
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    { id: "glass", label: "Glassmorphism" },
                    { id: "outline", label: "Outline" },
                    { id: "solid", label: "Solid" },
                    { id: "none", label: "Clean / Tanpa Kartu" }
                  ].map(c => {
                    const isActive = data.cerita_card_style === c.id || (!data.cerita_card_style && c.id === "glass");
                    return (
                      <button key={c.id} type="button" onClick={() => upd("cerita_card_style", c.id)}
                        className={`px-3 py-1.5 rounded-xl text-[9px] font-bold border transition-all duration-300 ${
                          isActive 
                            ? "bg-[#064e3b] text-white border-[#d4af37] shadow-sm shadow-[#064e3b]/15" 
                            : "bg-white text-[#064e3b]/60 border-[#064e3b]/10 hover:bg-[#064e3b]/5 hover:text-[#064e3b]"
                        }`}>
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-[#064e3b]/60 block mb-1.5 font-bold">Gaya Alur Timeline</label>
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    { id: "left", label: "Kiri (Standar)" },
                    { id: "alternate", label: "Kanan-Kiri (Zig-Zag)" }
                  ].map(t => {
                    const isActive = data.cerita_timeline_style === t.id || (!data.cerita_timeline_style && t.id === "left");
                    return (
                      <button key={t.id} type="button" onClick={() => upd("cerita_timeline_style", t.id)}
                        className={`px-3 py-1.5 rounded-xl text-[9px] font-bold border transition-all duration-300 ${
                          isActive 
                            ? "bg-[#064e3b] text-white border-[#d4af37] shadow-sm shadow-[#064e3b]/15" 
                            : "bg-white text-[#064e3b]/60 border-[#064e3b]/10 hover:bg-[#064e3b]/5 hover:text-[#064e3b]"
                        }`}>
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </SectionInput>

          <SectionInput label="Gaya Layout Galeri">
            <div>
              <label className="text-[9px] font-black uppercase text-[#064e3b]/60 block mb-1.5">Pilih Desain Layout</label>
              <div className="flex gap-1.5 flex-wrap">
                {GALERI_LAYOUT_OPTIONS.map(l => {
                  const label = l === "grid-2" ? "Grid 2 Kolom" :
                                l === "grid-3" ? "Grid 3 Kolom" :
                                l === "masonry" ? "Masonry (Estetik)" :
                                l === "carousel" ? "Carousel (Geser)" :
                                l === "collage" ? "Collage Editorial" :
                                l === "polaroid" ? "Polaroid Stack" : l;
                  const isActive = data.galeri_layout === l || (l === "grid-2" && data.galeri_layout === "grid") || (!data.galeri_layout && l === "grid-2");
                  return (
                    <button key={l} type="button" onClick={() => upd("galeri_layout", l)}
                      className={`px-3 py-1.5 rounded-xl text-[9px] font-bold border transition-all duration-300 ${
                        isActive 
                          ? "bg-[#064e3b] text-white border-[#d4af37] shadow-sm shadow-[#064e3b]/15" 
                          : "bg-white text-[#064e3b]/60 border-[#064e3b]/10 hover:bg-[#064e3b]/5 hover:text-[#064e3b]"
                      }`}>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </SectionInput>

          <SectionInput label="Desain & Tipografi Galeri">
            <FontSettingsWidget 
              label="Setting Header 'Galeri Foto'" 
              value={data.setting_head_galeri || { size: "18px", color: "#ffffff", family: "Inter", position: "center" }} 
              onChange={v => upd("setting_head_galeri", v)} 
              showAnimation 
            />
          </SectionInput>

          <BackgroundWidget label="Background Galeri" value={data.background_galeri || { type: "solid", value: "#ffffff" }} onChange={v => upd("background_galeri", v)} />
        </>
      )}
    </div>
  );
}

export function CeritaPreview({ data }: { data: any }) {
  const bgCerita = getBgStyle(data.background_cerita);
  const bgGaleri = getBgStyle(data.background_galeri);
  const ceritas: any[] = data.ceritas || [];
  const galeris: string[] = (data.galeris || []).filter(Boolean);

  const getDividerClass = (align?: string) => {
    if (align === "left") return "w-8 h-0.5 bg-[#d4af37] mt-2 mr-auto ml-0";
    if (align === "right") return "w-8 h-0.5 bg-[#d4af37] mt-2 ml-auto mr-0";
    return "w-8 h-0.5 bg-[#d4af37] mt-2 mx-auto";
  };

  return (
    <div className="rounded-none overflow-hidden min-h-[512px] bg-[#f5f5dc]">
      {/* Cerita Section */}
      <div className="p-6 space-y-4" style={bgCerita}>
        <div style={getFontStyles(data.setting_head_cerita || { size: "18px", color: "#ffffff", family: "Inter", position: "center" })} className="relative">
          <div>Cerita Kita</div>
          <div className={getDividerClass(data.setting_head_cerita?.position)} />
        </div>
        {(() => {
          const cardStyle = data.cerita_card_style || "glass";
          const timelineStyle = data.cerita_timeline_style || "left";

          const getCardClass = () => {
            if (cardStyle === "glass") {
              return "bg-white/12 backdrop-blur-lg border border-white/20 rounded-[8px] p-4 shadow-[0_8px_32px_0_rgba(6,78,59,0.03)] relative space-y-2.5 transition-all duration-300 hover:bg-white/18 hover:border-white/35 hover:shadow-[0_12px_40px_rgba(6,78,59,0.05)]";
            }
            if (cardStyle === "outline") {
              return "bg-transparent border border-[#d4af37]/30 rounded-[8px] p-4 relative space-y-2.5 transition-all duration-300 hover:border-[#d4af37]/60";
            }
            if (cardStyle === "solid") {
              return "bg-white border border-slate-100 rounded-[8px] p-4 shadow-sm relative space-y-2.5 transition-all duration-300 hover:shadow-md";
            }
            // none
            return "bg-transparent border-none p-0 relative space-y-2.5";
          };

          const cardClass = getCardClass();

          if (timelineStyle === "alternate") {
            return (
              <div className="relative space-y-3.5 py-2">
                {/* Center Vertical Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#d4af37]/35 -translate-x-1/2" />
                
                {ceritas.map((c, i) => {
                  const isEven = i % 2 === 0;
                  const starTopClass = cardStyle === "none" ? "top-[6px]" : "top-[16px]";
                  return (
                    <div key={i} className={`relative flex items-start ${isEven ? "justify-start pl-[50%]" : "justify-end pr-[50%]"}`}>
                      {/* Elegant 4-pointed Star Node */}
                      <div className={`absolute left-1/2 -translate-x-1/2 ${starTopClass} w-5 h-5 flex items-center justify-center bg-transparent z-10`}>
                        <svg viewBox="0 0 24 24" className="w-[17px] h-[17px] text-[#d4af37] animate-star-twinkle" fill="currentColor">
                          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                        </svg>
                      </div>
                      
                      {/* Card wrapper */}
                      <div className={`w-[calc(100%-10px)] max-w-full ${isEven ? "pl-3.5" : "pr-3.5"}`}>
                        <div className={cardClass}>
                          {/* Card Header */}
                          <div className="flex flex-col gap-1 border-b border-[#d4af37]/15 pb-1.5 mb-0.5">
                            <div style={getFontStyles(data.setting_judul_cerita || { size: "14px", color: "#ffffff", family: "Inter", position: "left" })} className="font-bold tracking-wide break-words">
                              {c.judul || "Judul"}
                            </div>
                            <div style={getFontStyles(data.setting_waktu_cerita || { size: "10px", color: "#ffffff", family: "Inter", position: "left" })} className="font-black uppercase tracking-widest text-[8px] opacity-80">
                              {c.waktu || "Waktu"}
                            </div>
                          </div>
                          
                          {/* Card Content */}
                          <div style={getFontStyles(data.setting_isi_cerita || { size: "11px", color: "#ffffff", family: "Inter", position: "left" })} className="leading-relaxed font-light break-words">
                            {c.isi || "Isi cerita..."}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {ceritas.length === 0 && <div className="text-xs text-[#064e3b]/40 text-center py-4">Belum ada cerita.</div>}
              </div>
            );
          }

          // Left/standard style
          return (
            <div className="relative pl-6 border-l border-[#d4af37]/35 space-y-2.5">
              {ceritas.map((c, i) => (
                <div key={i} className="relative">
                  {/* Elegant 4-pointed Star Node */}
                  <div className="absolute -left-[34px] top-[16px] w-5 h-5 flex items-center justify-center bg-transparent">
                    <svg viewBox="0 0 24 24" className="w-[17px] h-[17px] text-[#d4af37] animate-star-twinkle" fill="currentColor">
                      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                    </svg>
                  </div>
                  
                  {/* Card Container */}
                  <div className={cardClass}>
                    {/* Card Header */}
                    <div className="flex items-baseline justify-between gap-3 border-b border-[#d4af37]/15 pb-1.5 mb-0.5">
                      <div style={getFontStyles(data.setting_judul_cerita || { size: "14px", color: "#ffffff", family: "Inter", position: "left" })} className="font-bold tracking-wide">
                        {c.judul || "Judul"}
                      </div>
                      <div style={getFontStyles(data.setting_waktu_cerita || { size: "10px", color: "#ffffff", family: "Inter", position: "left" })} className="font-black uppercase tracking-widest text-[8px] opacity-80 shrink-0">
                        {c.waktu || "Waktu"}
                      </div>
                    </div>
                    
                    {/* Card Content */}
                    <div style={getFontStyles(data.setting_isi_cerita || { size: "11px", color: "#ffffff", family: "Inter", position: "left" })} className="leading-relaxed font-light">
                      {c.isi || "Isi cerita..."}
                    </div>
                  </div>
                </div>
              ))}
              {ceritas.length === 0 && <div className="text-xs text-[#064e3b]/40 text-center py-4">Belum ada cerita.</div>}
            </div>
          );
        })()}
      </div>

      {/* Galeri Section */}
      <div className="p-6 space-y-3" style={bgGaleri}>
        <div style={getFontStyles(data.setting_head_galeri || { size: "18px", color: "#ffffff", family: "Inter", position: "center" })} className="relative">
          <div>Galeri Foto</div>
          <div className={getDividerClass(data.setting_head_galeri?.position)} />
        </div>
        {galeris.length > 0 ? (
          (() => {
            const layout = data.galeri_layout || "grid-2";
            if (layout === "grid" || layout === "grid-2") {
              return (
                <div className="grid grid-cols-2 gap-2">
                  {galeris.map((g, i) => (
                    <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden border border-white/20 shadow-sm">
                      <img src={g} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              );
            }
            if (layout === "grid-3") {
              return (
                <div className="grid grid-cols-3 gap-1.5">
                  {galeris.map((g, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden border border-white/20 shadow-sm">
                      <img src={g} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              );
            }
            if (layout === "masonry") {
              return (
                <div className="columns-2 gap-2 space-y-2">
                  {galeris.map((g, i) => (
                    <div key={i} className="break-inside-avoid">
                      <img src={g} alt="" className="w-full h-auto rounded-xl object-cover border border-white/20 shadow-sm" />
                    </div>
                  ))}
                </div>
              );
            }
            if (layout === "carousel") {
              return (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
                  {galeris.map((g, i) => (
                    <div key={i} className="w-[160px] shrink-0 snap-center">
                      <img src={g} alt="" className="w-full aspect-[3/4] object-cover rounded-xl border border-white/25 shadow-md" />
                    </div>
                  ))}
                </div>
              );
            }
            if (layout === "collage") {
              return (
                <div className="grid grid-cols-6 gap-2">
                  {galeris.map((g, i) => {
                    const colSpan = (i % 4 === 0 || i % 4 === 3) ? "col-span-4 aspect-[4/3]" : "col-span-2 aspect-square";
                    return (
                      <div key={i} className={`${colSpan} overflow-hidden rounded-xl border border-white/20 shadow-sm`}>
                        <img src={g} alt="" className="w-full h-full object-cover" />
                      </div>
                    );
                  })}
                </div>
              );
            }
            if (layout === "polaroid") {
              return (
                <div className="grid grid-cols-2 gap-3.5 pt-1">
                  {galeris.map((g, i) => {
                    const rotations = ["-rotate-2", "rotate-3", "rotate-1", "-rotate-3", "rotate-2", "-rotate-1"];
                    const rot = rotations[i % rotations.length];
                    return (
                      <div key={i} className={`bg-white p-1.5 pb-4 shadow-md border border-black/5 ${rot} transition-transform hover:rotate-0 duration-300`}>
                        <img src={g} alt="" className="w-full aspect-square object-cover" />
                        <div className="mt-1.5 text-center font-serif text-[7px] text-gray-400 tracking-widest font-black uppercase">Love #{i + 1}</div>
                      </div>
                    );
                  })}
                </div>
              );
            }
            return null;
          })()
        ) : (
          <div className="text-center text-xs text-[#064e3b]/40 py-6">Belum ada foto galeri.</div>
        )}
      </div>
    </div>
  );
}

// ─── PENUTUP TAB ──────────────────────────────────────────────────────────────

export function PenutupForm({ data, onChange, mode }: { data: any; onChange: (d: any) => void; mode?: "data" | "settings" }) {
  const upd = (key: string, val: any) => onChange({ ...data, [key]: val });
  const amplops: any[] = data.amplops || [];

  const addAmplop = () => upd("amplops", [...amplops, { bank: "", nomor_rekening: "", atas_nama: "" }]);
  const removeAmplop = (i: number) => upd("amplops", amplops.filter((_, idx) => idx !== i));
  const updAmplop = (i: number, key: string, val: string) => upd("amplops", amplops.map((a, idx) => idx === i ? { ...a, [key]: val } : a));

  return (
    <div className="space-y-4">
      {/* ── DATA SECTION ── */}
      {(!mode || mode === "data") && (
        <>
          <SectionInput label="RSVP & Konfirmasi">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={!!data.rsvp_aktif} onChange={e => upd("rsvp_aktif", e.target.checked)}
                className="w-4 h-4 accent-[#064e3b]" />
              <span className="text-xs font-bold text-[#064e3b]">Aktifkan Fitur RSVP</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={!!data.ucapan_aktif} onChange={e => upd("ucapan_aktif", e.target.checked)}
                className="w-4 h-4 accent-[#064e3b]" />
              <span className="text-xs font-bold text-[#064e3b]">Aktifkan Kolom Doa & Ucapan</span>
            </label>
          </SectionInput>

          <SectionInput label="Special Gift">
            <div className="space-y-3">
              {amplops.map((a, i) => (
                <div key={i} className="p-3 bg-white border border-[#064e3b]/10 rounded-xl space-y-2 relative">
                  <button type="button" onClick={() => removeAmplop(i)} className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[9px] font-black uppercase text-[#d4af37]">Rekening/Gift #{i + 1}</p>
                  <InputField label="Bank / E-Wallet" value={a.bank} onChange={v => updAmplop(i, "bank", v)} placeholder="BCA / GoPay..." />
                  <InputField label="Nomor Rekening" value={a.nomor_rekening} onChange={v => updAmplop(i, "nomor_rekening", v)} placeholder="1234567890" />
                  <InputField label="Atas Nama" value={a.atas_nama} onChange={v => updAmplop(i, "atas_nama", v)} placeholder="Nama Penerima" />
                </div>
              ))}
            </div>
            <button type="button" onClick={addAmplop}
              className="w-full py-2 border-2 border-dashed border-[#064e3b]/20 rounded-xl text-xs font-bold text-[#064e3b]/50 hover:border-[#d4af37] hover:text-[#d4af37] flex items-center justify-center gap-2 transition-all">
              <Plus className="w-4 h-4" /> Tambah Rekening/Gift
            </button>
          </SectionInput>

          <SectionInput label="Pesan Penutup">
            <InputField label="Pesan Penutup" value={data.pesan_penutup || ""} onChange={v => upd("pesan_penutup", v)} textarea placeholder="Merupakan suatu kehormatan..." />
            <InputField label="Salam Penutup" value={data.salam || ""} onChange={v => upd("salam", v)} placeholder="Wassalamu'alaikum..." />
            <InputField label="Tertanda" value={data.tertanda || ""} onChange={v => upd("tertanda", v)} placeholder="Nama & Nama" />
          </SectionInput>
        </>
      )}

      {/* ── SETTINGS SECTION ── */}
      {(!mode || mode === "settings") && (
        <>
          <SectionInput label="Desain & Tipografi Penutup">
            <div className="space-y-4">
              <FontSettingsWidget 
                label="Setting Header RSVP & Ucapan" 
                value={data.setting_head_rsvp || { size: "16px", color: "#ffffff", family: "Inter", position: "center" }} 
                onChange={v => upd("setting_head_rsvp", v)} 
                showAnimation 
              />
              <FontSettingsWidget 
                label="Setting Header Special Gift" 
                value={data.setting_head_gift || { size: "16px", color: "#ffffff", family: "Inter", position: "center" }} 
                onChange={v => upd("setting_head_gift", v)} 
                showAnimation 
              />
              <FontSettingsWidget 
                label="Setting Font Pesan Penutup" 
                value={data.setting_pesan_penutup || { size: "12px", color: "#ffffff", family: "Inter", position: "center" }} 
                onChange={v => upd("setting_pesan_penutup", v)} 
                showAnimation 
              />
            </div>
          </SectionInput>
          <BackgroundWidget value={data.background || { type: "solid", value: "#064e3b" }} onChange={v => upd("background", v)} />
        </>
      )}
    </div>
  );
}

export function PenutupPreview({ 
  data,
  wishes,
  onRsvpSubmit,
  namaTamu,
  setNamaTamu,
  kehadiran,
  setKehadiran,
  jumlahTamu,
  setJumlahTamu,
  ucapan,
  setUcapan,
  submitting,
  formSuccess,
  formError,
  onCopyClick,
  copiedIndex
}: { 
  data: any;
  wishes?: any[];
  onRsvpSubmit?: (e: React.FormEvent) => void;
  namaTamu?: string;
  setNamaTamu?: (v: string) => void;
  kehadiran?: "HADIR" | "TIDAK_HADIR" | "RAGU_RAGU";
  setKehadiran?: (v: "HADIR" | "TIDAK_HADIR" | "RAGU_RAGU") => void;
  jumlahTamu?: number;
  setJumlahTamu?: (v: number) => void;
  ucapan?: string;
  setUcapan?: (v: string) => void;
  submitting?: boolean;
  formSuccess?: boolean;
  formError?: string | null;
  onCopyClick?: (text: string, index: number) => void;
  copiedIndex?: number | null;
}) {
  const bgPenutup = getBgStyle(data.background);
  const amplops: any[] = data.amplops || [];

  const getDividerClass = (align?: string) => {
    if (align === "left") return "w-8 h-0.5 bg-[#d4af37] mt-2 mr-auto ml-0";
    if (align === "right") return "w-8 h-0.5 bg-[#d4af37] mt-2 ml-auto mr-0";
    return "w-8 h-0.5 bg-[#d4af37] mt-2 mx-auto";
  };

  return (
    <div className="w-full min-h-[512px] bg-[#f5f5dc] rounded-none overflow-hidden p-6 space-y-6" style={bgPenutup}>
      {data.rsvp_aktif && (
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 text-center space-y-4 shadow-xl relative">
          <div style={getFontStyles(data.setting_head_rsvp || { size: "14px", color: "#ffffff", family: "Inter", position: "center" })} className="font-extrabold uppercase tracking-wider">
            <div>Konfirmasi Kehadiran</div>
            <div className={getDividerClass(data.setting_head_rsvp?.position)} />
          </div>
          {onRsvpSubmit ? (
            formSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/10 to-emerald-500/30 border border-emerald-400/40 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <div className="text-white font-extrabold text-[12px] tracking-wider uppercase">Konfirmasi Terkirim!</div>
                  <div className="text-[9.5px] text-white/70 max-w-[200px] mx-auto leading-relaxed">Terima kasih atas konfirmasi Anda. Kehadiran Anda sangat berarti bagi kami.</div>
                </div>
              </div>
            ) : (
              <form onSubmit={onRsvpSubmit} className="space-y-3.5 pt-1.5 text-left">
                {formError && (
                  <div className="bg-rose-950/35 border border-rose-500/30 text-rose-300 p-2.5 rounded-xl text-[9px] font-semibold">
                    {formError}
                  </div>
                )}
                <div>
                  <label className="block text-[8.5px] font-extrabold uppercase tracking-widest text-white/60 mb-1.5">Nama Tamu</label>
                  <input
                    type="text"
                    required
                    value={namaTamu}
                    onChange={(e) => setNamaTamu?.(e.target.value)}
                    placeholder="Masukkan nama lengkap Anda..."
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/40 rounded-xl text-[10px] text-white placeholder-white/30 outline-none transition-all duration-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8.5px] font-extrabold uppercase tracking-widest text-white/60 mb-1.5">Kehadiran</label>
                    <div className="relative">
                      <select
                        value={kehadiran}
                        onChange={(e) => setKehadiran?.(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/40 rounded-xl text-[10px] text-white outline-none transition-all duration-300 cursor-pointer appearance-none"
                      >
                        <option value="HADIR" className="text-slate-800 bg-white">Hadir</option>
                        <option value="TIDAK_HADIR" className="text-slate-800 bg-white">Tidak Hadir</option>
                        <option value="RAGU_RAGU" className="text-slate-800 bg-white">Ragu-ragu</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-white/40">
                        <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-extrabold uppercase tracking-widest text-white/60 mb-1.5">Jumlah Tamu</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={jumlahTamu}
                      onChange={(e) => setJumlahTamu?.(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/40 rounded-xl text-[10px] text-white outline-none transition-all duration-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[8.5px] font-extrabold uppercase tracking-widest text-white/60 mb-1.5">Ucapan & Doa Restu</label>
                  <textarea
                    value={ucapan}
                    onChange={(e) => setUcapan?.(e.target.value)}
                    rows={2.5}
                    placeholder="Tuliskan ucapan selamat & doa restu Anda di sini..."
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/40 rounded-xl text-[10px] text-white placeholder-white/30 outline-none resize-none transition-all duration-300"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] hover:brightness-105 active:scale-[0.98] text-[#064e3b] font-black uppercase text-[10px] tracking-widest rounded-xl transition-all duration-300 shadow-lg shadow-[#d4af37]/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#064e3b] border-t-transparent rounded-full animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <span>Kirim Konfirmasi</span>
                  )}
                </button>
              </form>
            )
          ) : (
            <div className="flex gap-3 justify-center pt-2">
              <div className="px-6 py-2.5 bg-gradient-to-br from-[#d4af37] to-[#b48f17] text-white text-xs font-black rounded-xl shadow-md hover:scale-102 transition-transform cursor-pointer tracking-wider">Hadir</div>
              <div className="px-6 py-2.5 border border-white/20 text-white/90 text-xs font-black rounded-xl hover:bg-white/5 transition-colors cursor-pointer tracking-wider">Tidak Hadir</div>
            </div>
          )}
        </div>
      )}

      {amplops.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 space-y-4 shadow-xl relative">
          <div style={getFontStyles(data.setting_head_gift || { size: "14px", color: "#ffffff", family: "Inter", position: "center" })} className="font-extrabold uppercase tracking-wider">
            <div>Special Gift</div>
            <div className={getDividerClass(data.setting_head_gift?.position)} />
          </div>
          <div className="space-y-3 pt-1.5">
            {amplops.map((a, i) => (
              <div key={i} className="bg-white/[0.02] backdrop-blur-md rounded-2xl p-3.5 border border-white/10 border-l-2 border-l-[#d4af37] flex justify-between items-center transition-all duration-300 hover:bg-white/[0.05] shadow-sm">
                <div className="space-y-0.5 text-left">
                  <div className="text-[9px] font-bold text-white/50 uppercase tracking-widest">{a.bank || "Bank / E-Wallet"}</div>
                  <div className="text-xs font-mono font-bold text-white tracking-wider my-0.5">{a.nomor_rekening || "No. Rekening"}</div>
                  <div className="text-[9.5px] font-medium text-[#d4af37]/90">a.n. {a.atas_nama || "Atas Nama"}</div>
                </div>
                <button
                  type="button"
                  onClick={() => onCopyClick ? onCopyClick(a.nomor_rekening || "", i) : navigator.clipboard.writeText(a.nomor_rekening || "")}
                  className={`px-3.5 py-1.5 border rounded-lg text-[8.5px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                    copiedIndex === i
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                      : "bg-white/10 hover:bg-[#d4af37] hover:text-[#064e3b] border-white/15 hover:border-[#d4af37]"
                  }`}
                >
                  {copiedIndex === i ? "Tersalin" : "Salin"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.ucapan_aktif && (
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 space-y-4 shadow-xl relative text-left">
          <div style={getFontStyles(data.setting_head_rsvp || { size: "14px", color: "#ffffff", family: "Inter", position: "center" })} className="font-extrabold uppercase text-center tracking-wider">
            <div>Doa & Ucapan</div>
            <div className={getDividerClass(data.setting_head_rsvp?.position)} />
          </div>
          {wishes ? (
            wishes.length > 0 ? (
              <div 
                className="space-y-3 max-h-[220px] overflow-y-auto pr-1.5 pt-1 scrollbar-thin"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(255,255,255,0.15) transparent",
                }}
              >
                {wishes.map((w, idx) => (
                  <div key={w.id || idx} className="bg-white/5 rounded-2xl p-3 border border-white/10 flex gap-3 items-start transition-all hover:bg-white/10 shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/45 border border-[#d4af37]/40 flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-inner">
                      {w.nama_tamu ? w.nama_tamu.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold text-white truncate block">{w.nama_tamu}</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[6.5px] font-black uppercase tracking-wider ${
                          w.kehadiran === "HADIR"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : w.kehadiran === "TIDAK_HADIR"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}>
                          {w.kehadiran === "HADIR" ? "Hadir" : w.kehadiran === "TIDAK_HADIR" ? "Absen" : "Ragu"}
                        </span>
                      </div>
                      <p className="text-[9.5px] text-white/90 leading-relaxed font-normal whitespace-pre-wrap break-words">{w.ucapan}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-[9.5px] text-white/40 py-6">Belum ada doa atau ucapan terkirim.</div>
            )
          ) : (
            <div className="mt-1 w-full h-16 bg-white/5 border border-white/10 rounded-2xl text-[10px] flex items-center justify-center text-white/40 italic">Kolom ucapan tamu akan muncul di sini...</div>
          )}
        </div>
      )}

      <div className="text-center space-y-2.5 pt-5 border-t border-white/15">
        <p style={getFontStyles(data.setting_pesan_penutup || { size: "12px", color: "#ffffff", family: "Inter", position: "center" })} className="leading-relaxed whitespace-pre-wrap">{data.pesan_penutup || "Pesan penutup belum diisi."}</p>
        <p style={getFontStyles(data.setting_pesan_penutup || { size: "12px", color: "#ffffff", family: "Inter", position: "center" })} className="font-bold">{data.salam || ""}</p>
        <p style={getFontStyles(data.setting_pesan_penutup || { size: "14px", color: "#ffffff", family: "Inter", position: "center" })} className="font-black mt-2">{data.tertanda || "Nama & Nama"}</p>
        <p className="text-[9px] text-white/30 uppercase tracking-widest mt-4">Made with ❤ by Adatara</p>
      </div>
    </div>
  );
}
