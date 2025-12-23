import Vue from "vue";
import api from "@/api";
import { fetchAll } from "./actions";
import { useErrorsStore } from "./errors";
import { useAuthStore } from "./auth";

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
    async index({ commit }) {
      const generator = api.codec_conversions.index(useAuthStore().apiToken);
      try {
        await fetchAll(commit, generator, "setCodecConversions");
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async create({ commit }, newCodecConversion) {
      try {
        const result = await api.codec_conversions.create(
          useAuthStore().apiToken,
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
        useErrorsStore().addError(error);
        return false;
      }
    },
    async update({ commit }, { id, newCodecConversion }) {
      try {
        const result = await api.codec_conversions.update(
          useAuthStore().apiToken,
          id,
          {
            codec_conversion: newCodecConversion,
          },
        );
        commit("setCodecConversion", { id, codecConversion: result });
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async destroy({ commit }, id) {
      try {
        await api.codec_conversions.destroy(useAuthStore().apiToken, id);
        commit("removeCodecConversion", id);
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
  },
  getters: {
    codecConversions: (state) =>
      Object.values(state.codecConversions).sort((cc1, cc2) => cc1.id - cc2.id),
  },
};
