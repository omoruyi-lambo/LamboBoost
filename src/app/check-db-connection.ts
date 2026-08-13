import { MongoClient } from "mongodb";

async function checkDbConnection() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("Error: MONGODB_URI environment variable is not set.");
    console.log("Please set MONGODB_URI in your .env.local file or as an environment variable.");
    return;
  }

  console.log("Attempting to connect to MongoDB...");
  console.log(`URI present: YES (length: ${MONGODB_URI.length})`);
  console.log(`URI starts with mongodb+srv:// : ${MONGODB_URI.startsWith("mongodb+srv://")}`);

  let client: MongoClient | undefined;
  try {
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout for server selection
      socketTimeoutMS: 45000, // 45 seconds timeout for socket operations
    });

    await client.connect();
    console.log("Connection: SUCCESS");

    await client.db().admin().ping();
    console.log("Ping: SUCCESS");

  } catch (err: any) {
    console.error("Connection: FAIL");
    console.error("Ping: FAIL");
    console.error("Error Name:", err.name);
    console.error("Error Code:", err.code);
    console.error("Sanitized Error Message:", err.message.split('\n')[0]); // Only show first line to avoid leaking full URI
  } finally {
    if (client) await client.close();
  }
}

checkDbConnection();