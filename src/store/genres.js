import Vue from "vue";
import { create, destroy, update, destroyEmpty, merge } from "../api/genres";
import { fetchAll } from "./commit";
import { compareStrings } from "../comparators";

export default {
  namespaced: true,
  state: {
    genres: {},
    startLoading: new Date(0),
  },
  mutations: {
    setGenres(state, payload) {
      const loaded = new Date();
      for (let genre in payload) {
        payload[genre].loaded = loaded;
      }
      state.genres = Object.assign({}, state.genres, payload);
    },
    setGenre(state, { id, genre }) {
      genre.loaded = new Date();
      Vue.set(state.genres, id, genre);
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeGenre(state, id) {
      Vue.delete(state.genres, id);
    },
    removeOld(state) {
      Object.values(state.genres)
        .filter((obj) => {
          return obj.loaded < state.startLoading;
        })
        .forEach((obj) => {
          Vue.delete(state.genres, obj.id);
        });
    },
  },
  actions: {
    index(context) {
      return fetchAll(context, {
        collection: "genres",
        commitAction: "setGenres",
      })
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
