import { betterAuth } from "better-auth";
import { getDb } from "@/lib/db";
import { nextCookies } from "better-auth/next-js";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = () => {
    if (authInstance) return authInstance;

    authInstance = betterAuth({
        database: getDb(), // Better Auth supports passing a pg Pool directly
        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
        emailAndPassword: {
            enabled: true,
            autoSignIn: true,
        },
        plugins: [nextCookies()],
    });

    return authInstance;
};

// Lazy export to avoid top-level await and connection issues during build
export const auth = getAuth();