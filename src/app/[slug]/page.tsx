import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PublicInvitationView } from "./PublicInvitationView";

const BASE_URL = "https://adatara.my.id";

/** Extract the best OG image from the invitation JSON data */
function extractOgImage(dataJson: any, templateThumbnail?: string | null): string {
  try {
    const cover = dataJson?.cover;
    // 1st choice: cover background image uploaded by user
    if (cover?.background?.type === "image" && cover?.background?.value) {
      return cover.background.value;
    }
    // 2nd choice: framed photo / couple photo on cover
    if (cover?.foto && typeof cover.foto === "string" && cover.foto.startsWith("http")) {
      return cover.foto;
    }
    // 3rd choice: template thumbnail
    if (templateThumbnail && templateThumbnail.startsWith("http")) {
      return templateThumbnail;
    }
  } catch {}
  // Fallback: Adatara logo
  return `${BASE_URL}/logo.png`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const invitation = await db.invitation.findUnique({
    where: { slug },
    include: { template: true },
  });

  if (!invitation) {
    return { title: "Undangan tidak ditemukan – Adatara" };
  }

  const dataJson = invitation.data_undangan_json as any;
  const namaAcara: string = dataJson?.cover?.nama_acara || "Undangan Spesial";
  const ogImage = extractOgImage(dataJson, invitation.template.thumbnail);

  const title = `${namaAcara} – Undangan Digital`;
  const description = `Anda mendapat undangan dari ${namaAcara}. Buka link ini untuk melihat undangan digital interaktif di Adatara.`;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${slug}`,
      siteName: "Adatara",
      locale: "id_ID",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

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

