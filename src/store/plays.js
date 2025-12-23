import api from "@/api";
import { TracksScope } from "@accentor/api-client-js";
import { fetchAll } from "./actions";
import { shallowRef } from "vue";

export default {
  namespaced: true,
  state: {
    plays: {},
    startLoading: new Date(0),
  },
  mutations: {
    setPlays(state, payload) {
      const oldPlays = state.plays;
      state.plays = {};
      for (let id in oldPlays) {
        state.plays[id] = oldPlays[id];
      }
      const loaded = new Date();
      for (let play of payload) {
        play.loaded = loaded;
        state.plays[play.id] = shallowRef(play);
      }
    },
    setPlay(state, { id, play }) {
      const oldPlays = state.plays;
      state.plays = {};
      for (let id in oldPlays) {
        state.plays[id] = oldPlays[id];
      }
      play.loaded = new Date();
      state.plays[id] = shallowRef(play);
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeOld(state) {
      const oldPlays = state.plays;
      state.plays = {};
      for (let id in oldPlays) {
        if (oldPlays[id].loaded > state.startLoading) {
          state.plays[id] = oldPlays[id];
        }
      }
    },
  },
  actions: {
    async index({ commit, rootState }, scope = new TracksScope()) {
      const generator = api.plays.index(rootState.auth.apiToken, scope);
      try {
        await this.playsRestored;
        await fetchAll(commit, generator, "setPlays", scope);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async create({ commit, rootState }, track_id) {
      try {
        const result = await api.plays.create(rootState.auth.apiToken, {
          play: {
            track_id,
            played_at: new Date(),
          },
        });
        commit("setPlay", { id: result.id, play: result });
        return result.id;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
  },
  getters: {
    plays: (state) => Object.values(state.plays),
    playStatsByTrack: (state, getters) => {
      const result = {};
      for (let play of getters.plays) {
        if (!(play.track_id in result)) {
          result[play.track_id] = {
            count: 1,
            last_played_at: new Date(play.played_at),
          };
        } else {
          result[play.track_id].count++;

          if (result[play.track_id].last_played_at < new Date(play.played_at)) {
            result[play.track_id].last_played_at = new Date(play.played_at);
          }
        }
      }
      return result;
    },
    playStatsByAlbum: (state, getters, rootState) => {
      const result = {};
      for (let track_id in getters.playStatsByTrack) {
        // If this track is not (yet) loaded, we need to skip it
        if (!rootState.tracks.tracks[track_id]) {
          continue;
        }

        const album_id = rootState.tracks.tracks[track_id].album_id;
        if (!(album_id in result)) {
          result[album_id] = {
            last_played_at: getters.playStatsByTrack[track_id].last_played_at,
          };
        } else if (
          result[album_id].last_played_at <
          getters.playStatsByTrack[track_id].last_played_at
        ) {
          result[album_id].last_played_at =
            getters.playStatsByTrack[track_id].last_played_at;
        }
      }
      return result;
    },
    playStatsByArtist: (state, getters, rootState) => {
      const result = {};
      for (let track_id in getters.playStatsByTrack) {
        // If this track is not (yet) loaded, we need to skip it
        if (!rootState.tracks.tracks[track_id]) {
          continue;
        }

        for (let ta of rootState.tracks.tracks[track_id].track_artists) {
          if (!(ta.artist_id in result)) {
            result[ta.artist_id] = {
              count: getters.playStatsByTrack[track_id].count,
              last_played_at: getters.playStatsByTrack[track_id].last_played_at,
            };
          } else {
            result[ta.artist_id].count +=
              getters.playStatsByTrack[track_id].count;
            if (
              result[ta.artist_id].last_played_at <
              getters.playStatsByTrack[track_id].last_played_at
            ) {
              result[ta.artist_id].last_played_at =
                getters.playStatsByTrack[track_id].last_played_at;
            }
          }
        }
      }
      return result;
    },
  },
};
