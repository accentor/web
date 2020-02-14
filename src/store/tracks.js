import Vue from "vue";
import { create, destroy, update } from "../api/tracks";
import { index } from "./commit";
import { compareStrings } from "../comparators";

export default {
  namespaced: true,
  state: {
    tracks: {},
  },
  mutations: {
    setTracks(state, payload) {
      for (let track of payload) {
        Vue.set(state.tracks, track.id, track);
      }
    },
    setTrack(state, { id, track }) {
      if (state.tracks[id]) {
        Vue.delete(state.tracks, id);
      }
      Vue.set(state.tracks, id, track);
    },
    removeTrack(state, id) {
      Vue.delete(state.tracks, id);
    },
    updateGenreOccurence(state, { newID, oldID }) {
      for (const t in state.tracks) {
        const i = state.tracks[t].genre_ids.findIndex(
          (gId) => `${gId}` === `${oldID}`
        );
        if (i >= 0) {
          state.tracks[t].genre_ids.splice(i, 1);
          if (
            state.tracks[t].genre_ids.findIndex(
              (gId) => `${gId}` === `${newID}`
            ) === -1
          ) {
            state.tracks[t].genre_ids.push(newID);
          }
        }
      }
    },
  },
  actions: {
    index({ commit, rootState }) {
      return index(
        { commit, auth: rootState.auth },
        { url: "tracks", commitAction: "setTracks" }
      )
        .then(() => {
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    create({ commit, rootState }, newTrack) {
      return create(rootState.auth, newTrack)
        .then((result) => {
          commit("setTrack", { id: result.id, track: result });
          return Promise.resolve(result.id);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    update({ commit, rootState }, { id, newTrack }) {
      return update(rootState.auth, id, newTrack)
        .then((result) => {
          commit("setTrack", { id, track: result });
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
          commit("removeTrack", id);
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
  },
  getters: {
    tracks: (state) => Object.values(state.tracks),
    tracksByAlbumAndNumber: (state, getters, rootState) => {
      return getters.tracks.sort((a1, a2) => {
        let albumOrder = compareStrings(
          rootState.albums.albums[a1.album_id].normalized_title,
          rootState.albums.albums[a2.album_id].normalized_title
        );
        albumOrder =
          albumOrder === 0
            ? compareStrings(
                rootState.albums.albums[a1.album_id].release,
                rootState.albums.albums[a2.album_id].release
              )
            : albumOrder;
        albumOrder = albumOrder === 0 ? a2.album_id - a1.album_id : albumOrder;
        return albumOrder === 0 ? a1.number - a2.number : albumOrder;
      });
    },
    tracksFilterByAlbum: (state, getters) => (id) => {
      return getters.tracks
        .filter((t) => `${t.album_id}` === `${id}`)
        .sort((a1, a2) => {
          return a1.number - a2.number;
        });
    },
    tracksFilterByArtist: (state, getters, rootState) => (id) => {
      const taFilter = (t) =>
        t.track_artists.filter((ta) => `${ta.artist_id}` === `${id}`).length >
        0;
      return getters.tracks.filter(taFilter).sort((a1, a2) => {
        let albumOrder = compareStrings(
          rootState.albums.albums[a1.album_id].normalized_title,
          rootState.albums.albums[a2.album_id].normalized_title
        );
        albumOrder =
          albumOrder === 0
            ? compareStrings(
                rootState.albums.albums[a1.album_id].release,
                rootState.albums.albums[a2.album_id].release
              )
            : albumOrder;
        albumOrder = albumOrder === 0 ? a2.album_id - a1.album_id : albumOrder;
        return albumOrder === 0 ? a1.number - a2.number : albumOrder;
      });
    },
    tracksFilterByGenre: (state, getters, rootState) => (id) => {
      const tgFilter = (t) =>
        t.genre_ids.filter((gId) => `${gId}` === `${id}`).length > 0;
      return getters.tracks.filter(tgFilter).sort((a1, a2) => {
        let albumOrder = compareStrings(
          rootState.albums.albums[a1.album_id].normalized_title,
          rootState.albums.albums[a2.album_id].normalized_title
        );
        albumOrder =
          albumOrder === 0
            ? compareStrings(
                rootState.albums.albums[a1.album_id].release,
                rootState.albums.albums[a2.album_id].release
              )
            : albumOrder;
        albumOrder = albumOrder === 0 ? a2.album_id - a1.album_id : albumOrder;
        return albumOrder === 0 ? a1.number - a2.number : albumOrder;
      });
    },
    tracksFlagged: (state, getters, rootState) => {
      return getters.tracks
        .filter((t) => t.review_comment !== null)
        .sort((a1, a2) => {
          let albumOrder = compareStrings(
            rootState.albums.albums[a1.album_id].normalized_title,
            rootState.albums.albums[a2.album_id].normalized_title
          );
          albumOrder =
            albumOrder === 0
              ? compareStrings(
                  rootState.albums.albums[a1.album_id].release,
                  rootState.albums.albums[a2.album_id].release
                )
              : albumOrder;
          albumOrder =
            albumOrder === 0 ? a2.album_id - a1.album_id : albumOrder;
          return albumOrder === 0 ? a1.number - a2.number : albumOrder;
        });
    },
  },
};
