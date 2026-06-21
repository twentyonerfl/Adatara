"use server";

// @ts-ignore
import midtransClient from "midtrans-client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

const packagePrices = {
  SILVER: 49000,
  GOLD: 99000,
  PLATINUM: 149000
};

export async function createPayment(packageType: "SILVER" | "GOLD" | "PLATINUM") {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Sesi Anda telah kedaluwarsa. Silakan login kembali." };
  }

  const amount = packagePrices[packageType];
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
