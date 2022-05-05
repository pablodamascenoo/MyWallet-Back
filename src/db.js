import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const COLLECTION = process.env.COLLECTION;

let db;
const mongoClient = new MongoClient(MONGO_URI);

try {
  await mongoClient.connect();
  db = mongoClient.db(COLLECTION);
} catch (error) {
  console.log(error);
}

export default db;
