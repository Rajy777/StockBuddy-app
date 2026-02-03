'use server';

import { query } from '@/lib/db';

export const getAllUsersForNewsEmail = async () => {
    try {
        const usersResult = await query(
            'SELECT id, email, name FROM "user" WHERE email IS NOT NULL'
        );
        const users = usersResult.rows;

        return (users as UserForNewsEmail[]).filter((user) => user.email && user.name).map((user) => ({
            id: user.id || '',
            email: user.email,
            name: user.name
        }))
    } catch (e) {
        console.error('Error fetching users for news email:', e)
        return []
    }
}