import Vue from "vue";
import { create, destroy, update } from "../api/cover_filenames";
import { indexGenerator } from "../api/fetch";
import { fetchAll } from "./commit";

export default {
  namespaced: true,
  state: {
    coverFilenames: {},
  },
  mutations: {
    setCoverFilenames(state, payload) {
      const loaded = new Date();
      for (let coverFilename in payload) {
        payload[coverFilename].loaded = loaded;
      }
      state.coverFilenames = Object.assign({}, state.coverFilenames, payload);
    },
    setCoverFilename(state, { id, coverFilename }) {
      coverFilename.loaded = new Date();
      Vue.set(state.coverFilenames, id, coverFilename);
    },
    removeCoverFilename(state, id) {
      Vue.delete(state.coverFilenames, id);
    },
    removeOld(state, startLoading) {
      Object.values(state.coverFilenames)
        .filter((obj) => {
          return obj.loaded < startLoading;
        })
        .forEach((obj) => {
          Vue.delete(state.coverFilenames, obj.id);
        });
    },
  },
  actions: {
    index({ commit, rootState }) {
      const indexCoverFilenames = indexGenerator(
        "coverFilenames",
        rootState.auth
      );
      const startLoading = new Date();
      return fetchAll(
        { commit },
        {
          generator: indexCoverFilenames,
          commitAction: "setCoverFilenames",
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
