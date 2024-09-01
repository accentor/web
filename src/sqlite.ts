import SqliteClient from './db/client'
import UserDao from './db/user_dao'
import TrackDao from './db/track_dao'
import type { App } from 'vue'

export interface DaoCollection {
  users: UserDao
  tracks: TrackDao
  killAllFiles: () => Promise<void>
}

interface Options {
  file: string
}

export default {
  install: (app: App, options: Options) => {
    const client = new SqliteClient(options.file, [
      'CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR, permission VARCHAR);',
      'CREATE TABLE tracks (id INT PRIMARY KEY, title VARCHAR, normalized_title VARCHAR, number INT, album_id INT, review_comment VARCHAR, created_at VARCHAR, updated_at VARCHAR, codec_id INT, length INT, bitrate INT, location_id INT, audio_file_id INT, filename VARCHAR, sample_rate INT, bit_depth INT);',
      'CREATE TABLE track_genres (track_id INT, genre_id INT);',
      'CREATE TABLE track_artists (track_id INT, artist_id INT, name VARCHAR, role VARCHAR, `order` INT, hidden INT);'
    ])
    const daos: DaoCollection = {
      users: new UserDao(client),
      tracks: new TrackDao(client),
      killAllFiles: async () => {
        await client.killAllFiles()
      }
    }
    app.provide('db', daos)
  }
}
