import Vue from "vue";
import { index, create, destroy, update, read, merge } from "../api/tracks";
import { fetchAll } from "./actions";
import { compareStrings, compareTracks } from "../comparators";

export default {
  namespaced: true,
  state: {
    tracks: {},
    startLoading: new Date(0),
  },
  mutations: {
    setTracks(state, payload) {
      const oldTracks = state.tracks;
      state.tracks = {};
      for (let id in oldTracks) {
        state.tracks[id] = oldTracks[id];
      }
      for (let track of payload) {
        state.tracks[track.id] = track;
      }
    },
    setTrack(state, { id, track }) {
      const oldTracks = state.tracks;
      state.tracks = {};
      for (let id in oldTracks) {
        state.tracks[id] = oldTracks[id];
      }
      track.loaded = new Date();
      state.tracks[id] = track;
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeTrack(state, id) {
      Vue.delete(state.tracks, id);
    },
    removeOld(state) {
      const oldTracks = state.tracks;
      state.tracks = {};
      for (let id in oldTracks) {
        if (oldTracks[id].loaded > state.startLoading) {
          state.tracks[id] = oldTracks[id];
        }
      }
    },
    removeArtistOccurence(state, oldID) {
      const oldTracks = state.tracks;
      state.tracks = {};
      for (let track of Object.values(oldTracks)) {
        if (track.track_artists.some((ta) => ta.artist_id === oldID)) {
          track.track_artists = track.track_artists.filter(
            (ta) => ta.artist_id !== oldID
          );
        }
        state.tracks[track.id] = track;
      }
    },
    updateArtistOccurence(state, { newID, oldID }) {
      const oldTracks = state.tracks;
      state.tracks = {};
      for (let track of Object.values(oldTracks)) {
        if (track.track_artists.some((ta) => ta.artist_id === oldID)) {
          track.track_artists.forEach((ta) => {
            if (ta.artist_id === oldID) {
              ta.artist_id = newID;
            }
          });
        }
        state.tracks[track.id] = track;
      }
    },
    removeGenreOccurence(state, oldID) {
      const oldTracks = state.tracks;
      state.tracks = {};
      for (const track of Object.values(oldTracks)) {
        const i = track.genre_ids.findIndex((gId) => `${gId}` === `${oldID}`);
        if (i >= 0) {
          track.genre_ids.splice(i, 1);
        }
        state.tracks[track.id] = track;
      }
    },
    updateGenreOccurence(state, { newID, oldID }) {
      const oldTracks = state.tracks;
      state.tracks = {};
      for (const track of Object.values(oldTracks)) {
        const i = track.genre_ids.findIndex((gId) => `${gId}` === `${oldID}`);
        if (i >= 0) {
          track.genre_ids.splice(i, 1);
          if (!track.genre_ids.includes(newID)) {
            track.genre_ids.push(newID);
          }
        }
        state.tracks[track.id] = track;
      }
    },
  },
  actions: {
    index({ commit, rootState }) {
      const generator = index(rootState.auth);
      return fetchAll(commit, generator, "setTracks")
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
    async read({ commit, rootState }, id) {
      try {
        const track = await read(rootState.auth, id);
        commit("setTrack", { id, track });
      } catch (error) {
        this.commit("addError", error);
      }
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
    async merge({ commit, rootState }, { newID, oldID }) {
      try {
        await merge(rootState.auth, newID, oldID);
        await dispatch("read", newID);
        commit("removeTrack", oldID);
      } catch (error) {
        this.commit("addError", error);
      }
    },
  },
  getters: {
    tracks: (state) => Object.values(state.tracks),
    tracksByAlbumAndNumber: (state, getters, rootState) => {
      return getters.tracks.sort((t1, t2) => compareTracks(rootState, t1, t2));
    },
    tracksBinnedByAlbum: (state, getters) => {
      const result = {};
      for (let track of getters.tracks) {
        if (!(track.album_id in result)) {
          result[track.album_id] = [];
        }
        result[track.album_id].push(track);
      }
      return result;
    },
    tracksBinnedByGenre: (state, getters) => {
      const result = {};
      for (let track of getters.tracks) {
        for (let genreId of track.genre_ids) {
          if (!(genreId in result)) {
            result[genreId] = [];
          }
          result[genreId].push(track);
        }
      }
      return result;
    },
    tracksBinnedByArtist: (state, getters) => {
      const result = {};
      for (let track of getters.tracks) {
        for (let ta of track.track_artists) {
          if (!(ta.artist_id in result)) {
            result[ta.artist_id] = [];
          }
          if (!result[ta.artist_id].includes(track)) {
            result[ta.artist_id].push(track);
          }
        }
      }
      return result;
    },
    tracksFilterByAlbum: (state, getters) => (id) => {
      return (getters.tracksBinnedByAlbum[id] || []).sort(
        (t1, t2) => t1.number - t2.number
      );
    },
    tracksFilterByGenre: (state, getters, rootState) => (id) => {
      return (getters.tracksBinnedByGenre[id] || []).sort((t1, t2) =>
        compareTracks(rootState, t1, t2)
      );
    },
    tracksFilterByArtist: (state, getters, rootState) => (id) => {
      return (getters.tracksBinnedByArtist[id] || []).sort((t1, t2) =>
        compareTracks(rootState, t1, t2)
      );
    },
    tracksFlagged: (state, getters, rootState) => {
      return getters.tracks
        .filter((t) => t.review_comment !== null)
        .sort((t1, t2) => compareTracks(rootState, t1, t2));
    },
  },
};
