import Vue from "vue";
import api from "@/api";
import { fetchAll } from "./actions";
import { compareStrings } from "../comparators";
import { useErrorsStore } from "./errors";
import { useAuthStore } from "./auth";

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
      const loaded = new Date();
      for (let obj of payload) {
        obj.loaded = loaded;
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
    async index({ commit }) {
      const generator = api.genres.index(useAuthStore().apiToken);
      try {
        await this.genresRestored;
        await fetchAll(commit, generator, "setGenres");
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async create({ commit }, newGenre) {
      try {
        const result = await api.genres.create(useAuthStore().apiToken, {
          genre: newGenre,
        });
        commit("setGenre", { id: result.id, genre: result });
        return result.id;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async read({ commit }, id) {
      try {
        const result = await api.genres.read(useAuthStore().apiToken, id);
        await this.genresRestored;
        commit("setGenre", { id, genre: result });
        return result.id;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async update({ commit }, { id, newGenre }) {
      try {
        const result = await api.genres.update(useAuthStore().apiToken, id, {
          genre: newGenre,
        });
        commit("setGenre", { id, genre: result });
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async destroy({ commit }, id) {
      try {
        await api.genres.destroy(useAuthStore().apiToken, id);
        commit("tracks/removeGenreOccurence", id, { root: true });
        commit("removeGenre", id);
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async destroyEmpty({ dispatch }) {
      try {
        await api.genres.destroyEmpty(useAuthStore().apiToken);
        await dispatch("index");
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async merge({ commit }, { newID, oldID }) {
      try {
        await api.genres.merge(useAuthStore().apiToken, newID, oldID);
        commit("tracks/updateGenreOccurence", { newID, oldID }, { root: true });
        commit("removeGenre", oldID);
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
  },
  getters: {
    genres: (state) => Object.values(state.genres),
    genresByName: (state, getters) =>
      getters.genres.sort((g1, g2) =>
        compareStrings(g1.normalized_name, g2.normalized_name),
      ),
  },
};
