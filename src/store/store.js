import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import albums from "./albums";
import artists from "./artists";
import auth from "./auth";
import genres from "./genres";
import rescan from "./rescan";
import tracks from "./tracks";
import users from "./users";
import labels from "./labels";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      paths: ["auth"]
    })
  ],
  strict: process.env.NODE_ENV !== "production",
  modules: {
    albums,
    artists,
    auth,
    genres,
    labels,
    rescan,
    tracks,
    users
  },
  state: {
    errors: []
  },
  mutations: {
    addError(state, error) {
      state.errors.push(error);
    },
    clearErrors(state) {
      state.errors = [];
    }
  },
  actions: {},
  getters: {}
});
