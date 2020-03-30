import Vue from "vue";
import { create, destroy, update, destroyEmpty } from "../api/artists";
import { indexGenerator } from "../api/fetch";
import { fetchAll } from "./commit";
import { compareStrings } from "../comparators";

export default {
  namespaced: true,
  state: {
    artists: {},
  },
  mutations: {
    setArtists(state, payload) {
      const loaded = new Date();
      for (let artist in payload) {
        payload[artist].loaded = loaded;
      }
      state.artists = Object.assign({}, state.artists, payload);
    },
    setArtist(state, { id, artist }) {
      artist.loaded = new Date();
      Vue.set(state.artists, id, artist);
    },
    removeArtist(state, id) {
      Vue.delete(state.artists, id);
    },
    removeOld(state, startLoading) {
      Object.values(state.artists)
        .filter((obj) => {
          return obj.loaded < startLoading;
        })
        .forEach((obj) => {
          Vue.delete(state.artists, obj.id);
        });
    },
  },
  actions: {
    index({ commit, rootState }) {
      const indexArtists = indexGenerator("artists", rootState.auth);
      const startLoading = new Date();
      return fetchAll(
        { commit },
        {
          generator: indexArtists,
          commitAction: "setArtists",
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
