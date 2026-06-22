"use server";

// @ts-ignore
import midtransClient from "midtrans-client";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getPackagesConfig } from "@/lib/packages";

import fs from "fs/promises";
import path from "path";

async function getPackagePrices() {
  try {
    const config = await getPackagesConfig();
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
    console.error("Gagal memuat config packages: ", err);
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

export async function saveInvitationPublic(
  id: string, 
  dataUndanganJson: any, 
  status: "DRAFT" | "ACTIVE" | "INACTIVE"
) {
  try {
    const invitation = await db.invitation.findUnique({
      where: { id }
    });

    if (!invitation) {
      return { error: "Undangan tidak ditemukan." };
    }

    // Update invitation data and status
    await db.invitation.update({
      where: { id },
      data: {
        data_undangan_json: dataUndanganJson,
        status: status,
      }
    });

    revalidatePath(`/builder/${id}`);
    revalidatePath(`/${invitation.slug}`);

    return { success: true };
  } catch (err) {
    console.error("Gagal menyimpan undangan publik: ", err);
    return { error: "Gagal menyimpan perubahan ke database." };
  }
}

export async function createPaymentPublic(
  invitationId: string,
  packageType: "SILVER" | "GOLD" | "PLATINUM" | "PREMIUM" | "SULTAN" | "EXCLUSIVE"
) {
  const prices = await getPackagePrices();
  const amount = prices[packageType];
  if (!amount) {
    return { error: "Paket tidak valid." };
  }

  try {
    // 1. Fetch invitation with User details
    const invitation = await db.invitation.findUnique({
      where: { id: invitationId },
      include: { user: true }
    });

    if (!invitation) {
      return { error: "Undangan tidak ditemukan." };
    }

    const user = invitation.user;

    // 2. Create Transaction record in DB (PENDING)
    const transaction = await db.transaction.create({
      data: {
        user_id: user.id,
        nominal: amount,
        status_pembayaran: "PENDING"
      }
    });

    // 3. Initialize Midtrans Snap client
    const snap = new midtransClient.Snap({
      isProduction: false, // Sandbox
      serverKey: process.env.MIDTRANS_SERVER_KEY || "",
      clientKey: process.env.MIDTRANS_CLIENT_KEY || ""
    });

    // 4. Build Midtrans parameter
    const parameter = {
      transaction_details: {
        order_id: transaction.id,
        gross_amount: amount
      },
      credit_card: {
        secure: true
      },
      customer_details: {
        first_name: user.name,
        email: user.email,
        phone: user.nomor_hp || ""
      },
      item_details: [
        {
          id: packageType,
          price: amount,
          quantity: 1,
          name: `Aktivasi Undangan - Paket ${packageType}`
        }
      ]
    };

    // 5. Request Snap Token
    const midtransRes = await snap.createTransaction(parameter);

    if (!midtransRes || !midtransRes.token) {
      return { error: "Gagal berkomunikasi dengan Payment Gateway." };
    }

    // 6. Update transaction with snap_token
    await db.transaction.update({
      where: { id: transaction.id },
      data: {
        snap_token: midtransRes.token
      }
    });

    return { 
      success: true, 
      token: midtransRes.token, 
      redirectUrl: midtransRes.redirect_url 
    };
  } catch (err) {
    console.error("Gagal membuat transaksi Midtrans publik: ", err);
    return { error: "Terjadi kesalahan internal. Silakan coba kembali." };
  }
}
