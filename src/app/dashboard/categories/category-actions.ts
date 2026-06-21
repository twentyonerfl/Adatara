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

export async function createCategory(nama: string) {
  await verifyAdmin();
  const trimmed = nama.trim();
  if (!trimmed) {
    return { error: "Nama kategori tidak boleh kosong" };
  }

  try {
    const existing = await db.category.findUnique({
      where: { nama: trimmed }
    });
    if (existing) {
      return { error: "Kategori dengan nama tersebut sudah ada" };
    }

    const category = await db.category.create({
      data: { nama: trimmed }
    });

    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/templates");
    return { success: true, category };
  } catch (err) {
    console.error(err);
    return { error: "Gagal membuat kategori" };
  }
}

export async function deleteCategory(id: string) {
  await verifyAdmin();

  try {
    const category = await db.category.findUnique({
      where: { id }
    });

    if (!category) {
      return { error: "Kategori tidak ditemukan" };
    }

    // Check if any templates are currently using this category name
    const templateUsing = await db.template.findFirst({
      where: { kategori: category.nama }
    });

    if (templateUsing) {
      return { error: `Kategori "${category.nama}" sedang digunakan oleh template dan tidak bisa dihapus.` };
    }

    await db.category.delete({
      where: { id }
    });

    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/templates");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Gagal menghapus kategori" };
  }
}
