import Vue from "vue";
import { index, create, destroy, update, destroyEmpty } from "../api/artists";
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
      let oldArtists = { ...state.artists };
      state.artists = {};
      for (let id in oldArtists) {
        state.artists[id] = oldArtists[id];
      }
      for (let artist of payload) {
        state.artists[artist.id] = artist;
      }
    },
    setArtist(state, { id, artist }) {
      artist.loaded = new Date();
      Vue.set(state.artists, id, Object.freeze(artist));
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeArtist(state, id) {
      Vue.delete(state.artists, id);
    },
    removeOld(state) {
      Object.values(state.artists)
        .filter((obj) => {
          return obj.loaded < state.startLoading;
        })
        .forEach((obj) => {
          Vue.delete(state.artists, obj.id);
        });
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
