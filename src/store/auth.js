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
      const oldAuthTokens = state.authTokens;
      state.authTokens = {};
      for (let id in oldAuthTokens) {
        state.authTokens[id] = oldAuthTokens[id];
      }
      for (let obj of payload) {
        state.authTokens[obj.id] = obj;
      }
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeAuthToken(state, id) {
      Vue.delete(state.authTokens, id);
    },
    removeOld(state) {
      const oldAuthTokens = state.authTokens;
      state.authTokens = {};
      for (let id in oldAuthTokens) {
        if (oldAuthTokens[id].loaded > state.startLoading) {
          state.authTokens[id] = oldAuthTokens[id];
        }
      }
    },
  },
  actions: {
    async login({ commit }, data) {
      try {
        const result = await create(data);
        commit("login", result);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async logout({ commit, state }) {
      try {
        await destroy(state, state.id);
        commit("logout");
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async index({ commit, rootState }) {
      const generator = index(rootState.auth);
      try {
        await fetchAll(commit, generator, "setAuthTokens");
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async destroy({ commit, rootState }, id) {
      try {
        await destroy(rootState.auth, id);
        commit("removeAuthToken", id);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
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
