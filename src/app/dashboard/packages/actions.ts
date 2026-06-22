"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { savePackagesConfig } from "@/lib/packages";

export async function savePackagesAction(updatedPackages: any) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "SUPER_ADMIN") {
    return { error: "Akses ditolak. Anda bukan Administrator." };
  }

  try {
    // Validate inputs
    for (const key of Object.keys(updatedPackages)) {
      const pkg = updatedPackages[key];
      if (typeof pkg.price !== "number" || pkg.price < 0) {
        return { error: `Harga paket ${key} tidak valid.` };
      }
      if (!pkg.name || !pkg.sub || !Array.isArray(pkg.features)) {
        return { error: `Format paket ${key} tidak lengkap.` };
      }
      // Ensure desc defaults to empty string if missing
      if (pkg.desc === undefined || pkg.desc === null) {
        pkg.desc = "";
      }
    }

    // Save package configuration to DB & fallback to file
    await savePackagesConfig(updatedPackages);

    // Revalidate landing page and packages page
    revalidatePath("/");
    revalidatePath("/dashboard/packages");

    return { success: true };
  } catch (err) {
    console.error("Gagal menyimpan setting paket: ", err);
    return { error: "Terjadi kesalahan internal saat menyimpan perubahan." };
  }
}
