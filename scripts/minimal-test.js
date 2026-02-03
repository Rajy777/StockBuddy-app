const { Client } = require('pg');
const client = new Client({
    connectionString: "postgres://postgres:Px%2Ff%2AUCy6zB9qq4@db.samtqyznrjviqieiaaol.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false }
});
client.connect()
    .then(() => {
        console.log('CONNECTED_TO_DIRECT');
        return client.query('SELECT NOW()');
    })
    .then(res => {
        console.log('QUERY_RESULT', res.rows[0]);
        process.exit(0);
    })
    .catch(err => {
        console.error('CONNECTION_ERROR', err.message);
        process.exit(1);
    });
