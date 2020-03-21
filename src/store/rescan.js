import { show, start } from "../api/rescan";

export default {
  namespaced: true,
  state: {
    rescan: null,
    lastClick: new Date(0)
  },
  mutations: {
    setLastClick(state, payload) {
      state.lastClick = payload;
    },
    setRescan(state, payload) {
      state.rescan = Object.assign({}, state.rescan, payload);
    }
  },
  actions: {
    show({ commit, dispatch, rootState }) {
      return show(rootState.auth)
        .then(result => {
          commit("setRescan", result);
          if (rootState.rescan.lastClick > new Date(result.finished_at)) {
            setTimeout(() => dispatch("show"), 1000);
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
          result.last_click = new Date();
          commit("setRescan", result);
          commit("setLastClick", new Date());
          setTimeout(() => dispatch("show"), 1000);
          return Promise.resolve(true);
        })
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    }
  },
  getters: {
    finishedAt: state => state.rescan?.finished_at
  }
};
