import Vue from "vue";
import {
  index,
  create,
  read,
  destroy,
  update,
  destroyEmpty,
  merge,
} from "../api/artists";
import { fetchAll } from "./actions";
import { compareStrings } from "../comparators";
import { ArtistsScope } from "../api/scopes";

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
      for (let artist of payload) {
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
      const generator = index(rootState.auth, scope);
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
        const result = await create(rootState.auth, newArtist);
        commit("setArtist", { id: result.id, artist: result });
        return result.id;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async read({ commit, rootState }, id) {
      try {
        const result = await read(rootState.auth, id);
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
        const result = await update(rootState.auth, id, newArtist);
        commit("setArtist", { id, artist: result });
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async destroy({ commit, rootState }, id) {
      try {
        await destroy(rootState.auth, id);
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
        await destroyEmpty(rootState.auth);
        await dispatch("index");
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async merge({ commit, rootState }, { newID, oldID }) {
      try {
        await merge(rootState.auth, newID, oldID);
        commit(
          "tracks/updateArtistOccurence",
          { newID, oldID },
          { root: true }
        );
        commit(
          "albums/updateArtistOccurence",
          { newID, oldID },
          { root: true }
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
        compareStrings(a1.normalized_name, a2.normalized_name)
      ),
    artistsFlagged: (state, getters) => {
      return getters.artists
        .filter((t) => t.review_comment !== null)
        .sort((a1, a2) =>
          compareStrings(a1.normalized_name, a2.normalized_name)
        );
    },
  },
};
