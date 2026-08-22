import { NextRequest } from "next/server";
import { UserRole } from "@prisma/client";
import { verifyAccessToken } from "./jwt";
import { hasRequiredRole } from "./rbac";

export async function checkAdminAuth(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const payload = token ? await verifyAccessToken(token) : null;
  if (!payload || !hasRequiredRole(payload.role as UserRole, "ADMIN")) {
    return null;
  }
  return payload;
}
