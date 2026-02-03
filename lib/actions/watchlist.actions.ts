'use server';

import { query } from '@/lib/db';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
    if (!email) return [];

    try {
        // Better Auth stores users in the "user" table. 
        // Note: "user" is a reserved word in Postgres, so we use double quotes.
        const userResult = await query('SELECT id FROM "user" WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user) return [];

        const userId = user.id;

        const itemsResult = await query('SELECT symbol FROM watchlist WHERE user_id = $1', [userId]);
        return itemsResult.rows.map((i: { symbol: string }) => String(i.symbol));
    } catch (err) {
        console.error('getWatchlistSymbolsByEmail error:', err);
        return [];
    }
}

export async function toggleWatchlist(email: string, symbol: string, company: string, isAdded: boolean) {
    if (!email || !symbol) return { success: false };

    try {
        const userResult = await query('SELECT id FROM "user" WHERE email = $1', [email]);
        const userId = userResult.rows[0]?.id;
        if (!userId) throw new Error('User not found');

        if (isAdded) {
            await query(
                'INSERT INTO watchlist (user_id, symbol, company) VALUES ($1, $2, $3) ON CONFLICT (user_id, symbol) DO NOTHING',
                [userId, symbol.toUpperCase(), company]
            );
        } else {
            await query(
                'DELETE FROM watchlist WHERE user_id = $1 AND symbol = $2',
                [userId, symbol.toUpperCase()]
            );
        }

        return { success: true };
    } catch (err) {
        console.error('toggleWatchlist error:', err);
        return { success: false };
    }
}