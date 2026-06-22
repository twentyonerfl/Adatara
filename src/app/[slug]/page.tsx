import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PublicInvitationView } from "./PublicInvitationView";

export default async function PublicInvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const invitation = await db.invitation.findUnique({
    where: { slug },
    include: { template: true },
  });

  if (!invitation) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isOwner = session?.user?.id === invitation.user_id;

  // If draft and not the creator, block viewing
  if (invitation.status === "DRAFT" && !isOwner) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 mb-6 text-xl font-bold">
          🔒
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Undangan Belum Aktif</h1>
        <p className="text-slate-400 text-sm mt-2 max-w-sm leading-relaxed">
          Undangan ini masih dalam status draf dan belum diterbitkan secara resmi oleh pemiliknya.
        </p>
      </div>
    );
  }

  // Fetch guest wishes (RSVPs containing wishes)
  const wishesData = await db.rSVP.findMany({
    where: {
      invitation_id: invitation.id,
      NOT: {
        ucapan: "",
      },
    },
    include: {
      guest: true,
    },
    orderBy: { created_at: "desc" },
  });

  // Map to wishes array structure expected by frontend
  const wishes = wishesData.map((w) => ({
    id: w.id,
    nama_tamu: w.guest.nama,
    kehadiran: w.kehadiran ? "HADIR" : "TIDAK_HADIR",
    ucapan: w.ucapan,
    created_at: w.created_at,
  }));

  return (
    <PublicInvitationView 
      invitation={invitation} 
      wishes={wishes}
    />
  );
}
