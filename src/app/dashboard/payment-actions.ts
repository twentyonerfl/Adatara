"use server";

// @ts-ignore
import midtransClient from "midtrans-client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import fs from "fs/promises";
import path from "path";

async function getPackagePrices() {
  try {
    const configPath = path.join(process.cwd(), "src/config/packages.json");
    const configRaw = await fs.readFile(configPath, "utf-8");
    const config = JSON.parse(configRaw);
    return {
      PREMIUM: config.PREMIUM.price,
      SULTAN: config.SULTAN.price,
      EXCLUSIVE: config.EXCLUSIVE.price,
      // Compatibility mapping
      SILVER: config.PREMIUM.price,
      GOLD: config.SULTAN.price,
      PLATINUM: config.EXCLUSIVE.price
    };
  } catch (err) {
    console.error("Gagal membaca config packages.json, using defaults: ", err);
    return {
      PREMIUM: 99000,
      SULTAN: 149000,
      EXCLUSIVE: 299000,
      SILVER: 99000,
      GOLD: 149000,
      PLATINUM: 299000
    };
  }
}

export async function createPayment(packageType: "SILVER" | "GOLD" | "PLATINUM" | "PREMIUM" | "SULTAN" | "EXCLUSIVE") {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Sesi Anda telah kedaluwarsa. Silakan login kembali." };
  }

  const prices = await getPackagePrices();
  const amount = prices[packageType];
  if (!amount) {
    return { error: "Paket tidak valid." };
  }

  try {
    // 1. Create Transaction record in DB (PENDING)
    const transaction = await db.transaction.create({
      data: {
        user_id: session.user.id,
        nominal: amount,
        status_pembayaran: "PENDING"
      }
    });

    // 2. Initialize Midtrans Snap SDK client
    const snap = new midtransClient.Snap({
      isProduction: false, // Sandbox
      serverKey: process.env.MIDTRANS_SERVER_KEY || "",
      clientKey: process.env.MIDTRANS_CLIENT_KEY || ""
    });

    // 3. Build Midtrans parameter
    const parameter = {
      transaction_details: {
        order_id: transaction.id,
        gross_amount: amount
      },
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name: session.user.name,
        email: session.user.email,
        phone: session.user.nomor_hp || ""
      },
      item_details: [
        {
          id: packageType,
          price: amount,
          quantity: 1,
          name: `Paket Adatara Premium - ${packageType}`
        }
      ]
    };

    // 4. Request Snap Token
    const midtransRes = await snap.createTransaction(parameter);

    if (!midtransRes || !midtransRes.token) {
      return { error: "Gagal berkomunikasi dengan Payment Gateway." };
    }

    // 5. Update transaction with snap_token
    await db.transaction.update({
      where: { id: transaction.id },
      data: {
        snap_token: midtransRes.token
      }
    });

    revalidatePath("/dashboard");

    return { 
      success: true, 
      token: midtransRes.token, 
      redirectUrl: midtransRes.redirect_url 
    };
  } catch (err) {
    console.error("Gagal membuat transaksi Midtrans: ", err);
    return { error: "Terjadi kesalahan internal. Silakan coba kembali." };
  }
}
