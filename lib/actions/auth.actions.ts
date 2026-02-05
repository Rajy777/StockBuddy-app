'use server';

import { auth } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";
import { headers } from "next/headers";

export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpFormData) => {
    try {
        const response = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name: fullName
            }
        })

        if (response) {
            await inngest.send({
                name: 'app/user.created',
                data: { email, name: fullName, country, investmentGoals, riskTolerance, preferredIndustry }
            })
        }

        return {
            success: true,
            user: response?.user ? {
                id: response.user.id,
                email: response.user.email,
                name: response.user.name
            } : null
        }
    } catch (e) {
        const error = e as Error;
        console.log('Sign up failed', error)
        return { success: false, error: error?.message || 'Sign up failed' }
    }
}

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
    try {
        const response = await auth.api.signInEmail({ body: { email, password } })

        return {
            success: true,
            user: response?.user ? {
                id: response.user.id,
                email: response.user.email,
                name: response.user.name
            } : null
        }
    } catch (e) {
        const error = e as Error;
        console.log('Sign in failed', error)
        return { success: false, error: error?.message || 'Sign in failed' }
    }
}

export const signOut = async () => {
    try {
        await auth.api.signOut({ headers: await headers() });
    } catch (e) {
        console.log('Sign out failed', e)
        return { success: false, error: 'Sign out failed' }
    }
}