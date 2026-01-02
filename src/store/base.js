import { ref, markRaw, computed } from "vue";
import { useStorageAsync } from "@vueuse/core";
import localForage from "localforage";
import { fetchAll } from "./actions";

const RawObjectSerializer = {
  write: async (value) => value,
  read: async (value) => markRaw(value),
};

export function useBaseModelStore(localStorageKey) {
  const { promise: restored, resolve: resolveRestored } =
    Promise.withResolvers();

  const _items = useStorageAsync(localStorageKey, {}, localForage, {
    serializer: RawObjectSerializer,
    onReady: resolveRestored,
  });
  const items = computed(() => _items.value);
  const startLoading = ref(new Date(0));

  function addItems(payload) {
    const newItems = {};
    for (let id in _items.value) {
      newItems[id] = _items.value[id];
    }
    const loaded = new Date();
    for (let obj of payload) {
      obj.loaded = loaded;
      newItems[obj.id] = obj;
    }
    _items.value = markRaw(newItems);
  }

  function setItems(payload) {
    _items.value = markRaw(payload);
  }

  function setItem(id, item) {
    const newItems = {};
    for (let id in _items.value) {
      newItems[id] = _items.value[id];
    }
    item.loaded = new Date();
    newItems[id] = item;
    _items.value = markRaw(newItems);
  }

  function setStartLoading() {
    startLoading.value = new Date();
  }

  function removeItem(id) {
    const newItems = {};
    for (let itemId in _items.value) {
      if (`${itemId}` !== `${id}`) {
        newItems[itemId] = _items.value[itemId];
      }
    }
    _items.value = markRaw(newItems);
  }

  function removeOld() {
    const newItems = {};
    for (let id in _items.value) {
      if (_items.value[id].loaded > startLoading.value) {
        newItems[id] = _items.value[id];
      }
    }
    _items.value = markRaw(newItems);
  }

  return {
    items,
    addItems,
    removeItem,
    removeOld,
    restored,
    setItem,
    setItems,
    startLoading,
    setStartLoading,
  };
}

export function index(
  apiModule,
  authStore,
  errorsStore,
  restored,
  addItems,
  setStartLoading,
  removeOld,
  baseScope,
) {
  return async function (scope = baseScope) {
    const generator = apiModule.index(authStore.apiToken, scope);
    try {
      await restored;
      await fetchAll(generator, addItems, setStartLoading, removeOld, scope);
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  };
}

export function create(apiModule, authStore, errorsStore, crudKey, setItem) {
  return async function (newItem) {
    try {
      const result = await apiModule.create(authStore.apiToken, {
        [crudKey]: newItem,
      });
      setItem(result.id, result);
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  };
}

export function read(apiModule, authStore, errorsStore, restored, setItem) {
  return async function (id) {
    try {
      const result = await apiModule.read(authStore.apiToken, id);
      await restored;
      setItem(id, result);
      return result.id;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  };
}

export function update(apiModule, authStore, errorsStore, crudKey, setItem) {
  return async function (id, updatedItem) {
    try {
      const result = await apiModule.update(authStore.apiToken, id, {
        [crudKey]: updatedItem,
      });
      setItem(id, result);
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  };
}

export function destroy(
  apiModule,
  authStore,
  errorsStore,
  removeItem,
  extraDestroyOperations = undefined,
) {
  return async function (id) {
    try {
      await apiModule.destroy(authStore.apiToken, id);
      extraDestroyOperations?.(id);
      removeItem(id);
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  };
}

export function destroyEmpty(apiModule, authStore, errorsStore, index) {
  return async function () {
    try {
      await apiModule.destroyEmpty(authStore.apiToken);
      await index();
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  };
}

export function merge(
  apiModule,
  authStore,
  errorsStore,
  removeItem,
  extraMergeOperations = undefined,
) {
  return async function (newId, oldId) {
    try {
      await apiModule.merge(authStore.apiToken, newId, oldId);
      extraMergeOperations?.(newId, oldId);
      removeItem(oldId);
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  };
}
