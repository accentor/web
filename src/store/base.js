import Vue, { ref, markRaw, computed } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { RawObjectSerializer } from "./persistence";
import { useErrorsStore } from "./errors";
import { useAuthStore } from "./auth";
import { fetchAllPinia } from "./actions";

export function useBaseModelStore(
  apiModule,
  localStorageKey,
  crudKey,
  { extraMergeOperations = () => {}, extraDestroyOperations = () => {}, baseScope = null } = {},
) {
  const errorsStore = useErrorsStore();
  const authStore = useAuthStore();

  const _items = useLocalStorage(
    localStorageKey,
    {},
    { serializer: RawObjectSerializer },
  );
  const items = computed(() => _items.value);
  const startLoading = ref(new Date(0));

  function setItems(payload) {
    const newItems = {};
    for (let id in _items.value) {
      newItems[id] = _items.value[id];
    }
    const loaded = new Date();
    for (let obj of payload) {
      obj.loaded = loaded;
      newItems[obj.id] = markRaw(obj);
    }
    _items.value = newItems;
  }

  function setItem(id, item) {
    const newItems = {};
    for (let id in _items.value) {
      newItems[id] = _items.value[id];
    }
    item.loaded = new Date();
    newItems[id] = markRaw(item);
    _items.value = newItems;
  }

  function setStartLoading() {
    startLoading.value = new Date();
  }

  function removeItem(id) {
    Vue.delete(_items.value, id);
  }

  function removeOld() {
    const oldItems = _items.value;
    _items.value = {};
    for (let id in oldItems) {
      if (oldItems[id].loaded > startLoading.value) {
        _items.value[id] = oldItems[id];
      }
    }
  }

  async function index(scope = baseScope) {
    const generator = apiModule.index(authStore.apiToken, scope);
    try {
      await fetchAllPinia(generator, setItems, setStartLoading, removeOld, scope);
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  }

  async function create(newItem) {
    try {
      const result = await apiModule.create(authStore.apiToken, {
        [crudKey]: newItem,
      });
      setItem(result.id, result);
      return result.id;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  }

  async function read(id) {
    try {
      const result = await apiModule.read(authStore.apiToken, id);
      setItem(id, result);
      return result.id;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  }

  async function update(id, updatedItem) {
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
  }

  async function destroy(id) {
    try {
      await apiModule.destroy(authStore.apiToken, id);
      extraDestroyOperations(id);
      removeItem(id);
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  }

  async function destroyEmpty() {
    try {
      await apiModule.destroyEmpty(authStore.apiToken);
      await index();
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  }

  async function merge(newId, oldId) {
    try {
      await apiModule.merge(authStore.apiToken, newId, oldId);
      extraMergeOperations(newId, oldId);
      removeItem(oldId);
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  }

  return {
    items,
    startLoading,
    setItem,
    setItems,
    index,
    create,
    read,
    update,
    destroy,
    destroyEmpty,
    merge,
  };
}
