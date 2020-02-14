import Vue from "vue";
import { create, destroy, update } from "../api/cover_filenames";
import { index } from "./commit";

export default {
  namespaced: true,
  state: {
    coverFilenames: {},
  },
  mutations: {
    setCoverFilenames(state, payload) {
      for (let coverFilename of payload) {
        Vue.set(state.coverFilenames, coverFilename.id, coverFilename);
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
    },
  },
  actions: {
    index({ commit, rootState }) {
      return index(
        { commit, auth: rootState.auth },
        { url: "cover_filenames", commitAction: "setCoverFilenames" }
      )
        .then(() => {
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    create({ commit, rootState }, newCoverFilename) {
      return create(rootState.auth, newCoverFilename)
        .then((result) => {
          commit("setCoverFilename", { id: result.id, coverFilename: result });
          return Promise.resolve(result.id);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    update({ commit, rootState }, { id, newCoverFilename }) {
      return update(rootState.auth, id, newCoverFilename)
        .then((result) => {
          commit("setCoverFilename", { id, coverFilename: result });
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
          commit("removeCoverFilename", id);
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
  },
  getters: {
    coverFilenames: (state) =>
      Object.values(state.coverFilenames).sort((cf1, cf2) => cf1.id - cf2.id),
  },
};
