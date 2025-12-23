import api from "@/api";
import { fetchAll } from "./actions";
import { shallowRef } from "vue";

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
      const loaded = new Date();
      for (let obj of payload) {
        obj.loaded = loaded;
        state.codecConversions[obj.id] = shallowRef(obj);
      }
    },
    setCodecConversion(state, { id, codecConversion }) {
      const oldCodecConversions = state.codecConversions;
      state.codecConversions = {};
      for (let id in oldCodecConversions) {
        state.codecConversions[id] = oldCodecConversions[id];
      }
      codecConversion.loaded = new Date();
      state.codecConversions[id] = shallowRef(codecConversion);
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeCodecConversion(state, id) {
      delete state.codecConversions[id];
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
      const generator = api.codec_conversions.index(rootState.auth.apiToken);
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
        const result = await api.codec_conversions.create(
          rootState.auth.apiToken,
          {
            codec_conversion: newCodecConversion,
          },
        );
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
        const result = await api.codec_conversions.update(
          rootState.auth.apiToken,
          id,
          {
            codec_conversion: newCodecConversion,
          },
        );
        commit("setCodecConversion", { id, codecConversion: result });
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async destroy({ commit, rootState }, id) {
      try {
        await api.codec_conversions.destroy(rootState.auth.apiToken, id);
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
