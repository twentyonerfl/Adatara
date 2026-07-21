import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import TemplateBuilderEditor from "@/app/dashboard/templates/TemplateBuilderEditor";

export default async function EditInvitationAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "SUPER_ADMIN") redirect("/login");

  const { id } = await params;

  const [invitation, musicLibrary, categories] = await Promise.all([
    db.invitation.findUnique({
      where: { id },
      include: { template: true, user: true },
    }),
    db.musicLibrary.findMany({ orderBy: { created_at: "desc" } }),
    db.category.findMany({ orderBy: { nama: "asc" } }),
  ]);

  if (!invitation) redirect("/dashboard/invitations");

  const savedJson = invitation.data_undangan_json as any;

  return (
    <TemplateBuilderEditor
      invitationId={invitation.id}
      invitationSlug={invitation.slug}
      isInvitationEdit={true}
      initialData={savedJson}
      initialName={invitation.slug}
      initialKategori={invitation.template?.kategori || ""}
      initialStatus={invitation.status}
      initialBahasa={savedJson?.cover?.bahasa ?? "id"}
      musicLibrary={musicLibrary}
      categories={categories}
    />
  );
}
