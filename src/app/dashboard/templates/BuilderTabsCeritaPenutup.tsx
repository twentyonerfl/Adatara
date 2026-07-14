"use client";

import { useState, useRef, useEffect } from "react";
import { getBgStyle, BackgroundWidget, SectionInput, InputField, FileUploader, FontSettingsWidget, ButtonSettingsWidget, AnimatedWrapper, ScrollReveal } from "./BuilderWidgets";
import { GALERI_LAYOUT_OPTIONS, GALERI_LAYOUT_DETAILS } from "./builder-constants";
import { Plus, Trash2, ArrowUp, ArrowDown, GripVertical } from "lucide-react";

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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addCerita = () => upd("ceritas", [...ceritas, { judul: "", waktu: "", isi: "" }]);
  const removeCerita = (i: number) => upd("ceritas", ceritas.filter((_, idx) => idx !== i));
  const updCerita = (i: number, key: string, val: string) => upd("ceritas", ceritas.map((c, idx) => idx === i ? { ...c, [key]: val } : c));
  const addGaleri = () => upd("galeris", [...galeris, ""]);
  const removeGaleri = (i: number) => {
    const newGaleris = galeris.filter((_, idx) => idx !== i);
    const newConfigs = (data.galeri_custom_configs || []).filter((_: any, idx: number) => idx !== i);
    onChange({
      ...data,
      galeris: newGaleris,
      galeri_custom_configs: newConfigs
    });
  };
  const updGaleri = (i: number, val: string) => upd("galeris", galeris.map((g, idx) => idx === i ? val : g));
  
  const moveGaleri = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= galeris.length) return;
    
    const newGaleris = [...galeris];
    const [removedGaleri] = newGaleris.splice(fromIndex, 1);
    newGaleris.splice(toIndex, 0, removedGaleri);

    const newConfigs = data.galeri_custom_configs ? [...data.galeri_custom_configs] : [];
    while (newConfigs.length < galeris.length) {
      newConfigs.push({
        colSpan: "col-span-3",
        aspect: "aspect-[3/4]",
        rotate: "rotate-0",
        styleType: "polaroid"
      });
    }
    const [removedConfig] = newConfigs.splice(fromIndex, 1);
    newConfigs.splice(toIndex, 0, removedConfig);

    onChange({
      ...data,
      galeris: newGaleris,
      galeri_custom_configs: newConfigs
    });
  };

  const updCustomConfig = (idx: number, key: string, val: string) => {
    const configs = [...(data.galeri_custom_configs || [])];
    while (configs.length <= idx) {
      configs.push({
        colSpan: "col-span-3",
        aspect: "aspect-[3/4]",
        rotate: "rotate-0",
        styleType: "polaroid"
      });
    }
    configs[idx] = { ...configs[idx], [key]: val };
    upd("galeri_custom_configs", configs);
  };

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
                <div
                  key={i}
                  draggable
                  onDragStart={(e) => {
                    setDraggedIndex(i);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedIndex !== null && draggedIndex !== i) {
                      moveGaleri(draggedIndex, i);
                    }
                    setDraggedIndex(null);
                  }}
                  className={`p-3 bg-white border rounded-xl space-y-2 relative transition-all duration-200 ${
                    draggedIndex === i ? "opacity-40 border-dashed border-[#d4af37] bg-slate-50" : "border-[#064e3b]/10"
                  }`}
                >
                  <div className="absolute top-2 right-8 flex gap-1 items-center z-10">
                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => moveGaleri(i, i - 1)}
                        className="p-1 text-[#064e3b]/50 hover:text-[#d4af37] hover:bg-[#064e3b]/5 rounded transition-all cursor-pointer"
                        title="Pindahkan Ke Atas"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                    )}
                    {i < galeris.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveGaleri(i, i + 1)}
                        className="p-1 text-[#064e3b]/50 hover:text-[#d4af37] hover:bg-[#064e3b]/5 rounded transition-all cursor-pointer"
                        title="Pindahkan Ke Bawah"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <button type="button" onClick={() => removeGaleri(i)} className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 rounded-lg z-10 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-1 cursor-grab active:cursor-grabbing text-slate-400 select-none w-max">
                    <GripVertical className="w-3 h-3" />
                    <span className="text-[9px] font-black uppercase text-[#d4af37]">Foto #{i + 1}</span>
                  </div>
                  <FileUploader
                    value={g}
                    onChange={v => updGaleri(i, v)}
                    accept="image/*"
                    type="image"
                  />
                  {data.galeri_layout === "custom" && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#064e3b]/5">
                      <div>
                        <label className="text-[8px] font-black uppercase text-[#064e3b]/60 block mb-0.5">Lebar Grid</label>
                        <select
                          value={(data.galeri_custom_configs?.[i]?.colSpan) || "col-span-3"}
                          onChange={e => updCustomConfig(i, "colSpan", e.target.value)}
                          className="w-full px-2 py-1 text-[9px] bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-[#064e3b]"
                        >
                          <option value="col-span-1">1/6 (Kecil)</option>
                          <option value="col-span-2">1/3 (Sedang)</option>
                          <option value="col-span-3">1/2 (Setengah)</option>
                          <option value="col-span-4">2/3 (Lebar)</option>
                          <option value="col-span-6">6/6 (Penuh)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[8px] font-black uppercase text-[#064e3b]/60 block mb-0.5">Rasio Foto</label>
                        <select
                          value={(data.galeri_custom_configs?.[i]?.aspect) || "aspect-[3/4]"}
                          onChange={e => updCustomConfig(i, "aspect", e.target.value)}
                          className="w-full px-2 py-1 text-[9px] bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-[#064e3b]"
                        >
                          <option value="aspect-square">Square (1:1)</option>
                          <option value="aspect-[3/4]">Portrait (3:4)</option>
                          <option value="aspect-[4/3]">Landscape (4:3)</option>
                          <option value="aspect-[16/9]">Landscape (16:9)</option>
                          <option value="aspect-auto">Auto (Asli)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[8px] font-black uppercase text-[#064e3b]/60 block mb-0.5">Kemiringan</label>
                        <select
                          value={(data.galeri_custom_configs?.[i]?.rotate) || "rotate-0"}
                          onChange={e => updCustomConfig(i, "rotate", e.target.value)}
                          className="w-full px-2 py-1 text-[9px] bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-[#064e3b]"
                        >
                          <option value="rotate-0">Normal (0°)</option>
                          <option value="rotate-1">Kanan 1°</option>
                          <option value="rotate-2">Kanan 2°</option>
                          <option value="rotate-3">Kanan 3°</option>
                          <option value="-rotate-1">Kiri -1°</option>
                          <option value="-rotate-2">Kiri -2°</option>
                          <option value="-rotate-3">Kiri -3°</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[8px] font-black uppercase text-[#064e3b]/60 block mb-0.5">Gaya Bingkai</label>
                        <select
                          value={(data.galeri_custom_configs?.[i]?.styleType) || "polaroid"}
                          onChange={e => updCustomConfig(i, "styleType", e.target.value)}
                          className="w-full px-2 py-1 text-[9px] bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-[#064e3b]"
                        >
                          <option value="polaroid">Bingkai Foto</option>
                          <option value="rounded">Melengkung</option>
                          <option value="sharp">Siku Tajam</option>
                          <option value="circle">Bulat / Oval</option>
                        </select>
                      </div>
                    </div>
                  )}
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

          <SectionInput label="Background Cerita">
            <BackgroundWidget value={data.background_cerita || { type: "solid", value: "#fefcf6" }} onChange={v => upd("background_cerita", v)} />
          </SectionInput>

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
                        className={`px-3 py-1.5 rounded-xl text-[9px] font-bold border transition-all duration-300 ${isActive
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
                    { id: "right", label: "Kanan" },
                    { id: "alternate", label: "Kanan-Kiri (Zig-Zag)" }
                  ].map(t => {
                    const isActive = data.cerita_timeline_style === t.id || (!data.cerita_timeline_style && t.id === "left");
                    return (
                      <button key={t.id} type="button" onClick={() => upd("cerita_timeline_style", t.id)}
                        className={`px-3 py-1.5 rounded-xl text-[9px] font-bold border transition-all duration-300 ${isActive
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
            <div ref={dropdownRef} className="relative">
              <label className="text-[9px] font-black uppercase text-[#064e3b]/60 block mb-1.5 font-bold">Pilih Desain Layout</label>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-[#064e3b]/20 hover:border-[#d4af37] focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl text-xs text-[#064e3b] font-bold transition-all duration-200 shadow-sm"
              >
                <div className="text-left">
                  <span className="block text-[8px] font-black uppercase text-[#d4af37] tracking-wider mb-0.5">Layout Aktif</span>
                  <span className="text-xs font-black text-[#064e3b] leading-none">
                    {(() => {
                      const activeLayout = data.galeri_layout || "grid-2";
                      const layoutKey = activeLayout === "grid" ? "grid-2" : activeLayout;
                      return GALERI_LAYOUT_DETAILS[layoutKey]?.label || layoutKey;
                    })()}
                  </span>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`w-3.5 h-3.5 text-[#064e3b]/60 transition-transform duration-300 ${dropdownOpen ? "rotate-180 text-[#d4af37]" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-[#064e3b]/10 rounded-2xl shadow-xl max-h-[300px] overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                  <div className="grid grid-cols-1 gap-1">
                    {GALERI_LAYOUT_OPTIONS.map((l) => {
                      const info = GALERI_LAYOUT_DETAILS[l] || { label: l, desc: "" };
                      const isActive = data.galeri_layout === l || (l === "grid-2" && data.galeri_layout === "grid") || (!data.galeri_layout && l === "grid-2");
                      return (
                        <button
                          key={l}
                          type="button"
                          onClick={() => {
                            upd("galeri_layout", l);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all duration-200 flex flex-col gap-0.5 ${
                            isActive
                              ? "bg-[#064e3b] text-white border-l-4 border-l-[#d4af37]"
                              : "hover:bg-[#064e3b]/5 text-[#064e3b] border-l-4 border-l-transparent"
                          }`}
                        >
                          <span className="font-extrabold">{info.label}</span>
                          <span className={`text-[9px] ${isActive ? "text-white/70" : "text-[#064e3b]/50"}`}>{info.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Gap setting — only visible for custom layout */}
            {data.galeri_layout === "custom" && (
              <div className="mt-3 pt-3 border-t border-[#064e3b]/8">
                <label className="text-[9px] font-black uppercase text-[#064e3b]/60 block mb-1.5">Jarak Antar Foto</label>
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    { val: "gap-0", label: "Tanpa Jarak" },
                    { val: "gap-1", label: "Sangat Rapat" },
                    { val: "gap-2", label: "Rapat" },
                    { val: "gap-3", label: "Sedang" },
                    { val: "gap-4", label: "Normal" },
                    { val: "gap-6", label: "Lebar" },
                    { val: "gap-8", label: "Sangat Lebar" },
                  ].map(({ val, label }) => {
                    const isActive = (data.galeri_custom_gap || "gap-2") === val;
                    return (
                      <button key={val} type="button" onClick={() => upd("galeri_custom_gap", val)}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border transition-all duration-200 ${
                          isActive
                            ? "bg-[#064e3b] text-white border-[#d4af37] shadow-sm"
                            : "bg-white text-[#064e3b]/60 border-[#064e3b]/10 hover:bg-[#064e3b]/5"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Scroll height setting — only visible for scroll layout */}
            {data.galeri_layout === "scroll" && (
              <div className="mt-3 pt-3 border-t border-[#064e3b]/8">
                <label className="text-[9px] font-black uppercase text-[#064e3b]/60 block mb-1.5">Tinggi Galeri Scroll</label>
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    { val: "h-[180px]", label: "Kecil (180px)" },
                    { val: "h-[260px]", label: "Sedang (260px)" },
                    { val: "h-[360px]", label: "Besar (360px)" },
                    { val: "h-[480px]", label: "Sangat Besar (480px)" },
                  ].map(({ val, label }) => {
                    const isActive = (data.galeri_scroll_height || "h-[260px]") === val;
                    return (
                      <button key={val} type="button" onClick={() => upd("galeri_scroll_height", val)}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border transition-all duration-200 ${
                          isActive
                            ? "bg-[#064e3b] text-white border-[#d4af37] shadow-sm"
                            : "bg-white text-[#064e3b]/60 border-[#064e3b]/10 hover:bg-[#064e3b]/5"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2">
                  <label className="text-[9px] font-black uppercase text-[#064e3b]/60 block mb-1.5">Kolom Foto</label>
                  <div className="flex gap-1.5">
                    {[
                      { val: "1", label: "1 Kolom" },
                      { val: "2", label: "2 Kolom" },
                      { val: "3", label: "3 Kolom" },
                    ].map(({ val, label }) => {
                      const isActive = (data.galeri_scroll_cols || "2") === val;
                      return (
                        <button key={val} type="button" onClick={() => upd("galeri_scroll_cols", val)}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border transition-all duration-200 ${
                            isActive
                              ? "bg-[#064e3b] text-white border-[#d4af37] shadow-sm"
                              : "bg-white text-[#064e3b]/60 border-[#064e3b]/10 hover:bg-[#064e3b]/5"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </SectionInput>

          <SectionInput label="Desain & Tipografi Galeri">
            <FontSettingsWidget
              label="Setting Header 'Galeri Foto'"
              value={data.setting_head_galeri || { size: "18px", color: "#ffffff", family: "Inter", position: "center" }}
              onChange={v => upd("setting_head_galeri", v)}
              showAnimation
            />
          </SectionInput>

          <SectionInput label="Background Galeri">
            <BackgroundWidget value={data.background_galeri || { type: "solid", value: "#ffffff" }} onChange={v => upd("background_galeri", v)} />
          </SectionInput>
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
      {ceritas.length > 0 && (
        <div className="p-6 space-y-4 relative" style={bgCerita}>
          {data.background_cerita?.type === "video" && data.background_cerita?.value && (
            <video
              key={data.background_cerita.value}
              src={data.background_cerita.value}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          )}
          <div className="relative z-10">
            <div style={getFontStyles(data.setting_head_cerita || { size: "18px", color: "#ffffff", family: "Inter", position: "center" })} className="relative">
              <AnimatedWrapper val={data.setting_head_cerita}>
                <div>Cerita Kita</div>
                <div className={getDividerClass(data.setting_head_cerita?.position)} />
              </AnimatedWrapper>
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
                            <AnimatedWrapper val={data.setting_judul_cerita}>
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
                            </AnimatedWrapper>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }

              if (timelineStyle === "right") {
                return (
                  <div className="relative pr-6 border-r border-[#d4af37]/35 space-y-2.5">
                    {ceritas.map((c, i) => (
                      <div key={i} className="relative">
                        {/* Elegant 4-pointed Star Node */}
                        <div className="absolute -right-[34px] top-[16px] w-5 h-5 flex items-center justify-center bg-transparent">
                          <svg viewBox="0 0 24 24" className="w-[17px] h-[17px] text-[#d4af37] animate-star-twinkle" fill="currentColor">
                            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                          </svg>
                        </div>

                        {/* Card Container */}
                        <AnimatedWrapper val={data.setting_judul_cerita}>
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
                        </AnimatedWrapper>
                      </div>
                    ))}
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
                      <AnimatedWrapper val={data.setting_judul_cerita}>
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
                      </AnimatedWrapper>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Galeri Section */}
      <div className="p-6 space-y-3 relative" style={bgGaleri}>
        {data.background_galeri?.type === "video" && data.background_galeri?.value && (
          <video
            key={data.background_galeri.value}
            src={data.background_galeri.value}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        )}
        <div className="relative z-10">
        <div style={getFontStyles(data.setting_head_galeri || { size: "18px", color: "#ffffff", family: "Inter", position: "center" })} className="relative">
          <AnimatedWrapper val={data.setting_head_galeri}>
            <div>Galeri Foto</div>
            <div className={getDividerClass(data.setting_head_galeri?.position)} />
          </AnimatedWrapper>
        </div>
        {galeris.length > 0 ? (
          <div className="mt-5">
            {(() => {
              const layout = data.galeri_layout || "grid-2";
              if (layout === "grid" || layout === "grid-2") {
                return (
                  <div className="grid grid-cols-2 gap-2">
                    {galeris.map((g, i) => (
                      <ScrollReveal key={i} animationType="zoom-in" duration={0.6} delay={i * 0.04}>
                        <div className="aspect-[4/3] rounded-xl overflow-hidden border border-white/20 shadow-sm">
                          <img src={g} alt="" className="w-full h-full object-cover" />
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                );
              }
              if (layout === "grid-3") {
                return (
                  <div className="grid grid-cols-3 gap-1.5">
                    {galeris.map((g, i) => (
                      <ScrollReveal key={i} animationType="zoom-in" duration={0.6} delay={i * 0.03}>
                        <div className="aspect-square rounded-lg overflow-hidden border border-white/20 shadow-sm">
                          <img src={g} alt="" className="w-full h-full object-cover" />
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                );
              }
              if (layout === "masonry") {
                return (
                  <div className="columns-2 gap-2 space-y-2">
                    {galeris.map((g, i) => (
                      <ScrollReveal key={i} animationType="fade-up" duration={0.6} delay={i * 0.04}>
                        <div className="break-inside-avoid">
                          <img src={g} alt="" className="w-full h-auto rounded-xl object-cover border border-white/20 shadow-sm" />
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                );
              }
              if (layout === "carousel") {
                return (
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
                    {galeris.map((g, i) => (
                      <ScrollReveal key={i} animationType="zoom-in" duration={0.6} delay={i * 0.05}>
                        <div className="w-[160px] shrink-0 snap-center">
                          <img src={g} alt="" className="w-full aspect-[3/4] object-cover rounded-xl border border-white/25 shadow-md" />
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                );
              }
              if (layout === "scroll") {
                const scrollH = data.galeri_scroll_height || "h-[260px]";
                const scrollCols = data.galeri_scroll_cols || "2";
                const colsClass = scrollCols === "1" ? "grid-cols-1" : scrollCols === "3" ? "grid-cols-3" : "grid-cols-2";
                return (
                  <div className="relative">
                    <div className={`${scrollH} overflow-y-auto grid ${colsClass} gap-2 pr-1 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent`}
                      style={{ scrollbarWidth: "thin" }}>
                      {galeris.map((g, i) => (
                        <ScrollReveal key={i} animationType="zoom-in" duration={0.6} delay={i * 0.04}>
                          <div className="aspect-square rounded-xl overflow-hidden border border-white/20 shadow-sm shrink-0">
                            <img src={g} alt="" className="w-full h-full object-cover" />
                          </div>
                        </ScrollReveal>
                      ))}
                    </div>
                    {/* Fade gradient hint at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-b-xl" />
                  </div>
                );
              }
              if (layout === "collage") {
                return (
                  <div className="grid grid-cols-6 gap-2">
                    {galeris.map((g, i) => {
                      const colSpan = (i % 4 === 0 || i % 4 === 3) ? "col-span-4 aspect-[4/3]" : "col-span-2 aspect-square";
                      return (
                        <ScrollReveal key={i} animationType="zoom-in" duration={0.6} delay={i * 0.04}>
                          <div className={`${colSpan} overflow-hidden rounded-xl border border-white/20 shadow-sm`}>
                            <img src={g} alt="" className="w-full h-full object-cover" />
                          </div>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                );
              }
              if (layout === "aesthetic") {
                return (
                  <div className="grid grid-cols-6 gap-x-2 gap-y-4 pt-1 pb-4">
                    {galeris.map((g, i) => {
                      let gridClass = "";
                      if (i % 7 === 0) {
                        gridClass = "col-span-3 aspect-[3/4]";
                      } else if (i % 7 === 1) {
                        gridClass = "col-span-3 aspect-[3/4] translate-y-3";
                      } else if (i % 7 === 2) {
                        gridClass = "col-span-4 aspect-[4/3] mt-3";
                      } else if (i % 7 === 3) {
                        gridClass = "col-span-2 aspect-[3/4] mt-3";
                      } else if (i % 7 === 4) {
                        gridClass = "col-span-2 aspect-[3/4]";
                      } else if (i % 7 === 5) {
                        gridClass = "col-span-4 aspect-[4/3]";
                      } else {
                        gridClass = "col-span-6 max-w-[150px] mx-auto aspect-[3/4]";
                      }
                      return (
                        <ScrollReveal key={i} animationType="zoom-in" duration={0.6} delay={i * 0.04}>
                          <div className={`${gridClass} border-2 border-white shadow-lg overflow-hidden rounded-none`}>
                            <img src={g} alt="" className="w-full h-full object-cover" />
                          </div>
                        </ScrollReveal>
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
                        <ScrollReveal key={i} animationType="zoom-in" duration={0.6} delay={i * 0.04}>
                          <div className={`bg-white p-1.5 pb-4 shadow-md border border-black/5 ${rot} transition-transform hover:rotate-0 duration-300`}>
                            <img src={g} alt="" className="w-full aspect-square object-cover" />
                            <div className="mt-1.5 text-center font-serif text-[7px] text-gray-400 tracking-widest font-black uppercase">Love #{i + 1}</div>
                          </div>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                );
              }
              if (layout === "grid-4") {
                return (
                  <div className="grid grid-cols-4 gap-1 pt-1">
                    {galeris.map((g, i) => (
                      <ScrollReveal key={i} animationType="zoom-in" duration={0.6} delay={i * 0.03}>
                        <div className="aspect-square rounded-md overflow-hidden border border-white/20 shadow-sm">
                          <img src={g} alt="" className="w-full h-full object-cover" />
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                );
              }
              if (layout === "masonry-3") {
                return (
                  <div className="columns-3 gap-1.5 space-y-1.5 pt-1">
                    {galeris.map((g, i) => (
                      <ScrollReveal key={i} animationType="fade-up" duration={0.6} delay={i * 0.04}>
                        <div className="break-inside-avoid">
                          <img src={g} alt="" className="w-full h-auto rounded-lg object-cover border border-white/20 shadow-sm" />
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                );
              }
              if (layout === "mosaic-modern") {
                return (
                  <div className="grid grid-cols-6 gap-2 pt-1">
                    {galeris.map((g, i) => {
                      const indexPattern = i % 6;
                      let colSpan = "col-span-3 aspect-[4/3]";
                      if (indexPattern === 0) colSpan = "col-span-4 aspect-square";
                      else if (indexPattern === 1) colSpan = "col-span-2 aspect-[3/4]";
                      else if (indexPattern === 2) colSpan = "col-span-2 aspect-square";
                      else if (indexPattern === 3) colSpan = "col-span-4 aspect-[16/9]";
                      else if (indexPattern === 4) colSpan = "col-span-3 aspect-[4/3]";
                      else if (indexPattern === 5) colSpan = "col-span-3 aspect-[4/3]";
                      return (
                        <ScrollReveal key={i} animationType="zoom-in" duration={0.6} delay={i * 0.04}>
                          <div className={`${colSpan} overflow-hidden rounded-xl border border-white/20 shadow-sm`}>
                            <img src={g} alt="" className="w-full h-full object-cover" />
                          </div>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                );
              }
              if (layout === "zigzag") {
                return (
                  <div className="space-y-4 pt-1">
                    {galeris.map((g, i) => {
                      const isEven = i % 2 === 0;
                      return (
                        <ScrollReveal key={i} animationType={isEven ? "fade-right" : "fade-left"} duration={0.6} delay={0.05}>
                          <div className={`flex ${isEven ? "justify-start" : "justify-end"}`}>
                            <div className="w-[85%] aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-white/25 transform hover:scale-[1.02] transition-transform duration-300">
                              <img src={g} alt="" className="w-full h-full object-cover" />
                            </div>
                          </div>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                );
              }
              if (layout === "asymmetric") {
                return (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {galeris.map((g, i) => {
                      const indexPattern = i % 4;
                      const colSpan = (indexPattern === 0 || indexPattern === 3) ? "col-span-2 aspect-[4/3]" : "col-span-1 aspect-[4/3]";
                      return (
                        <ScrollReveal key={i} animationType="zoom-in" duration={0.6} delay={i * 0.04}>
                          <div className={`${colSpan} overflow-hidden rounded-xl border border-white/20 shadow-sm`}>
                            <img src={g} alt="" className="w-full h-full object-cover" />
                          </div>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                );
              }
              if (layout === "bubbles") {
                return (
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    {galeris.map((g, i) => {
                      const isEven = i % 2 === 0;
                      const bubbleClass = isEven 
                        ? "aspect-square rounded-full scale-95 hover:scale-100" 
                        : "aspect-[3/4] rounded-[100px] translate-y-3 hover:translate-y-1";
                      return (
                        <ScrollReveal key={i} animationType="zoom-in" duration={0.7} delay={i * 0.05}>
                          <div className={`${bubbleClass} overflow-hidden border-2 border-white shadow-md transition-all duration-300`}>
                            <img src={g} alt="" className="w-full h-full object-cover" />
                          </div>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                );
              }
              if (layout === "parallax-floating") {
                return (
                  <div className="space-y-6 pt-2 pb-6 relative">
                    {galeris.map((g, i) => {
                      const indexPattern = i % 3;
                      let offsetClass = "w-[75%] mr-auto rotate-1";
                      if (indexPattern === 1) offsetClass = "w-[75%] ml-auto -mt-6 -rotate-2 relative z-10";
                      else if (indexPattern === 2) offsetClass = "w-[85%] mx-auto -mt-4 rotate-2";
                      return (
                        <ScrollReveal key={i} animationType="zoom-in" duration={0.7} delay={i * 0.05}>
                          <div className={`${offsetClass} aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/30 transform hover:rotate-0 transition-all duration-500`}>
                            <img src={g} alt="" className="w-full h-full object-cover" />
                          </div>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                );
              }
              if (layout === "minimal-polaroid") {
                return (
                  <div className="space-y-6 pt-1">
                    {galeris.map((g, i) => {
                      const isEven = i % 2 === 0;
                      const rotation = isEven ? "rotate-1" : "-rotate-1";
                      return (
                        <ScrollReveal key={i} animationType="zoom-in" duration={0.7} delay={0.05}>
                          <div className="flex justify-center">
                            <div className={`w-[85%] bg-white p-2.5 pb-6 shadow-xl border border-black/5 rounded-none transform ${rotation} hover:rotate-0 transition-transform duration-300`}>
                              <img src={g} alt="" className="w-full aspect-square object-cover" />
                              <div className="mt-2 text-center font-serif text-[8px] text-gray-400 tracking-wider">Photo {i + 1}</div>
                            </div>
                          </div>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                );
              }
              if (layout === "classic-frame") {
                return (
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    {galeris.map((g, i) => (
                      <ScrollReveal key={i} animationType="zoom-in" duration={0.6} delay={i * 0.04}>
                        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-white p-2 shadow-lg border-2 border-[#d4af37]/30 hover:border-[#d4af37] transition-all duration-300">
                          <div className="w-full h-full overflow-hidden border border-[#d4af37]/20 relative">
                            <img src={g} alt="" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                );
              }
              if (layout === "filmstrip") {
                return (
                  <div className="flex gap-2 overflow-x-auto bg-neutral-900 py-3 px-2 border-y-4 border-dashed border-neutral-700 scrollbar-none snap-x snap-mandatory pt-1">
                    {galeris.map((g, i) => (
                      <ScrollReveal key={i} animationType="zoom-in" duration={0.6} delay={i * 0.05}>
                        <div className="w-[130px] aspect-square shrink-0 bg-black relative border-x border-neutral-800 snap-center flex items-center justify-center p-1">
                          <img src={g} alt="" className="w-full h-full object-cover" />
                          {/* Decorative Film Sprocket Holes */}
                          <div className="absolute top-0.5 left-0 right-0 flex justify-between px-1 pointer-events-none opacity-40">
                            <div className="w-1 h-1.5 bg-neutral-300 rounded-sm"></div>
                            <div className="w-1 h-1.5 bg-neutral-300 rounded-sm"></div>
                            <div className="w-1 h-1.5 bg-neutral-300 rounded-sm"></div>
                            <div className="w-1 h-1.5 bg-neutral-300 rounded-sm"></div>
                            <div className="w-1 h-1.5 bg-neutral-300 rounded-sm"></div>
                          </div>
                          <div className="absolute bottom-0.5 left-0 right-0 flex justify-between px-1 pointer-events-none opacity-40">
                            <div className="w-1 h-1.5 bg-neutral-300 rounded-sm"></div>
                            <div className="w-1 h-1.5 bg-neutral-300 rounded-sm"></div>
                            <div className="w-1 h-1.5 bg-neutral-300 rounded-sm"></div>
                            <div className="w-1 h-1.5 bg-neutral-300 rounded-sm"></div>
                            <div className="w-1 h-1.5 bg-neutral-300 rounded-sm"></div>
                          </div>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                );
              }
              if (layout === "highlight-first") {
                const first = galeris[0];
                const others = galeris.slice(1);
                return (
                  <div className="space-y-2 pt-1">
                    {first && (
                      <ScrollReveal animationType="zoom-in" duration={0.8}>
                        <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/20 shadow-md">
                          <img src={first} alt="" className="w-full h-full object-cover" />
                        </div>
                      </ScrollReveal>
                    )}
                    {others.length > 0 && (
                      <div className="grid grid-cols-3 gap-1.5">
                        {others.map((g, i) => (
                          <ScrollReveal key={i} animationType="zoom-in" duration={0.6} delay={i * 0.04}>
                            <div className="aspect-square rounded-lg overflow-hidden border border-white/10 shadow-sm">
                              <img src={g} alt="" className="w-full h-full object-cover" />
                            </div>
                          </ScrollReveal>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              if (layout === "custom") {
                const customGap = data.galeri_custom_gap || "gap-2";
                return (
                  <div className={`grid grid-cols-6 ${customGap} pt-1 pb-4`}>
                    {galeris.map((g, i) => {
                      const config = data.galeri_custom_configs?.[i] || {};
                      const colSpan = config.colSpan || "col-span-3";
                      const aspect = config.aspect || "aspect-[3/4]";
                      const rotate = config.rotate || "rotate-0";
                      const styleType = config.styleType || "polaroid";

                      let styleClass = "";
                      let imgClass = "w-full h-full object-cover";

                      if (styleType === "polaroid") {
                        styleClass = "border-4 border-white shadow-lg rounded-none bg-white p-1 pb-4 flex flex-col";
                        imgClass = "w-full flex-1 object-cover aspect-square";
                      } else if (styleType === "rounded") {
                        styleClass = "border border-white/20 shadow-md rounded-xl";
                      } else if (styleType === "circle") {
                        styleClass = "border border-white/20 shadow-md rounded-full aspect-square";
                      } else {
                        styleClass = "border border-white/20 shadow-sm rounded-none";
                      }

                      return (
                        <ScrollReveal key={i} animationType="zoom-in" duration={0.6} delay={i * 0.04}>
                          <div className={`${colSpan} ${aspect} ${rotate} ${styleClass} overflow-hidden transition-all duration-300`}>
                            <img src={g} alt="" className={imgClass} />
                          </div>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                );
              }
              return null;
            })()}
          </div>
        ) : (
          <div className="text-center text-xs text-[#064e3b]/40 py-6">Belum ada foto galeri.</div>
        )}
        </div>
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
                label="Setting Header RSVP"
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
              <FontSettingsWidget
                label="Setting Font Salam Penutup"
                value={data.setting_salam || { size: "12px", color: "#ffffff", family: "Inter", position: "center" }}
                onChange={v => upd("setting_salam", v)}
                showAnimation
              />
              <FontSettingsWidget
                label="Setting Font Nama/Tertanda"
                value={data.setting_tertanda || { size: "14px", color: "#d4af37", family: "Inter", position: "center" }}
                onChange={v => upd("setting_tertanda", v)}
                showAnimation
              />
              <ButtonSettingsWidget
                label="Setting Tombol RSVP / Konfirmasi"
                value={data.setting_tombol || { text: "Konfirmasi", size: "9.5px", color: "#064e3b", bg_color: "#d4af37", border_color: "transparent", family: "Inter" }}
                onChange={v => upd("setting_tombol", v)}
              />
            </div>
          </SectionInput>
          <SectionInput label="Background RSVP & Gift">
            <BackgroundWidget value={data.background_rsvp || data.background || { type: "solid", value: "#064e3b" }} onChange={v => upd("background_rsvp", v)} />
          </SectionInput>
          <SectionInput label="Background Pesan Penutup">
            <BackgroundWidget value={data.background || { type: "solid", value: "#064e3b" }} onChange={v => upd("background", v)} />
          </SectionInput>
        </>
      )}
    </div>
  );
}

const getTranslucentColor = (colorStr: string, opacityHex: string) => {
  let cleanColor = (colorStr || "#ffffff").trim();
  if (cleanColor.startsWith("#")) {
    if (cleanColor.length === 4) {
      cleanColor = "#" + cleanColor[1] + cleanColor[1] + cleanColor[2] + cleanColor[2] + cleanColor[3] + cleanColor[3];
    }
    if (cleanColor.length === 7) {
      return cleanColor + opacityHex;
    }
  }
  return cleanColor;
};

export function PenutupPreview({
  data,
  wishes,
  onRsvpSubmit,
  namaTamu = "",
  setNamaTamu,
  kehadiran = "HADIR",
  setKehadiran,
  jumlahTamu = 1,
  setJumlahTamu,
  ucapan = "",
  setUcapan,
  submitting = false,
  formSuccess = false,
  formError = null,
  onCopyClick,
  copiedIndex = null
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
  const [localNamaTamu, setLocalNamaTamu] = useState("");
  const [localKehadiran, setLocalKehadiran] = useState<"HADIR" | "TIDAK_HADIR" | "RAGU_RAGU">("HADIR");
  const [localJumlahTamu, setLocalJumlahTamu] = useState(1);
  const [localUcapan, setLocalUcapan] = useState("");

  const activeNamaTamu = setNamaTamu ? namaTamu : localNamaTamu;
  const activeKehadiran = setKehadiran ? kehadiran : localKehadiran;
  const activeJumlahTamu = setJumlahTamu ? jumlahTamu : localJumlahTamu;
  const activeUcapan = setUcapan ? ucapan : localUcapan;

  const handleNamaChange = (v: string) => {
    if (setNamaTamu) setNamaTamu(v);
    else setLocalNamaTamu(v);
  };
  const handleKehadiranChange = (v: "HADIR" | "TIDAK_HADIR" | "RAGU_RAGU") => {
    if (setKehadiran) setKehadiran(v);
    else setLocalKehadiran(v);
  };
  const handleJumlahChange = (v: number) => {
    if (setJumlahTamu) setJumlahTamu(v);
    else setLocalJumlahTamu(v);
  };
  const handleUcapanChange = (v: string) => {
    if (setUcapan) setUcapan(v);
    else setLocalUcapan(v);
  };

  const bgRsvp = getBgStyle(data.background_rsvp || data.background || { type: "solid", value: "#064e3b" });
  const rsvpBgData = data.background_rsvp || data.background || { type: "solid", value: "#064e3b" };
  const bgPenutup = getBgStyle(data.background || { type: "solid", value: "#064e3b" });
  const penutupBgData = data.background || { type: "solid", value: "#064e3b" };
  const amplops: any[] = data.amplops || [];
  const showRsvpBlock = data.rsvp_aktif || amplops.length > 0;

  const getDividerClass = (align?: string) => {
    if (align === "left") return "w-8 h-0.5 bg-[#d4af37] mt-2 mr-auto ml-0";
    if (align === "right") return "w-8 h-0.5 bg-[#d4af37] mt-2 ml-auto mr-0";
    return "w-8 h-0.5 bg-[#d4af37] mt-2 mx-auto";
  };

  const textColor = data.setting_pesan_penutup?.color || "#ffffff";
  const bgCardColor = getTranslucentColor(textColor, "15"); // ~8% opacity
  const borderCardColor = getTranslucentColor(textColor, "25"); // ~15% opacity
  const inputBgColor = getTranslucentColor(textColor, "08"); // ~3% opacity
  const inputBorderColor = getTranslucentColor(textColor, "18"); // ~10% opacity

  return (
    <div className="w-full rounded-none overflow-hidden penutup-preview-container flex flex-col">
      <style dangerouslySetInnerHTML={{__html: `
        .penutup-preview-container input::placeholder,
        .penutup-preview-container textarea::placeholder {
          color: ${textColor} !important;
          opacity: 0.35 !important;
        }
      `}} />

      {/* BLOCK 1: RSVP & SPECIAL GIFT */}
      {showRsvpBlock && (
        <div className="w-full p-6 space-y-6 relative overflow-hidden flex flex-col justify-center min-h-[250px]" style={bgRsvp}>
          {rsvpBgData.type === "video" && rsvpBgData.value && (
            <video
              key={rsvpBgData.value}
              src={rsvpBgData.value}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          )}
          <div className="relative z-10 w-full space-y-6">
            {data.rsvp_aktif && (
              <div 
                className="backdrop-blur-md border p-5 text-center space-y-4 shadow-xl relative" 
                style={{ 
                  borderRadius: "6%",
                  backgroundColor: bgCardColor,
                  borderColor: borderCardColor
                }}
              >
                <div style={getFontStyles(data.setting_head_rsvp || { size: "14px", color: "#ffffff", family: "Inter", position: "center" })} className="font-extrabold tracking-wider">
                  <AnimatedWrapper val={data.setting_head_rsvp}>
                    <div>Konfirmasi Kehadiran</div>
                    <div className={getDividerClass(data.setting_head_rsvp?.position)} />
                  </AnimatedWrapper>
                </div>
                {formSuccess ? (
                  <div className="text-center py-6 space-y-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/10 to-emerald-500/30 border border-emerald-400/40 rounded-full flex items-center justify-center mx-auto shadow-md">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <div className="font-extrabold text-[12px] tracking-wider" style={{ color: textColor }}>Konfirmasi Terkirim!</div>
                      <div className="text-[9.5px] max-w-[200px] mx-auto leading-relaxed" style={{ color: textColor, opacity: 0.7 }}>Terima kasih atas konfirmasi Anda. Kehadiran Anda sangat berarti bagi kami.</div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={onRsvpSubmit || ((e) => e.preventDefault())} className="space-y-4 pt-1 text-left">
                    {formError && (
                      <div className="bg-rose-950/35 border border-rose-500/30 text-rose-300 p-2.5 text-[9px] font-semibold" style={{ borderRadius: "6%" }}>
                        {formError}
                      </div>
                    )}

                    {/* 1. Nama Tamu */}
                    <div className="space-y-1.5">
                      <label className="block text-[8.5px] font-extrabold uppercase tracking-widest" style={{ color: textColor, opacity: 0.85 }}>Nama Tamu</label>
                      <input
                        type="text"
                        required
                        value={activeNamaTamu}
                        onChange={(e) => handleNamaChange(e.target.value)}
                        placeholder="Masukkan nama lengkap Anda..."
                        className="w-full px-3.5 py-2.5 border text-[10px] outline-none transition-all duration-300"
                        style={{ 
                          borderRadius: "10px",
                          backgroundColor: inputBgColor,
                          borderColor: inputBorderColor,
                          color: textColor
                        }}
                      />
                    </div>

                    {/* 2. Ucapan & Doa Restu */}
                    <div className="space-y-1.5">
                      <label className="block text-[8.5px] font-extrabold uppercase tracking-widest" style={{ color: textColor, opacity: 0.85 }}>Ucapan & Doa Restu</label>
                      <textarea
                        value={activeUcapan}
                        onChange={(e) => handleUcapanChange(e.target.value)}
                        rows={2.5}
                        placeholder="Tuliskan ucapan selamat & doa restu Anda di sini..."
                        className="w-full px-3.5 py-2.5 border text-[10px] outline-none resize-none transition-all duration-300"
                        style={{ 
                          borderRadius: "10px",
                          backgroundColor: inputBgColor,
                          borderColor: inputBorderColor,
                          color: textColor
                        }}
                      />
                    </div>

                    {/* 3. Konfirmasi Kehadiran */}
                    <div className="space-y-1.5">
                      <label className="block text-[8.5px] font-extrabold uppercase tracking-widest" style={{ color: textColor, opacity: 0.85 }}>Konfirmasi Kehadiran ?</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {[
                          {
                            value: "HADIR",
                            label: "Hadir",
                            icon: (
                              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ),
                            activeStyle: {
                              backgroundColor: "rgba(16, 185, 129, 0.15)",
                              borderColor: "#10b981",
                              color: "#10b981"
                            },
                            inactiveStyle: {
                              backgroundColor: inputBgColor,
                              borderColor: inputBorderColor,
                              color: getTranslucentColor(textColor, "99")
                            }
                          },
                          {
                            value: "TIDAK_HADIR",
                            label: "Tidak Hadir",
                            icon: (
                              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            ),
                            activeStyle: {
                              backgroundColor: "rgba(244, 63, 94, 0.15)",
                              borderColor: "#f43f5e",
                              color: "#f43f5e"
                            },
                            inactiveStyle: {
                              backgroundColor: inputBgColor,
                              borderColor: inputBorderColor,
                              color: getTranslucentColor(textColor, "99")
                            }
                          }
                        ].map((opt) => {
                          const isSelected = activeKehadiran === opt.value;
                          const btnStyle = isSelected ? opt.activeStyle : opt.inactiveStyle;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleKehadiranChange(opt.value as any)}
                              className="py-2 px-3 text-[9.5px] border transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 font-bold"
                              style={{ borderRadius: "10px", ...btnStyle }}
                            >
                              {opt.icon}
                              <span>{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {(() => {
                      const btnSetting = data.setting_tombol || {};
                      const btnText = btnSetting.text || "Konfirmasi";
                      const btnSize = btnSetting.size || "9.5px";
                      const btnColor = btnSetting.color || "#064e3b";
                      const btnBg = btnSetting.bg_color || "#d4af37";
                      const btnBorder = btnSetting.border_color || "transparent";
                      const btnFamily = btnSetting.family || "Inter";
                      
                      const hasCustomBg = btnSetting.bg_color && btnSetting.bg_color !== "#d4af37";
                      const bgStyle = hasCustomBg ? { backgroundColor: btnBg } : {};

                      return (
                        <button
                          type="submit"
                          disabled={submitting}
                          className={`w-full py-2 hover:brightness-105 active:scale-[0.98] font-extrabold tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 border ${!hasCustomBg ? 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37]' : ''}`}
                          style={{
                            borderRadius: "10px",
                            fontSize: btnSize,
                            color: btnColor,
                            borderColor: btnBorder,
                            fontFamily: btnFamily,
                            ...bgStyle,
                          }}
                        >
                          {submitting ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              <span>Mengirim...</span>
                            </>
                          ) : (
                            <span>{btnText}</span>
                          )}
                        </button>
                      );
                    })()}
                  </form>
                )}
              </div>
            )}

            {wishes && wishes.length > 0 && (
              <div 
                className="backdrop-blur-md border p-5 space-y-4 shadow-xl relative animate-fade-in" 
                style={{ 
                  borderRadius: "6%",
                  backgroundColor: bgCardColor,
                  borderColor: borderCardColor
                }}
              >
                <div style={getFontStyles(data.setting_head_rsvp || { size: "14px", color: "#ffffff", family: "Inter", position: "center" })} className="font-extrabold tracking-wider">
                  <AnimatedWrapper val={data.setting_head_rsvp}>
                    <div>Ucapan & Doa Restu</div>
                    <div className={getDividerClass(data.setting_head_rsvp?.position)} />
                  </AnimatedWrapper>
                </div>
                <div className="space-y-3 pt-1.5 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#d4af37]/30 text-left">
                  {wishes.map((w, idx) => (
                    <div 
                      key={w.id || idx} 
                      className="backdrop-blur-md p-3.5 border border-slate-100/10 flex flex-col gap-1 transition-all duration-300 shadow-sm rounded-xl" 
                      style={{ 
                        backgroundColor: getTranslucentColor(textColor, "05"),
                        borderColor: inputBorderColor,
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: textColor }}>{w.nama_tamu || w.nama || "Tamu"}</span>
                        {w.kehadiran && (
                          <span 
                            className="px-1.5 py-0.5 text-[7.5px] font-extrabold rounded" 
                            style={{ 
                              backgroundColor: w.kehadiran === "HADIR" ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)",
                              color: w.kehadiran === "HADIR" ? "#10b981" : "#f43f5e",
                              border: `1px solid ${w.kehadiran === "HADIR" ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)"}`
                            }}
                          >
                            {w.kehadiran === "HADIR" ? "Hadir" : "Tidak Hadir"}
                          </span>
                        )}
                      </div>
                      <p className="text-[9.5px] italic leading-relaxed" style={{ color: textColor, opacity: 0.85 }}>"{w.ucapan || w.pesan || "Mengirim doa restu."}"</p>
                      {w.created_at && (
                        <span className="text-[7px] self-end" style={{ color: textColor, opacity: 0.4 }}>
                          {new Date(w.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {amplops.length > 0 && (
              <div 
                className="backdrop-blur-md border p-5 space-y-4 shadow-xl relative" 
                style={{ 
                  borderRadius: "6%",
                  backgroundColor: bgCardColor,
                  borderColor: borderCardColor
                }}
              >
                <div style={getFontStyles(data.setting_head_gift || { size: "14px", color: "#ffffff", family: "Inter", position: "center" })} className="font-extrabold tracking-wider">
                  <AnimatedWrapper val={data.setting_head_gift}>
                    <div>Special Gift</div>
                    <div className={getDividerClass(data.setting_head_gift?.position)} />
                  </AnimatedWrapper>
                </div>
                <div className="space-y-3 pt-1.5">
                  {amplops.map((a, i) => (
                    <div 
                      key={i} 
                      className="backdrop-blur-md p-3.5 border border-l-2 flex justify-between items-center transition-all duration-300 shadow-sm" 
                      style={{ 
                        borderRadius: "6%",
                        backgroundColor: getTranslucentColor(textColor, "05"),
                        borderColor: inputBorderColor,
                        borderLeftColor: "#d4af37"
                      }}
                    >
                      <div className="space-y-0.5 text-left">
                        <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: textColor, opacity: 0.5 }}>{a.bank || "Bank / E-Wallet"}</div>
                        <div className="text-xs font-mono font-bold tracking-wider my-0.5" style={{ color: textColor }}>{a.nomor_rekening || "No. Rekening"}</div>
                        <div className="text-[9.5px] font-medium" style={{ color: "#d4af37" }}>a.n. {a.atas_nama || "Atas Nama"}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onCopyClick ? onCopyClick(a.nomor_rekening || "", i) : navigator.clipboard.writeText(a.nomor_rekening || "")}
                        className="px-2.5 py-1 border text-[8px] font-extrabold tracking-wider transition-all duration-300 cursor-pointer"
                        style={{ 
                          borderRadius: "6%",
                          backgroundColor: copiedIndex === i ? getTranslucentColor("#10b981", "30") : getTranslucentColor(textColor, "15"),
                          borderColor: copiedIndex === i ? "#10b981" : borderCardColor,
                          color: copiedIndex === i ? "#10b981" : textColor
                        }}
                      >
                        {copiedIndex === i ? "Tersalin" : "Salin"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BLOCK 2: PESAN PENUTUP */}
      <div className="w-full p-6 py-10 relative overflow-hidden flex flex-col justify-center text-center" style={bgPenutup}>
        {penutupBgData.type === "video" && penutupBgData.value && (
          <video
            key={penutupBgData.value}
            src={penutupBgData.value}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        )}
        <div className="relative z-10 w-full space-y-4">
          <div style={getFontStyles(data.setting_pesan_penutup || { size: "12px", color: "#ffffff", family: "Inter", position: "center" })}>
            <AnimatedWrapper val={data.setting_pesan_penutup}>
              <p className="leading-relaxed whitespace-pre-wrap">{data.pesan_penutup || "Pesan penutup belum diisi."}</p>
            </AnimatedWrapper>
          </div>

          {data.salam && (
            <div style={getFontStyles(data.setting_salam || { size: "12px", color: "#ffffff", family: "Inter", position: "center" })}>
              <AnimatedWrapper val={data.setting_salam}>
                <p className="font-bold">{data.salam}</p>
              </AnimatedWrapper>
            </div>
          )}

          <div style={getFontStyles(data.setting_tertanda || { size: "14px", color: "#d4af37", family: "Inter", position: "center" })}>
            <AnimatedWrapper val={data.setting_tertanda}>
              <p className="font-black mt-2">{data.tertanda || "Nama & Nama"}</p>
            </AnimatedWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}
