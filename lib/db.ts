import { Pool } from 'pg';

let pool: Pool | null = null;

export const getDb = () => {
    if (pool) return pool;

    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        // During build time, we might not have the environment variable.
        // We log a warning instead of throwing to allow the build to proceed.
        console.warn('WARNING: DATABASE_URL is not set. This might cause issues if database access is required.');
        return null as any; // Better Auth will handle the null if not used
    }

    pool = new Pool({
        connectionString: databaseUrl,
        ssl: databaseUrl.includes('supabase.co') ? { rejectUnauthorized: false } : false,
    });

    return pool;
};

export const query = async (text: string, params?: any[]) => {
    const db = getDb();
    return db.query(text, params);
};
