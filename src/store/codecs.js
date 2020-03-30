import Vue from "vue";
import { create, destroy, update } from "../api/codecs";
import { index } from "./commit";

export default {
  namespaced: true,
  state: {
    codecs: {},
  },
  mutations: {
    setCodecs(state, payload) {
      const loaded = new Date();
      for (let codec in payload) {
        payload[codec].loaded = loaded;
      }
      state.codecs = Object.assign({}, state.codecs, payload);
    },
    setCodec(state, { id, codec }) {
      codec.loaded = new Date();
      Vue.set(state.codecs, id, codec);
    },
    removeCodec(state, id) {
      Vue.delete(state.codecs, id);
    },
  },
  actions: {
    index({ commit, rootState }) {
      return index(
        { commit, auth: rootState.auth },
        { url: "codecs", commitAction: "setCodecs" }
      )
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
