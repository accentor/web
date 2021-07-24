import Vue from "vue";
import api from "@/api";
import { fetchAll } from "./actions";

export default {
  namespaced: true,
  state: {
    codecConversions: {},
    startLoading: new Date(0),
  },
  mutations: {
    setCodecConversions(state, payload) {
      const oldCodecConversions = state.codecConversions;
      state.codecConversions = {};
      for (let id in oldCodecConversions) {
        state.codecConversions[id] = oldCodecConversions[id];
      }
      for (let obj of payload) {
        state.codecConversions[obj.id] = obj;
      }
    },
    setCodecConversion(state, { id, codecConversion }) {
      const oldCodecConversions = state.codecConversions;
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
      const oldCodecConversions = state.codecConversions;
      state.codecConversions = {};
      for (let id in oldCodecConversions) {
        if (oldCodecConversions[id].loaded > state.startLoading) {
          state.codecConversions[id] = oldCodecConversions[id];
        }
      }
    },
  },
  actions: {
    async index({ commit, rootState }) {
      const generator = api.codec_conversions.index(rootState.auth);
      try {
        await fetchAll(commit, generator, "setCodecConversions");
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async create({ commit, rootState }, newCodecConversion) {
      try {
        const result = await api.codec_conversions.create(rootState.auth, newCodecConversion);
        commit("setCodecConversion", {
          id: result.id,
          codecConversion: result,
        });
        return result.id;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async update({ commit, rootState }, { id, newCodecConversion }) {
      try {
        const result = await api.codec_conversions.update(rootState.auth, id, newCodecConversion);
        commit("setCodecConversion", { id, codecConversion: result });
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async destroy({ commit, rootState }, id) {
      try {
        await api.codec_conversions.destroy(rootState.auth, id);
        commit("removeCodecConversion", id);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
  },
  getters: {
    codecConversions: (state) =>
      Object.values(state.codecConversions).sort((cc1, cc2) => cc1.id - cc2.id),
  },
};
