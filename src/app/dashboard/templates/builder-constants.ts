export const defaultTemplateJson = {
  cover: {
    setting_font: { size: "20px", color: "#ffffff", family: "Inter", position: "center" },
    setting_nama: { size: "20px", color: "#ffffff", family: "Inter", position: "center" },
    setting_tombol: { text: "Buka Undangan", size: "12px", color: "#ffffff", bg_color: "transparent", border_color: "#ffffff", family: "Inter", position: "center", x: 50, y: 65 },
    background: { type: "solid", value: "#000000", gradient_to: "#000000", direction: "to bottom" },
    setting_bingkai: { enabled: false, width: "2px", color: "#d4af37", style: "solid", padding: "16px", radius: "12px" },
    music_url: "",
  },
  pembuka: {
    setting_kategori: { size: "12px", color: "#ffffff", family: "Inter", position: "center" },
    setting_nama: { size: "24px", color: "#ffffff", family: "Inter", position: "center" },
    ucapan: "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu untuk hadir.",
    setting_ucapan: { size: "20px", color: "#ffffff", family: "Inter", position: "center", animation: "fade-in" },
    tanggal_acara: "",
    setting_tanggal: { size: "20px", color: "#ffffff", family: "Inter", position: "center", animation: "fade-in" },
    foto_pembuka: "",
    foto_setting: { size: "medium", bingkai: "oval", position: "center", animation: "fade-in", width: "120px", height: "120px", overlay_url: "" },
    setting_card: { enabled: false, glassmorphism: false, bg_color: "#ffffff", border_color: "#d4af37", border_radius: "16px", padding: "24px", shadow: "none" },
    background: { type: "solid", value: "#000000", gradient_to: "#000000", direction: "to bottom" },
  },
  profil: {
    ucapan_profil: "Maha suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan.",
    setting_ucapan_profil: { size: "20px", color: "#ffffff", family: "Inter", position: "center", animation: "fade-in" },
    setting_nama_profil: { size: "14px", color: "#ffffff", family: "Inter", position: "center", animation: "none" },
    setting_keterangan_profil: { size: "10px", color: "#ffffff", family: "Inter", position: "center", animation: "none" },
    setting_urutan_profil: { size: "9px", color: "#ffffff", family: "Inter", position: "center", animation: "none" },
    profils: [
      { foto: "", bingkai: "oval", foto_width: "120px", foto_height: "120px", overlay_url: "", nama: "Nama Pertama", keterangan: "Putra/i dari Bpk. & Ibu." },
    ],
    background: { type: "solid", value: "#000000", gradient_to: "#000000", direction: "to bottom" },
  },
  acara: {
    acaras: [
      { nama: "Nama Acara", tanggal: "", jam_mulai: "08:00", jam_selesai: "10:00", alamat: "Alamat lengkap", link_maps: "", embed_maps: "" },
    ],
    countdown_aktif: false,
    countdown_acara_index: 0,
    setting_countdown: {
      type: "grid",
      family: "Inter",
      size: "14px",
      color: "#064e3b",
      label_family: "Inter",
      label_size: "7px",
      label_color: "#d4af37",
      bg_color: "rgba(255, 255, 255, 0.8)",
      border_color: "rgba(6, 78, 59, 0.1)",
      border_radius: "12px",
      position: "center"
    },
    setting_nama_acara: { size: "16px", color: "#ffffff", family: "Inter", position: "center", animation: "none" },
    setting_tanggal_acara: { size: "12px", color: "#ffffff", family: "Inter", position: "center", animation: "none" },
    setting_jam_acara: { size: "11px", color: "#ffffff", family: "Inter", position: "center", animation: "none" },
    background: { type: "solid", value: "#000000", gradient_to: "#000000", direction: "to bottom" },
  },
  cerita: {
    ceritas: [
      { judul: "Awal Pertemuan", waktu: "Januari 2024", isi: "Cerita singkat tentang momen ini." },
    ],
    setting_head_cerita: { size: "18px", color: "#ffffff", family: "Inter", position: "center", animation: "none" },
    setting_head_galeri: { size: "18px", color: "#ffffff", family: "Inter", position: "center", animation: "none" },
    setting_judul_cerita: { size: "14px", color: "#ffffff", family: "Inter", position: "left", animation: "none" },
    setting_waktu_cerita: { size: "10px", color: "#ffffff", family: "Inter", position: "left", animation: "none" },
    setting_isi_cerita: { size: "11px", color: "#ffffff", family: "Inter", position: "left", animation: "none" },
    background_cerita: { type: "solid", value: "#000000", gradient_to: "#000000", direction: "to bottom" },
    galeris: [],
    galeri_layout: "grid",
    background_galeri: { type: "solid", value: "#000000", gradient_to: "#000000", direction: "to bottom" },
  },
  penutup: {
    rsvp_aktif: true,
    amplops: [{ bank: "BCA", nomor_rekening: "1234567890", atas_nama: "Nama Penerima" }],
    ucapan_aktif: true,
    pesan_penutup: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu berkenan hadir.",
    salam: "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
    tertanda: "Nama & Nama",
  },
};

export const FONT_FAMILIES = [
  "Inter", "Playfair Display", "Alex Brush", "Great Vibes", "Sacramento",
  "Pinyon Script", "Outfit", "Roboto", "Lato", "Poppins", "Cormorant Garamond",
];

export const KATEGORI_OPTIONS = [
  "Keagamaan", "Aqiqah & Kelahiran", "Bisnis & Promosi", "Hiburan & Event",
  "Khitanan", "Komunitas & Reuni", "Lamaran & Pertunangan", "Pernikahan",
  "Resepsi Pernikahan", "Seminar & Workshop", "Syukuran Keluarga", "Ulang Tahun", "Wisuda & Kelulusan",
];

/** Terjemahan Bahasa Inggris untuk setiap kategori */
export const KATEGORI_EN_MAP: Record<string, string> = {
  "Keagamaan":             "Religious Ceremony",
  "Aqiqah & Kelahiran":    "Aqiqah & Birth Celebration",
  "Bisnis & Promosi":      "Business & Promotion",
  "Hiburan & Event":       "Entertainment & Event",
  "Khitanan":              "Circumcision Ceremony",
  "Komunitas & Reuni":     "Community & Reunion",
  "Lamaran & Pertunangan": "Engagement Ceremony",
  "Pernikahan":            "Wedding of",
  "Resepsi Pernikahan":    "Wedding Reception of",
  "Seminar & Workshop":    "Seminar & Workshop",
  "Syukuran Keluarga":     "Family Thanksgiving",
  "Ulang Tahun":           "Birthday Celebration",
  "Wisuda & Kelulusan":    "Graduation Ceremony",
};

export const ANIMATION_OPTIONS = ["none", "fade-in", "slide-up", "zoom-in", "bounce"];
export const BINGKAI_OPTIONS = ["none", "bulat", "oval", "kubah", "hexagon", "daun", "perisai", "kotak-rounded", "kotak", "overlay-1", "overlay-2", "overlay-3", "custom"];
export const GALERI_LAYOUT_OPTIONS = ["grid", "masonry", "carousel"];
