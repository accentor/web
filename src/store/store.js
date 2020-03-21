import localforage from "localforage";
import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
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

const vuexPersisted = new VuexPersistence({
  storage: localforage,
  asyncStorage: true,
  strictMode: process.env.NODE_ENV !== "production"
});

const mutations = {
  addError(state, error) {
    if (error.unauthorized) {
      this.commit("auth/logout");
    }
    state.errors.push(error);
  },
  clearErrors(state) {
    state.errors = [];
  }
};

if (process.env.NODE_ENV !== "production") {
  mutations.RESTORE_MUTATION = vuexPersisted.RESTORE_MUTATION;
}

export default new Vuex.Store({
  plugins: [vuexPersisted.plugin],
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
    userSettings
  },
  state: {
    errors: []
  },
  mutations: mutations,
  actions: {},
  getters: {
    numberOfFlaggedItems(state, getters) {
      return (
        getters["artists/artistsFlagged"].length +
        getters["albums/albumsFlagged"].length +
        getters["tracks/tracksFlagged"].length
      );
    }
  }
});
