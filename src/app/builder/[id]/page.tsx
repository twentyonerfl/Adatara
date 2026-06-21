import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { BuilderEditor } from "./BuilderEditor";

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
    include: { template: true },
  });

  if (!invitation) {
    redirect("/templates");
  }

  // Fetch background music library
  const musicList = await db.musicLibrary.findMany({
    orderBy: { judul: "asc" },
  });

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#f5f5dc]">
      <BuilderEditor 
        invitation={invitation} 
        musicList={musicList} 
      />
    </div>
  );
}
