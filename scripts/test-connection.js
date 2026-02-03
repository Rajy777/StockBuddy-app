const { Client } = require('pg');
require('dotenv').config();

async function testConnection(name, connectionString) {
    console.log(`Testing connection: ${name}`);
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log(`[${name}] Success: Connected to database`);
        const res = await client.query('SELECT NOW()');
        console.log(`[${name}] Query result:`, res.rows[0]);
    } catch (err) {
        console.error(`[${name}] Error:`, err.message);
    } finally {
        await client.end();
    }
}

async function run() {
    const pooledUrl = process.env.DATABASE_URL;
    const directUrl = pooledUrl.replace('aws-0-ap-south-1.pooler.supabase.com:6543', 'db.samtqyznrjviqieiaaol.supabase.co:5432');

    await testConnection('Pooled (6543)', pooledUrl);
    await testConnection('Direct (5432)', directUrl);
}

run();
