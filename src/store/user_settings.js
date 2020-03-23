export default {
  namespaced: true,
  state: {
    locale: null,
  },
  mutations: {
    setLocale(state, payload) {
      state.locale = payload.locale;
    },
  },
};
