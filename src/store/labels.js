import Vue from "vue";
import { index, create, destroy, update, destroyEmpty } from "../api/labels";
import { fetchAll } from "./actions";
import { compareStrings } from "../comparators";

export default {
  namespaced: true,
  state: {
    labels: {},
    startLoading: new Date(0),
  },
  mutations: {
    setLabels(state, payload) {
      state.labels = Object.assign({}, state.labels, payload);
    },
    setLabel(state, { id, label }) {
      label.loaded = new Date();
      Vue.set(state.labels, id, label);
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeLabel(state, id) {
      Vue.delete(state.labels, id);
    },
    removeOld(state) {
      Object.values(state.labels)
        .filter((obj) => {
          return obj.loaded < state.startLoading;
        })
        .forEach((obj) => {
          Vue.delete(state.labels, obj.id);
        });
    },
  },
  actions: {
    index({ commit, rootState }) {
      const generator = index(rootState.auth);
      return fetchAll(commit, generator, "setLabels")
        .then(() => {
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    create({ commit, rootState }, newLabel) {
      return create(rootState.auth, newLabel)
        .then((result) => {
          commit("setLabel", { id: result.id, label: result });
          return Promise.resolve(result.id);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    update({ commit, rootState }, { id, newLabel }) {
      return update(rootState.auth, id, newLabel)
        .then((result) => {
          commit("setLabel", { id, label: result });
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
          commit("removeLabel", id);
          return Promise.resolve(true);
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    destroyEmpty({ rootState }) {
      return destroyEmpty(rootState.auth)
        .then(() => {
          return this.dispatch("labels/index");
        })
        .catch((error) => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
  },
  getters: {
    labels: (state) => Object.values(state.labels),
    labelsByName: (state, getters) =>
      getters.labels.sort((g1, g2) =>
        compareStrings(g1.normalized_name, g2.normalized_name)
      ),
  },
};
