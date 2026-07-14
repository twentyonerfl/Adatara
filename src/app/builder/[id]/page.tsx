import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import TemplateBuilderEditor from "@/app/dashboard/templates/TemplateBuilderEditor";
import { BuilderEditor } from "@/app/dashboard/builder/[id]/BuilderEditor";

export const revalidate = 0; // Disable caching to ensure real-time edits are shown

export default async function PublicBuilderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const { id } = await params;
  const { edit } = await searchParams;

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

  if (edit === "true") {
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

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#fefcf6]">
      <BuilderEditor
        invitation={invitation}
        musicList={musicList}
      />
    </div>
  );
}
