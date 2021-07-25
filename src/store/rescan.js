import api from "@/api";

export default {
  namespaced: true,
  state: {
    rescan: null,
    lastClick: new Date(0),
    loading: false,
  },
  mutations: {
    setLastClick(state, payload) {
      state.lastClick = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setRescan(state, payload) {
      state.rescan = payload;
    },
  },
  actions: {
    async show({ commit, rootState }) {
      if (rootState.rescan.loading) {
        return true;
      }
      try {
        commit("setLoading", true);
        let result = null;
        do {
          result = await api.rescan.show(rootState.auth);
          commit("setRescan", result);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } while (
          rootState.rescan.lastClick > new Date(result.finished_at) ||
          result.running
        );
        commit("setLoading", false);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        commit("setLoading", false);
        return false;
      }
    },
    async start({ commit, dispatch, rootState }) {
      commit("setLastClick", new Date());
      try {
        const result = await api.rescan.start(rootState.auth);
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
