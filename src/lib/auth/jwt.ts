import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "fallback-secret-at-least-32-chars-long"
);

export interface JWTPayload {
  userId: string;
  role: string;
  phone?: string;
  email?: string;
  consentGiven?: boolean;
}

export async function signAccessToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    role: payload.role,
    phone: payload.phone,
    email: payload.email,
    consentGiven: payload.consentGiven || false,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m") 
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
      consentGiven: payload.consentGiven as boolean,
    };
  } catch {
    return null;
  }
}
