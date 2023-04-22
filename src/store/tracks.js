import Vue from "vue";
import api from "@/api";
import { fetchAll } from "./actions";
import { compareTracks } from "../comparators";
import { TracksScope } from "@accentor/api-client-js";

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
      const loaded = new Date();
      for (let track of payload) {
        track.loaded = loaded;
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
    updateAlbumOccurence(state, { newID, oldID }) {
      const oldTracks = state.tracks;
      state.tracks = {};
      for (const track of Object.values(oldTracks)) {
        if (track.album_id == oldID) {
          track.album_id = newID;
        }
        state.tracks[track.id] = track;
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
    async index({ commit, rootState }, scope = new TracksScope()) {
      const generator = api.tracks.index(rootState.auth, scope);
      try {
        await this.tracksRestored;
        await fetchAll(commit, generator, "setTracks", scope);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async create({ commit, rootState }, newTrack) {
      try {
        const result = await api.tracks.create(rootState.auth, {
          track: newTrack,
        });
        commit("setTrack", { id: result.id, track: result });
        return result.id;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async read({ commit, rootState }, id) {
      try {
        const track = await api.tracks.read(rootState.auth, id);
        await this.tracksRestored;
        commit("setTrack", { id, track });
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async update({ commit, rootState }, { id, newTrack }) {
      try {
        const result = await api.tracks.update(rootState.auth, id, {
          track: newTrack,
        });
        commit("setTrack", { id, track: result });
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async destroy({ commit, rootState }, id) {
      try {
        await api.tracks.destroy(rootState.auth, id);
        commit("removeTrack", id);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async merge({ commit, dispatch, rootState }, { newID, oldID }) {
      try {
        await api.tracks.merge(rootState.auth, newID, oldID);
        await dispatch("read", newID);
        commit("removeTrack", oldID);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
  },
  getters: {
    tracks: (state) => Object.values(state.tracks),
    tracksByAlbumAndNumber: (state, getters, rootState) => {
      return getters.tracks.sort(compareTracks(rootState.albums.albums));
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
      return (getters.tracksBinnedByGenre[id] || []).sort(
        compareTracks(rootState.albums.albums)
      );
    },
    tracksFilterByArtist: (state, getters, rootState) => (id) => {
      return (getters.tracksBinnedByArtist[id] || []).sort(
        compareTracks(rootState.albums.albums)
      );
    },
    tracksEmpty: (state, getters, rootState) => {
      return getters.tracks
        .filter((t) => t.length === null)
        .sort(compareTracks(rootState.albums.albums));
    },
    tracksFlagged: (state, getters, rootState) => {
      return getters.tracks
        .filter((t) => t.review_comment !== null)
        .sort(compareTracks(rootState.albums.albums));
    },
  },
};
