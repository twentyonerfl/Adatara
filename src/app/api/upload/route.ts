import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { v2 as cloudinary } from "cloudinary";

import { db } from "@/lib/db";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    // Parse FormData first to check parameters
    const formData = await req.formData();
    const invitationId = formData.get("invitationId") as string | null;
    const file = formData.get("file") as File | null;

    let authorized = false;

    // 1. Authenticate user as admin
    const session = await auth.api.getSession({ headers: await headers() });
    if (session && session.user.role === "SUPER_ADMIN") {
      authorized = true;
    } else if (invitationId) {
      // Validate that this invitation exists in the DB
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

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    // 3. Get file info
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Fallback: If Cloudinary credentials are not set, save locally to public/uploads
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      const fs = require("fs").promises;
      const path = require("path");
      
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      
      // Ensure directory exists
      await fs.mkdir(uploadDir, { recursive: true });
      
      // Generate a unique filename
      const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = path.join(uploadDir, uniqueFilename);
      
      // Write file buffer
      await fs.writeFile(filePath, buffer);
      
      // Return local URL
      return NextResponse.json({ success: true, url: `/uploads/${uniqueFilename}` });
    }

    // 4. Upload to Cloudinary using upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "adatara",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    }) as any;

    // 5. Return the secure URL from Cloudinary
    return NextResponse.json({ success: true, url: uploadResult.secure_url });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Gagal mengunggah file: " + err.message }, { status: 500 });
  }
}

