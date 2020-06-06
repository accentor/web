import Vue from "vue";
import { index, create, destroy, update } from "../api/tracks";
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
      state.tracks = Object.assign({}, state.tracks, payload);
    },
    setTrack(state, { id, track }) {
      track.loaded = new Date();
      Vue.set(state.tracks, id, track);
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeTrack(state, id) {
      Vue.delete(state.tracks, id);
    },
    removeOld(state) {
      Object.values(state.tracks)
        .filter((obj) => {
          return obj.loaded < state.startLoading;
        })
        .forEach((obj) => {
          Vue.delete(state.tracks, obj.id);
        });
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
      return getters.tracks.sort((t1, t2) => compareTracks(rootState, t1, t2));
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
      return getters.tracks
        .filter(taFilter)
        .sort((t1, t2) => compareTracks(rootState, t1, t2));
    },
    tracksFilterByGenre: (state, getters, rootState) => (id) => {
      const tgFilter = (t) =>
        t.genre_ids.filter((gId) => `${gId}` === `${id}`).length > 0;
      return getters.tracks
        .filter(tgFilter)
        .sort((t1, t2) => compareTracks(rootState, t1, t2));
    },
    tracksFlagged: (state, getters, rootState) => {
      return getters.tracks
        .filter((t) => t.review_comment !== null)
        .sort((t1, t2) => compareTracks(rootState, t1, t2));
    },
  },
};
