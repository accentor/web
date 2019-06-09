import Vue from "vue";
import { create, destroy, index, update } from "../api/codec_conversions";

export default {
  namespaced: true,
  state: {
    codecConversions: {}
  },
  mutations: {
    setCodecConversions(state, payload) {
      state.codecConversions = {};
      for (let codecConversion of payload) {
        state.codecConversions[codecConversion.id] = codecConversion;
      }
    },
    setCodecConversion(state, { id, codecConversion }) {
      if (state.codecConversions[id]) {
        Vue.delete(state.codecConversions, id);
      }
      Vue.set(state.codecConversions, id, codecConversion);
    },
    removeCodecConversion(state, id) {
      Vue.delete(state.codecConversions, id);
    }
  },
  actions: {
    index({ commit, rootState }) {
      return index(rootState.auth)
        .then(result => {
          commit("setCodecConversions", result);
          return Promise.resolve(true);
        })
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    create({ commit, rootState }, newCodecConversion) {
      return create(rootState.auth, newCodecConversion)
        .then(result => {
          commit("setCodecConversion", {
            id: result.id,
            codecConversion: result
          });
          return Promise.resolve(result.id);
        })
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    update({ commit, rootState }, { id, newCodecConversion }) {
      return update(rootState.auth, id, newCodecConversion)
        .then(result => {
          commit("setCodecConversion", { id, codecConversion: result });
          return Promise.resolve(true);
        })
        .catch(error => {
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
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    }
  },
  getters: {
    codecConversions: state => Object.values(state.codecConversions)
  }
};
