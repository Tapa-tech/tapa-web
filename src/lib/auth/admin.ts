import { NextRequest } from "next/server";
import { verifyAccessToken } from "./jwt";

export async function checkAdminAuth(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const payload = token ? await verifyAccessToken(token) : null;
  if (!payload || payload.role !== "ADMIN") {
    return null;
  }
  return payload;
}
