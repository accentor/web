export default {
  namespaced: true,
  state: {
    locale: null,
    codecConversion: null,
  },
  mutations: {
    setSettings(state, payload) {
      state.locale = payload.locale;
      state.codecConversion = payload.codecConversion;
    },
  },
};
