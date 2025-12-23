import VuexPersister from "vuex-persister";
import localForage from "localforage";
import debounce from "lodash.debounce";

// A subclass for VuexPersistence to deal with single namespaced modules and large collections
// Should be provided with a module and an async storage
// IMPORTANT: This class assumes a lot about the structure of state and mutations available in each module
// If this structure changes, we inevitably have to update this class
class VuexPersistentModule extends VuexPersister {
  constructor(module, storage) {
    const lowerCaseModule = module.toLowerCase();
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
      modules: [lowerCaseModule],
      key: lowerCaseModule,
      filter: (m) =>
        m.type.substring(0, m.type.indexOf("/")) === lowerCaseModule,
      saveState: debounce(saveModule, 60000),
    });

    this.capitilizedModule = module;

    // Get item from an async storage and commit them back to the store
    this.replaceState = async (
      lowerCaseModule,
      capitilizedModule,
      storage,
      store,
    ) => {
      const savedState = await storage.getItem(lowerCaseModule);
      if (savedState) {
        if (savedState.startLoading) {
          store.commit(
            `${lowerCaseModule}/setStartLoading`,
            savedState.startLoading,
          );
        }
        if (savedState[lowerCaseModule]) {
          store.commit(
            `${lowerCaseModule}/set${capitilizedModule}`,
            savedState[lowerCaseModule],
          );
        }
      }
    };

    // Overwrite plugin to use replaceState and set a custom restored prop for each module
    this.plugin = (store) => {
      store[`${this.key}Restored`] = this.replaceState(
        this.key,
        this.capitilizedModule,
        this.storage,
        store,
      ).then(() => {
        // The subscriber is the same as in VuexPersistence, but we have to add it ourselves since we overwrite the plugin method
        this.subscriber(store)((mutation, state) => {
          if (this.filter(mutation)) {
            this._mutex.enqueue(
              this.saveState(this.key, this.reducer(state), this.storage),
            );
          }
        });
        this.subscribed = true;
      });
    };
  }
}

const plugins = [
  "Albums",
  "Artists",
  "Genres",
  "Labels",
  "Plays",
  "Tracks",
].map((module) => {
  const plugin = new VuexPersistentModule(module, localForage);
  return plugin.persist;
});

const localStorageModules = [
  "auth",
  "codecConversions",
  "codecs",
  "coverFilenames",
  "imageTypes",
  "locations",
  "users",
  "userSettings",
];

export const vuexLocalStorage = new VuexPersister({
  storage: window.localStorage,
  strictMode: !import.meta.env.PROD,
  modules: localStorageModules,
  filter: (m) =>
    localStorageModules.includes(m.type.substring(0, m.type.indexOf("/"))),
});

plugins.push(vuexLocalStorage.persist);

export default plugins;
