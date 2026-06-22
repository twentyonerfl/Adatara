"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { clearTemplateUserData } from "@/lib/invitation-helper";

const createPublicInvitationSchema = z.object({
  templateId: z.string(),
  slug: z.string()
    .min(3, "Slug minimal 3 karakter")
    .max(50, "Slug maksimal 50 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)"),
  email: z.string().email("Masukkan alamat email yang valid"),
  name: z.string().min(2, "Nama minimal 2 karakter"),
  nomor_hp: z.string()
    .min(10, "Nomor WhatsApp minimal 10 digit")
    .max(15, "Nomor WhatsApp maksimal 15 digit")
    .regex(/^[0-9]+$/, "Nomor WhatsApp hanya boleh berisi angka"),
});

export async function createInvitationPublic(formData: {
  templateId: string;
  slug: string;
  email: string;
  name: string;
  nomor_hp: string;
}) {
  const result = createPublicInvitationSchema.safeParse(formData);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { templateId, slug, email, name, nomor_hp } = result.data;
  const formattedSlug = slug.toLowerCase().trim().replace(/\s+/g, "-");

  try {
    // 1. Check if slug is already taken
    const existingSlug = await db.invitation.findUnique({
      where: { slug: formattedSlug }
    });

    if (existingSlug) {
      return { error: "Link undangan (slug) ini sudah digunakan. Coba nama lain." };
    }

    // 2. Fetch the template to copy its default config
    const template = await db.template.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      return { error: "Template tidak ditemukan." };
    }

    // 3. Find or Create guest User
    let user = await db.user.findUnique({
      where: { email }
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name,
          nomor_hp,
          role: "USER",
          status: "ACTIVE"
        }
      });
    } else {
      // Update phone number and name if they already exist
      user = await db.user.update({
        where: { id: user.id },
        data: {
          name,
          nomor_hp
        }
      });
    }

    // 4. Create the new invitation
    const cleanJson = clearTemplateUserData(template.template_json);
    const invitation = await db.invitation.create({
      data: {
        user_id: user.id,
        template_id: templateId,
        slug: formattedSlug,
        data_undangan_json: cleanJson as any,
        status: "DRAFT",
      }
    });

    return { success: true, invitationId: invitation.id };
  } catch (err) {
    console.error("Gagal membuat undangan publik: ", err);
    return { error: "Terjadi kesalahan saat membuat undangan. Silakan coba lagi." };
  }
}

export async function getPublishedTemplates() {
  try {
    const templates = await db.template.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [
        { created_at: "desc" },
        { id: "asc" }
      ],
    });
    return { success: true, templates };
  } catch (err) {
    console.error("Gagal mengambil template: ", err);
    return { success: false, error: "Gagal memuat template" };
  }
}

export async function getPublicCategories() {
  try {
    const categories = await db.category.findMany({
      orderBy: { nama: "asc" },
    });
    return { success: true, categories };
  } catch (err) {
    console.error("Gagal mengambil kategori: ", err);
    return { success: false, error: "Gagal memuat kategori" };
  }
}
