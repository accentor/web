import { useCodecConversionsStore } from "./codec_conversions";
import {defineStore} from "pinia";
import {StorageSerializers, useLocalStorage} from "@vueuse/core";
import {computed} from "vue";

export const useUserSettingsStore = defineStore('user-settings', () => {
    const codecConversionsStore = useCodecConversionsStore();

    const _locale = useLocalStorage('userSettings.locale', 'en');
    const locale = computed(() => _locale.value);
    const _codecConversionID = useLocalStorage('userSettings.codecConversionID', null, { serializer: StorageSerializers.object });
    const codecConversionID = computed(() => _codecConversionID.value);
    const codecConversion = computed(() => codecConversionID.value !== null ? codecConversionsStore.codecConversions[codecConversionID.value] : null);

    function setSettings({ locale: newLocale, codecConversionID: newCodecConversionID }) {
        _locale.value = newLocale;
        _codecConversionID.value = newCodecConversionID;
    }

    return {
        locale,
        codecConversionID,
        codecConversion,
        setSettings,
    }
})