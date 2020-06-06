import Vue from "vue";
import { index, create, destroy } from "../api/auth_tokens";
import { fetchAll } from "./actions";

export default {
  namespaced: true,
  state: {
    authTokens: {},
    device_id: null,
    secret: null,
    user_id: null,
    id: null,
    startLoading: new Date(0),
  },
  mutations: {
    login(state, payload) {
      state.device_id = payload.device_id;
      state.secret = payload.secret;
      state.user_id = payload.user_id;
      state.id = payload.id;
    },
    logout(state) {
      state.device_id = null;
      state.secret = null;
      state.user_id = null;
      state.id = null;
    },
    setAuthTokens(state, payload) {
      state.authTokens = Object.assign({}, state.authTokens, payload);
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeAuthToken(state, id) {
      Vue.delete(state.authTokens, id);
    },
    removeOld(state) {
      Object.values(state.authTokens)
        .filter((obj) => {
          return obj.loaded < state.startLoading;
        })
        .forEach((obj) => {
          Vue.delete(state.authTokens, obj.id);
        });
    },
  },
  actions: {
    login(context, data) {
      return create(data)
        .then((result) => {
          context.commit("login", result);
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    logout({ commit, state }) {
      return destroy(state, state.id)
        .then(() => {
          commit("logout");
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    index({ commit, rootState }) {
      const generator = index(rootState.auth);
      return fetchAll(commit, generator, "setAuthTokens")
        .then(() => {
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    destroy({ commit, rootState }, id) {
      return destroy(rootState.auth, id)
        .then(() => {
          commit("removeAuthToken", id);
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
  },
  getters: {
    authTokens: (state) =>
      Object.values(state.authTokens).sort((a1, a2) => a1.id - a2.id),
    loggedIn: (state) => {
      return state.secret !== null && state.device_id !== null;
    },
    currentSession: (state) => {
      return state.id;
    },
    currentUser: (state, getters, rootState) => {
      return rootState.users.users[state.user_id];
    },
    isModerator: (state, getters) => {
      return (
        getters.isAdmin ||
        (getters.currentUser && getters.currentUser.permission === "moderator")
      );
    },
    isAdmin: (state, getters) => {
      return getters.currentUser && getters.currentUser.permission === "admin";
    },
  },
};
