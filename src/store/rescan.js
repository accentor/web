import api from "@/api";
import { fetchAll } from "./actions";

export default {
  namespaced: true,
  state: {
    rescans: {},
    lastClick: new Date(0),
    loading: false,
  },
  mutations: {
    setRescans(state, payload) {
      const oldRescans = state.rescans;
      state.rescans = {};
      for (let id in oldRescans) {
        state.rescans[id] = oldRescans[id];
      }
      const loaded = new Date();
      for (let rescan of payload) {
        rescan.loaded = loaded;
        state.rescans[rescan.id] = rescan;
      }
    },
    setRescan(state, { id, rescan }) {
      const oldRescans = state.rescans;
      state.rescans = {};
      for (let id in oldRescans) {
        state.rescans[id] = oldRescans[id];
      }
      rescan.loaded = new Date();
      state.rescans[id] = rescan;
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeOld(state) {
      const oldRescans = state.rescans;
      state.rescans = {};
      for (let id in oldRescans) {
        if (oldRescans[id].loaded > state.startLoading) {
          state.rescans[id] = oldRescans[id];
        }
      }
    },
    setLastClick(state, payload) {
      state.lastClick = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
  },
  actions: {
    async index({ commit, rootState, getters }) {
      if (rootState.rescan.loading) {
        return true;
      }
      try {
        commit("setLoading", true);
        do {
          const generator = api.rescans.index(rootState.auth.apiToken);
          await fetchAll(commit, generator, "setRescans");
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } while (
          rootState.rescan.lastClick > new Date(getters.finishedAt) ||
          getters.running
        );
        commit("setLoading", false);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async show({ commit, rootState }, id) {
      if (rootState.rescan.loading) {
        return true;
      }
      try {
        commit("setLoading", true);
        let result = null;
        do {
          result = await api.rescans.show(rootState.auth.apiToken, id);
          commit("setRescan", { id, rescan: result });
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
    async startAll({ commit, dispatch, rootState }) {
      commit("setLastClick", new Date());
      try {
        await api.rescans.startAll(rootState.auth.apiToken);
        setTimeout(() => dispatch("index"), 2500);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async start({ commit, dispatch, rootState }, id) {
      commit("setLastClick", new Date());
      try {
        const result = await api.rescans.start(rootState.auth.apiToken, id);
        result.running = true;
        commit("setRescan", { id, rescan: result });
        setTimeout(() => dispatch("show", id), 1000);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
  },
  getters: {
    rescans: (state) => Object.values(state.rescans),
    running: (state, getters) => getters.rescans.some((r) => r.running),
    combinedRescans: (state, getters) =>
      getters.rescans.reduce(
        (acc, rescan) => {
          acc.finished_at =
            acc.finished_at < new Date(rescan.finished_at)
              ? new Date(rescan.finished_at)
              : acc.finished_at;
          acc.processed += rescan.processed;
          acc.error_text += rescan.error_text;
          acc.warning_text += rescan.warning_text;
          return acc;
        },
        {
          running: false,
          finished_at: 0,
          processed: 0,
          error_text: "",
          warning_text: "",
        },
      ),
    finishedAt: (state, getters) =>
      getters.rescans.reduce((acc, rescan) => {
        return acc < new Date(rescan.finished_at)
          ? new Date(rescan.finished_at)
          : acc;
      }, null),
  },
};
