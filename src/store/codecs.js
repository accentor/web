import Vue from "vue";
import api from "@/api";
import { fetchAll } from "./actions";
import { useErrorsStore } from "./errors";
import { useAuthStore } from "./auth";

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
      const loaded = new Date();
      for (let obj of payload) {
        obj.loaded = loaded;
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
    async index({ commit }) {
      const generator = api.codecs.index(useAuthStore().apiToken);
      try {
        await fetchAll(commit, generator, "setCodecs");
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async create({ commit }, newCodec) {
      try {
        const result = await api.codecs.create(useAuthStore().apiToken, {
          codec: newCodec,
        });
        commit("setCodec", { id: result.id, codec: result });
        return result.id;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async update({ commit }, { id, newCodec }) {
      try {
        const result = await api.codecs.update(useAuthStore().apiToken, id, {
          codec: newCodec,
        });
        commit("setCodec", { id, codec: result });
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async destroy({ commit }, id) {
      try {
        await api.codecs.destroy(useAuthStore().apiToken, id);
        commit("removeCodec", id);
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
  },
  getters: {
    codecs: (state) =>
      Object.values(state.codecs).sort((c1, c2) => c1.id - c2.id),
  },
};
