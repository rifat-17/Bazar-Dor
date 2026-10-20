import { MongoClient, type Db } from "mongodb";

const mongoUrl = process.env.MONGODB_URL;

if (!mongoUrl) {
  throw new Error("MONGODB_URL is missing");
}

// Reuse the client across hot reloads / serverless invocations so we don't
// exhaust MongoDB connections in development or on Vercel.
const globalForMongo = globalThis as unknown as {
  __bazarMongoClient?: MongoClient;
  __bazarMongoDb?: Db;
};

export const mongoClient =
  globalForMongo.__bazarMongoClient ?? new MongoClient(mongoUrl);

export const db = globalForMongo.__bazarMongoDb ?? mongoClient.db("bazar-dor");

globalForMongo.__bazarMongoClient = mongoClient;
globalForMongo.__bazarMongoDb = db;
