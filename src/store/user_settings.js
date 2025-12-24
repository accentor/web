import { useCodecConversionsStore } from "./codec_conversions";

export default {
  namespaced: true,
  state: {
    locale: "en",
    codecConversionID: null,
  },
  mutations: {
    setSettings(state, payload) {
      state.locale = payload.locale;
      state.codecConversionID = payload.codecConversionID;
    },
  },
  getters: {
    codecConversion: (state) =>
      useCodecConversionsStore().codecConversions[state.codecConversionID],
  },
};
