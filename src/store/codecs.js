import Vue from "vue";
import { index, create, destroy, update } from "../api/codecs";
import { fetchAll } from "./actions";

export default {
  namespaced: true,
  state: {
    codecs: {},
    startLoading: new Date(0),
  },
  mutations: {
    setCodecs(state, payload) {
      const oldCodecs = state.codecs;
      state.codecs = {};
      for (let id in oldCodecs) {
        state.codecs[id] = oldCodecs[id];
      }
      for (let obj of payload) {
        state.codecs[obj.id] = obj;
      }
    },
    setCodec(state, { id, codec }) {
      const oldCodecs = state.codecs;
      state.codecs = {};
      for (let id in oldCodecs) {
        state.codecs[id] = oldCodecs[id];
      }
      codec.loaded = new Date();
      state.codecs[id] = codec;
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeCodec(state, id) {
      Vue.delete(state.codecs, id);
    },
    removeOld(state) {
      const oldCodecs = state.codecs;
      state.codecs = {};
      for (let id in oldCodecs) {
        if (oldCodecs[id].loaded > state.startLoading) {
          state.codecs[id] = oldCodecs[id];
        }
      }
    },
  },
  actions: {
    async index({ commit, rootState }) {
      const generator = index(rootState.auth);
      try {
        await fetchAll(commit, generator, "setCodecs");
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async create({ commit, rootState }, newCodec) {
      try {
        const result = await create(rootState.auth, newCodec);
        commit("setCodec", { id: result.id, codec: result });
        return result.id;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async update({ commit, rootState }, { id, newCodec }) {
      try {
        const result = await update(rootState.auth, id, newCodec);
        commit("setCodec", { id, codec: result });
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async destroy({ commit, rootState }, id) {
      try {
        await destroy(rootState.auth, id);
        commit("removeCodec", id);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
  },
  getters: {
    codecs: (state) =>
      Object.values(state.codecs).sort((c1, c2) => c1.id - c2.id),
  },
};
