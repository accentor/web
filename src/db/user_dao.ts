import type SqliteClient from '@/db/client'
import api from '@/api'
import { useAuthStore } from '@/stores/auth'
import type { UnwrapNestedRefs } from 'vue'

export default class UserDao {
  client: SqliteClient
  authStore: UnwrapNestedRefs<{ secret: string | null; deviceId: string | null }>

  constructor(client: SqliteClient) {
    this.client = client
    this.authStore = useAuthStore()
  }

  async refresh() {
    let done = false
    const generator = api.users.index({
      secret: this.authStore.secret!,
      device_id: this.authStore.deviceId!
    })
    while (!done) {
      const obj = await generator.next()
      for (const row of obj.value) {
        // TODO(chvp): Delete old obsolete values
        await this.client.executeMutation(
          'users',
          'INSERT INTO users VALUES (?1, ?2, ?3) ON CONFLICT(id) DO UPDATE SET name=?2, permission=?3;',
          row.id,
          row.name,
          row.permission
        )
      }
      done = obj.done!
    }
  }

  getAll() {
    return this.client.executeSelect(['users'], 'SELECT * FROM users;')
  }
}
