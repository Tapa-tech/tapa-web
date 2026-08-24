import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/auth/admin";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
  const admin = await checkAdminAuth(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only PNG, JPEG, and WEBP are allowed." }, { status: 400 });
    }

    
    const maxSizeBytes = 4 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json({ error: "File too large. Max size allowed is 4MB." }, { status: 400 });
    }

    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    
    const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadDir, safeName);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${safeName}`,
    });
  } catch (err) {
    console.error("File upload failed:", err);
    return NextResponse.json({ error: "Internal server error during upload" }, { status: 500 });
  }
}
