import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import PackagesClient from "./PackagesClient";

export const revalidate = 0; // Disable server cache for real-time stats

export default async function PackagesPageAdmin() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  // Load packages.json
  let packages = {};
  try {
    const configPath = path.join(process.cwd(), "src/config/packages.json");
    const configRaw = await fs.readFile(configPath, "utf-8");
    packages = JSON.parse(configRaw);
  } catch (err) {
    console.error("Gagal membaca config packages.json: ", err);
  }

  // Count sales statistics dynamically by successful transactions nominals
  const transactions = await db.transaction.findMany({
    where: { status_pembayaran: "SUCCESS" },
    select: { nominal: true }
  });

  const salesStats: Record<string, number> = {
    BASIC: 0,
    PREMIUM: 0,
    SULTAN: 0,
    EXCLUSIVE: 0
  };

  transactions.forEach((tx) => {
    const value = Number(tx.nominal);
    if (value === 99000 || value === 49000) {
      salesStats.PREMIUM += 1;
    } else if (value === 149000) {
      salesStats.SULTAN += 1;
    } else if (value === 299000) {
      salesStats.EXCLUSIVE += 1;
    }
  });

  return (
    <PackagesClient 
      initialPackages={packages} 
      salesStats={salesStats}
    />
  );
}
