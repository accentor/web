import { computed } from "vue";
import { defineStore } from "pinia";
import api from "@/api";
import {
  create as baseCreate,
  destroy as baseDestroy,
  index as baseIndex,
  update as baseUpdate,
  useBaseModelStore,
} from "@/store/base";
import { useAuthStore } from "@/store/auth";
import { useErrorsStore } from "@/store/errors";

export const useCodecsStore = defineStore("codecs", () => {
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();

  const {
    items: codecs,
    addItems,
    removeItem,
    removeOld,
    restored,
    setItem,
    setStartLoading,
  } = useBaseModelStore("codecs.codecs");

  const allCodecs = computed(() =>
    Object.values(codecs.value).sort((c1, c2) => c1.id - c2.id),
  );

  const index = baseIndex(
    api.codecs,
    authStore,
    errorsStore,
    restored,
    addItems,
    setStartLoading,
    removeOld,
  );
  const create = baseCreate(
    api.codecs,
    authStore,
    errorsStore,
    "codec",
    setItem,
  );
  const update = baseUpdate(
    api.codecs,
    authStore,
    errorsStore,
    "codec",
    setItem,
  );
  const destroy = baseDestroy(api.codecs, authStore, errorsStore, removeItem);

  return {
    codecs,
    allCodecs,
    index,
    create,
    update,
    destroy,
  };
});
