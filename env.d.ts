/// <reference types="vite/client" />

declare module '@sqlite.org/sqlite-wasm'

declare module 'vuetify/lib/util/colors' {
  let blue: {
    base: string
    darken2: string
    darken3: string
    lighten1: string
  }
  let red: {
    base: string
    darken2: string
    darken3: string
    lighten1: string
  }
}

declare const APP_VERSION: string

interface FileSystemDirectoryHandle {
  keys: () => { [Symbol.asyncIterator](): AsyncIterator<string> }
}
