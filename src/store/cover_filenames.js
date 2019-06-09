import Vue from "vue";
import { create, destroy, index, update } from "../api/cover_filenames";

export default {
  namespaced: true,
  state: {
    coverFilenames: {}
  },
  mutations: {
    setCoverFilenames(state, payload) {
      state.coverFilenames = {};
      for (let coverFilename of payload) {
        state.coverFilenames[coverFilename.id] = coverFilename;
      }
    },
    setCoverFilename(state, { id, coverFilename }) {
      if (state.coverFilenames[id]) {
        Vue.delete(state.coverFilenames, id);
      }
      Vue.set(state.coverFilenames, id, coverFilename);
    },
    removeCoverFilename(state, id) {
      Vue.delete(state.coverFilenames, id);
    }
  },
  actions: {
    index({ commit, rootState }) {
      return index(rootState.auth)
        .then(result => {
          commit("setCoverFilenames", result);
          return Promise.resolve(true);
        })
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    create({ commit, rootState }, newCoverFilename) {
      return create(rootState.auth, newCoverFilename)
        .then(result => {
          commit("setCoverFilename", { id: result.id, coverFilename: result });
          return Promise.resolve(result.id);
        })
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    update({ commit, rootState }, { id, newCoverFilename }) {
      return update(rootState.auth, id, newCoverFilename)
        .then(result => {
          commit("setCoverFilename", { id, coverFilename: result });
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
          commit("removeCoverFilename", id);
          return Promise.resolve(true);
        })
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    }
  },
  getters: {
    coverFilenames: state =>
      Object.values(state.coverFilenames).sort((cf1, cf2) => cf1.id - cf2.id)
  }
};
