import { create, destroy } from "../api/auth_tokens";

export default {
  namespaced: true,
  state: {
    device_id: null,
    secret: null,
    user_id: null,
    id: null
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
    }
  },
  actions: {
    login(context, data) {
      return create(data)
        .then(result => {
          context.commit("login", result);
          return Promise.resolve(true);
        })
        .catch(({ error }) => {
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
        .catch(({ error }) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    }
  },
  getters: {
    loggedIn: state => {
      return state.secret !== null && state.device_id !== null;
    },
    currentUser: (state, getters, rootState) => {
      return rootState.users.users[state.user_id];
    },
    isModerator: (state, getters) => {
      return (
        getters.currentUser &&
        (getters.currentUser.permission === "moderator" ||
          getters.currentUser.permission === "admin")
      );
    }
  }
};
