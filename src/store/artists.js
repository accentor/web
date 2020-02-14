import Vue from "vue";
import { create, destroy, update, destroyEmpty } from "../api/artists";
import { index } from "./commit";
import { compareStrings } from "../comparators";

export default {
  namespaced: true,
  state: {
    artists: {},
  },
  mutations: {
    setArtists(state, payload) {
      for (let artist of payload) {
        Vue.set(state.artists, artist.id, artist);
      }
    },
    setArtist(state, { id, artist }) {
      if (state.artists[id]) {
        Vue.delete(state.artists, id);
      }
      Vue.set(state.artists, id, artist);
    },
    removeArtist(state, id) {
      Vue.delete(state.artists, id);
    },
  },
  actions: {
    index({ commit, rootState }) {
      return index(
        { commit, auth: rootState.auth },
        { url: "artists", commitAction: "setArtists" }
      )
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
