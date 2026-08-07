import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "fallback-secret-at-least-32-chars-long"
);

export interface JWTPayload {
  userId: string;
  role: string;
  phone?: string;
  email?: string;
}

export async function signAccessToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    role: payload.role,
    phone: payload.phone,
    email: payload.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m") // Short-lived (15 minutes)
    .sign(JWT_SECRET);
}

export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      role: payload.role as string,
      phone: payload.phone as string,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}
