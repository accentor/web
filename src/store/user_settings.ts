import { useCodecConversionsStore } from "./codec_conversions";
import { defineStore } from "pinia";
import { StorageSerializers, useLocalStorage } from "@vueuse/core";
import { computed, type ComputedRef, type Ref } from "vue";
import type { CodecConversion } from "@accentor/api-client-js";

export const useUserSettingsStore = defineStore("user-settings", () => {
  const codecConversionsStore = useCodecConversionsStore();

  const _locale: Ref<string> = useLocalStorage("userSettings.locale", "en");
  const locale = computed(() => _locale.value);
  const _codecConversionID: Ref<number | null> = useLocalStorage(
    "userSettings.codecConversionID",
    null,
    { serializer: StorageSerializers.object },
  );
  const codecConversionID = computed(() => _codecConversionID.value);
  const codecConversion: ComputedRef<CodecConversion | null> = computed(() => {
    if (codecConversionID.value === null) {
      return null;
    }
    return (
      codecConversionsStore.codecConversions[codecConversionID.value] ?? null
    );
  });

  function setSettings({
    locale: newLocale,
    codecConversionID: newCodecConversionID,
  }: {
    locale: "en" | "nl";
    codecConversionID: number | null;
  }): void {
    _locale.value = newLocale;
    _codecConversionID.value = newCodecConversionID;
  }

  return {
    locale,
    codecConversionID,
    codecConversion,
    setSettings,
  };
});
