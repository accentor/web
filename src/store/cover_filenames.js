import { computed } from "vue";
import { defineStore } from "pinia";
import api from "@/api";
import {
  create as baseCreate,
  destroy as baseDestroy,
  index as baseIndex,
  useBaseModelStore,
} from "@/store/base";
import { useAuthStore } from "@/store/auth";
import { useErrorsStore } from "@/store/errors";

export const useCoverFilenamesStore = defineStore("cover-filenames", () => {
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();

  const {
    items: coverFilenames,
    addItems,
    removeItem,
    removeOld,
    restored,
    setItem,
    setStartLoading,
  } = useBaseModelStore("coverFilenames.coverFilenames");

  const allCoverFilenames = computed(() =>
    Object.values(coverFilenames.value).sort((cf1, cf2) => cf1.id - cf2.id),
  );

  const index = baseIndex(
    api.cover_filenames,
    authStore,
    errorsStore,
    restored,
    addItems,
    setStartLoading,
    removeOld,
  );
  const create = baseCreate(
    api.cover_filenames,
    authStore,
    errorsStore,
    "cover_filename",
    setItem,
  );
  const destroy = baseDestroy(
    api.cover_filenames,
    authStore,
    errorsStore,
    removeItem,
  );

  return {
    coverFilenames,
    allCoverFilenames,
    index,
    create,
    destroy,
  };
});
