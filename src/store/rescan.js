import { show, start } from "../api/rescan";

export default {
  namespaced: true,
  state: {
    rescan: null,
    lastClick: new Date(0),
  },
  mutations: {
    setLastClick(state, payload) {
      state.lastClick = payload;
    },
    setRescan(state, payload) {
      state.rescan = payload;
    },
  },
  actions: {
    async show({ commit, dispatch, rootState }) {
      try {
        const result = await show(rootState.auth);
        commit("setRescan", result);
        if (
          rootState.rescan.lastClick > new Date(result.finished_at) ||
          result.running
        ) {
          setTimeout(() => dispatch("show"), 1000);
        }
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async start({ commit, dispatch, rootState }) {
      commit("setLastClick", new Date());
      try {
        const result = await start(rootState.auth);
        result.running = true;
        commit("setRescan", result);
        setTimeout(() => dispatch("show"), 1000);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
  },
  getters: {
    finishedAt: (state) => state.rescan?.finished_at,
  },
};
