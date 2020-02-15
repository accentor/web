import Vue from "vue";
import { create, destroy } from "../api/locations";
import { index } from "./commit";

export default {
  namespaced: true,
  state: {
    locations: {},
  },
  mutations: {
    setLocations(state, payload) {
      state.locations = Object.assign({}, state.locations, payload);
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
      return index(
        { commit, auth: rootState.auth },
        { url: "locations", commitAction: "setLocations" }
      )
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
