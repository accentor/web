import { computed } from "vue";
import api from "@/api";
import { defineStore } from "pinia";
import {
  create as baseCreate,
  destroy as baseDestroy,
  index as baseIndex,
  update as baseUpdate,
  useBaseModelStore,
} from "./base";
import { useAuthStore } from "@/store/auth";
import { useErrorsStore } from "@/store/errors";
import type { ImageType, ImageTypeParams } from "@accentor/api-client-js";

export const useImageTypesStore = defineStore("image-types", () => {
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();

  const {
    items: imageTypes,
    addItems,
    removeItem,
    removeOld,
    restored,
    setItem,
    setStartLoading,
  } = useBaseModelStore<ImageType>("imageTypes.imageTypes");

  const allImageTypes = computed(() =>
    Object.values(imageTypes.value).sort((i1, i2) => i1.id - i2.id),
  );

  const index = baseIndex(
    api.image_types,
    authStore,
    errorsStore,
    restored,
    addItems,
    setStartLoading,
    removeOld,
  );
  const create = baseCreate<
    ImageType,
    ImageTypeParams["image_type"],
    ImageTypeParams
  >(api.image_types, authStore, errorsStore, setItem, (val) => ({
    image_type: val,
  }));
  const update = baseUpdate<
    ImageType,
    ImageTypeParams["image_type"],
    ImageTypeParams
  >(api.image_types, authStore, errorsStore, setItem, (val) => ({
    image_type: val,
  }));
  const destroy = baseDestroy(
    api.image_types,
    authStore,
    errorsStore,
    removeItem,
  );

  return {
    imageTypes,
    allImageTypes,
    index,
    create,
    update,
    destroy,
    restored,
  };
});
