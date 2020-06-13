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
      const oldCodecs = { ...state.codecs };
      state.codecs = {};
      for (let id in oldCodecs) {
        state.codecs[id] = oldCodecs[id];
      }
      for (let obj of payload) {
        state.codecs[obj.id] = obj;
      }
    },
    setCodec(state, { id, codec }) {
      const oldCodecs = { ...state.codecs };
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
      const oldCodecs = { ...state.codecs };
      state.codecs = {};
      for (let id in oldCodecs) {
        if (oldCodecs[id].loaded > state.startLoading) {
          state.codecs[id] = oldCodecs[id];
        }
      }
    },
  },
  actions: {
    index({ commit, rootState }) {
      const generator = index(rootState.auth);
      return fetchAll(commit, generator, "setCodecs")
        .then(() => {
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    create({ commit, rootState }, newCodec) {
      return create(rootState.auth, newCodec)
        .then((result) => {
          commit("setCodec", { id: result.id, codec: result });
          return Promise.resolve(result.id);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    update({ commit, rootState }, { id, newCodec }) {
      return update(rootState.auth, id, newCodec)
        .then((result) => {
          commit("setCodec", { id, codec: result });
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    destroy({ commit, rootState }, id) {
      return destroy(rootState.auth, id)
        .then(() => {
          commit("removeCodec", id);
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
  },
  getters: {
    codecs: (state) =>
      Object.values(state.codecs).sort((c1, c2) => c1.id - c2.id),
  },
};
