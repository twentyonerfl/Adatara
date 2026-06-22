import { db } from "./db";
import fs from "fs/promises";
import path from "path";

export interface PackageData {
  price: number;
  name: string;
  sub: string;
  desc: string;
  features: string[];
  badgeText?: string;
  badgeStyle?: string;
  buttonText?: string;
}

export async function getPackagesConfig(): Promise<Record<string, PackageData>> {
  try {
    const settings = await db.homepageSetting.findFirst();
    if (settings && settings.packages_config) {
      const config = settings.packages_config;
      if (typeof config === "string") {
        return JSON.parse(config);
      }
      return config as any;
    }
  } catch (err) {
    console.error("Gagal memuat packages_config dari DB:", err);
  }

  // Fallback to local packages.json config
  try {
    const configPath = path.join(process.cwd(), "src/config/packages.json");
    const raw = await fs.readFile(configPath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Gagal membaca packages.json fallback:", err);
    // Hardcoded fallback if everything fails
    return {
      "BASIC": {
        "price": 0,
        "name": "PAKET BASIC",
        "sub": "Masa aktif 3 hari",
        "desc": "Layanan gratis untuk mencoba fitur utama Adatara.",
        "features": ["Masa aktif undangan 3 hari", "Maksimal 50 tamu", "Desain template dasar (Basic)", "Tanpa kustom musik & galeri"],
        "badgeStyle": "slate"
      },
      "PREMIUM": {
        "price": 99000,
        "name": "PAKET PREMIUM",
        "sub": "Bayar Sekali (Aktif Selamanya)",
        "desc": "Pilihan terbaik untuk pernikahan elegan dengan fitur lengkap.",
        "features": ["Masa aktif undangan selamanya", "Tamu undangan tak terbatas", "Bebas kustom musik latar & audio", "Galeri foto & video tak terbatas"],
        "badgeStyle": "emerald"
      },
      "EXCLUSIVE": {
        "price": 299000,
        "name": "PAKET EXCLUSIVE",
        "sub": "Bayar Sekali (Aktif Selamanya)",
        "desc": "Layanan premium terima beres. Tim kami yang akan menginput data dan mendesain undangan Anda sepenuhnya.",
        "features": ["Semua fitur paket SULTAN", "Pembuatan dibantu desainer kami", "Revising tanpa batas sepuasnya", "WhatsApp Blast tak terbatas", "Kustom domain pribadi (.com/.id)"],
        "badgeStyle": "purple"
      }
    };
  }
}

export async function savePackagesConfig(updatedPackages: any) {
  // Try writing to database
  try {
    let settings = await db.homepageSetting.findFirst();
    if (!settings) {
      await db.homepageSetting.create({
        data: {
          id: "default",
          emulator_covers: [],
          packages_config: updatedPackages
        }
      });
    } else {
      await db.homepageSetting.update({
        where: { id: settings.id },
        data: {
          packages_config: updatedPackages
        }
      });
    }
  } catch (err) {
    console.error("Gagal menyimpan packages_config ke DB:", err);
  }

  // Try writing to local packages.json for local development tracking
  try {
    const configPath = path.join(process.cwd(), "src/config/packages.json");
    await fs.writeFile(configPath, JSON.stringify(updatedPackages, null, 2), "utf-8");
  } catch (err) {
    console.warn("Gagal menulis ke packages.json (abaikan jika di serverless):", err);
  }
}
