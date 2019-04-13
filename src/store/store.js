import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import auth from "./auth";
import users from "./users";
import artists from "./artists";

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
    users
  },
  state: {},
  mutations: {},
  actions: {},
  getters: {}
});
