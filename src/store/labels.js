import Vue from "vue";
import { create, destroy, update, destroyEmpty } from "../api/labels";
import { index } from "./commit";
import { compareStrings } from "../comparators";

export default {
  namespaced: true,
  state: {
    labels: {},
  },
  mutations: {
    setLabels(state, payload) {
      const loaded = new Date();
      for (let label in payload) {
        payload[label].loaded = loaded;
      }
      state.labels = Object.assign({}, state.labels, payload);
    },
    setLabel(state, { id, label }) {
      label.loaded = new Date();
      Vue.set(state.labels, id, label);
    },
    removeLabel(state, id) {
      Vue.delete(state.labels, id);
    },
  },
  actions: {
    index({ commit, rootState }) {
      return index(
        { commit, auth: rootState.auth },
        { url: "labels", commitAction: "setLabels" }
      )
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
