import api from "@/api";
import { TracksScope } from "@accentor/api-client-js";
import { fetchAll } from "./actions";

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
        state.plays[play.id] = play;
      }
    },
    setPlay(state, { id, play }) {
      const oldPlays = state.plays;
      state.plays = {};
      for (let id in oldPlays) {
        state.plays[id] = oldPlays[id];
      }
      play.loaded = new Date();
      state.plays[id] = play;
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
      const generator = api.plays.index(rootState.auth, scope);
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
        const result = await api.plays.create(rootState.auth, {
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
    playCountsByTrack: (state, getters) => {
      const result = {};
      for (let play of getters.plays) {
        if (!(play.track_id in result)) {
          result[play.track_id] = 0;
        }
        result[play.track_id]++;
      }
      return result;
    },
  },
};
