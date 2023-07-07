import { find_lyrics } from '../utils/findLyrics';
import { isString } from '../utils/typeChecker';
import { Song } from '../entities/Song';
import { accessToken } from '../../keys';
import { getDiscography } from '../utils/getDiscography';

import { Request, Response } from 'express';
import { RequestContext } from '@mikro-orm/core';
import axios from 'axios';


export const getLyrics = async (req: Request, res: Response) => {
  try {
    const response = await find_lyrics("Wap");
    res.status(200).json({ success: true, message: 'Lyrics stored successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to retrieve and store lyrics.' });
  }
}

export const getLyricsForSong = async (req: Request, res: Response) => {
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
}

export const getSongsFromArtist = async (req: Request, res: Response) => {
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
}