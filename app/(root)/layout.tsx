import Header from "@/components/Header";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    let session = null;
    try {
        session = await auth.api.getSession({ headers: await headers() });
    } catch (e) {
        console.error('Failed to get session, falling back to guest mode:', e);
    }

    const user = session?.user
        ? {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
        }
        : {
            id: 'guest',
            name: 'Guest',
            email: 'guest@stockbuddy.com',
        };

    return (
        <main className="min-h-screen text-gray-400">
            <Header user={user} />

            <div className="container py-10">
                {children}
            </div>
        </main>
    )
}
export default Layout