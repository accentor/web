import Vue from "vue";
import { index, create, destroy, update, destroyEmpty } from "../api/albums";
import { fetchAll } from "./actions";
import { compareStrings } from "../comparators";

export default {
  namespaced: true,
  state: {
    albums: {},
    startLoading: new Date(0),
  },
  mutations: {
    setAlbums(state, payload) {
      const oldAlbums = { ...state.albums };
      state.albums = {};
      for (let id in oldAlbums) {
        state.albums[id] = oldAlbums[id];
      }
      for (let album of payload) {
        state.albums[album.id] = album;
      }
    },
    setAlbum(state, { id, album }) {
      const oldAlbums = { ...state.albums };
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
      Object.values(state.albums)
        .filter((obj) => {
          return obj.loaded < state.startLoading;
        })
        .forEach((obj) => {
          Vue.delete(state.albums, obj.id);
        });
    },
    updateLabelOccurence(state, { newID, oldID }) {
      for (const a in state.albums) {
        const i = state.albums[a].label_ids.findIndex(
          (lId) => `${lId}` === `${oldID}`
        );
        if (i >= 0) {
          state.albums[a].label_ids.splice(i, 1);
          if (
            state.albums[a].label_ids.findIndex(
              (lId) => `${lId}` === `${newID}`
            ) === -1
          ) {
            state.albums[t].label_ids.push(newID);
          }
        }
      }
    },
  },
  actions: {
    index({ commit, rootState }) {
      const generator = index(rootState.auth);
      return fetchAll(commit, generator, "setAlbums")
        .then(() => {
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    create({ commit, rootState }, newAlbum) {
      return create(rootState.auth, newAlbum)
        .then((result) => {
          commit("setAlbum", { id: result.id, album: result });
          return Promise.resolve(result.id);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    update({ commit, rootState }, { id, newAlbum }) {
      return update(rootState.auth, id, newAlbum)
        .then((result) => {
          commit("setAlbum", { id, album: result });
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
          commit("removeAlbum", id);
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
          return this.dispatch("albums/index");
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
  },
  getters: {
    albums: (state) => Object.values(state.albums),
    albumsByTitle: (state, getters) =>
      getters.albums.sort((a1, a2) =>
        compareStrings(a1.normalized_title, a2.normalized_title)
      ),
    albumsFilterByArtist: (state, getters) => (id) => {
      const aaFilter = (a) =>
        a.album_artists.filter((aa) => `${aa.artist_id}` === `${id}`).length >
        0;
      return getters.albums
        .filter(aaFilter)
        .sort(
          (a1, a2) =>
            compareStrings(a1.release, a2.release) ||
            compareStrings(a1.normalized_title, a2.normalized_title)
        );
    },
    albumsFilterByLabel: (state, getters) => (id) => {
      const alFilter = (a) =>
        a.album_labels.filter((l) => `${l.label_id}` === `${id}`).length > 0;
      return getters.albums
        .filter(alFilter)
        .sort(
          (a1, a2) =>
            compareStrings(a1.release, a2.release) ||
            compareStrings(a1.normalized_title, a2.normalized_title)
        );
    },
    albumsFlagged: (state, getters) => {
      return getters.albums
        .filter((t) => t.review_comment !== null)
        .sort((a1, a2) =>
          compareStrings(a1.normalized_title, a2.normalized_title)
        );
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
        .sort(
          (a1, a2) =>
            compareStrings(a1.release, a2.release) ||
            compareStrings(a1.normalized_title, a2.normalized_title)
        );
    },
  },
};
