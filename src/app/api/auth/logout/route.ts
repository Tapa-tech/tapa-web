import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createHash } from "crypto";

function hashSHA256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const refreshTokenVal = req.cookies.get("refresh_token")?.value;

    if (refreshTokenVal) {
      const currentHash = hashSHA256(refreshTokenVal);

      // Mark the refresh token as revoked in the database
      await db.refreshToken
        .update({
          where: { tokenHash: currentHash },
          data: { revoked: true },
        })
        .catch(() => {
          // Ignore lookup errors if token is already missing or deleted
        });
    }

    // Build logout response clearing all auth cookies
    const response = NextResponse.json({ success: true, message: "Logged out successfully." });

    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");

    return response;
  } catch (error) {
    console.error("Error during logout handler:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
