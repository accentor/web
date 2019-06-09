import Vue from "vue";
import { create, destroy, index, update } from "../api/image_types";

export default {
  namespaced: true,
  state: {
    imageTypes: {}
  },
  mutations: {
    setImageTypes(state, payload) {
      state.imageTypes = {};
      for (let imageType of payload) {
        state.imageTypes[imageType.id] = imageType;
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
    }
  },
  actions: {
    index({ commit, rootState }) {
      return index(rootState.auth)
        .then(result => {
          commit("setImageTypes", result);
          return Promise.resolve(true);
        })
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    create({ commit, rootState }, newImageType) {
      return create(rootState.auth, newImageType)
        .then(result => {
          commit("setImageType", { id: result.id, imageType: result });
          return Promise.resolve(result.id);
        })
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    update({ commit, rootState }, { id, newImageType }) {
      return update(rootState.auth, id, newImageType)
        .then(result => {
          commit("setImageType", { id, imageType: result });
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
          commit("removeImageType", id);
          return Promise.resolve(true);
        })
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    }
  },
  getters: {
    imageTypes: state => Object.values(state.imageTypes)
  }
};
