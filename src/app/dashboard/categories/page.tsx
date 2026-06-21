import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CategoriesClient from "./CategoriesClient";

export default async function CategoriesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  // Fetch all categories and templates from db
  const [categories, templates] = await Promise.all([
    db.category.findMany({ orderBy: { nama: "asc" } }),
    db.template.findMany({ orderBy: { created_at: "desc" } }),
  ]);

  // Map category groups with dynamic counts and template listings
  const categoryGroups = categories.map(cat => {
    const items = templates.filter(t => t.kategori.toLowerCase() === cat.nama.toLowerCase());
    return {
      id: cat.id,
      nama: cat.nama,
      count: items.length,
      items: items.map(i => ({ id: i.id, nama_template: i.nama_template }))
    };
  });

  return (
    <CategoriesClient initialGroups={categoryGroups} />
  );
}
