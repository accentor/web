import Vue from "vue";
import { create, destroy, update } from "../api/users";
import { index } from "./commit";
import { compareStrings } from "../comparators";

export default {
  namespaced: true,
  state: {
    users: {},
  },
  mutations: {
    setUsers(state, payload) {
      state.users = Object.assign({}, state.users, payload);
    },
    setUser(state, { id, user }) {
      if (state.users[id]) {
        Vue.delete(state.users, id);
      }
      Vue.set(state.users, id, user);
    },
    removeUser(state, id) {
      Vue.delete(state.users, id);
    },
  },
  actions: {
    index({ commit, rootState }) {
      return index(
        { commit, auth: rootState.auth },
        { url: "users", commitAction: "setUsers" }
      )
        .then(() => {
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    create({ commit, rootState }, newUser) {
      return create(rootState.auth, newUser)
        .then((result) => {
          commit("setUser", { id: result.id, user: result });
          return Promise.resolve(result.id);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    update({ commit, rootState }, { id, newUser }) {
      return update(rootState.auth, id, newUser)
        .then((result) => {
          commit("setUser", { id, user: result });
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
          commit("removeUser", id);
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
  },
  getters: {
    users: (state) => Object.values(state.users),
    usersByName: (state, getters) =>
      getters.users.sort((u1, u2) => compareStrings(u1.name, u2.name)),
  },
};
