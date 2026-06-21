import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import TemplateBuilderEditor from "../../TemplateBuilderEditor";

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "SUPER_ADMIN") redirect("/login");

  const { id } = await params;

  const [template, musicLibrary, categories] = await Promise.all([
    db.template.findUnique({ where: { id } }),
    db.musicLibrary.findMany({ orderBy: { created_at: "desc" } }),
    db.category.findMany({ orderBy: { nama: "asc" } }),
  ]);

  if (!template) redirect("/dashboard/templates");

  const savedJson = template.template_json as any;

  return (
    <TemplateBuilderEditor
      templateId={template.id}
      initialData={savedJson}
      initialName={template.nama_template}
      initialKategori={template.kategori}
      initialPaket={template.paket}
      initialThumbnail={template.thumbnail}
      initialDeskripsi={template.deskripsi || ""}
      initialStatus={template.status}
      initialBahasa={savedJson?.cover?.bahasa ?? "id"}
      musicLibrary={musicLibrary}
      categories={categories}
    />
  );
}
