"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
        thumbnail: formData.thumbnail,
        deskripsi: formData.deskripsi,
        template_json: formData.template_json,
      },
    });
    revalidatePath("/dashboard/templates");
    revalidatePath(`/dashboard/templates/edit/${id}`);
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
