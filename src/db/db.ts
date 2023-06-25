import { MongoClient } from 'mongodb';
import { Song } from '../../types/index';

const mongoURL = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
const dbName = 'rhyme-time'; // Replace with your database name
const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
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

export async function insertSong(song: Song): Promise<void> {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('song');

    await collection.insertOne(song);
    console.log('Song inserted successfully');
  } catch (error) {
    console.error('Error inserting song:', error);
  } finally {
    client.close();
  }
}