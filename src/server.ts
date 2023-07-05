import { connectDb, getOrmInstance, initializeORM } from './db/db';
import { accessToken, getAccessToken } from '../keys';
import { find_lyrics } from './utils/find_lyrics';
import { isString } from './utils/typeChecker';

import express, { Request, Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { Song } from './entities/Song';
import axios from 'axios';
import getDiscography from './utils/get_discography';

const app = express();
const port = 3000;

(async () => {
  await initializeORM();

  app.use(express.json());

  app.use((req, res, next) => {
    const orm = getOrmInstance();
    RequestContext.create(orm.em, next);
  });

  // Retrieve lyrics for a specific artist
  app.get('/lyrics', async (req: Request, res: Response) => {
    try {
      const response = await find_lyrics("Wap");
      res.status(200).json({ success: true, message: 'Lyrics stored successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to retrieve and store lyrics.' });
    }
  });

  app.post('/song', async () => {
    const name = 'WAP';
    const artist = 'Cardi B';
    let lyrics: string | Error;
    try {
      lyrics = await find_lyrics(name);
      const song = {
        name,
        artist,
        lyrics: isString(lyrics) ? lyrics : '',
      };
      const em = RequestContext.getEntityManager();
      if (em && song) {
        let songEntity = em.create(Song, song);
        await em.persistAndFlush(songEntity);
      }
    } catch (e) {
      console.error('Failed to retrieve lyrics: ', e);
    }
  });

  app.get('/artists', async () => {
    const genre = 'Rap';

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

  app.get('/artistID', async () => {
    const name = 'Eminem';
    try {
      const response = await axios.get(`https://api.spotify.com/v1/search?type=artist&q=${name}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const id = response.data.artists.items[0].id;
      const albums = await getDiscography(id, 10);
      console.log('albums; ', albums);

      for (const album of albums) {
        const albumName = Object.keys(album)[0];
        const { songs } = album[albumName];
        for (const songName of songs) {
          const artist = 'Eminem';
          let lyrics: string | Error;
          try {
            lyrics = await find_lyrics(songName);
            const song = {
              name: songName,
              artist,
              lyrics: isString(lyrics) ? lyrics : '',
            };
            const em = RequestContext.getEntityManager();
            if (em && song) {
              let songEntity = em.create(Song, song);
              await em.persistAndFlush(songEntity);
            }
          } catch (e) {
            console.error('Failed to retrieve lyrics: ', e);
          }
        }
      }

    } catch (e) {
      console.log(e);
    }
  });

  app.get('/token', async (req: Request, res: Response) => {
    getAccessToken();
  });

  connectDb()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
      });
    })
    .catch((error: Error) => {
      console.error('Failed to connect to the database:', error);
    });
})();



