import Vue from "vue";
import { create, destroy, update } from "../api/image_types";
import { indexGenerator } from "../api/fetch";
import { fetchAll } from "./commit";

export default {
  namespaced: true,
  state: {
    imageTypes: {},
  },
  mutations: {
    setImageTypes(state, payload) {
      const loaded = new Date();
      for (let imageType in payload) {
        payload[imageType].loaded = loaded;
      }
      state.imageTypes = Object.assign({}, state.imageTypes, payload);
    },
    setImageType(state, { id, imageType }) {
      imageType.loaded = new Date();
      Vue.set(state.imageTypes, id, imageType);
    },
    removeImageType(state, id) {
      Vue.delete(state.imageTypes, id);
    },
    removeOld(state, startLoading) {
      Object.values(state.imageTypes)
        .filter((obj) => {
          return obj.loaded < startLoading;
        })
        .forEach((obj) => {
          Vue.delete(state.imageTypes, obj.id);
        });
    },
  },
  actions: {
    index({ commit, rootState }) {
      const indexImageTypes = indexGenerator("image_types", rootState.auth);
      const startLoading = new Date();
      return fetchAll(
        { commit },
        {
          generator: indexImageTypes,
          commitAction: "setImageTypes",
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
