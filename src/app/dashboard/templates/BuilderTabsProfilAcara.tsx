"use client";

import { useState, useEffect } from "react";
import { getBgStyle, FontSettingsWidget, BackgroundWidget, SectionInput, InputField, FileUploader, FramedPhoto, PhotoStyleWidget } from "./BuilderWidgets";
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
                    <InputField label="Jam Mulai" value={a.jam_mulai} onChange={v => updAcara(i, "jam_mulai", v)} type="time" />
                    <InputField label="Jam Selesai" value={a.jam_selesai} onChange={v => updAcara(i, "jam_selesai", v)} type="time" />
                  </div>
                  <InputField label="Alamat Lengkap" value={a.alamat} onChange={v => updAcara(i, "alamat", v)} placeholder="Jl. ..." textarea />
                  <InputField label="Link Google Maps" value={a.link_maps} onChange={v => updAcara(i, "link_maps", v)} placeholder="https://maps.google.com/..." />
                  <InputField label="Embed Maps URL (Opsional)" value={a.embed_maps} onChange={v => updAcara(i, "embed_maps", v)} placeholder="https://www.google.com/maps/embed?..." />
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

export function AcaraPreview({ data }: { data: any }) {
  const bg = getBgStyle(data.background);
  const acaras: any[] = data.acaras || [];
  return (
    <div className="w-full min-h-[512px] rounded-none overflow-hidden p-6 space-y-4" style={bg}>
      <div className="text-center mb-4">
        <div className="text-xs font-black uppercase tracking-wider opacity-60 text-[#064e3b]">Jadwal & Lokasi</div>
        <div className="w-8 h-0.5 bg-[#d4af37] mx-auto mt-2" />
      </div>

      {data.countdown_aktif && (() => {
        const idx = data.countdown_acara_index ?? 0;
        const targetEvent = acaras[idx];
        if (!targetEvent || !targetEvent.tanggal) return null;
        const targetDateTime = targetEvent.jam_mulai
          ? `${targetEvent.tanggal}T${targetEvent.jam_mulai}`
          : `${targetEvent.tanggal}T00:00`;
        return (
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/80 space-y-1.5 text-center">
            <div className="text-[10px] font-black uppercase tracking-wider opacity-60 text-[#064e3b]">
              Hitung Mundur Acara
            </div>
            <Countdown targetDateStr={targetDateTime} />
          </div>
        );
      })()}

      {acaras.map((a, i) => (
        <div key={i} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/80 space-y-1.5">
          <div 
            className="text-sm font-black" 
            style={{
              fontFamily: a.setting_nama?.family || data.setting_nama_acara?.family || "Inter",
              fontSize: a.setting_nama?.size || data.setting_nama_acara?.size || "14px",
              color: a.setting_nama?.color || data.setting_nama_acara?.color || "#064e3b"
            }}
          >
            {a.nama || "Nama Acara"}
          </div>
          {a.tanggal && (
            <div 
              className="text-xs font-semibold"
              style={{
                fontFamily: a.setting_tanggal?.family || data.setting_tanggal_acara?.family || "Inter",
                fontSize: a.setting_tanggal?.size || data.setting_tanggal_acara?.size || "12px",
                color: a.setting_tanggal?.color || data.setting_tanggal_acara?.color || "#064e3b"
              }}
            >
              {new Date(a.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          )}
          {(a.jam_mulai || a.jam_selesai) && (
            <div 
              className="text-xs"
              style={{
                fontFamily: a.setting_jam?.family || data.setting_jam_acara?.family || "Inter",
                fontSize: a.setting_jam?.size || data.setting_jam_acara?.size || "11px",
                color: a.setting_jam?.color || data.setting_jam_acara?.color || "#064e3b"
              }}
            >
              {a.jam_mulai} – {a.jam_selesai} WIB
            </div>
          )}
          {a.alamat && (
            <div 
              className="text-[10px] leading-relaxed"
              style={{
                fontFamily: a.setting_alamat?.family || data.setting_alamat_acara?.family || data.setting_jam_acara?.family || "Inter",
                fontSize: a.setting_alamat?.size || data.setting_alamat_acara?.size || "10px",
                color: a.setting_alamat?.color || data.setting_alamat_acara?.color || data.setting_jam_acara?.color || "#064e3b"
              }}
            >
              {a.alamat}
            </div>
          )}
          {a.embed_maps && (
            <div className="w-full h-28 rounded-lg overflow-hidden mt-1 border border-[#064e3b]/10">
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
          {a.link_maps && <a href={a.link_maps} target="_blank" className="text-[10px] text-[#d4af37] font-bold hover:underline">Lihat di Maps →</a>}
        </div>
      ))}
    </div>
  );
}
