/**
 * Clears user-editable data fields from a template's default JSON configuration
 * while preserving layout styles, typography, backgrounds, and themes.
 */
export function clearTemplateUserData(json: any): any {
  if (!json || typeof json !== "object") return json;

  // Deep clone the object
  const clean = JSON.parse(JSON.stringify(json));

  // 1. Cover
  if (clean.cover) {
    clean.cover.nama_acara = "";
    clean.cover.music_url = "";
    if (clean.cover.background) {
      clean.cover.background.value = "";
    }
  }

  // 2. Pembuka
  if (clean.pembuka) {
    clean.pembuka.ucapan = "";
    clean.pembuka.tanggal_acara = "";
    clean.pembuka.foto_pembuka = "";
  }

  // 3. Profil
  if (clean.profil) {
    // Keep clean.profil.ucapan_profil because it's the template's default quote/verse (e.g. Ar-Rum)
    if (Array.isArray(clean.profil.profils)) {
      clean.profil.profils = clean.profil.profils.map((p: any) => ({
        ...p,
        nama: "",
        nama_panggilan: "",
        keterangan: "",
        urutan_anak: "",
        foto: "",
      }));
    } else {
      clean.profil.profils = [];
    }
  }

  // 4. Acara
  if (clean.acara) {
    if (Array.isArray(clean.acara.acaras)) {
      clean.acara.acaras = clean.acara.acaras.map((a: any) => ({
        ...a,
        nama: "",
        tanggal: "",
        jam_mulai: "08:00",
        jam_selesai: "10:00",
        alamat: "",
        link_maps: "",
        embed_maps: "",
      }));
    } else {
      clean.acara.acaras = [];
    }
  }

  // 5. Cerita & Galeri
  if (clean.cerita) {
    clean.cerita.ceritas = [];
    clean.cerita.galeris = [];
  }

  // 6. Penutup
  if (clean.penutup) {
    clean.penutup.amplops = [];
    clean.penutup.pesan_penutup = "";
    clean.penutup.salam = "";
    clean.penutup.tertanda = "";
  }

  return clean;
}
