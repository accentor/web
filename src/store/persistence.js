import VuexPersistence from "vuex-persist";
import localForage from "localforage";
import debounce from "lodash.debounce";

// A subclass for VuexPersintence to deal with single namespaced modules and large collections
// Should be provided with a module and an async storage
// IMPORTANT: This class assumes a lot about the structure of state and mutations available in each module
// If this structure changes, we inevitably have to update this class
class VuexPersistentModule extends VuexPersistence {
  constructor(module, storage) {
    // Write startLoading and the main collection (as an array) to storage
    async function saveModule(module, state, storage) {
      const modifiedState = {
        startLoading: state[module].startLoading,
      };
      modifiedState[module] = Object.values(state[module][module]);
      await storage.setItem(module, modifiedState);
    }

    // Set all options in parent class
    super({
      storage,
      asyncStorage: true,
      modules: [module],
      key: module,
      filter: (m) => m.type.substring(0, m.type.indexOf("/")) === module,
      saveState: debounce(saveModule, 60000),
    });

    // Get item from an async storage and commit them back to the store
    this.replaceState = async (module, storage, store) => {
      const savedState = await storage.getItem(module);
      if (savedState) {
        if (savedState.startLoading) {
          store.commit(`${module}/setStartLoading`, savedState.startLoading);
        }
        if (savedState[module]) {
          store.commit(
            `${module}/set${module.charAt(0).toUpperCase() + module.slice(1)}`,
            savedState[module]
          );
        }
      }
    };

    // Overwrite plugin to use replaceState and set a custom restored prop for each module
    this.plugin = (store) => {
      store[`${module}Restored`] = this.replaceState(
        this.key,
        this.storage,
        store
      ).then(() => {
        // The subscriber is the same as in VuexPersistence, but we have to add it ourselves since we overwrite the plugin method
        this.subscriber(store)((mutation, state) => {
          if (this.filter(mutation)) {
            this._mutex.enqueue(
              this.saveState(this.key, this.reducer(state), this.storage)
            );
          }
        });
        this.subscribed = true;
      });
    };
  }
}

const plugins = [
  "albums",
  "artists",
  "genres",
  "labels",
  "plays",
  "tracks",
].map((module) => {
  const plugin = new VuexPersistentModule(module, localForage);
  return plugin.plugin;
});

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

export const vuexLocalStorage = new VuexPersistence({
  storage: window.localStorage,
  strictMode: process.env.NODE_ENV !== "production",
  modules: localStorageModules,
  filter: (m) =>
    localStorageModules.includes(m.type.substring(0, m.type.indexOf("/"))),
});

plugins.push(vuexLocalStorage.plugin);

export default plugins;
