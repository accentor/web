import { computed, type ComputedRef, markRaw, type Ref, ref } from "vue";
import { useStorageAsync } from "@vueuse/core";
import localForage from "localforage";
import type { AuthStore } from "@/store/auth";
import type { ApiToken, Scope, UpdateParams } from "@accentor/api-client-js";
import type { ApiError, ErrorsStore } from "@/store/errors";

// The types here are not correct, but useStorageAsync wants us to convert to a string,
// which we don't actually want to do, since indexeddb can just store the objects.
const RawObjectSerializer = {
  write: <T>(value: T): Promise<string> => Promise.resolve(value as string),
  read: <T extends object>(value: string): Promise<T> =>
    Promise.resolve(markRaw(value as unknown as T)),
};

export type Loaded<T> = T & { loaded: Date };
export type ModelItemsType<T> = Record<string, Loaded<T>>;

export function useBaseModelStore<T extends { id: number }>(
  localStorageKey: string,
): {
  items: ComputedRef<ModelItemsType<T>>;
  startLoading: Ref<Date>;
  addItems: (items: T[]) => void;
  setItems: (items: ModelItemsType<T>) => void;
  setItem: (id: number, item: T) => void;
  setStartLoading: () => void;
  removeItem: (id: number) => void;
  removeOld: () => void;
  restored: Promise<unknown>;
} {
  const { promise: restored, resolve: resolveRestored } =
    Promise.withResolvers();

  const _items: Ref<ModelItemsType<T>> = useStorageAsync<ModelItemsType<T>>(
    localStorageKey,
    {},
    {
      getItem: async (key: string) => await localForage.getItem(key),
      setItem: async (key: string, value: string) => {
        await localForage.setItem(key, value);
      },
      removeItem: async (key: string) => {
        await localForage.removeItem(key);
      },
    },
    {
      serializer: RawObjectSerializer,
      onReady: resolveRestored,
    },
  );
  const items = computed(() => _items.value);
  const startLoading: Ref<Date> = ref(new Date(0));

  function addItems(payload: T[]): void {
    const newItems: ModelItemsType<T> = {};
    for (const id in _items.value) {
      newItems[id] = _items.value[id]!;
    }
    const loaded = new Date();
    for (const obj of payload) {
      newItems[`${obj.id}`] = { loaded, ...obj };
    }
    _items.value = markRaw(newItems);
  }

  function setItems(payload: ModelItemsType<T>): void {
    _items.value = markRaw(payload);
  }

  function setItem(id: number, item: T): void {
    const newItems: ModelItemsType<T> = {};
    for (const id in _items.value) {
      newItems[id] = _items.value[id]!;
    }
    newItems[`${id}`] = { loaded: new Date(), ...item };
    _items.value = markRaw(newItems);
  }

  function setStartLoading(): void {
    startLoading.value = new Date();
  }

  function removeItem(id: number): void {
    const newItems: ModelItemsType<T> = {};
    for (const itemId in _items.value) {
      if (`${itemId}` !== `${id}`) {
        newItems[itemId] = _items.value[itemId]!;
      }
    }
    _items.value = markRaw(newItems);
  }

  function removeOld(): void {
    const newItems: ModelItemsType<T> = {};
    for (const id in _items.value) {
      if (_items.value[id]!.loaded > startLoading.value) {
        newItems[id] = _items.value[id]!;
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

export async function fetchAll<T>(
  generator: AsyncGenerator<T[], T[], void>,
  add: (items: T[]) => void,
  setStartLoading: () => void,
  removeOld: () => void,
  scope?: Scope,
): Promise<void> {
  if (!scope || scope.scopes.length === 0) {
    setStartLoading();
  }
  let done: boolean | undefined = false;
  let results = [];
  let counter = 0;
  while (!done) {
    let value = [];
    ({ value, done } = await generator.next());
    results.push(...value);
    if (++counter % 5 === 0) {
      add(results);
      results = [];
    }
  }
  add(results);
  if (!scope || scope.scopes.length === 0) {
    removeOld();
  }
}

export function index<T, TScope extends Scope | never>(
  apiModule: {
    index: (
      apiToken: ApiToken,
      scope?: TScope,
    ) => AsyncGenerator<T[], T[], void>;
  },
  authStore: AuthStore,
  errorsStore: ErrorsStore,
  restored: Promise<unknown>,
  addItems: (items: T[]) => void,
  setStartLoading: () => void,
  removeOld: () => void,
  baseScope?: TScope,
): (scope?: TScope) => Promise<boolean> {
  return async function (scope = baseScope) {
    const generator = apiModule.index(authStore.apiToken!, scope);
    try {
      await restored;
      await fetchAll(generator, addItems, setStartLoading, removeOld, scope);
      return true;
    } catch (error) {
      errorsStore.addError(error as ApiError);
      return false;
    }
  };
}

export function create<T extends { id: number }, TParams, TFullParams>(
  apiModule: {
    create: (apiToken: ApiToken, params: TFullParams) => Promise<T>;
  },
  authStore: AuthStore,
  errorsStore: ErrorsStore,
  setItem: (id: number, item: T) => void,
  wrap: (newItem: TParams) => TFullParams,
) {
  return async function (newItem: TParams): Promise<number | false> {
    try {
      const result = await apiModule.create(authStore.apiToken!, wrap(newItem));
      setItem(result.id, result);
      return result.id;
    } catch (error) {
      errorsStore.addError(error as ApiError);
      return false;
    }
  };
}

export function read<T>(
  apiModule: { read: (apiToken: ApiToken, id: number) => Promise<T> },
  authStore: AuthStore,
  errorsStore: ErrorsStore,
  restored: Promise<unknown>,
  setItem: (id: number, item: T) => void,
) {
  return async function (id: number): Promise<boolean> {
    try {
      const result = await apiModule.read(authStore.apiToken!, id);
      await restored;
      setItem(id, result);
      return true;
    } catch (error) {
      errorsStore.addError(error as ApiError);
      return false;
    }
  };
}

export function update<T, TParams, TFullParams>(
  apiModule: {
    update: (
      apiToken: ApiToken,
      id: number,
      params: UpdateParams<TFullParams>,
    ) => Promise<T>;
  },
  authStore: AuthStore,
  errorsStore: ErrorsStore,
  setItem: (id: number, item: T) => void,
  wrap: (newItem: Partial<TParams>) => UpdateParams<TFullParams>,
) {
  return async function (
    id: number,
    updatedItem: Partial<TParams>,
  ): Promise<boolean> {
    try {
      const result = await apiModule.update(
        authStore.apiToken!,
        id,
        wrap(updatedItem),
      );
      setItem(id, result);
      return true;
    } catch (error) {
      errorsStore.addError(error as ApiError);
      return false;
    }
  };
}

export function destroy(
  apiModule: { destroy: (apiToken: ApiToken, id: number) => Promise<boolean> },
  authStore: AuthStore,
  errorsStore: ErrorsStore,
  removeItem: (id: number) => void,
  extraDestroyOperations?: (id: number) => void,
) {
  return async function (id: number): Promise<boolean> {
    try {
      await apiModule.destroy(authStore.apiToken!, id);
      extraDestroyOperations?.(id);
      removeItem(id);
      return true;
    } catch (error) {
      errorsStore.addError(error as ApiError);
      return false;
    }
  };
}

export function destroyEmpty(
  apiModule: { destroyEmpty: (apiToken: ApiToken) => Promise<boolean> },
  authStore: AuthStore,
  errorsStore: ErrorsStore,
  index: () => Promise<boolean>,
) {
  return async function (): Promise<boolean> {
    try {
      await apiModule.destroyEmpty(authStore.apiToken!);
      await index();
      return true;
    } catch (error) {
      errorsStore.addError(error as ApiError);
      return false;
    }
  };
}

export function merge<T>(
  apiModule: {
    merge: (apiToken: ApiToken, newId: number, oldId: number) => Promise<T>;
  },
  read: (id: number) => Promise<boolean>,
  authStore: AuthStore,
  errorsStore: ErrorsStore,
  removeItem: (id: number) => void,
  extraMergeOperations?: (newId: number, oldId: number) => void,
) {
  return async function (newId: number, oldId: number): Promise<boolean> {
    try {
      await apiModule.merge(authStore.apiToken!, newId, oldId);
      await read(newId);
      extraMergeOperations?.(newId, oldId);
      removeItem(oldId);
      return true;
    } catch (error) {
      errorsStore.addError(error as ApiError);
      return false;
    }
  };
}
