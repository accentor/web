import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import albums from "./albums";
import artists from "./artists";
import auth from "./auth";
import codecs from "./codecs";
import codecConversions from "./codec_conversions";
import coverFilenames from "./cover_filenames";
import genres from "./genres";
import imageTypes from "./image_types";
import labels from "./labels";
import locations from "./locations";
import player from "./player";
import rescan from "./rescan";
import tracks from "./tracks";
import users from "./users";
import userSettings from "./user_settings";

Vue.use(Vuex);

const persistedModules = ["auth", "userSettings"];

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      paths: persistedModules,
      filter: (m) =>
        persistedModules.includes(m.type.substring(0, m.type.indexOf("/"))),
    }),
  ],
  strict: process.env.NODE_ENV !== "production",
  modules: {
    albums,
    artists,
    auth,
    codecs,
    codecConversions,
    coverFilenames,
    genres,
    imageTypes,
    labels,
    locations,
    player,
    rescan,
    tracks,
    users,
    userSettings,
  },
  state: {
    errors: [],
    currentDay: new Date().setHours(0, 0, 0, 0),
  },
  mutations: {
    addError(state, error) {
      if (error.unauthorized) {
        this.commit("auth/logout");
      }
      state.errors.push(error);
    },
    clearErrors(state) {
      state.errors = [];
    },
    updateCurrentDay(state) {
      state.currentDay = new Date().setHours(0, 0, 0, 0);
    },
  },
  actions: {},
  getters: {
    numberOfFlaggedItems(state, getters) {
      return (
        getters["artists/artists"].filter((a) => a.review_comment !== null)
          .length +
        getters["albums/albums"].filter((a) => a.review_comment !== null)
          .length +
        getters["tracks/tracks"].filter((t) => t.review_comment !== null).length
      );
    },
  },
});
