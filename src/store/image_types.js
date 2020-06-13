import Vue from "vue";
import { index, create, destroy, update } from "../api/image_types";
import { fetchAll } from "./actions";

export default {
  namespaced: true,
  state: {
    imageTypes: {},
    startLoading: new Date(0),
  },
  mutations: {
    setImageTypes(state, payload) {
      const oldImageTypes = { ...state.imageTypes };
      state.imageTypes = {};
      for (let id in oldImageTypes) {
        state.imageTypes[id] = oldImageTypes[id];
      }
      for (let obj of payload) {
        state.imageTypes[obj.id] = obj;
      }
    },
    setImageType(state, { id, imageType }) {
      const oldImageTypes = { ...state.imageTypes };
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
      const oldImageTypes = { ...state.imageTypes };
      state.imageTypes = {};
      for (let id in oldImageTypes) {
        if (oldImageTypes[id].loaded > state.startLoading) {
          state.imageTypes[id] = oldImageTypes[id];
        }
      }
    },
  },
  actions: {
    index({ commit, rootState }) {
      const generator = index(rootState.auth);
      return fetchAll(commit, generator, "setImageTypes")
        .then(() => {
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    create({ commit, rootState }, newImageType) {
      return create(rootState.auth, newImageType)
        .then((result) => {
          commit("setImageType", { id: result.id, imageType: result });
          return Promise.resolve(result.id);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    update({ commit, rootState }, { id, newImageType }) {
      return update(rootState.auth, id, newImageType)
        .then((result) => {
          commit("setImageType", { id, imageType: result });
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
          commit("removeImageType", id);
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
  },
  getters: {
    imageTypes: (state) =>
      Object.values(state.imageTypes).sort((i1, i2) => i1.id - i2.id),
  },
};
