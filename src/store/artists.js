import Vue from "vue";
import api from "@/api";
import { fetchAll } from "./actions";
import { compareStrings } from "../comparators";
import { ArtistsScope } from "@accentor/api-client-js";

export default {
  namespaced: true,
  state: {
    artists: {},
    startLoading: new Date(0),
  },
  mutations: {
    setArtists(state, payload) {
      const oldArtists = state.artists;
      state.artists = {};
      for (let id in oldArtists) {
        state.artists[id] = oldArtists[id];
      }
      const loaded = new Date();
      for (let artist of payload) {
        artist.loaded = loaded;
        state.artists[artist.id] = artist;
      }
    },
    setArtist(state, { id, artist }) {
      const oldArtists = state.artists;
      state.artists = {};
      for (let id in oldArtists) {
        state.artists[id] = oldArtists[id];
      }
      artist.loaded = new Date();
      state.artists[id] = artist;
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeArtist(state, id) {
      Vue.delete(state.artists, id);
    },
    removeOld(state) {
      const oldArtists = state.artists;
      state.artists = {};
      for (let id in oldArtists) {
        if (oldArtists[id].loaded > state.startLoading) {
          state.artists[id] = oldArtists[id];
        }
      }
    },
  },
  actions: {
    async index({ commit, rootState }, scope = new ArtistsScope()) {
      const generator = api.artists.index(rootState.auth.apiToken, scope);
      try {
        await this.artistsRestored;
        await fetchAll(commit, generator, "setArtists", scope);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async create({ commit, rootState }, newArtist) {
      try {
        const result = await api.artists.create(rootState.auth.apiToken, {
          artist: newArtist,
        });
        commit("setArtist", { id: result.id, artist: result });
        return result.id;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async read({ commit, rootState }, id) {
      try {
        const result = await api.artists.read(rootState.auth.apiToken, id);
        await this.artistsRestored;
        commit("setArtist", { id, artist: result });
        return result.id;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async update({ commit, rootState }, { id, newArtist }) {
      try {
        const result = await api.artists.update(rootState.auth.apiToken, id, {
          artist: newArtist,
        });
        commit("setArtist", { id, artist: result });
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async destroy({ commit, rootState }, id) {
      try {
        await api.artists.destroy(rootState.auth.apiToken, id);
        commit("albums/removeArtistOccurence", id, { root: true });
        commit("tracks/removeArtistOccurence", id, { root: true });
        commit("removeArtist", id);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async destroyEmpty({ commit, dispatch, rootState }) {
      try {
        await api.artists.destroyEmpty(rootState.auth.apiToken);
        await dispatch("index");
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async merge({ commit, rootState }, { newID, oldID }) {
      try {
        await api.artists.merge(rootState.auth.apiToken, newID, oldID);
        commit(
          "tracks/updateArtistOccurence",
          { newID, oldID },
          { root: true },
        );
        commit(
          "albums/updateArtistOccurence",
          { newID, oldID },
          { root: true },
        );
        commit("removeArtist", oldID);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
  },
  getters: {
    artists: (state) => Object.values(state.artists),
    artistsByName: (state, getters) =>
      getters.artists.sort((a1, a2) =>
        compareStrings(a1.normalized_name, a2.normalized_name),
      ),
    artistsFlagged: (state, getters) => {
      return getters.artists
        .filter((t) => t.review_comment !== null)
        .sort((a1, a2) =>
          compareStrings(a1.normalized_name, a2.normalized_name),
        );
    },
  },
};
