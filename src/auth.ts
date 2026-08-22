import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "@/lib/db";
import { signAccessToken } from "@/lib/auth/jwt";
import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";

function hashSHA256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

function generateOpaqueToken(): string {
  return randomBytes(32).toString("hex");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const email = user.email;
        if (!email) return false;

        // 1. Find or create User record
        let dbUser = await db.user.findUnique({
          where: { email },
        });

        if (!dbUser) {
          dbUser = await db.user.create({
            data: {
              email,
              name: user.name || null,
              image: user.image || null,
              role: "CUSTOMER",
              emailVerified: new Date(),
            },
          });
        }

        // 2. Link Google OAuth account record if not already linked
        const oauthLink = await db.oAuthAccount.findUnique({
          where: {
            provider_providerAccountId: {
              provider: "GOOGLE",
              providerAccountId: account.providerAccountId,
            },
          },
        });

        if (!oauthLink) {
          await db.oAuthAccount.create({
            data: {
              userId: dbUser.id,
              provider: "GOOGLE",
              providerAccountId: account.providerAccountId,
            },
          });
        }

        // 3. Generate access and refresh tokens
        const accessToken = await signAccessToken({
          userId: dbUser.id,
          role: dbUser.role,
          email: dbUser.email || undefined,
          consentGiven: dbUser.consentGiven,
        });

        const refreshTokenVal = generateOpaqueToken();
        const refreshTokenHash = hashSHA256(refreshTokenVal);
        const family = generateOpaqueToken();
        const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        await db.refreshToken.create({
          data: {
            userId: dbUser.id,
            tokenHash: refreshTokenHash,
            family,
            expiresAt: refreshTokenExpiry,
          },
        });

        // 4. Set secure cookies
        const cookieStore = cookies();
        
        cookieStore.set("access_token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 15 * 60, // 15 mins
        });

        cookieStore.set("refresh_token", refreshTokenVal, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 30 * 24 * 60 * 60, // 30 days
        });
      }
      return true;
    },
  },
});
