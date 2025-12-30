import { computed } from "vue";
import api from "@/api";
import { defineStore } from "pinia";
import { useBaseModelStore } from "./base";

export const useCodecConversionsStore = defineStore("codec-conversions", () => {
  const {
    items: codecConversions,
    startLoading,
    index,
    create,
    update,
    destroy,
  } = useBaseModelStore(
    api.codec_conversions,
    "codecConversions.codecConversions",
    "codec_conversion",
  );

  const allCodecConversions = computed(() =>
    Object.values(codecConversions.value).sort((cc1, cc2) => cc1.id - cc2.id),
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
