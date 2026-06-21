"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function saveInvitation(
  id: string, 
  dataUndanganJson: any, 
  status: "DRAFT" | "ACTIVE" | "INACTIVE"
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Sesi Anda telah kedaluwarsa. Silakan login kembali." };
  }

  try {
    // Verify ownership
    const invitation = await db.invitation.findUnique({
      where: { id }
    });

    if (!invitation || invitation.user_id !== session.user.id) {
      return { error: "Undangan tidak ditemukan atau Anda tidak memiliki akses." };
    }

    // Update the invitation data and status
    await db.invitation.update({
      where: { id },
      data: {
        data_undangan_json: dataUndanganJson,
        status: status,
      }
    });

    // Revalidate paths to reflect changes in the dashboard
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/builder/${id}`);
    revalidatePath(`/u/${invitation.slug}`);

    return { success: true };
  } catch (err) {
    console.error("Gagal menyimpan undangan: ", err);
    return { error: "Gagal menyimpan perubahan ke database." };
  }
}
