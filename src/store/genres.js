import Vue from "vue";
import { create, destroy, index, update } from "../api/genres";
import { compareStrings } from "../comparators";

export default {
  namespaced: true,
  state: {
    genres: {}
  },
  mutations: {
    setGenres(state, payload) {
      state.genres = {};
      for (let genre of payload) {
        state.genres[genre.id] = genre;
      }
    },
    setGenre(state, { id, genre }) {
      if (state.genres[id]) {
        Object.assign(state.genres[id], genre);
      } else {
        Vue.set(state.genres, id, genre);
      }
    },
    removeGenre(state, id) {
      Vue.delete(state.genres, id);
    }
  },
  actions: {
    index({ commit, rootState }) {
      return index(rootState.auth)
        .then(result => {
          commit("setGenres", result);
          return Promise.resolve(true);
        })
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    create({ commit, rootState }, newGenre) {
      return create(rootState.auth, newGenre)
        .then(result => {
          commit("setGenre", { id: result.id, genre: result });
          return Promise.resolve(result.id);
        })
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    update({ commit, rootState }, { id, newGenre }) {
      return update(rootState.auth, id, newGenre)
        .then(result => {
          commit("setGenre", { id, genre: result });
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
          commit("removeGenre", id);
          return Promise.resolve(true);
        })
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    }
  },
  getters: {
    genres: state => Object.values(state.genres),
    genresByName: (state, getters) =>
      getters.genres.sort((g1, g2) => compareStrings(g1.name, g2.name))
  }
};
