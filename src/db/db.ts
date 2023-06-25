import { MongoClient } from 'mongodb';

const mongoURL = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
const dbName = 'lyrics'; // Replace with your database name

let db: any;

// Connect to the MongoDB database
export async function connectDb() {
  try {
    const client = new MongoClient(mongoURL);
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to the database');
  } catch (error) {
    throw new Error('Failed to connect to the database');
  }
}

// Insert lyrics into the database
export async function insertLyrics(artist: string, lyrics: string) {
  const collection = db.collection('lyrics');
  const document = {
    artist: artist,
    lyrics: lyrics
  };
  await collection.insertOne(document);
}
