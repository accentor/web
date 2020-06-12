import Vue from "vue";
import { index, create, destroy, update } from "../api/cover_filenames";
import { fetchAll } from "./actions";

export default {
  namespaced: true,
  state: {
    coverFilenames: {},
    startLoading: new Date(0),
  },
  mutations: {
    setCoverFilenames(state, payload) {
      let oldCoverFilenames = { ...state.coverFilenames };
      state.coverFilenames = {};
      for (let id in oldCoverFilenames) {
        state.coverFilenames[id] = oldCoverFilenames[id];
      }
      for (let obj of payload) {
        state.coverFilenames[obj.id] = obj;
      }
    },
    setCoverFilename(state, { id, coverFilename }) {
      coverFilename.loaded = new Date();
      Vue.set(state.coverFilenames, id, Object.freeze(coverFilename));
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeCoverFilename(state, id) {
      Vue.delete(state.coverFilenames, id);
    },
    removeOld(state) {
      Object.values(state.coverFilenames)
        .filter((obj) => {
          return obj.loaded < state.startLoading;
        })
        .forEach((obj) => {
          Vue.delete(state.coverFilenames, obj.id);
        });
    },
  },
  actions: {
    index({ commit, rootState }) {
      const generator = index(rootState.auth);
      return fetchAll(commit, generator, "setCoverFilenames")
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
