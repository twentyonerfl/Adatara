import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import TemplateBuilderEditor from "../TemplateBuilderEditor";

export default async function NewTemplatePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "SUPER_ADMIN") redirect("/login");

  const [musicLibrary, categories] = await Promise.all([
    db.musicLibrary.findMany({ orderBy: { created_at: "desc" } }),
    db.category.findMany({ orderBy: { nama: "asc" } }),
  ]);

  return (
    <TemplateBuilderEditor
      musicLibrary={musicLibrary}
      categories={categories}
    />
  );
}
