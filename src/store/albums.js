import Vue from "vue";
import {
  index,
  create,
  read,
  destroy,
  update,
  destroyEmpty,
} from "../api/albums";
import { fetchAll } from "./actions";
import {
  compareAlbumsByReleaseFirst,
  compareAlbumsByTitleFirst,
} from "../comparators";

export default {
  namespaced: true,
  state: {
    albums: {},
    startLoading: new Date(0),
  },
  mutations: {
    setAlbums(state, payload) {
      const oldAlbums = state.albums;
      state.albums = {};
      for (let id in oldAlbums) {
        state.albums[id] = oldAlbums[id];
      }
      for (let album of payload) {
        state.albums[album.id] = album;
      }
    },
    setAlbum(state, { id, album }) {
      const oldAlbums = state.albums;
      state.albums = {};
      for (let id in oldAlbums) {
        state.albums[id] = oldAlbums[id];
      }
      album.loaded = new Date();
      state.albums[id] = album;
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeAlbum(state, id) {
      Vue.delete(state.albums, id);
    },
    removeOld(state) {
      const oldAlbums = state.albums;
      state.albums = {};
      for (let id in oldAlbums) {
        if (oldAlbums[id].loaded > state.startLoading) {
          state.albums[id] = oldAlbums[id];
        }
      }
    },
    removeArtistOccurence(state, oldID) {
      const oldAlbums = state.albums;
      state.albums = {};
      for (let album of Object.values(oldAlbums)) {
        const i = album.album_artists.findIndex((aa) => aa.artist_id === oldID);
        if (i >= 0) {
          album.album_artists.splice(i, 1);
        }
        state.albums[album.id] = album;
      }
    },
    updateArtistOccurence(state, { newID, oldID }) {
      const oldAlbums = state.albums;
      state.albums = {};
      for (let album of Object.values(oldAlbums)) {
        const i = album.album_artists.findIndex((aa) => aa.artist_id === oldID);
        if (i >= 0) {
          album.album_artists[i].artist_id = newID;
        }
        state.albums[album.id] = album;
      }
    },
    removeLabelOccurence(state, oldID) {
      const oldAlbums = state.albums;
      state.albums = {};
      for (let album of Object.values(oldAlbums)) {
        const i = album.album_labels.findIndex((l) => l.label_id === oldID);
        if (i >= 0) {
          album.album_labels.splice(i, 1);
        }
        state.albums[album.id] = album;
      }
    },
    updateLabelOccurence(state, { oldID, newID }) {
      const oldAlbums = state.albums;
      state.albums = {};
      for (let album of Object.values(oldAlbums)) {
        const i = album.album_labels.findIndex((l) => l.label_id === oldID);
        if (i >= 0) {
          if (album.album_labels.some((l) => l.label_id === newID)) {
            album.album_labels.splice(i, 1);
          } else {
            album.album_labels[i].label_id = newID;
          }
        }
        state.albums[album.id] = album;
      }
    },
  },
  actions: {
    async index({ commit, rootState }) {
      const generator = index(rootState.auth);
      try {
        await fetchAll(commit, generator, "setAlbums");
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async create({ commit, rootState }, newAlbum) {
      try {
        const result = await create(rootState.auth, newAlbum);
        commit("setAlbum", { id: result.id, album: result });
        return result.id;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async read({ commit, rootState }, id) {
      try {
        const result = await read(rootState.auth, id);
        commit("setAlbum", { id, album: result });
        return result.id;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async update({ commit, rootState }, { id, newAlbum }) {
      try {
        const result = await update(rootState.auth, id, newAlbum);
        commit("setAlbum", { id, album: result });
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async destroy({ commit, rootState }, id) {
      try {
        await destroy(rootState.auth, id);
        commit("removeAlbum", id);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async destroyEmpty({ commit, dispatch, rootState }) {
      try {
        await destroyEmpty(rootState.auth);
        dispatch("index");
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
  },
  getters: {
    albums: (state) => Object.values(state.albums),
    albumsByTitle: (state, getters) =>
      getters.albums.sort(compareAlbumsByTitleFirst),
    albumsFilterByArtist: (state, getters) => (id) => {
      const aaFilter = (a) =>
        a.album_artists.filter((aa) => `${aa.artist_id}` === `${id}`).length >
        0;
      return getters.albums.filter(aaFilter).sort(compareAlbumsByReleaseFirst);
    },
    albumsFilterByLabel: (state, getters) => (id) => {
      const alFilter = (a) =>
        a.album_labels.filter((l) => `${l.label_id}` === `${id}`).length > 0;
      return getters.albums.filter(alFilter).sort(compareAlbumsByReleaseFirst);
    },
    albumsFlagged: (state, getters) => {
      return getters.albums
        .filter((t) => t.review_comment !== null)
        .sort(compareAlbumsByTitleFirst);
    },
    albumsOnThisDay: (state, getters, rootState) => {
      const today = new Date(rootState.currentDay);
      return getters.albums
        .filter(
          (r) =>
            `${r.release.slice(-5, -3)}` ===
              `${today.getMonth() + 1}`.padStart(2, "0") &&
            `${r.release.slice(-2)}` === `${today.getDate()}`.padStart(2, "0")
        )
        .sort(compareAlbumsByReleaseFirst);
    },
  },
};
