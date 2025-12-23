import Vue from "vue";
import api from "@/api";
import { fetchAll } from "./actions";
import { compareStrings } from "../comparators";
import { useErrorsStore } from "./errors";
import { useAuthStore } from "./auth";

export default {
  namespaced: true,
  state: {
    playlists: {},
    startLoading: new Date(0),
  },
  mutations: {
    setPlaylists(state, payload) {
      const oldLists = state.playlists;
      state.playlists = {};
      for (let id in oldLists) {
        state.playlists[id] = oldLists[id];
      }
      const loaded = new Date();
      for (let list of payload) {
        list.loaded = loaded;
        state.playlists[list.id] = list;
      }
    },
    setPlaylist(state, { id, playlist }) {
      const oldLists = state.playlists;
      state.playlists = {};
      for (let id in oldLists) {
        state.playlists[id] = oldLists[id];
      }
      playlist.loaded = new Date();
      state.playlists[id] = playlist;
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removePlaylist(state, id) {
      Vue.delete(state.playlists, id);
    },
    removeOld(state) {
      const oldLists = state.playlists;
      state.playlists = {};
      for (let id in oldLists) {
        if (oldLists[id].loaded > state.startLoading) {
          state.playlists[id] = oldLists[id];
        }
      }
    },
  },
  actions: {
    async index({ commit }) {
      const generator = api.playlists.index(useAuthStore().apiToken);
      try {
        await fetchAll(commit, generator, "setPlaylists");
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async create({ commit }, newPlaylist) {
      try {
        const result = await api.playlists.create(useAuthStore().apiToken, {
          playlist: newPlaylist,
        });
        commit("setPlaylist", { id: result.id, playlist: result });
        return result.id;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async read({ commit }, id) {
      try {
        const result = await api.playlists.read(useAuthStore().apiToken, id);
        commit("setPlaylist", { id, playlist: result });
        return result.id;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async update({ commit }, { id, newPlaylist }) {
      try {
        const result = await api.playlists.update(useAuthStore().apiToken, id, {
          playlist: newPlaylist,
        });
        commit("setPlaylist", { id, playlist: result });
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async addItem({ dispatch }, { id, newItem }) {
      try {
        await api.playlists.addItem(useAuthStore().apiToken, id, {
          playlist: newItem,
        });
        await dispatch("read", id);
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async destroy({ commit }, id) {
      try {
        await api.playlists.destroy(useAuthStore().apiToken, id);
        commit("removePlaylist", id);
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
  },
  getters: {
    playlists: (state) => Object.values(state.playlists),
    playlistsByName: (state, getters) =>
      getters.playlists.sort((p1, p2) =>
        compareStrings(p1.name.toLowerCase(), p2.name.toLowerCase()),
      ),
    editablePlaylists: (state, getters, rootState) =>
      getters.playlistsByName.filter(
        (p) => p.access === "shared" || p.user_id === rootState.auth.user_id,
      ),
    albumPlaylists: (state, getters) =>
      getters.playlistsByName.filter((p) => p.playlist_type === "album"),
    artistPlaylists: (state, getters) =>
      getters.playlistsByName.filter((p) => p.playlist_type === "artist"),
  },
};
