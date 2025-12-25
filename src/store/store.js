import Vue from "vue";
import Vuex from "vuex";
import persistencePlugins from "./persistence";
import albums from "./albums";
import artists from "./artists";
import genres from "./genres";
import labels from "./labels";
import player from "./player";
import plays from "./plays";
import tracks from "./tracks";

Vue.use(Vuex);

const mutations = {
  updateCurrentDay(state) {
    state.currentDay = new Date().setHours(0, 0, 0, 0);
  },
};

export default new Vuex.Store({
  plugins: persistencePlugins,
  strict: !import.meta.env.PROD,
  modules: {
    albums,
    artists,
    genres,
    labels,
    player,
    plays,
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
