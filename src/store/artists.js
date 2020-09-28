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
    index({ commit, rootState }) {
      const generator = index(rootState.auth);
      return fetchAll(commit, generator, "setArtists")
        .then(() => {
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    create({ commit, rootState }, newArtist) {
      return create(rootState.auth, newArtist)
        .then((result) => {
          commit("setArtist", { id: result.id, artist: result });
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
          commit("setArtist", { id, artist: result });
          return Promise.resolve(result.id);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    update({ commit, rootState }, { id, newArtist }) {
      return update(rootState.auth, id, newArtist)
        .then((result) => {
          commit("setArtist", { id, artist: result });
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
          commit("albums/removeArtistOccurence", id, { root: true });
          commit("tracks/removeArtistOccurence", id, { root: true });
          commit("removeArtist", id);
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
          return this.dispatch("artists/index");
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
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
      } catch (error) {
        this.commit("addError", error);
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
