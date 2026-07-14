"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  if (!session || session.user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function deleteInvitationAdmin(id: string) {
  await verifyAdmin();
  try {
    await db.invitation.delete({
      where: { id }
    });
    revalidatePath("/dashboard/invitations");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Gagal menghapus undangan." };
  }
}

export async function updateInvitationStatusAdmin(id: string, status: "DRAFT" | "ACTIVE" | "INACTIVE") {
  await verifyAdmin();
  try {
    await db.invitation.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/dashboard/invitations");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: "Gagal memperbarui status." };
  }
}

export async function updateInvitationDetailsAdmin(
  id: string, 
  payload: { 
    slug?: string; 
    status?: "DRAFT" | "ACTIVE" | "INACTIVE"; 
    data_undangan_json?: any;
  }
) {
  await verifyAdmin();
  try {
    if (payload.slug) {
      const cleanSlug = payload.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
      const existing = await db.invitation.findFirst({
        where: {
          slug: cleanSlug,
          NOT: { id }
        }
      });
      if (existing) {
        return { error: "Slug URL sudah digunakan oleh undangan lain." };
      }
      payload.slug = cleanSlug;
    }

    const updated = await db.invitation.update({
      where: { id },
      data: {
        ...(payload.slug ? { slug: payload.slug } : {}),
        ...(payload.status ? { status: payload.status } : {}),
        ...(payload.data_undangan_json ? { data_undangan_json: payload.data_undangan_json } : {})
      }
    });

    revalidatePath("/dashboard/invitations");
    revalidatePath("/dashboard");
    revalidatePath(`/builder/${id}`);
    revalidatePath(`/${updated.slug}`);
    return { success: true, invitation: updated };
  } catch (err) {
    console.error(err);
    return { error: "Gagal memperbarui data undangan." };
  }
}

