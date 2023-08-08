import { computed, toRef, type UnwrapNestedRefs, type Ref } from 'vue'
import type SqliteClient from '@/db/client'
import api from '@/api'
import { useAuthStore } from '@/stores/auth'

export default class TrackDao {
  client: SqliteClient
  authStore: UnwrapNestedRefs<{ secret: string | null; deviceId: string | null }>

  constructor(client: SqliteClient) {
    this.client = client
    this.authStore = useAuthStore()
  }

  async refresh() {
    let done = false
    const generator = api.tracks.index({
      secret: this.authStore.secret!,
      device_id: this.authStore.deviceId!
    })
    while (!done) {
      const obj = await generator.next()
      // TODO(chvp): Delete old obsolete values
      // TODO(chvp): Also insert track_genres and track_artists (in the same transaction, if possible)
      await this.client.insertAll(
        obj.value,
        'tracks',
        'INSERT INTO tracks VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16) ON CONFLICT(id) DO UPDATE SET title=?2, normalized_title=?3, number=?4, album_id=?5, review_comment=?6, created_at=?7, updated_at=?8, codec_id=?9, length=?10, bitrate=?11, location_id=?12, audio_file_id=?13, filename=?14, sample_rate=?15, bit_depth=?16;',
        (row) => [
          row.id,
          row.title,
          row.normalized_title,
          row.number,
          row.album_id,
          row.review_comment,
          row.created_at,
          row.updated_at,
          row.codec_id,
          row.length,
          row.bitrate,
          row.location_id,
          row.audio_file_id,
          row.filename,
          row.sample_rate,
          row.bit_depth
        ]
      )
      done = obj.done!
    }
  }

  getAll() {
    return this.client.executeSelect(['tracks'], 'SELECT * FROM tracks;')
  }

  getPage(num: number | Ref<number>, perPage: number | Ref<number>) {
    const numRef = toRef(num)
    const perPageRef = toRef(perPage)
    return this.client.executeSelect(
      ['tracks'],
      'SELECT * FROM tracks ORDER BY created_at DESC LIMIT ? OFFSET ?;',
      perPageRef,
      computed(() => numRef.value * perPageRef.value)
    )
  }

  getCount() {
    return this.client.executeTransformedSelect(
      ['tracks'],
      'SELECT COUNT(*) AS count FROM tracks;',
      (rows) => (rows.length > 0 ? rows[0].count : 0)
    )
  }
}
