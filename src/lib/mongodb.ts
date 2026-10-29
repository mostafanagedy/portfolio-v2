import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "nagedy_portfolio";

if (!uri) {
  // Keep builds working before the owner configures the database.
  console.warn("MONGODB_URI is not configured; visitor event persistence is disabled.");
}

type MongoCache = { client: MongoClient | null; promise: Promise<MongoClient> | null };
const globalForMongo = globalThis as typeof globalThis & { __nagedyMongo?: MongoCache };
const cache = (globalForMongo.__nagedyMongo ??= { client: null, promise: null });

export async function getDatabase(): Promise<Db> {
  if (!uri) throw new Error("DATABASE_NOT_CONFIGURED");
  if (cache.client) return cache.client.db(dbName);
  if (!cache.promise) {
    cache.promise = new MongoClient(uri, { maxPoolSize: 5, serverSelectionTimeoutMS: 5000 }).connect();
  }
  cache.client = await cache.promise;
  return cache.client.db(dbName);
}

export async function ensureVisitorIndexes(db: Db) {
  const events = db.collection("visitor_events");
  await Promise.all([
    events.createIndex({ createdAt: -1 }),
    events.createIndex({ sessionId: 1, createdAt: -1 }),
    events.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    events.createIndex({ eventName: 1, createdAt: -1 }),
  ]);
}
