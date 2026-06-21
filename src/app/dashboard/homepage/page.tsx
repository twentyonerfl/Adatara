import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getHomepageSettings } from "./homepage-actions";
import HomepageSettingsClient from "./HomepageSettingsClient";

export default async function HomepageSettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  const settings = await getHomepageSettings();

  return (
    <HomepageSettingsClient initialSettings={JSON.parse(JSON.stringify(settings))} />
  );
}
