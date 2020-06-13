import Vue from "vue";
import { index, create, destroy, update } from "../api/codec_conversions";
import { fetchAll } from "./actions";

export default {
  namespaced: true,
  state: {
    codecConversions: {},
    startLoading: new Date(0),
  },
  mutations: {
    setCodecConversions(state, payload) {
      let oldCodecConversions = { ...state.codecConversions };
      state.codecConversions = {};
      for (let id in oldCodecConversions) {
        state.codecConversions[id] = oldCodecConversions[id];
      }
      for (let obj of payload) {
        state.codecConversions[obj.id] = obj;
      }
    },
    setCodecConversion(state, { id, codecConversion }) {
      const oldCodecConversions = { ...state.codecConversions };
      state.codecConversions = {};
      for (let id in oldCodecConversions) {
        state.codecConversions[id] = oldCodecConversions[id];
      }
      codecConversion.loaded = new Date();
      state.codecConversions[id] = codecConversion;
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeCodecConversion(state, id) {
      Vue.delete(state.codecConversions, id);
    },
    removeOld(state) {
      Object.values(state.codecConversions)
        .filter((obj) => {
          return obj.loaded < state.startLoading;
        })
        .forEach((obj) => {
          Vue.delete(state.codecConversions, obj.id);
        });
    },
  },
  actions: {
    index({ commit, rootState }) {
      const generator = index(rootState.auth);
      return fetchAll(commit, generator, "setCodecConversions")
        .then(() => {
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    create({ commit, rootState }, newCodecConversion) {
      return create(rootState.auth, newCodecConversion)
        .then((result) => {
          commit("setCodecConversion", {
            id: result.id,
            codecConversion: result,
          });
          return Promise.resolve(result.id);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    update({ commit, rootState }, { id, newCodecConversion }) {
      return update(rootState.auth, id, newCodecConversion)
        .then((result) => {
          commit("setCodecConversion", { id, codecConversion: result });
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
          commit("removeCodecConversion", id);
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
  },
  getters: {
    codecConversions: (state) =>
      Object.values(state.codecConversions).sort((cc1, cc2) => cc1.id - cc2.id),
  },
};
