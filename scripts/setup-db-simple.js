const { Client } = require('pg');

const conn = 'postgres://postgres.samtqyznrjviqieiaaol:Px/f*UCy6zB9qq4@db.samtqyznrjviqieiaaol.supabase.co:5432/postgres';

const sql = `
CREATE TABLE IF NOT EXISTS watchlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    symbol TEXT NOT NULL,
    company TEXT NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, symbol)
);
`;

async function setup() {
    const client = new Client({
        connectionString: 'postgres://postgres.samtqyznrjviqieiaaol:Px%2Ff%2AUCy6zB9qq4@aws-0-ap-south-1.pooler.supabase.com:6543/postgres'
    });

    try {
        await client.connect();
        console.log('Connected to database');
        await client.query(sql);
        console.log('SQL Schema applied successfully');
    } catch (err) {
        console.error('Error applying schema:');
        console.error(err.message);
        console.error(err.stack);
    } finally {
        await client.end();
    }
}

setup();
