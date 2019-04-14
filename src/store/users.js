import Vue from "vue";
import { create, destroy, index, update } from "../api/users";
import { compareStrings } from "../comparators";

export default {
  namespaced: true,
  state: {
    users: {}
  },
  mutations: {
    setUsers(state, payload) {
      state.users = {};
      for (let user of payload) {
        state.users[user.id] = user;
      }
    },
    setUser(state, { id, user }) {
      if (state.users[id]) {
        Object.assign(state.users[id], user);
      } else {
        Vue.set(state.users, id, user);
      }
    },
    removeUser(state, id) {
      Vue.delete(state.users, id);
    }
  },
  actions: {
    index({ commit, rootState }) {
      return index(rootState.auth)
        .then(result => {
          commit("setUsers", result);
          return Promise.resolve(true);
        })
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    create({ commit, rootState }, newUser) {
      return create(rootState.auth, newUser)
        .then(result => {
          commit("setUser", { id: result.id, user: result });
          return Promise.resolve(result.id);
        })
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    update({ commit, rootState }, { id, newUser }) {
      return update(rootState.auth, id, newUser)
        .then(result => {
          commit("setUser", { id, user: result });
          return Promise.resolve(true);
        })
        .catch(error => {
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
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    }
  },
  getters: {
    users: state => Object.values(state.users),
    usersByName: (state, getters) =>
      getters.users.sort((u1, u2) => compareStrings(u1.name, u2.name))
  }
};
