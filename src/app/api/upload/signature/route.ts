import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { v2 as cloudinary } from "cloudinary";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    let authorized = false;
    let invitationId: string | null = null;

    try {
      const body = await req.json();
      invitationId = body.invitationId || null;
    } catch {}

    // 1. Authenticate user
    const session = await auth.api.getSession({ headers: await headers() });
    if (session && session.user.role === "SUPER_ADMIN") {
      authorized = true;
    } else if (invitationId) {
      const invitation = await db.invitation.findUnique({
        where: { id: invitationId },
      });
      if (invitation) {
        authorized = true;
      }
    }

    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary credentials not configured on the server" },
        { status: 400 }
      );
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    const timestamp = Math.round(new Date().getTime() / 1000);

    const params_to_sign = {
      timestamp: timestamp,
      folder: "adatara",
    };

    const signature = cloudinary.utils.api_sign_request(
      params_to_sign,
      apiSecret
    );

    return NextResponse.json({
      success: true,
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder: "adatara",
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Signature error:", err);
    return NextResponse.json(
      { error: "Failed to generate upload signature: " + err.message },
      { status: 500 }
    );
  }
}
