import { connectDb, getOrmInstance, initializeORM } from './db/db';
import { getAccessToken } from '../keys';
import { getLyrics, getLyricsForSong, getSongsFromArtist } from './handlers/songHandler';

import express, { Request, Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import { cleanAllLyrics } from './utils/parseLyrics';

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
  app.get('/lyrics', getLyrics);

  app.post('/song', getLyricsForSong);

  app.get('/clean-lyrics', cleanAllLyrics);

  app.get('/get-songs', getSongsFromArtist);

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



