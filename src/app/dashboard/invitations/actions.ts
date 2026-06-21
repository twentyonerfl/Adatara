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
