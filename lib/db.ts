import { Pool } from 'pg';

let pool: Pool | null = null;

export const getDb = () => {
    if (pool) return pool;

    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not set in environment variables');
    }

    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL.includes('supabase.co') ? { rejectUnauthorized: false } : false,
    });

    return pool;
};

export const query = async (text: string, params?: any[]) => {
    const db = getDb();
    return db.query(text, params);
};
