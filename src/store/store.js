import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import artists from "./artists";
import auth from "./auth";
import rescan from "./rescan";
import users from "./users";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      paths: ["auth"]
    })
  ],
  strict: process.env.NODE_ENV !== "production",
  modules: {
    artists,
    auth,
    rescan,
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
