import Vue from "vue";
import { index, create, destroy } from "../api/locations";
import { fetchAll } from "./actions";

export default {
  namespaced: true,
  state: {
    locations: {},
    startLoading: new Date(0),
  },
  mutations: {
    setLocations(state, payload) {
      let oldLocations = { ...state.locations };
      state.locations = {};
      for (let id in oldLocations) {
        state.locations[id] = oldLocations[id];
      }
      for (let obj of payload) {
        state.locations[obj.id] = obj;
      }
    },
    setLocation(state, { id, location }) {
      const oldLocations = { ...state.locations };
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
      Object.values(state.locations)
        .filter((obj) => {
          return obj.loaded < state.startLoading;
        })
        .forEach((obj) => {
          Vue.delete(state.locations, obj.id);
        });
    },
  },
  actions: {
    index({ commit, rootState }) {
      const generator = index(rootState.auth);
      return fetchAll(commit, generator, "setLocations")
        .then(() => {
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    create({ commit, rootState }, newLocation) {
      return create(rootState.auth, newLocation)
        .then((result) => {
          commit("setLocation", { id: result.id, location: result });
          return Promise.resolve(result.id);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    destroy({ commit, rootState }, id) {
      return destroy(rootState.auth, id)
        .then(() => {
          commit("removeLocation", id);
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
  },
  getters: {
    locations: (state) =>
      Object.values(state.locations).sort((l1, l2) => l1.id - l2.id),
  },
};
