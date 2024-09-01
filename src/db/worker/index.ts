import * as Comlink from 'comlink'
import sqlite3InitModule from '@sqlite.org/sqlite-wasm'
import type { Database } from '@sqlite.org/sqlite-wasm'
import { BroadcastChannel, createLeaderElection } from 'broadcast-channel'
import type { LeaderElector } from 'broadcast-channel'

const log = (...args: any[]) => console.log(...args)
const error = (...args: any[]) => console.error(...args)

type DB = typeof Database

interface Request {
  type: 'request'
  id: string
  method: 'executeSql' | 'executeSqlNoResult'
  args: { sqlStatement: string; bindParameters: any[] }
}

interface Response {
  type: 'response'
  id: string
  data: any
}

type Message = Request | Response

function messageHandler(worker: SqliteWorker): (ev: Message) => Promise<void> {
  return async (event: Message) => {
    if (event.type === 'request') {
      if (worker.elector!.isLeader) {
        const callable = worker[event.method]
        const result = await callable.bind(worker)(
          event.args.sqlStatement,
          event.args.bindParameters
        )
        worker.channel!.postMessage({ type: 'response', id: event.id, data: result })
      }
    } else if (worker.awaiting![event.id]) {
      worker.awaiting![event.id](event.data)
      delete worker.awaiting![event.id]
    }
  }
}

class SqliteWorker {
  db?: Promise<DB>
  pool?: any
  channel?: BroadcastChannel<Message>
  elector?: LeaderElector
  awaiting?: Record<string, (data: any) => void>

  async initDb(dbFile: string): Promise<DB> {
    await this.elector!.awaitLeadership()
    const sqlite3 = await sqlite3InitModule({
      print: log,
      printErr: error
    })
    this.pool = await sqlite3.installOpfsSAHPoolVfs()
    return await new this.pool.OpfsSAHPoolDb(dbFile)
  }

  init(dbFile: string): void {
    this.channel = new BroadcastChannel<Message>('sqlite')
    this.elector = createLeaderElection(this.channel)
    this.db = this.initDb(dbFile)
    this.awaiting = {}
    this.channel.onmessage = messageHandler(this)
  }

  async killAllFiles(): Promise<void> {
    (await this.db).close()
    this.pool.removeVfs()
    const handle = await navigator.storage.getDirectory()
    for await (const key of handle.keys()) {
      handle.removeEntry(key, { recursive: true })
    }
  }

  async executeSql<T>(sqlStatement: string, bindParameters: any[]): Promise<T[]> {
    if (this.elector!.isLeader) {
      return (await this.db).exec({
        sql: sqlStatement,
        bind: bindParameters,
        returnValue: 'resultRows',
        rowMode: 'object'
      }) as T[]
    } else {
      const requestId = crypto.randomUUID()
      return new Promise((resolve) => {
        this.awaiting![requestId] = resolve
        this.channel!.postMessage({
          type: 'request',
          id: requestId,
          method: 'executeSql',
          args: { sqlStatement, bindParameters }
        })
      })
    }
  }

  async executeSqlNoResult(sqlStatement: string, bindParameters: any[]): Promise<void> {
    if (this.elector!.isLeader) {
      ;(await this.db).exec({
        sql: sqlStatement,
        bind: bindParameters,
        returnValue: 'resultRows',
        rowMode: 'object'
      })
    } else {
      const requestId = crypto.randomUUID()
      return new Promise((resolve) => {
        this.awaiting![requestId] = resolve
        this.channel!.postMessage({
          type: 'request',
          id: requestId,
          method: 'executeSqlNoResult',
          args: { sqlStatement, bindParameters }
        })
      })
    }
  }
}

Comlink.expose(SqliteWorker)
