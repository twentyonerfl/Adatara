import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BuilderEditor } from "./BuilderEditor";

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Fetch invitation details
  const invitation = await db.invitation.findUnique({
    where: { id },
    include: { template: true },
  });

  if (!invitation || invitation.user_id !== session.user.id) {
    redirect("/dashboard");
  }

  // Fetch background music library
  const musicList = await db.musicLibrary.findMany({
    orderBy: { judul: "asc" },
  });

  return (
    <div className="h-[calc(100vh-80px)] -m-6 sm:-m-10 flex flex-col">
      <BuilderEditor 
        invitation={invitation} 
        musicList={musicList} 
      />
    </div>
  );
}
