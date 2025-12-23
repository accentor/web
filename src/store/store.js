import persistencePlugins, { vuexLocalStorage } from "./persistence";
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
import playlists from "./playlists";
import plays from "./plays";
import rescan from "./rescan";
import tracks from "./tracks";
import users from "./users";
import userSettings from "./user_settings";
import { createStore } from "vuex";

const mutations = {
  addError(state, error) {
    if (error.unauthorized) {
      this.commit("auth/logout");
    }
    state.errors.push(error);

    // We want to log our errors here, to help with debugging

    console.error(error);
  },
  clearErrors(state) {
    state.errors = [];
  },
  updateCurrentDay(state) {
    state.currentDay = new Date().setHours(0, 0, 0, 0);
  },
};

export default createStore({
  plugins: persistencePlugins,
  strict: !import.meta.env.PROD,
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
    playlists,
    plays,
    rescan,
    tracks,
    users,
    userSettings,
  },
  state: {
    errors: [],
    currentDay: new Date().setHours(0, 0, 0, 0),
  },
  mutations,
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
