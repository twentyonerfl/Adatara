import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FileText } from "lucide-react";
import InvitationsListAdmin from "./InvitationsListAdmin";

export default async function InvitationsPageAdmin() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  // Fetch all invitations in the platform
  const invitations = await db.invitation.findMany({
    orderBy: { created_at: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      template: {
        select: {
          nama_template: true,
          kategori: true
        }
      }
    }
  });

  return (
    <div className="space-y-8 text-[#064e3b]">
      {/* HEADER */}
      <div>
        <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
          <FileText className="w-3.5 h-3.5" />
          Daftar Undangan
        </span>
        <h1 className="text-3xl font-black text-[#064e3b] tracking-tight">Kelola Undangan Platform</h1>
        <p className="text-[#064e3b]/70 text-sm mt-1">
          Pantau status publikasi, buka pratinjau, sesuaikan konfigurasi, atau hapus undangan pelanggan.
        </p>
      </div>

      {/* Invitations Table Wrapper */}
      <InvitationsListAdmin initialInvitations={invitations} />
    </div>
  );
}
