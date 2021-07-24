import Vue from "vue";
import api from "@/api";
import { fetchAll } from "./actions";

export default {
  namespaced: true,
  state: {
    coverFilenames: {},
    startLoading: new Date(0),
  },
  mutations: {
    setCoverFilenames(state, payload) {
      const oldCoverFilenames = state.coverFilenames;
      state.coverFilenames = {};
      for (let id in oldCoverFilenames) {
        state.coverFilenames[id] = oldCoverFilenames[id];
      }
      for (let obj of payload) {
        state.coverFilenames[obj.id] = obj;
      }
    },
    setCoverFilename(state, { id, coverFilename }) {
      const oldCoverFilenames = state.coverFilenames;
      state.coverFilenames = {};
      for (let id in oldCoverFilenames) {
        state.coverFilenames[id] = oldCoverFilenames[id];
      }
      coverFilename.loaded = new Date();
      state.coverFilenames[id] = coverFilename;
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeCoverFilename(state, id) {
      Vue.delete(state.coverFilenames, id);
    },
    removeOld(state) {
      const oldCoverFilenames = state.coverFilenames;
      state.coverFilenames = {};
      for (let id in oldCoverFilenames) {
        if (oldCoverFilenames[id].loaded > state.startLoading) {
          state.coverFilenames[id] = oldCoverFilenames[id];
        }
      }
    },
  },
  actions: {
    async index({ commit, rootState }) {
      const generator = api.cover_filenames.index(rootState.auth);
      try {
        await fetchAll(commit, generator, "setCoverFilenames");
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async create({ commit, rootState }, newCoverFilename) {
      try {
        const result = await api.cover_filenames.create(rootState.auth, newCoverFilename);
        commit("setCoverFilename", { id: result.id, coverFilename: result });
        return result.id;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async update({ commit, rootState }, { id, newCoverFilename }) {
      try {
        const result = await api.cover_filenames.update(rootState.auth, id, newCoverFilename);
        commit("setCoverFilename", { id, coverFilename: result });
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async destroy({ commit, rootState }, id) {
      try {
        await api.cover_filenames.destroy(rootState.auth, id);
        commit("removeCoverFilename", id);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
  },
  getters: {
    coverFilenames: (state) =>
      Object.values(state.coverFilenames).sort((cf1, cf2) => cf1.id - cf2.id),
  },
};
