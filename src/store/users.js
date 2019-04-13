import { index } from "../api/users";

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
    }
  },
  actions: {
    index({ commit, rootState }) {
      return index(rootState.auth)
        .then(result => {
          commit("setUsers", result);
          return Promise.resolve(true);
        })
        .catch(({ error }) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    }
  }
};
