import { computed } from "vue";
import { defineStore } from "pinia";
import api from "@/api";
import {
  create as baseCreate,
  destroy as baseDestroy,
  index as baseIndex,
  update as baseUpdate,
  useBaseModelStore,
} from "./base";
import { useAuthStore } from "@/store/auth";
import { useErrorsStore } from "@/store/errors";

export const useCodecConversionsStore = defineStore("codec-conversions", () => {
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();

  const {
    items: codecConversions,
    addItems,
    removeItem,
    removeOld,
    restored,
    setItem,
    startLoading,
    setStartLoading,
  } = useBaseModelStore("codecConversions.codecConversions");

  const allCodecConversions = computed(() =>
    Object.values(codecConversions.value).sort((cc1, cc2) => cc1.id - cc2.id),
  );
  const index = baseIndex(
    api.codec_conversions,
    authStore,
    errorsStore,
    restored,
    addItems,
    setStartLoading,
    removeOld,
  );
  const create = baseCreate(
    api.codec_conversions,
    authStore,
    errorsStore,
    setItem,
    (val) => ({ codec_conversion: val }),
  );
  const update = baseUpdate(
    api.codec_conversions,
    authStore,
    errorsStore,
    setItem,
    (val) => ({ codec_conversion: val }),
  );
  const destroy = baseDestroy(
    api.codec_conversions,
    authStore,
    errorsStore,
    removeItem,
  );

  return {
    codecConversions,
    startLoading,
    allCodecConversions,
    index,
    create,
    update,
    destroy,
  };
});
