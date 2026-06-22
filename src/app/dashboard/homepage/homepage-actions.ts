"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getHomepageSettings() {
  try {
    let settings = await db.homepageSetting.findFirst();
    if (!settings) {
      const defaultCovers = [
        {
          image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
          badge: "GALERI DESAIN PREMIUM",
          title: "Pilih Desain Eksklusif Anda",
          subtitle: "Sesuaikan tema undangan dengan tradisi, gaya modern, atau konsep khidmat acara Anda. Semua terintegrasi dalam sistem kami."
        },
        {
          image_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
          badge: "ESTETIKA MODERN",
          title: "Sentuhan Romantisme Abadi",
          subtitle: "Kemewahan dalam kesederhanaan desain minimalis premium."
        }
      ];

      settings = await db.homepageSetting.create({
        data: {
          id: "default",
          hero_title: "Abadikan Momen Berharga Anda Dengan Kemewahan Digital",
          hero_subtitle: "Platform SaaS undangan digital premium nomor satu di Indonesia. Didesain khusus dengan perpaduan keindahan ornamen Nusantara, kemewahan modern, dan animasi interaktif terbaik.",
          hero_cta_text: "Buat Undangan Sekarang",
          hero_cta_url: "/templates",
          hero_demo_text: "Lihat Katalog Undangan",
          hero_demo_url: "#template",
          bg_color: "#f5f5dc",
          text_color: "#064e3b",
          accent_color: "#d4af37",
          bg_image: "",
          bg_gradient: true,
          bg_pattern_opacity: 0.3,
          bg_pattern_blur: 0,
          bg_overlay_opacity: 0.2,
          hero_title_font: "Playfair Display",
          hero_title_color: "#064e3b",
          hero_title_size: 56,
          hero_title_align: "left",
          hero_subtitle_font: "Inter",
          hero_subtitle_color: "#064e3b",
          hero_subtitle_size: 16,
          hero_subtitle_align: "left",
          stats_bg_color: "#064e3b",
          emulator_covers: JSON.stringify(defaultCovers)
        }
      });
    }
    return settings;
  } catch (err) {
    console.error("Gagal mendapatkan setting homepage:", err);
    throw new Error("Gagal mengambil pengaturan.");
  }
}

interface UpdateSettingsData {
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  hero_cta_url: string;
  hero_demo_text: string;
  hero_demo_url: string;
  bg_color: string;
  text_color: string;
  accent_color: string;
  bg_image?: string;
  bg_gradient: boolean;
  bg_pattern_opacity: number;
  bg_pattern_blur: number;
  bg_overlay_opacity: number;
  hero_title_font: string;
  hero_title_color: string;
  hero_title_size: number;
  hero_title_align: string;
  hero_subtitle_font: string;
  hero_subtitle_color: string;
  hero_subtitle_size: number;
  hero_subtitle_align: string;
  stats_bg_color: string;
  emulator_covers: string; // JSON string
}

export async function updateHomepageSettings(data: UpdateSettingsData) {
  await verifyAdmin();

  try {
    const existing = await db.homepageSetting.findFirst();
    if (existing) {
      await db.homepageSetting.update({
        where: { id: existing.id },
        data: {
          hero_title: data.hero_title,
          hero_subtitle: data.hero_subtitle,
          hero_cta_text: data.hero_cta_text,
          hero_cta_url: data.hero_cta_url,
          hero_demo_text: data.hero_demo_text,
          hero_demo_url: data.hero_demo_url,
          bg_color: data.bg_color,
          text_color: data.text_color,
          accent_color: data.accent_color,
          bg_image: data.bg_image || "",
          bg_gradient: data.bg_gradient,
          bg_pattern_opacity: data.bg_pattern_opacity,
          bg_pattern_blur: data.bg_pattern_blur,
          bg_overlay_opacity: data.bg_overlay_opacity,
          hero_title_font: data.hero_title_font,
          hero_title_color: data.hero_title_color,
          hero_title_size: data.hero_title_size,
          hero_title_align: data.hero_title_align,
          hero_subtitle_font: data.hero_subtitle_font,
          hero_subtitle_color: data.hero_subtitle_color,
          hero_subtitle_size: data.hero_subtitle_size,
          hero_subtitle_align: data.hero_subtitle_align,
          stats_bg_color: data.stats_bg_color,
          emulator_covers: data.emulator_covers
        }
      });
    } else {
      await db.homepageSetting.create({
        data: {
          id: "default",
          hero_title: data.hero_title,
          hero_subtitle: data.hero_subtitle,
          hero_cta_text: data.hero_cta_text,
          hero_cta_url: data.hero_cta_url,
          hero_demo_text: data.hero_demo_text,
          hero_demo_url: data.hero_demo_url,
          bg_color: data.bg_color,
          text_color: data.text_color,
          accent_color: data.accent_color,
          bg_image: data.bg_image || "",
          bg_gradient: data.bg_gradient,
          bg_pattern_opacity: data.bg_pattern_opacity,
          bg_pattern_blur: data.bg_pattern_blur,
          bg_overlay_opacity: data.bg_overlay_opacity,
          hero_title_font: data.hero_title_font,
          hero_title_color: data.hero_title_color,
          hero_title_size: data.hero_title_size,
          hero_title_align: data.hero_title_align,
          hero_subtitle_font: data.hero_subtitle_font,
          hero_subtitle_color: data.hero_subtitle_color,
          hero_subtitle_size: data.hero_subtitle_size,
          hero_subtitle_align: data.hero_subtitle_align,
          stats_bg_color: data.stats_bg_color,
          emulator_covers: data.emulator_covers
        }
      });
    }

    revalidatePath("/");
    revalidatePath("/dashboard/homepage");
    return { success: true };
  } catch (err: any) {
    console.error("Gagal memperbarui setting homepage:", err);
    return { error: `Gagal menyimpan pengaturan: ${err?.message || String(err)}` };
  }
}
