import * as Comlink from 'comlink'
import { ref, unref, isRef, isProxy, shallowRef, shallowReadonly, watch } from 'vue'
import type { Ref, ShallowRef } from 'vue'

export default class SqliteClient {
  sqliteWorker: Promise<any>

  listenersForTable: Map<string, Ref<number>> = new Map()

  constructor(dbFile: string, migrations: string[]) {
    const DbWorker: any = Comlink.wrap(
      new Worker(new URL('./worker/index.ts', import.meta.url), { type: 'module' })
    )
    this.sqliteWorker = new DbWorker().then((worker: any) =>
      worker.init(dbFile).then(async () => {
        await worker.executeSqlNoResult(
          'CREATE TABLE IF NOT EXISTS migrations (text VARCHAR PRIMARY KEY);'
        )
        for (const m of migrations) {
          const migrationResult = await worker.executeSql(
            'SELECT * FROM migrations WHERE text = ?;',
            m
          )
          if (migrationResult.length == 0) {
            await worker.executeSqlNoResult(m)
            await worker.executeSqlNoResult('INSERT INTO migrations VALUES (?)', m)
          }
        }
        return worker
      })
    )
  }

  async killAllFiles() {
    return this.sqliteWorker.then((worker) => worker.killAllFiles())
  }

  getRefsForTables(tables: string[]): Ref<number>[] {
    return tables.map((name) => {
      if (!this.listenersForTable.has(name)) {
        this.listenersForTable.set(name, ref(0))
      }
      return this.listenersForTable.get(name)!
    })
  }

  executeTransformedSelect(
    tables: string[],
    sqlStatement: string,
    transformer: (arg: any[]) => any,
    ...bindParameters: any[]
  ) {
    const rows: ShallowRef<any[]> = shallowRef(transformer([]))
    const weakRowsRef = new WeakRef(rows)
    const stopHandle = watch(
      this.getRefsForTables(tables).concat(bindParameters.filter((e) => isRef(e) || isProxy(e))),
      () => {
        if (weakRowsRef.deref() == undefined) {
          stopHandle()
        }
        this.sqliteWorker
          .then((worker) => worker.executeSql(sqlStatement, bindParameters.map(unref)))
          .then((resultRows) => {
            const rowsRef = weakRowsRef.deref()
            if (rowsRef != undefined) {
              rowsRef.value = transformer(resultRows)
            }
          })
      },
      { immediate: true }
    )
    return shallowReadonly(rows)
  }

  executeSelect(tables: string[], sqlStatement: string, ...bindParameters: any[]) {
    return this.executeTransformedSelect(tables, sqlStatement, (arg) => arg, ...bindParameters)
  }

  async executeMutation(table: string, sqlStatement: string, ...bindParameters: any[]) {
    const worker = await this.sqliteWorker
    await worker.executeSqlNoResult(sqlStatement, bindParameters)
    const tableCounter = this.listenersForTable.get(table)
    if (tableCounter != undefined) {
      tableCounter.value++
    }
  }

  async insertAll(values: any[], table: string, statement: string, extractor: (arg: any) => any[]) {
    const worker = await this.sqliteWorker
    await worker.executeSqlNoResult('BEGIN TRANSACTION;')
    for (const value of values) {
      await worker.executeSqlNoResult(statement, extractor(value))
    }
    await worker.executeSqlNoResult('COMMIT TRANSACTION;')
    const tableCounter = this.listenersForTable.get(table)
    if (tableCounter != undefined) {
      tableCounter.value++
    }
  }
}
