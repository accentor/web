import Vue from "vue";
import api from "@/api";
import { fetchAll } from "./actions";
import { useErrorsStore } from "./errors";
import { useAuthStore } from "./auth";

export default {
  namespaced: true,
  state: {
    imageTypes: {},
    startLoading: new Date(0),
  },
  mutations: {
    setImageTypes(state, payload) {
      const oldImageTypes = state.imageTypes;
      state.imageTypes = {};
      for (let id in oldImageTypes) {
        state.imageTypes[id] = oldImageTypes[id];
      }
      const loaded = new Date();
      for (let obj of payload) {
        obj.loaded = loaded;
        state.imageTypes[obj.id] = obj;
      }
    },
    setImageType(state, { id, imageType }) {
      const oldImageTypes = state.imageTypes;
      state.imageTypes = {};
      for (let id in oldImageTypes) {
        state.imageTypes[id] = oldImageTypes[id];
      }
      imageType.loaded = new Date();
      state.imageTypes[id] = imageType;
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeImageType(state, id) {
      Vue.delete(state.imageTypes, id);
    },
    removeOld(state) {
      const oldImageTypes = state.imageTypes;
      state.imageTypes = {};
      for (let id in oldImageTypes) {
        if (oldImageTypes[id].loaded > state.startLoading) {
          state.imageTypes[id] = oldImageTypes[id];
        }
      }
    },
  },
  actions: {
    async index({ commit }) {
      const generator = api.image_types.index(useAuthStore().apiToken);
      try {
        await fetchAll(commit, generator, "setImageTypes");
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async create({ commit }, newImageType) {
      try {
        const result = await api.image_types.create(useAuthStore().apiToken, {
          image_type: newImageType,
        });
        commit("setImageType", { id: result.id, imageType: result });
        return result.id;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async update({ commit }, { id, newImageType }) {
      try {
        const result = await api.image_types.update(
          useAuthStore().apiToken,
          id,
          {
            image_type: newImageType,
          },
        );
        commit("setImageType", { id, imageType: result });
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async destroy({ commit }, id) {
      try {
        await api.image_types.destroy(useAuthStore().apiToken, id);
        commit("removeImageType", id);
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
  },
  getters: {
    imageTypes: (state) =>
      Object.values(state.imageTypes).sort((i1, i2) => i1.id - i2.id),
  },
};
