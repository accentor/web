import Vue from "vue";
import { index, create, destroy, update } from "../api/users";
import { fetchAll } from "./actions";
import { compareStrings } from "../comparators";

export default {
  namespaced: true,
  state: {
    users: {},
    startLoading: new Date(0),
  },
  mutations: {
    setUsers(state, payload) {
      const oldUsers = state.users;
      state.users = {};
      for (let id in oldUsers) {
        state.users[id] = oldUsers[id];
      }
      for (let user of payload) {
        state.users[user.id] = user;
      }
    },
    setUser(state, { id, user }) {
      const oldUsers = state.users;
      state.users = {};
      for (let id in oldUsers) {
        state.users[id] = oldUsers[id];
      }
      user.loaded = new Date();
      state.users[id] = user;
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeUser(state, id) {
      Vue.delete(state.users, id);
    },
    removeOld(state) {
      const oldUsers = state.users;
      state.users = {};
      for (let id in oldUsers) {
        if (oldUsers[id].loaded > state.startLoading) {
          state.users[id] = oldUsers[id];
        }
      }
    },
  },
  actions: {
    async index({ commit, rootState }) {
      const generator = index(rootState.auth);
      try {
        await fetchAll(commit, generator, "setUsers");
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async create({ commit, rootState }, newUser) {
      try {
        const result = await create(rootState.auth, newUser);
        commit("setUser", { id: result.id, user: result });
        return result.id;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async update({ commit, rootState }, { id, newUser }) {
      try {
        const result = await update(rootState.auth, id, newUser);
        commit("setUser", { id, user: result });
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async destroy({ commit, rootState }, id) {
      try {
        await destroy(rootState.auth, id);
        commit("removeUser", id);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
  },
  getters: {
    users: (state) => Object.values(state.users),
    usersByName: (state, getters) =>
      getters.users.sort((u1, u2) => compareStrings(u1.name, u2.name)),
  },
};
