import Vue from "vue";
import { create, destroy, update } from "../api/image_types";
import { index } from "./commit";

export default {
  namespaced: true,
  state: {
    imageTypes: {},
  },
  mutations: {
    setImageTypes(state, payload) {
      for (let imageType of payload) {
        Vue.set(state.imageTypes, imageType.id, imageType);
      }
    },
    setImageType(state, { id, imageType }) {
      if (state.imageTypes[id]) {
        Vue.delete(state.imageTypes, id);
      }
      Vue.set(state.imageTypes, id, imageType);
    },
    removeImageType(state, id) {
      Vue.delete(state.imageTypes, id);
    },
  },
  actions: {
    index({ commit, rootState }) {
      return index(
        { commit, auth: rootState.auth },
        { url: "image_types", commitAction: "setImageTypes" }
      )
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
