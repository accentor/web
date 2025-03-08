import Vue from "vue";
import api from "@/api";
import { fetchAll } from "./actions";

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
    async index({ commit, rootState }) {
      const generator = api.image_types.index(rootState.auth.apiToken);
      try {
        await fetchAll(commit, generator, "setImageTypes");
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async create({ commit, rootState }, newImageType) {
      try {
        const result = await api.image_types.create(rootState.auth.apiToken, {
          image_type: newImageType,
        });
        commit("setImageType", { id: result.id, imageType: result });
        return result.id;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async update({ commit, rootState }, { id, newImageType }) {
      try {
        const result = await api.image_types.update(
          rootState.auth.apiToken,
          id,
          {
            image_type: newImageType,
          },
        );
        commit("setImageType", { id, imageType: result });
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async destroy({ commit, rootState }, id) {
      try {
        await api.image_types.destroy(rootState.auth.apiToken, id);
        commit("removeImageType", id);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
  },
  getters: {
    imageTypes: (state) =>
      Object.values(state.imageTypes).sort((i1, i2) => i1.id - i2.id),
  },
};
