const axios = require('axios');
import { connectDb, insertSong } from './db/db'; // Assuming you've created the `db.js` file

import express, { Request, Response } from 'express';
import { find_lyrics } from './utils/find_lyrics';

import { accessToken, getAccessToken } from '../keys';

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Route to retrieve lyrics for a specific artist
app.get('/lyrics', async (req: Request, res: Response) => {
  try {
    const response = await find_lyrics("Wap");
    console.log('Response: ', response);
    res.status(200).json({ success: true, message: 'Lyrics stored successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to retrieve and store lyrics.' });
  }
});

app.post('/song', async () => {
  const song = {
    name: 'WAP',
    artist: 'Cardi B',
    lyrics: 'some lyrics'
  };

  await insertSong(song);
});

app.get('/artists', async () => {

  const genre = 'Rap'; // Replace with the desired genre

  axios.get(`https://api.spotify.com/v1/search?type=artist&q=genre:${genre}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
    .then((response: any) => {
      const artists = response.data.artists.items;
      console.log(artists);
    })
    .catch((error: any) => {
      console.error('Error:', error);
    });

});


app.get('/token', async (req: Request, res: Response) => {
  getAccessToken();
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
