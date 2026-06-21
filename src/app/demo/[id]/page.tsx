import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PublicInvitationView } from "@/app/u/[slug]/PublicInvitationView";

export const revalidate = 0; // Disable cache for real-time preview

export default async function TemplateDemoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Cari template di database berdasarkan id
  let template = await db.template.findUnique({
    where: { id },
  });

  // Fallback: Jika tidak ditemukan (misal id mock 1-6 dari landing page), ambil template pertama yang PUBLISHED
  if (!template) {
    template = await db.template.findFirst({
      where: { status: "PUBLISHED" },
    });
  }

  // Fallback 2: Jika masih tidak ada, ambil template apa saja yang tersedia
  if (!template) {
    template = await db.template.findFirst();
  }

  if (!template) {
    notFound();
  }

  // Siapkan objek invitation tiruan menggunakan template_json bawaan template
  const mockInvitation = {
    id: `demo-${template.id}`,
    slug: `demo-${template.id}`,
    data_undangan_json: template.template_json,
    template: {
      kategori: template.kategori,
      nama_template: template.nama_template,
    },
  };

  // Kirim wishes kosong untuk demo
  const wishes: any[] = [];

  return (
    <PublicInvitationView
      invitation={mockInvitation}
      wishes={wishes}
    />
  );
}
