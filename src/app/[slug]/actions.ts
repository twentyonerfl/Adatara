"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const rsvpSchema = z.object({
  invitationId: z.string(),
  namaTamu: z.string().min(2, "Nama minimal 2 karakter"),
  kehadiran: z.enum(["HADIR", "TIDAK_HADIR", "RAGU_RAGU"]),
  jumlahTamu: z.number().min(1).max(10),
  ucapan: z.string().max(500, "Ucapan terlalu panjang").optional(),
});

export async function submitRsvp(formData: {
  invitationId: string;
  namaTamu: string;
  kehadiran: "HADIR" | "TIDAK_HADIR" | "RAGU_RAGU";
  jumlahTamu: number;
  ucapan?: string;
}) {
  const result = rsvpSchema.safeParse(formData);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { invitationId, namaTamu, kehadiran, ucapan } = result.data;

  try {
    const invitation = await db.invitation.findUnique({
      where: { id: invitationId }
    });

    if (!invitation) {
      return { error: "Undangan tidak ditemukan." };
    }

    const isHadir = kehadiran === "HADIR";

    // 1. Create or Find Guest
    let guest = await db.guest.findFirst({
      where: {
        invitation_id: invitationId,
        nama: namaTamu,
      }
    });

    if (!guest) {
      guest = await db.guest.create({
        data: {
          invitation_id: invitationId,
          nama: namaTamu,
          status_kehadiran: isHadir ? "CONFIRMED" : "DECLINED"
        }
      });
    } else {
      guest = await db.guest.update({
        where: { id: guest.id },
        data: {
          status_kehadiran: isHadir ? "CONFIRMED" : "DECLINED"
        }
      });
    }

    // 2. Create or Update RSVP
    const existingRsvp = await db.rSVP.findUnique({
      where: { guest_id: guest.id }
    });

    if (existingRsvp) {
      await db.rSVP.update({
        where: { id: existingRsvp.id },
        data: {
          kehadiran: isHadir,
          ucapan: ucapan || ""
        }
      });
    } else {
      await db.rSVP.create({
        data: {
          invitation_id: invitationId,
          guest_id: guest.id,
          kehadiran: isHadir,
          ucapan: ucapan || ""
        }
      });
    }

    // Revalidate public invitation page cache
    revalidatePath(`/${invitation.slug}`);

    return { success: true };
  } catch (err) {
    console.error("Gagal mengirim RSVP: ", err);
    return { error: "Gagal memproses RSVP Anda. Silakan coba kembali." };
  }
}
