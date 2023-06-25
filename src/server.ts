// const express = require('express');

import { connectDb, insertLyrics } from './db/db'; // Assuming you've created the `db.js` file

import express, { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import { find_lyrics } from './utils/find_lyrics';


const app = express();
const port = 3000;

const mongoURL = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
const dbName = 'lyrics'; // Replace with your database name

// Middleware to parse JSON requests
app.use(express.json());

// Route to retrieve lyrics for a specific artist
// app.get('/lyrics/:artist', async (req: Request, res: Response) => {
app.get('/lyrics', async (req: Request, res: Response) => {
  try {
    const response = await find_lyrics("Wap");

    const lyrics = response;
    console.log('Response: ', response);

    // res.status(200).json({ success: true, message: 'Lyrics stored successfully.' });
  } catch (error) {
    console.error(error);
    // res.status(500).json({ success: false, message: 'Failed to retrieve and store lyrics.' });
  }
});

// Connect to the MongoDB database and start the server
connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((error: Error) => {
    console.error('Failed to connect to the database:', error);
  });
