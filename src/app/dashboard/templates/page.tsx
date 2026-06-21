import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Palette, Plus } from "lucide-react";
import AdminTemplateList from "./AdminTemplateList";

export default async function TemplatesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "SUPER_ADMIN") redirect("/login");

  const templates = await db.template.findMany({
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="space-y-8 text-[#064e3b]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Palette className="w-3.5 h-3.5" />
            Template Builder
          </span>
          <h1 className="text-3xl font-black text-[#064e3b] tracking-tight">Kelola Template</h1>
          <p className="text-[#064e3b]/70 text-sm mt-1">
            Buat, edit, dan publish template desain undangan digital.
          </p>
        </div>
        <Link
          href="/dashboard/templates/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black bg-[#064e3b] hover:bg-[#064e3b]/90 text-white border border-[#d4af37] shadow-lg shadow-[#064e3b]/10 transition-all uppercase tracking-wider whitespace-nowrap"
        >
          <Plus className="w-4 h-4 text-[#d4af37]" />
          Buat Template Baru
        </Link>
      </div>

      <AdminTemplateList templates={templates} />
    </div>
  );
}
