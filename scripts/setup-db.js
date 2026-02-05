/* eslint-disable @typescript-eslint/no-require-imports */
const { Client } = require('pg');
require('dotenv').config();

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
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL is not set');
        process.exit(1);
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database');
        await client.query(sql);
        console.log('SQL Schema applied successfully');
    } catch (err) {
        console.error('Error applying schema:', err);
    } finally {
        await client.end();
    }
}

setup();
