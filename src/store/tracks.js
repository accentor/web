import Vue from "vue";
import { create, destroy, index, update } from "../api/tracks";
import { compareStrings } from "../comparators";

export default {
  namespaced: true,
  state: {
    tracks: {}
  },
  mutations: {
    setTracks(state, payload) {
      state.tracks = {};
      for (let track of payload) {
        state.tracks[track.id] = track;
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
    }
  },
  actions: {
    index({ commit, rootState }) {
      return index(rootState.auth)
        .then(result => {
          commit("setTracks", result);
          return Promise.resolve(true);
        })
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    create({ commit, rootState }, newTrack) {
      return create(rootState.auth, newTrack)
        .then(result => {
          commit("setTrack", { id: result.id, track: result });
          return Promise.resolve(result.id);
        })
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    update({ commit, rootState }, { id, newTrack }) {
      return update(rootState.auth, id, newTrack)
        .then(result => {
          commit("setTrack", { id, track: result });
          return Promise.resolve(true);
        })
        .catch(error => {
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
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    }
  },
  getters: {
    tracks: state => Object.values(state.tracks),
    tracksByAlbumAndNumber: (state, getters, rootState) => {
      return getters.tracks.sort((a1, a2) => {
        const albumOrder = compareStrings(
          rootState.albums.albums[a1.album_id].title,
          rootState.albums.albums[a2.album_id].title
        );
        return albumOrder === 0 ? a1.number - a2.number : albumOrder;
      });
    },
    tracksFilterByAlbum: (state, getters) => id => {
      return getters.tracks
        .filter(t => `${t.album_id}` === `${id}`)
        .sort((a1, a2) => {
          return a1.number - a2.number;
        });
    },
    tracksFilterByArtist: (state, getters, rootState) => id => {
      const taFilter = t =>
        t.track_artists.filter(ta => `${ta.artist_id}` === `${id}`).length > 0;
      return getters.tracks.filter(taFilter).sort((a1, a2) => {
        const albumOrder = compareStrings(
          rootState.albums.albums[a1.album_id].title,
          rootState.albums.albums[a2.album_id].title
        );
        return albumOrder === 0 ? a1.number - a2.number : albumOrder;
      });
    },
    tracksFlagged: (state, getters) => {
      return getters.tracks.filter(t => t.review_comment !== null);
    }
  }
};
