import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

function getSafeMongoLabel(uri: string): string {
    try {
        const u = new URL(uri);
        // Never log credentials or query params.
        return `${u.protocol}//${u.host}${u.pathname}`;
    } catch {
        // Fallback: redact anything that looks like user:pass@ in the authority.
        return uri.replace(/\/\/[^@]+@/g, '//***@');
    }
}

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

let cached = global.mongooseCache;

if(!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
    if(!MONGODB_URI) throw new Error('MONGODB_URI must be set within .env');

    if(cached.conn) return cached.conn;

    if(!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    const safeLabel = getSafeMongoLabel(MONGODB_URI);
    console.log(`Connected to database ${process.env.NODE_ENV} - ${safeLabel}`);

    return cached.conn;
}