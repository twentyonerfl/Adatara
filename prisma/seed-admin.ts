import "dotenv/config";
import { auth } from "../src/lib/auth";
import { db } from "../src/lib/db";

async function run() {
  const email = "alchemist@adatara.id";
  const password = "AlchemistAdmin2026!";
  const name = "alchemist";

  console.log(`Creating user ${name} (${email})...`);

  try {
    // Better Auth server API will handle standard creation and password hashing
    const userResult = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        nomor_hp: "081234567890",
      },
    });

    console.log("User created:", userResult);

    // Promote the user to SUPER_ADMIN
    await db.user.update({
      where: { email },
      data: {
        role: "SUPER_ADMIN",
      },
    });

    console.log("Successfully promoted to SUPER_ADMIN!");
  } catch (error) {
    console.error("Failed to seed admin:", error);
  } finally {
    await db.$disconnect();
  }
}

run();
