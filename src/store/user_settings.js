export default {
  namespaced: true,
  state: {
    locale: null,
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
