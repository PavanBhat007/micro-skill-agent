import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error("MongoDB URI not available!")
}

try {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
} catch {
  throw new Error("MongoDB connection failed!")
}

export default clientPromise;