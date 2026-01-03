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
import type {
  CodecConversion,
  CodecConversionParams,
} from "@accentor/api-client-js";

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
  } = useBaseModelStore<CodecConversion>("codecConversions.codecConversions");

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
  const create = baseCreate<
    CodecConversion,
    CodecConversionParams["codec_conversion"],
    CodecConversionParams
  >(api.codec_conversions, authStore, errorsStore, setItem, (val) => ({
    codec_conversion: val,
  }));
  const update = baseUpdate<
    CodecConversion,
    CodecConversionParams["codec_conversion"],
    CodecConversionParams
  >(api.codec_conversions, authStore, errorsStore, setItem, (val) => ({
    codec_conversion: val,
  }));
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
