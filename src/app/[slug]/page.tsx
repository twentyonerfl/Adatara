import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PublicInvitationView } from "./PublicInvitationView";
import type { Metadata } from "next";

const BASE_URL = "https://adatara.my.id";

// --- Dynamic OG metadata per invitation ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const invitation = await db.invitation.findUnique({
    where: { slug },
    select: {
      slug: true,
      data_undangan_json: true,
      template: { select: { kategori: true } },
    },
  });

  if (!invitation) {
    return {
      title: "Undangan Tidak Ditemukan",
      description: "Undangan ini tidak ditemukan atau telah dihapus.",
    };
  }

  const data = invitation.data_undangan_json as any;
  const cover = data?.cover || {};

  // Try to get couple/event names
  const namaLengkap1: string = data?.profil?.nama_lengkap_1 || data?.profil?.nama_panggilan_1 || "";
  const namaLengkap2: string = data?.profil?.nama_lengkap_2 || data?.profil?.nama_panggilan_2 || "";
  const kategori: string = invitation.template?.kategori || "Acara";

  let title = "Undangan Digital";
  let description = "Anda diundang! Buka link ini untuk melihat undangan digital.";

  if (namaLengkap1 && namaLengkap2) {
    title = `Undangan ${kategori}: ${namaLengkap1} & ${namaLengkap2}`;
    description = `Dengan hormat, kami mengundang Anda untuk hadir di acara ${kategori.toLowerCase()} ${namaLengkap1} & ${namaLengkap2}. Buka undangan digital di link ini.`;
  } else if (namaLengkap1) {
    title = `Undangan ${kategori}: ${namaLengkap1}`;
    description = `Anda diundang ke acara ${kategori.toLowerCase()} ${namaLengkap1}. Buka undangan digital di link ini.`;
  }

  // Cover image priority: custom upload → template image
  const coverImage: string | undefined =
    cover?.custom_image_url ||
    cover?.bg_image ||
    cover?.image_url ||
    undefined;

  const ogUrl = `${BASE_URL}/${slug}`;
  const images = coverImage
    ? [{ url: coverImage, width: 1200, height: 630, alt: title }]
    : [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: "Adatara - Undangan Digital" }];

  return {
    title,
    description,
    openGraph: {
      type: "website",
      siteName: "Adatara",
      title,
      description,
      url: ogUrl,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((i) => i.url),
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
