import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { hasRequiredRole } from "@/lib/auth/rbac";
import { UserRole } from "@prisma/client";

const ADMIN_ROUTES = ["/admin", "/api/admin"];
const SUPER_ADMIN_ROUTES = ["/admin/users", "/api/admin/users"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAdminRoute = ADMIN_ROUTES.some((p) => path.startsWith(p));

  if (!isAdminRoute) return NextResponse.next();

  const token = req.cookies.get("access_token")?.value;
  const payload = token ? await verifyAccessToken(token) : null;

  if (!payload) {
    if (path.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized. Please authenticate." }, { status: 401 });
    }
    
    return NextResponse.redirect(new URL("/?login=true", req.url));
  }

  
  const isSuperAdminRoute = SUPER_ADMIN_ROUTES.some((p) => path.startsWith(p));
  if (isSuperAdminRoute) {
    if (!hasRequiredRole(payload.role as UserRole, "SUPER_ADMIN")) {
      if (path.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden. Super Admin privileges required." }, { status: 403 });
      }
      return NextResponse.rewrite(new URL("/_not-found", req.url));
    }
    return NextResponse.next();
  }

  
  if (!hasRequiredRole(payload.role as UserRole, "ADMIN")) {
    if (path.startsWith("/api/")) {
      return NextResponse.json({ error: "Forbidden. Admin privileges required." }, { status: 403 });
    }
    return NextResponse.rewrite(new URL("/_not-found", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
