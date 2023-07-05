import { SongData } from '../../types';

import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Song {
  @PrimaryKey({ type: 'uuid', default: 'uuid', length: 36 })
  _id!: string;

  @Property({ length: 255 })
  name!: string;

  @Property({ length: 255 })
  artist!: string;

  @Property({ length: 15000 })
  lyrics!: string;

  constructor(song: SongData) {
    const { name, artist, lyrics } = song;
    this.name = name;
    this.artist = artist;
    this.lyrics = lyrics;
  }
}
