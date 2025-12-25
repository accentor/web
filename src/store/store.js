import Vue from "vue";
import Vuex from "vuex";
import persistencePlugins, { vuexLocalStorage } from "./persistence";
import albums from "./albums";
import artists from "./artists";
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

Vue.use(Vuex);

const mutations = {
  updateCurrentDay(state) {
    state.currentDay = new Date().setHours(0, 0, 0, 0);
  },
};

if (!import.meta.env.PROD) {
  mutations.RESTORE_MUTATION = vuexLocalStorage.RESTORE_MUTATION;
}

export default new Vuex.Store({
  plugins: persistencePlugins,
  strict: !import.meta.env.PROD,
  modules: {
    albums,
    artists,
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
  },
  state: {
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
