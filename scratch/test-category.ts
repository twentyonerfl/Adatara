import fs from "fs";
import path from "path";

// Load .env manually using process.cwd() BEFORE importing db
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const parts = trimmed.split("=");
    const key = parts[0].trim();
    const val = parts.slice(1).join("=").trim().replace(/(^['"]|['"]$)/g, "");
    process.env[key] = val;
  }
}

async function test() {
  const { db } = await import("../src/lib/db");
  try {
    const cats = await db.category.findMany();
    console.log("Existing categories:", cats);
    
    // Try to create a test one
    const newCat = await db.category.create({
      data: {
        nama: "Test Category " + Date.now()
      }
    });
    console.log("Created successfully:", newCat);
    
    // Clean up
    await db.category.delete({
      where: { id: newCat.id }
    });
    console.log("Deleted successfully.");
  } catch (err) {
    console.error("Error during Category DB operations:", err);
  }
}

test();
