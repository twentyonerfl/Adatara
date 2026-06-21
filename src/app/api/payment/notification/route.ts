import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const notification = await req.json();
    
    const { 
      order_id, 
      status_code, 
      gross_amount, 
      signature_key, 
      transaction_status, 
      payment_type 
    } = notification;
    
    // Verify Midtrans Signature Key
    // signature_key = SHA512(order_id + status_code + gross_amount + ServerKey)
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const hashSource = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const calculatedSignature = crypto.createHash("sha512").update(hashSource).digest("hex");
    
    if (calculatedSignature !== signature_key) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Find local transaction
    const transaction = await db.transaction.findUnique({
      where: { id: order_id }
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Determine target TransactionStatus
    let status_pembayaran: "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED" = "PENDING";

    if (transaction_status === "capture" || transaction_status === "settlement") {
      status_pembayaran = "SUCCESS";
    } else if (
      transaction_status === "deny" || 
      transaction_status === "cancel" || 
      transaction_status === "failure"
    ) {
      status_pembayaran = "FAILED";
    } else if (transaction_status === "expire") {
      status_pembayaran = "EXPIRED";
    }

    // Update the transaction in database
    await db.transaction.update({
      where: { id: order_id },
      data: {
        status_pembayaran,
        metode_pembayaran: payment_type || null
      }
    });

    // If payment is settled successfully, upgrade user status to active (premium) and publish the invitation
    if (status_pembayaran === "SUCCESS") {
      await db.user.update({
        where: { id: transaction.user_id },
        data: {
          status: "ACTIVE"
        }
      });

      // Find the invitation associated with this user and publish it
      const invitation = await db.invitation.findFirst({
        where: { user_id: transaction.user_id }
      });

      if (invitation) {
        await db.invitation.update({
          where: { id: invitation.id },
          data: {
            status: "ACTIVE"
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Gagal memproses webhook Midtrans: ", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
