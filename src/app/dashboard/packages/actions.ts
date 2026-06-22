"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

const configPath = path.join(process.cwd(), "src/config/packages.json");

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
      if (!pkg.name || !pkg.sub || !pkg.desc || !Array.isArray(pkg.features)) {
        return { error: `Format paket ${key} tidak lengkap.` };
      }
    }

    // Write to packages.json
    await fs.writeFile(configPath, JSON.stringify(updatedPackages, null, 2), "utf-8");

    // Revalidate landing page and packages page
    revalidatePath("/");
    revalidatePath("/dashboard/packages");

    return { success: true };
  } catch (err) {
    console.error("Gagal menyimpan setting paket: ", err);
    return { error: "Terjadi kesalahan internal saat menyimpan perubahan." };
  }
}
