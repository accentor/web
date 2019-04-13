import { create, destroy, index, update } from "../api/artists";
import Vue from "vue";

export default {
  namespaced: true,
  state: {
    artists: {}
  },
  mutations: {
    setArtists(state, payload) {
      state.artists = {};
      for (let artist of payload) {
        state.artists[artist.id] = artist;
      }
    },
    setArtist(state, { id, artist }) {
      if (state.artists[id]) {
        Object.assign(state.artists[id], artist);
      } else {
        Vue.set(state.artists, id, artist);
      }
    },
    removeArtist(state, id) {
      Vue.delete(state.artists, id);
    }
  },
  actions: {
    index({ commit, rootState }) {
      return index(rootState.auth).then(result => {
        commit("setArtists", result);
        return Promise.resolve();
      });
    },
    destroy({ commit, rootState }, id) {
      return destroy(rootState.auth, id).then(() => {
        commit("removeArtist", id);
        return Promise.resolve();
      });
    },
    update({ commit, rootState }, { id, newArtist }) {
      return update(rootState.auth, id, newArtist).then(result => {
        commit("setArtist", { id, artist: result });
        return Promise.resolve();
      });
    },
    create({ commit, rootState }, newArtist) {
      return create(rootState.auth, newArtist).then(result => {
        commit("setArtist", { id: result.id, artist: result });
        return Promise.resolve(result.id);
      });
    }
  },
  getters: {
    artists: state => Object.values(state.artists)
  }
};
