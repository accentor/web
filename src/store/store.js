import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import { create, destroy } from "../api/auth_tokens";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      paths: ["auth"]
    })
  ],
  strict: process.env.NODE_ENV !== "production",
  state: {
    auth: {
      device_id: null,
      secret: null,
      user_id: null,
      id: null
    }
  },
  mutations: {
    login(state, payload) {
      state.auth.device_id = payload.device_id;
      state.auth.secret = payload.secret;
      state.auth.user_id = payload.user_id;
      state.auth.id = payload.id;
    },
    logout(state) {
      state.auth.device_id = null;
      state.auth.secret = null;
      state.auth.user_id = null;
      state.auth.id = null;
    }
  },
  actions: {
    login(context, data) {
      return create(data).then(result => {
        context.commit("login", result);
        return Promise.resolve();
      });
    },
    logout({ commit, state }) {
      return destroy(state.auth, state.auth.id).then(() => {
        commit("logout");
        return Promise.resolve();
      });
    }
  },
  getters: {
    loggedIn: state => {
      return state.auth.secret !== null && state.auth.device_id !== null;
    }
  }
});
