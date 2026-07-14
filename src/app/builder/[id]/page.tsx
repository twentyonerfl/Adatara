import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import TemplateBuilderEditor from "@/app/dashboard/templates/TemplateBuilderEditor";

export const revalidate = 0; // Disable caching to ensure real-time edits are shown

export default async function PublicBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch invitation details
  const invitation = await db.invitation.findUnique({
    where: { id },
    include: { template: true, user: true },
  });

  if (!invitation) {
    redirect("/templates");
  }

  // Fetch background music library
  const musicList = await db.musicLibrary.findMany({
    orderBy: { judul: "asc" },
  });

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f5f5dc]">
      <TemplateBuilderEditor
        invitationId={invitation.id}
        invitationSlug={invitation.slug}
        isInvitationEdit={true}
        initialData={invitation.data_undangan_json}
        initialName={invitation.template?.nama_template || invitation.slug}
        initialKategori={invitation.template?.kategori || "Pernikahan"}
        initialPaket={invitation.template?.paket || "PREMIUM"}
        initialStatus={invitation.status}
        musicLibrary={musicList}
      />
    </div>
  );
}
