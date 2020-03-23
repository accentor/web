import Vue from "vue";
import { create, destroy, index } from "../api/locations";

export default {
  namespaced: true,
  state: {
    locations: {},
  },
  mutations: {
    setLocations(state, payload) {
      state.locations = {};
      for (let location of payload) {
        state.locations[location.id] = location;
      }
    },
    setLocation(state, { id, location }) {
      if (state.locations[id]) {
        Vue.delete(state.locations, id);
      }
      Vue.set(state.locations, id, location);
    },
    removeLocation(state, id) {
      Vue.delete(state.locations, id);
    },
  },
  actions: {
    index({ commit, rootState }) {
      return index(rootState.auth)
        .then((result) => {
          commit("setLocations", result);
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
