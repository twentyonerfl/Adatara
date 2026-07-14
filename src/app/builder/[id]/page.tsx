import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import WaSharePage from "./WaSharePage";

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

  return <WaSharePage invitation={invitation} />;
}
