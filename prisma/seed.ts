import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const defaultTemplates = [
  {
    nama_template: "Rustik Romantis",
    kategori: "Pernikahan",
    thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
    deskripsi: "Desain hangat dengan nuansa kayu, bunga kering, dan estetika vintage kecokelatan yang elegan.",
    status: "PUBLISHED" as const,
    template_json: {
      cover: {
        setting_font: { size: "48px", color: "#854d0e", family: "Playfair Display", position: "center" },
        setting_nama: { size: "64px", color: "#854d0e", family: "Playfair Display", position: "center" },
        background: { type: "image", value: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop" },
        music_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      },
      pembuka: {
        ucapan: "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.",
        setting_ucapan: { size: "16px", color: "#374151", family: "Inter", position: "center", animation: "fade-in" },
        setting_tanggal: { size: "20px", color: "#854d0e", family: "Playfair Display", position: "center" },
        foto_pembuka: "https://images.unsplash.com/photo-1519225495810-7512c696505a?q=80&w=600&auto=format&fit=crop"
      },
      profil: {
        ucapan_profil: "Maha suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan.",
        setting_ucapan_profil: { size: "14px", color: "#4b5563", family: "Inter", position: "center" },
        profils: [
          {
            foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
            nama: "Tara Amelia, S.E.",
            keterangan: "Putri pertama dari Bpk. Bambang & Ibu Ratna",
            bingkai: "oval"
          },
          {
            foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
            nama: "Aditya Wijaya, S.Kom.",
            keterangan: "Putra kedua dari Bpk. Gunawan & Ibu Susi",
            bingkai: "oval"
          }
        ]
      },
      acara: {
        background: { type: "solid", value: "#fdf6e2" },
        acaras: [
          {
            nama: "Akad Nikah",
            tanggal: "2026-10-12",
            jam: "08:00 - 10:00 WIB",
            alamat: "Masjid Raya Baiturrahman, Jl. Protokol No. 1",
            link_maps: "https://maps.google.com"
          },
          {
            nama: "Resepsi Pernikahan",
            tanggal: "2026-10-12",
            jam: "11:00 - 16:00 WIB",
            alamat: "Gedung Serbaguna Citra, Jl. Melati Raya No. 45",
            link_maps: "https://maps.google.com"
          }
        ]
      },
      cerita: {
        background: { type: "solid", value: "#fefcf6" },
        ceritas: [
          {
            judul: "Pertama Bertemu",
            waktu: "Januari 2024",
            isi: "Kami pertama kali bertemu di sebuah perpustakaan kota secara tidak sengaja saat mencari buku yang sama."
          },
          {
            judul: "Menyatakan Komitmen",
            waktu: "Desember 2025",
            isi: "Setelah dua tahun saling mengenal, kami memutuskan untuk membawa hubungan ini ke jenjang pernikahan."
          }
        ],
        galeri_layout: "grid",
        galeris: [
          "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&auto=format&fit=crop"
        ]
      },
      penutup: {
        rsvp_aktif: true,
        ucapan_aktif: true,
        pesan_penutup: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.",
        salam: "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
        tertanda: "Aditya & Tara",
        amplops: [
          { bank: "BCA", nomor_rekening: "1234567890", atas_nama: "Aditya Wijaya" },
          { bank: "Gopay", nomor_rekening: "081234567890", atas_nama: "Tara Amelia" }
        ]
      }
    }
  },
  {
    nama_template: "Minimalis Elegan",
    kategori: "Pernikahan",
    thumbnail: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
    deskripsi: "Sentuhan modern monokrom dengan tipografi serif klasik mewah dan tatanan minimalis.",
    status: "PUBLISHED" as const,
    template_json: {
      cover: {
        setting_font: { size: "40px", color: "#1f2937", family: "Playfair Display", position: "center" },
        setting_nama: { size: "56px", color: "#1f2937", family: "Playfair Display", position: "center" },
        background: { type: "solid", value: "#f9fafb" },
        music_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
      },
      pembuka: {
        ucapan: "Dengan rasa hormat, kami mengundang kerabat sekalian untuk merayakan hari bersejarah kami.",
        setting_ucapan: { size: "15px", color: "#4b5563", family: "Inter", position: "center", animation: "fade-in" },
        setting_tanggal: { size: "18px", color: "#1f2937", family: "Playfair Display", position: "center" },
        foto_pembuka: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop"
      },
      profil: {
        ucapan_profil: "Kami menapaki jalan baru ini bersama-sama.",
        setting_ucapan_profil: { size: "14px", color: "#4b5563", family: "Inter", position: "center" },
        profils: [
          {
            foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
            nama: "Tara Amelia",
            keterangan: "Putri dari Bpk. Bambang & Ibu Ratna",
            bingkai: "kotak"
          },
          {
            foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
            nama: "Aditya Wijaya",
            keterangan: "Putra dari Bpk. Gunawan & Ibu Susi",
            bingkai: "kotak"
          }
        ]
      },
      acara: {
        background: { type: "solid", value: "#ffffff" },
        acaras: [
          {
            nama: "Pemberkatan & Resepsi",
            tanggal: "2026-11-20",
            jam: "10:00 - 15:00 WIB",
            alamat: "Grand Ballroom Hotel Mulia, Jakarta",
            link_maps: "https://maps.google.com"
          }
        ]
      },
      cerita: {
        background: { type: "solid", value: "#f9fafb" },
        ceritas: [],
        galeri_layout: "masonry",
        galeris: [
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&auto=format&fit=crop"
        ]
      },
      penutup: {
        rsvp_aktif: true,
        ucapan_aktif: true,
        pesan_penutup: "Terima kasih atas doa restu Bapak/Ibu sekalian.",
        salam: "Salam Hangat,",
        tertanda: "Aditya & Tara",
        amplops: [
          { bank: "Mandiri", nomor_rekening: "0987654321", atas_nama: "Aditya Wijaya" }
        ]
      }
    }
  },
  {
    nama_template: "Neon Party",
    kategori: "Ulang Tahun",
    thumbnail: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop",
    deskripsi: "Penuh energi, warna gradasi neon terang, sangat cocok untuk pesta meriah kaum muda.",
    status: "PUBLISHED" as const,
    template_json: {
      cover: {
        setting_font: { size: "48px", color: "#ec4899", family: "Inter", position: "center" },
        setting_nama: { size: "64px", color: "#3b82f6", family: "Inter", position: "center" },
        background: { type: "solid", value: "#09090b" },
        music_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
      },
      pembuka: {
        ucapan: "Yo! Rayakan ulang tahunku yang ke-25! Dresscode: Neon/Bright colors.",
        setting_ucapan: { size: "18px", color: "#f43f5e", family: "Inter", position: "center", animation: "bounce" },
        setting_tanggal: { size: "22px", color: "#e11d48", family: "Inter", position: "center" },
        foto_pembuka: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop"
      },
      profil: {
        ucapan_profil: "It's my birthday bash!",
        setting_ucapan_profil: { size: "16px", color: "#a855f7", family: "Inter", position: "center" },
        profils: [
          {
            foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
            nama: "Amanda Putri",
            keterangan: "Turning 25 & Fab!",
            bingkai: "bulat"
          }
        ]
      },
      acara: {
        background: { type: "solid", value: "#0c0a09" },
        acaras: [
          {
            nama: "Birthday Party",
            tanggal: "2026-12-05",
            jam: "19:00 - Selesai",
            alamat: "Sky Lounge & Cafe, Gedung A lt. 12, Jakarta",
            link_maps: "https://maps.google.com"
          }
        ]
      },
      cerita: {
        background: { type: "solid", value: "#09090b" },
        ceritas: [],
        galeri_layout: "carousel",
        galeris: []
      },
      penutup: {
        rsvp_aktif: true,
        ucapan_aktif: true,
        pesan_penutup: "Ditunggu kehadiran kalian semua!",
        salam: "Sampai Jumpa,",
        tertanda: "Amanda",
        amplops: [
          { bank: "Gopay", nomor_rekening: "081288889999", atas_nama: "Amanda Putri" }
        ]
      }
    }
  },
  {
    nama_template: "Syukuran Aqiqah",
    kategori: "Syukuran Keluarga",
    thumbnail: "https://images.unsplash.com/photo-1507504038482-762618d23dd5?q=80&w=600&auto=format&fit=crop",
    deskripsi: "Desain lembut berkarakter ilustrasi anak yang bersih, ramah, dan bernuansa islami.",
    status: "PUBLISHED" as const,
    template_json: {
      cover: {
        setting_font: { size: "36px", color: "#0d9488", family: "Inter", position: "center" },
        setting_nama: { size: "48px", color: "#0d9488", family: "Inter", position: "center" },
        background: { type: "solid", value: "#f0fdfa" },
        music_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
      },
      pembuka: {
        ucapan: "Tasyakuran Aqiqah atas kelahiran putra tercinta kami.",
        setting_ucapan: { size: "16px", color: "#0f766e", family: "Inter", position: "center", animation: "fade-in" },
        setting_tanggal: { size: "18px", color: "#0d9488", family: "Inter", position: "center" },
        foto_pembuka: "https://images.unsplash.com/photo-1507504038482-762618d23dd5?q=80&w=600&auto=format&fit=crop"
      },
      profil: {
        ucapan_profil: "Semoga kelak menjadi anak yang sholeh.",
        setting_ucapan_profil: { size: "14px", color: "#115e59", family: "Inter", position: "center" },
        profils: [
          {
            foto: "https://images.unsplash.com/photo-1507504038482-762618d23dd5?q=80&w=400&auto=format&fit=crop",
            nama: "Muhammad Rafa Azka",
            keterangan: "Lahir pada 1 September 2026",
            bingkai: "oval"
          }
        ]
      },
      acara: {
        background: { type: "solid", value: "#f0fdfa" },
        acaras: [
          {
            nama: "Tasyakuran & Aqiqah",
            tanggal: "2026-09-20",
            jam: "09:00 - 12:00 WIB",
            alamat: "Kediaman Bpk. & Ibu Yusuf, Komplek Citra Indah Blok B4",
            link_maps: "https://maps.google.com"
          }
        ]
      },
      cerita: {
        background: { type: "solid", value: "#f0fdfa" },
        ceritas: [],
        galeri_layout: "grid",
        galeris: []
      },
      penutup: {
        rsvp_aktif: false,
        ucapan_aktif: true,
        pesan_penutup: "Doa dan restu Bapak/Ibu sekalian sangat berarti bagi keluarga kami.",
        salam: "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
        tertanda: "Keluarga Besar Yusuf",
        amplops: []
      }
    }
  }
];

async function seed() {
  console.log("Seeding database templates...");
  
  for (const template of defaultTemplates) {
    const created = await prisma.template.upsert({
      where: { id: template.nama_template.toLowerCase().replace(/\s+/g, "-") },
      update: {
        kategori: template.kategori,
        thumbnail: template.thumbnail,
        deskripsi: template.deskripsi,
        template_json: template.template_json,
        status: template.status
      },
      create: {
        id: template.nama_template.toLowerCase().replace(/\s+/g, "-"),
        nama_template: template.nama_template,
        kategori: template.kategori,
        thumbnail: template.thumbnail,
        deskripsi: template.deskripsi,
        template_json: template.template_json,
        status: template.status
      }
    });
    console.log(`- Seeded template: ${created.nama_template} (${created.id})`);
  }

  // Seed default music library items
  const musicList = [
    { id: "music-1", judul: "Beautiful In White", artis: "Shane Filan", audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", durasi: 240 },
    { id: "music-2", judul: "A Thousand Years", artis: "Christina Perri", audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", durasi: 285 },
    { id: "music-3", judul: "Perfect", artis: "Ed Sheeran", audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", durasi: 263 }
  ];

  console.log("Seeding music library...");
  for (const music of musicList) {
    await prisma.musicLibrary.upsert({
      where: { id: music.id },
      update: {
        judul: music.judul,
        artis: music.artis,
        audio_url: music.audio_url,
        durasi: music.durasi
      },
      create: music
    });
    console.log(`- Seeded music: ${music.judul}`);
  }

  // Seed default categories
  const defaultCategories = [
    "Keagamaan", "Aqiqah & Kelahiran", "Bisnis & Promosi", "Hiburan & Event",
    "Khitanan", "Komunitas & Reuni", "Lamaran & Pertunangan", "Pernikahan",
    "Resepsi Pernikahan", "Seminar & Workshop", "Syukuran Keluarga", "Ulang Tahun", "Wisuda & Kelulusan"
  ];
  
  console.log("Seeding categories...");
  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { nama: cat },
      update: {},
      create: { nama: cat }
    });
    console.log(`- Seeded category: ${cat}`);
  }

  console.log("Seeding database complete.");
  await prisma.$disconnect();
}

seed().catch((err) => {
  console.error("Error seeding database: ", err);
  process.exit(1);
});
