"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PaketTier } from "@prisma/client";

async function verifyAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createTemplate(formData: {
  nama_template: string;
  kategori: string;
  paket: PaketTier;
  thumbnail: string;
  deskripsi: string;
  template_json: any;
}) {
  await verifyAdmin();
  try {
    const template = await db.template.create({
      data: {
        nama_template: formData.nama_template,
        kategori: formData.kategori,
        paket: formData.paket,
        thumbnail: formData.thumbnail,
        deskripsi: formData.deskripsi,
        template_json: formData.template_json,
        status: "DRAFT",
      },
    });
    revalidatePath("/dashboard/templates");
    return { success: true, id: template.id };
  } catch (err) {
    console.error(err);
    return { error: "Gagal membuat template." };
  }
}

export async function updateTemplate(
  id: string,
  formData: {
    nama_template: string;
    kategori: string;
    paket: PaketTier;
    thumbnail: string;
    deskripsi: string;
    template_json: any;
  }
) {
  await verifyAdmin();
  try {
    await db.template.update({
      where: { id },
      data: {
        nama_template: formData.nama_template,
        kategori: formData.kategori,
        paket: formData.paket,
        thumbnail: formData.thumbnail,
        deskripsi: formData.deskripsi,
        template_json: formData.template_json,
      },
    });

    // Cari dan perbarui undangan aktif yang dibuat dari template ini dan dimiliki oleh SUPER_ADMIN
    const adminInvitations = await db.invitation.findMany({
      where: {
        template_id: id,
        user: {
          role: "SUPER_ADMIN",
        },
      },
    });

    for (const inv of adminInvitations) {
      await db.invitation.update({
        where: { id: inv.id },
        data: {
          data_undangan_json: formData.template_json,
        },
      });
      revalidatePath(`/${inv.slug}`);
    }

    revalidatePath("/dashboard/templates");
    revalidatePath(`/dashboard/templates/edit/${id}`);
    revalidatePath(`/demo/${id}`);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Gagal menyimpan template." };
  }
}

export async function publishTemplate(id: string) {
  await verifyAdmin();
  try {
    await db.template.update({
      where: { id },
      data: { status: "PUBLISHED" },
    });
    revalidatePath("/dashboard/templates");
    revalidatePath(`/dashboard/templates/edit/${id}`);
    revalidatePath(`/demo/${id}`);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Gagal mempublikasikan template." };
  }
}

export async function deleteTemplate(id: string) {
  await verifyAdmin();
  try {
    await db.template.delete({ where: { id } });
    revalidatePath("/dashboard/templates");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Gagal menghapus template." };
  }
}

export async function createActiveInvitationFromTemplate(formData: {
  templateId: string;
  slug: string;
  email: string;
  name: string;
  nomor_hp: string;
  templateJson: any;
}) {
  await verifyAdmin();
  const { templateId, slug, email, name, nomor_hp, templateJson } = formData;
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

    // 3. Find or Create user
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
      user = await db.user.update({
        where: { id: user.id },
        data: {
          name,
          nomor_hp
        }
      });
    }

    // 4. Create the new invitation as ACTIVE directly with exact template JSON data from editor
    const invitation = await db.invitation.create({
      data: {
        user_id: user.id,
        template_id: templateId,
        slug: formattedSlug,
        data_undangan_json: templateJson as any,
        status: "ACTIVE",
      }
    });

    revalidatePath("/dashboard/invitations");
    revalidatePath("/dashboard");
    revalidatePath(`/${formattedSlug}`);

    return { success: true, invitationId: invitation.id, slug: formattedSlug };
  } catch (err) {
    console.error("Gagal membuat undangan aktif dari admin: ", err);
    return { error: "Terjadi kesalahan saat membuat undangan. Silakan coba lagi." };
  }
}
