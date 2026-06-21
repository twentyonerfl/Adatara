import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user as admin
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    // 3. Get file info
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Generate unique filename
    const originalName = file.name;
    const extension = originalName.substring(originalName.lastIndexOf("."));
    const filename = `${crypto.randomUUID()}${extension}`;

    // 5. Ensure uploads folder exists
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // 6. Write file
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // 7. Return public URL path
    const url = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Gagal mengunggah file: " + err.message }, { status: 500 });
  }
}
