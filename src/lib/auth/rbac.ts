import { UserRole } from "@prisma/client";

const ROLE_HIERARCHY: Record<UserRole, number> = {
  CUSTOMER: 0,
  ADMIN: 1,
  SUPER_ADMIN: 2,
};

export function hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
  if (!userRole || !(userRole in ROLE_HIERARCHY)) return false;
  if (!requiredRole || !(requiredRole in ROLE_HIERARCHY)) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
