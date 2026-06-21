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
            <div className="space-y-3">
              {ceritas.map((c, i) => (
                <div key={i} className="p-3 bg-white border border-[#064e3b]/10 rounded-xl space-y-2 relative">
                  <button type="button" onClick={() => removeCerita(i)} className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[9px] font-black uppercase text-[#d4af37]">Cerita #{i + 1}</p>
                  <InputField label="Judul" value={c.judul} onChange={v => updCerita(i, "judul", v)} placeholder="Awal Pertemuan..." />
                  <InputField label="Waktu / Tanggal" value={c.waktu} onChange={v => updCerita(i, "waktu", v)} placeholder="Januari 2024" />
                  <InputField label="Isi Cerita" value={c.isi} onChange={v => updCerita(i, "isi", v)} placeholder="Ceritakan momen ini..." textarea />
                </div>
              ))}
            </div>
            <button type="button" onClick={addCerita}
              className="w-full py-2 border-2 border-dashed border-[#064e3b]/20 rounded-xl text-xs font-bold text-[#064e3b]/50 hover:border-[#d4af37] hover:text-[#d4af37] flex items-center justify-center gap-2 transition-all">
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

          <SectionInput label="Gaya Layout Galeri">
            <div>
              <label className="text-[9px] font-black uppercase text-[#064e3b]/60 block mb-1">Gaya Layout</label>
              <div className="flex gap-1">
                {GALERI_LAYOUT_OPTIONS.map(l => (
                  <button key={l} type="button" onClick={() => upd("galeri_layout", l)}
                    className={`px-3 py-1 rounded-lg text-[9px] font-black border ${data.galeri_layout === l ? "bg-[#064e3b] text-white border-[#d4af37]" : "bg-white text-[#064e3b]/60 border-[#064e3b]/20"}`}>
                    {l}
                  </button>
                ))}
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
    <div className="rounded-2xl overflow-hidden min-h-[512px] bg-[#f5f5dc]">
      {/* Cerita Section */}
      <div className="p-6 space-y-4" style={bgCerita}>
        <div style={getFontStyles(data.setting_head_cerita || { size: "18px", color: "#ffffff", family: "Inter", position: "center" })} className="relative">
          <div>Cerita Kita</div>
          <div className={getDividerClass(data.setting_head_cerita?.position)} />
        </div>
        <div className="relative pl-6 border-l border-dashed border-[#d4af37]/60 space-y-6">
          {ceritas.map((c, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-[#d4af37] ring-4 ring-[#d4af37]/20 border-2 border-white" />
              <div className="bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl p-3.5 shadow-sm relative space-y-1.5 transition-all hover:bg-white/80">
                <div className="flex items-baseline justify-between gap-3 border-b border-[#064e3b]/5 pb-1 mb-1">
                  <div style={getFontStyles(data.setting_judul_cerita || { size: "14px", color: "#ffffff", family: "Inter", position: "left" })} className="font-bold">
                    {c.judul || "Judul"}
                  </div>
                  <div style={getFontStyles(data.setting_waktu_cerita || { size: "10px", color: "#ffffff", family: "Inter", position: "left" })} className="font-black uppercase tracking-wider text-[9px] opacity-75 shrink-0">
                    {c.waktu || "Waktu"}
                  </div>
                </div>
                <div style={getFontStyles(data.setting_isi_cerita || { size: "11px", color: "#ffffff", family: "Inter", position: "left" })} className="leading-relaxed">
                  {c.isi || "Isi cerita..."}
                </div>
              </div>
            </div>
          ))}
          {ceritas.length === 0 && <div className="text-xs text-[#064e3b]/40 text-center py-4">Belum ada cerita.</div>}
        </div>
      </div>

      {/* Galeri Section */}
      <div className="p-6 space-y-3" style={bgGaleri}>
        <div style={getFontStyles(data.setting_head_galeri || { size: "18px", color: "#ffffff", family: "Inter", position: "center" })} className="relative">
          <div>Galeri Foto</div>
          <div className={getDividerClass(data.setting_head_galeri?.position)} />
        </div>
        {galeris.length > 0 ? (
          <div className={`grid gap-2 ${data.galeri_layout === "grid" ? "grid-cols-2" : "grid-cols-3"}`}>
            {galeris.map((g, i) => (
              <img key={i} src={g} alt={`Galeri ${i + 1}`} className="w-full aspect-square object-cover rounded-xl" />
            ))}
          </div>
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
    <div className="w-full min-h-[512px] bg-[#f5f5dc] rounded-2xl overflow-hidden p-6 space-y-5" style={bgPenutup}>
      {data.rsvp_aktif && (
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center space-y-3 shadow-md relative">
          <div style={getFontStyles(data.setting_head_rsvp || { size: "14px", color: "#ffffff", family: "Inter", position: "center" })} className="font-extrabold uppercase">
            <div>Konfirmasi Kehadiran</div>
            <div className={getDividerClass(data.setting_head_rsvp?.position)} />
          </div>
          {onRsvpSubmit ? (
            formSuccess ? (
              <div className="text-center py-4 space-y-2">
                <div className="text-emerald-400 font-bold text-xs">Terima Kasih!</div>
                <div className="text-[10px] text-white/80">Konfirmasi kehadiran Anda telah disimpan.</div>
              </div>
            ) : (
              <form onSubmit={onRsvpSubmit} className="space-y-2.5 pt-1 text-left">
                {formError && (
                  <div className="bg-rose-950/20 border border-rose-900/50 text-rose-400 p-2 rounded-lg text-[9px] font-semibold">
                    {formError}
                  </div>
                )}
                <div>
                  <label className="block text-[8px] font-black uppercase text-white/70 mb-1">Nama</label>
                  <input
                    type="text"
                    required
                    value={namaTamu}
                    onChange={(e) => setNamaTamu?.(e.target.value)}
                    placeholder="Nama Anda..."
                    className="w-full px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white outline-none focus:border-white/30"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[8px] font-black uppercase text-white/70 mb-1">Kehadiran</label>
                    <select
                      value={kehadiran}
                      onChange={(e) => setKehadiran?.(e.target.value as any)}
                      className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white outline-none focus:border-white/30"
                    >
                      <option value="HADIR" className="text-slate-800 bg-white">Hadir</option>
                      <option value="TIDAK_HADIR" className="text-slate-800 bg-white">Tidak Hadir</option>
                      <option value="RAGU_RAGU" className="text-slate-800 bg-white">Ragu-ragu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8px] font-black uppercase text-white/70 mb-1">Jumlah</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={jumlahTamu}
                      onChange={(e) => setJumlahTamu?.(parseInt(e.target.value) || 1)}
                      className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white outline-none focus:border-white/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[8px] font-black uppercase text-white/70 mb-1">Ucapan / Doa</label>
                  <textarea
                    value={ucapan}
                    onChange={(e) => setUcapan?.(e.target.value)}
                    rows={2}
                    placeholder="Ucapan..."
                    className="w-full px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white outline-none resize-none focus:border-white/30"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 bg-[#d4af37] hover:bg-[#c49f27] text-white font-bold text-[10px] rounded-lg cursor-pointer transition-all"
                >
                  {submitting ? "Mengirim..." : "Kirim Konfirmasi"}
                </button>
              </form>
            )
          ) : (
            <div className="flex gap-2 justify-center pt-1.5">
              <div className="px-5 py-2.5 bg-[#d4af37] text-white text-xs font-black rounded-xl shadow-sm hover:scale-102 transition-transform cursor-pointer">Hadir</div>
              <div className="px-5 py-2.5 border border-white/20 text-white/90 text-xs font-black rounded-xl hover:bg-white/5 transition-colors cursor-pointer">Tidak Hadir</div>
            </div>
          )}
        </div>
      )}
      {amplops.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-3 shadow-md relative">
          <div style={getFontStyles(data.setting_head_gift || { size: "14px", color: "#ffffff", family: "Inter", position: "center" })} className="font-extrabold uppercase">
            <div>Special Gift</div>
            <div className={getDividerClass(data.setting_head_gift?.position)} />
          </div>
          <div className="space-y-2 pt-1.5">
            {amplops.map((a, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/10 flex justify-between items-center transition-all hover:bg-white/10">
                <div className="space-y-0.5 text-left">
                  <div className="text-xs font-black text-white">{a.bank || "Bank"}</div>
                  <div className="text-[10px] text-white/70 font-mono tracking-wider">{a.nomor_rekening || "No. Rekening"}</div>
                  <div className="text-[10px] font-semibold text-[#d4af37]">{a.atas_nama || "Atas Nama"}</div>
                </div>
                <button
                  type="button"
                  onClick={() => onCopyClick ? onCopyClick(a.nomor_rekening || "", i) : navigator.clipboard.writeText(a.nomor_rekening || "")}
                  className="px-3 py-1.5 bg-white/10 hover:bg-[#d4af37] border border-white/10 hover:border-transparent rounded-lg text-[9px] font-black text-white transition-all cursor-pointer"
                >
                  {copiedIndex === i ? "Tersalin!" : "Salin"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {data.ucapan_aktif && (
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center space-y-3 shadow-md relative text-left">
          <div style={getFontStyles(data.setting_head_rsvp || { size: "14px", color: "#ffffff", family: "Inter", position: "center" })} className="font-extrabold uppercase text-center">
            <div>Doa & Ucapan</div>
            <div className={getDividerClass(data.setting_head_rsvp?.position)} />
          </div>
          {wishes ? (
            wishes.length > 0 ? (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 pt-1">
                {wishes.map((w, idx) => (
                  <div key={w.id || idx} className="bg-white/5 rounded-lg p-2.5 border border-white/5 space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] font-black text-white">{w.nama_tamu}</span>
                      <span className="text-[8px] opacity-60 text-white">
                        {w.kehadiran === "HADIR" ? "Hadir" : w.kehadiran === "TIDAK_HADIR" ? "Tidak Hadir" : "Ragu"}
                      </span>
                    </div>
                    <p className="text-[9px] text-white/80 leading-normal">{w.ucapan}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-[9px] text-white/40 py-4">Belum ada ucapan.</div>
            )
          ) : (
            <div className="mt-1 w-full h-16 bg-white/5 border border-white/10 rounded-xl text-[10px] flex items-center justify-center text-white/40 italic">Kolom ucapan tamu...</div>
          )}
        </div>
      )}
      <div className="text-center space-y-2 pt-4 border-t border-white/10">
        <p style={getFontStyles(data.setting_pesan_penutup || { size: "12px", color: "#ffffff", family: "Inter", position: "center" })} className="leading-relaxed whitespace-pre-wrap">{data.pesan_penutup || "Pesan penutup belum diisi."}</p>
        <p style={getFontStyles(data.setting_pesan_penutup || { size: "12px", color: "#ffffff", family: "Inter", position: "center" })} className="font-bold">{data.salam || ""}</p>
        <p style={getFontStyles(data.setting_pesan_penutup || { size: "14px", color: "#ffffff", family: "Inter", position: "center" })} className="font-black mt-2">{data.tertanda || "Nama & Nama"}</p>
        <p className="text-[9px] text-white/30 uppercase tracking-widest mt-4">Made with ❤ by Adatara</p>
      </div>
    </div>
  );
}
