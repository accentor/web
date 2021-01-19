import VuexPersistence from "vuex-persist";
import localforage from "localforage";

const localStorageModules = [
  "auth",
  "codecConversions",
  "codecs",
  "coverFilenames",
  "imageTypes",
  "locations",
  "rescan",
  "users",
  "userSettings",
];
const localForageModules = ["albums", "artists", "genres", "labels"];

export const vuexLocalForage = new VuexPersistence({
  storage: localforage,
  asyncStorage: true,
  strictMode: process.env.NODE_ENV !== "production",
  modules: localForageModules,
  filter: (m) =>
    localForageModules.includes(m.type.substring(0, m.type.indexOf("/"))),
});

export const vuexLocalStorage = new VuexPersistence({
  storage: window.localStorage,
  strictMode: process.env.NODE_ENV !== "production",
  modules: localStorageModules,
  filter: (m) =>
    localStorageModules.includes(m.type.substring(0, m.type.indexOf("/"))),
});