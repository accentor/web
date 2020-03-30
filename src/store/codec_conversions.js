import Vue from "vue";
import { create, destroy, update } from "../api/codec_conversions";
import { indexGenerator } from "../api/fetch";
import { fetchAll } from "./commit";

export default {
  namespaced: true,
  state: {
    codecConversions: {},
  },
  mutations: {
    setCodecConversions(state, payload) {
      const loaded = new Date();
      for (let codecConversion in payload) {
        payload[codecConversion].loaded = loaded;
      }
      state.codecConversions = Object.assign(
        {},
        state.codecConversions,
        payload
      );
    },
    setCodecConversion(state, { id, codecConversion }) {
      codecConversion.loaded = new Date();
      Vue.set(state.codecConversions, id, codecConversion);
    },
    removeCodecConversion(state, id) {
      Vue.delete(state.codecConversions, id);
    },
    removeOld(state, startLoading) {
      Object.values(state.codecConversions)
        .filter((obj) => {
          return obj.loaded < startLoading;
        })
        .forEach((obj) => {
          Vue.delete(state.codecConversions, obj.id);
        });
    },
  },
  actions: {
    index({ commit, rootState }) {
      const indexCodecConversions = indexGenerator(
        "codec_conversions",
        rootState.auth
      );
      const startLoading = new Date();
      return fetchAll(
        { commit },
        {
          generator: indexCodecConversions,
          commitAction: "setCodecConversions",
        }
      )
        .then(() => {
          commit("removeOld", startLoading);
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
