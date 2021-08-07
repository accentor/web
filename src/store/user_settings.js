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
    codecConversion: (state, getters, rootState) => {
      return rootState.codecConversions.codecConversions[
        state.codecConversionID
      ];
    },
  },
};
