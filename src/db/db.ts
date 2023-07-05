import { MongoClient } from 'mongodb';
import { SongData } from '../../types/index';
import { Song } from '../entities/Song';

import { MikroORM, EntityManager } from '@mikro-orm/core';
import { MongoDriver } from '@mikro-orm/mongodb';

const mongoURL = 'mongodb://localhost:27017'; 
const dbName = 'rhyme-time'; 
const uri = 'mongodb://localhost:27017'; 
let db: any;
let orm: MikroORM;

export async function initializeORM(): Promise<MikroORM> {
  const dbName = 'rhyme-time';
  orm = await MikroORM.init<MongoDriver>({
    dbName,
    clientUrl: 'mongodb://localhost:27017',
    entities: [Song],
    debug: true,
    driver: MongoDriver,
  });

  return orm;
}

export function getOrmInstance(): MikroORM {
  return orm;
}

export async function connectDb(): Promise<void> {
  try {
    const orm = await initializeORM();
    await orm.connect();
    console.log('Connected to the database');
  } catch (error) {
    throw new Error('Failed to connect to the database');
  }
}
