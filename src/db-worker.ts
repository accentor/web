import * as Comlink from 'comlink'
import sqlite3InitModule from '@sqlite.org/sqlite-wasm'

const log = (...args: any[]) => console.log(...args)
const error = (...args: any[]) => console.error(...args)

class SqliteWorker {
  db: any
  dbFile: string | undefined

  init(dbFile: string) {
    this.dbFile = dbFile
    return sqlite3InitModule({
      print: log,
      printErr: error
    }).then((sqlite3: any) => {
      this.db = new sqlite3.oo1.OpfsDb(dbFile)
    })
  }

  async killAllFiles() {
    const handle = await navigator.storage.getDirectory()
    for await (const key of handle.keys()) {
      handle.removeEntry(key, { recursive: true })
    }
  }

  executeSql(sqlStatement: string, bindParameters: any[]) {
    return this.db.exec({
      sql: sqlStatement,
      bind: bindParameters,
      returnValue: 'resultRows',
      rowMode: 'object'
    })
  }

  executeSqlNoResult(sqlStatement: string, bindParameters: any[]) {
    this.db.exec({
      sql: sqlStatement,
      bind: bindParameters,
      // TODO(chvp): We don't use any return value, check possible values
      returnValue: 'resultRows',
      rowMode: 'object'
    })
  }
}

Comlink.expose(SqliteWorker)
