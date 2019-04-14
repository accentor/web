import { show, start } from "../api/rescan";

export default {
  namespaced: true,
  state: {
    rescan: null
  },
  mutations: {
    setRescan(state, payload) {
      state.rescan = payload;
    }
  },
  actions: {
    show({ commit, dispatch, rootState }) {
      return show(rootState.auth)
        .then(result => {
          commit("setRescan", result);
          if (result.running) {
            setTimeout(dispatch("show"), 1000);
          }
          return Promise.resolve(true);
        })
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    start({ commit, dispatch, rootState }) {
      return start(rootState.auth)
        .then(result => {
          result.running = true;
          commit("setRescan", result);
          setTimeout(dispatch("show"), 2000);
          return Promise.resolve(true);
        })
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    }
  }
};
