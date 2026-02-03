import { betterAuth } from "better-auth";
import { getDb } from "@/lib/db";
import { nextCookies } from "better-auth/next-js";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = () => {
    if (authInstance) return authInstance;

    const db = getDb();
    const secret = process.env.BETTER_AUTH_SECRET || 'fallback-secret-for-build';

    authInstance = betterAuth({
        database: db || { type: 'postgres' } as any,
        secret: secret,
        baseURL: process.env.BETTER_AUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
        emailAndPassword: {
            enabled: true,
            autoSignIn: true,
        },
        plugins: [nextCookies()],
    });

    return authInstance;
};

// Use a getter to avoid top-level initialization issues during build
export const auth = getAuth();