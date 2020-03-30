import Vue from "vue";
import { create, destroy } from "../api/locations";
import { indexGenerator } from "../api/fetch";
import { fetchAll } from "./commit";

export default {
  namespaced: true,
  state: {
    locations: {},
  },
  mutations: {
    setLocations(state, payload) {
      const loaded = new Date();
      for (let location in payload) {
        payload[location].loaded = loaded;
      }
      state.locations = Object.assign({}, state.locations, payload);
    },
    setLocation(state, { id, location }) {
      location.loaded = new Date();
      Vue.set(state.locations, id, location);
    },
    removeLocation(state, id) {
      Vue.delete(state.locations, id);
    },
    removeOld(state, startLoading) {
      Object.values(state.locations)
        .filter((obj) => {
          return obj.loaded < startLoading;
        })
        .forEach((obj) => {
          Vue.delete(state.locations, obj.id);
        });
    },
  },
  actions: {
    index({ commit, rootState }) {
      const indexLocations = indexGenerator("locations", rootState.auth);
      const startLoading = new Date();
      return fetchAll(
        { commit },
        {
          generator: indexLocations,
          commitAction: "setLocations",
        }
      )
        .then(() => {
          commit("removeOld", startLoading);
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
