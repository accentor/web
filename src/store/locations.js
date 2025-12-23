import Vue from "vue";
import api from "@/api";
import { fetchAll } from "./actions";
import { useErrorsStore } from "./errors";
import { useAuthStore } from "./auth";

export default {
  namespaced: true,
  state: {
    locations: {},
    startLoading: new Date(0),
  },
  mutations: {
    setLocations(state, payload) {
      const oldLocations = state.locations;
      state.locations = {};
      for (let id in oldLocations) {
        state.locations[id] = oldLocations[id];
      }
      const loaded = new Date();
      for (let obj of payload) {
        obj.loaded = loaded;
        state.locations[obj.id] = obj;
      }
    },
    setLocation(state, { id, location }) {
      const oldLocations = state.locations;
      state.locations = {};
      for (let id in oldLocations) {
        state.locations[id] = oldLocations[id];
      }
      location.loaded = new Date();
      state.locations[id] = location;
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeLocation(state, id) {
      Vue.delete(state.locations, id);
    },
    removeOld(state) {
      const oldLocations = state.locations;
      state.locations = {};
      for (let id in oldLocations) {
        if (oldLocations[id].loaded > state.startLoading) {
          state.locations[id] = oldLocations[id];
        }
      }
    },
  },
  actions: {
    async index({ commit }) {
      const generator = api.locations.index(useAuthStore().apiToken);
      try {
        await fetchAll(commit, generator, "setLocations");
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async create({ commit }, newLocation) {
      try {
        const result = await api.locations.create(useAuthStore().apiToken, {
          location: newLocation,
        });
        commit("setLocation", { id: result.id, location: result });
        return result.id;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async destroy({ commit }, id) {
      try {
        await api.locations.destroy(useAuthStore().apiToken, id);
        commit("removeLocation", id);
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
  },
  getters: {
    locations: (state) =>
      Object.values(state.locations).sort((l1, l2) => l1.id - l2.id),
  },
};
