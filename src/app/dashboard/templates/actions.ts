"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { z } from "zod";
import { clearTemplateUserData } from "@/lib/invitation-helper";

const createInvitationSchema = z.object({
  templateId: z.string(),
  slug: z.string()
    .min(3, "Slug minimal 3 karakter")
    .max(50, "Slug maksimal 50 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)"),
});

export async function createInvitation(formData: { templateId: string; slug: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Sesi Anda telah kedaluwarsa. Silakan login kembali." };
  }

  const result = createInvitationSchema.safeParse(formData);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { templateId, slug } = result.data;

  try {
    // Check if slug is already taken
    const existing = await db.invitation.findUnique({
      where: { slug }
    });

    if (existing) {
      return { error: "Link undangan (slug) ini sudah digunakan. Coba nama lain." };
    }

    // Fetch the template to copy its default config
    const template = await db.template.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      return { error: "Template tidak ditemukan." };
    }

    // Create the new invitation
    const cleanJson = clearTemplateUserData(template.template_json);
    const invitation = await db.invitation.create({
      data: {
        user_id: session.user.id,
        template_id: templateId,
        slug,
        data_undangan_json: cleanJson as any, // Mulai dengan setting default template yang dibersihkan
        status: "DRAFT",
      }
    });

    return { success: true, invitationId: invitation.id };
  } catch (err) {
    console.error("Gagal membuat undangan: ", err);
    return { error: "Gagal membuat undangan. Silakan coba kembali." };
  }
}
