import Vue from "vue";
import {
  index,
  create,
  read,
  destroy,
  update,
  destroyEmpty,
  merge,
} from "../api/genres";
import { fetchAll } from "./actions";
import { compareStrings } from "../comparators";

export default {
  namespaced: true,
  state: {
    genres: {},
    startLoading: new Date(0),
  },
  mutations: {
    setGenres(state, payload) {
      const oldGenres = state.genres;
      state.genres = {};
      for (let id in oldGenres) {
        state.genres[id] = oldGenres[id];
      }
      for (let obj of payload) {
        state.genres[obj.id] = obj;
      }
    },
    setGenre(state, { id, genre }) {
      const oldGenres = state.genres;
      state.genres = {};
      for (let id in oldGenres) {
        state.genres[id] = oldGenres[id];
      }
      genre.loaded = new Date();
      state.genres[id] = genre;
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeGenre(state, id) {
      Vue.delete(state.genres, id);
    },
    removeOld(state) {
      const oldGenres = state.genres;
      state.genres = {};
      for (let id in oldGenres) {
        if (oldGenres[id].loaded > state.startLoading) {
          state.genres[id] = oldGenres[id];
        }
      }
    },
  },
  actions: {
    index({ commit, rootState }) {
      const generator = index(rootState.auth);
      return fetchAll(commit, generator, "setGenres")
        .then(() => {
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    create({ commit, rootState }, newGenre) {
      return create(rootState.auth, newGenre)
        .then((result) => {
          commit("setGenre", { id: result.id, genre: result });
          return Promise.resolve(result.id);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    read({ commit, rootState }, id) {
      return read(rootState.auth, id)
        .then((result) => {
          commit("setGenre", { id, genre: result });
          return Promise.resolve(result.id);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    update({ commit, rootState }, { id, newGenre }) {
      return update(rootState.auth, id, newGenre)
        .then((result) => {
          commit("setGenre", { id, genre: result });
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
          commit("tracks/removeGenreOccurence", id, { root: true });
          commit("removeGenre", id);
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    destroyEmpty({ rootState }) {
      return destroyEmpty(rootState.auth)
        .then(() => {
          return this.dispatch("genres/index");
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    merge({ commit, rootState }, { newID, oldID }) {
      return merge(rootState.auth, newID, oldID)
        .then(() => {
          commit(
            "tracks/updateGenreOccurence",
            { newID, oldID },
            { root: true }
          );
          commit("removeGenre", oldID);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
  },
  getters: {
    genres: (state) => Object.values(state.genres),
    genresByName: (state, getters) =>
      getters.genres.sort((g1, g2) =>
        compareStrings(g1.normalized_name, g2.normalized_name)
      ),
  },
};
