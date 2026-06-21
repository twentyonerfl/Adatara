import { db } from "@/lib/db";
import HomeClient from "./HomeClient";

export const revalidate = 0; // Disable server cache for real-time listings

const MOCK_TEMPLATES = [
  {
    id: "1",
    nama: "Rustik Romantis",
    kategori: "Pernikahan",
    paket: "BASIC",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
    warna: "bg-[#064e3b]",
    deskripsi: "Desain hangat dengan nuansa kayu, bunga kering, dan estetika vintage."
  },
  {
    id: "2",
    nama: "Minimalis Elegan",
    kategori: "Pernikahan",
    paket: "PREMIUM",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
    warna: "bg-[#d4af37]",
    deskripsi: "Sentuhan modern monokrom dengan tipografi serif klasik mewah."
  },
  {
    id: "3",
    nama: "Neon Party",
    kategori: "Ulang Tahun",
    paket: "SULTAN",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop",
    warna: "bg-rose-700",
    deskripsi: "Penuh energi, warna gradasi neon terang, cocok untuk pesta meriah."
  },
  {
    id: "4",
    nama: "Syukuran Aqiqah",
    kategori: "Syukuran Keluarga",
    paket: "BASIC",
    image: "https://images.unsplash.com/photo-1507504038482-762618d23dd5?q=80&w=600&auto=format&fit=crop",
    warna: "bg-emerald-800",
    deskripsi: "Desain lembut berkarakter ilustrasi anak yang bersih dan religius."
  },
  {
    id: "5",
    nama: "Summit Bisnis",
    kategori: "Bisnis & Promosi",
    paket: "PREMIUM",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop",
    warna: "bg-slate-800",
    deskripsi: "Profesional, rapi, dengan layout jadwal acara terintegrasi map."
  },
  {
    id: "6",
    nama: "Emas Kerajaan",
    kategori: "Pernikahan",
    paket: "SULTAN",
    image: "https://images.unsplash.com/photo-1519225495810-7512c696505a?q=80&w=600&auto=format&fit=crop",
    warna: "bg-[#d4af37] text-[#064e3b]",
    deskripsi: "Ornamen ukiran emas berlatar gelap yang menyiratkan kemegahan."
  }
];

export default async function Home() {
  // Fetch published templates from database
  let templates = [];
  try {
    const res = await db.template.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [
        { created_at: "desc" },
        { id: "asc" }
      ],
    });
    if (res && res.length > 0) {
      templates = res.map((t: any) => ({
        id: t.id,
        nama: t.nama_template,
        kategori: t.kategori,
        paket: t.paket || "BASIC",
        image: t.thumbnail,
        warna: "bg-[#064e3b]",
        deskripsi: t.deskripsi || "Tidak ada deskripsi.",
        template_json: t.template_json
      }));
    } else {
      templates = MOCK_TEMPLATES;
    }
  } catch (err) {
    console.error("Gagal memuat template dari database: ", err);
    templates = MOCK_TEMPLATES;
  }

  // Fetch categories from database
  let categories = [
    "Semua",
    "Keagamaan",
    "Aqiqah & Kelahiran",
    "Bisnis & Promosi",
    "Hiburan & Event",
    "Khitanan",
    "Komunitas & Reuni",
    "Lamaran & Pertunangan",
    "Pernikahan",
    "Resepsi Pernikahan",
    "Seminar & Workshop",
    "Syukuran Keluarga",
    "Ulang Tahun",
    "Wisuda & Kelulusan"
  ];
  try {
    const catRes = await db.category.findMany({
      orderBy: { nama: "asc" },
    });
    if (catRes && catRes.length > 0) {
      categories = ["Semua", ...catRes.map((c) => c.nama)];
    }
  } catch (err) {
    console.error("Gagal memuat kategori dari database: ", err);
  }

  // Fetch homepage settings
  let settings = null;
  try {
    settings = await db.homepageSetting.findFirst();
  } catch (err) {
    console.error("Gagal memuat setting homepage dari database: ", err);
  }

  return (
    <HomeClient 
      initialTemplates={templates} 
      initialCategories={categories} 
      settings={settings ? JSON.parse(JSON.stringify(settings)) : null}
    />
  );
}

