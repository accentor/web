import Vue from "vue";
import {
  index,
  create,
  destroy,
  update,
  destroyEmpty,
  merge,
} from "../api/labels";
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
      const oldLabels = state.labels;
      state.labels = {};
      for (let id in oldLabels) {
        state.labels[id] = oldLabels[id];
      }
      for (let obj of payload) {
        state.labels[obj.id] = obj;
      }
    },
    setLabel(state, { id, label }) {
      const oldLabels = state.labels;
      state.labels = {};
      for (let id in oldLabels) {
        state.labels[id] = oldLabels[id];
      }
      label.loaded = new Date();
      state.labels[id] = label;
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeLabel(state, id) {
      Vue.delete(state.labels, id);
    },
    removeOld(state) {
      const oldLabels = state.labels;
      state.labels = {};
      for (let id in oldLabels) {
        if (oldLabels[id].loaded > state.startLoading) {
          state.labels[id] = oldLabels[id];
        }
      }
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
    read({ commit, rootState }, id) {
      return read(rootState.auth, id)
        .then((result) => {
          commit("setLabel", { id, label: result });
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
          commit("albums/removeLabelOccurence", id, { root: true });
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
    merge({ commit, rootState }, { newID, oldID }) {
      return merge(rootState.auth, newID, oldID)
        .then(() => {
          commit(
            "albums/updateLabelOccurence",
            { newID, oldID },
            { root: true }
          );
          commit("removeLabel", oldID);
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
