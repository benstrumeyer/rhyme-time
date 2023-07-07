import { RequestContext } from "@mikro-orm/core";
import { Song } from "../entities/Song";

export const cleanText = (text: string): string => {
  return text.replace(/\[.*?\]|\n\s*\n/g, '');
};

export async function cleanAllLyrics() {
  const em = RequestContext.getEntityManager();
  try {
    if (em) {
      const songs: Song[] = await em.find(Song, {});
      for (const song of songs) {
        const cleanedLyrics: string = cleanText(song.lyrics);
        song.lyrics = cleanedLyrics;
        await em.persistAndFlush(song);
      }
      console.log('Lyrics cleaned and updated successfully.');
    }
  } catch (error) {
    console.error('Failed to update lyrics:', error);
  } finally {
    if (em) {
      em.getConnection().close();
    }
  }
}
