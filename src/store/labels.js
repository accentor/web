import Vue from "vue";
import { create, destroy, index, update, destroyEmpty } from "../api/labels";
import { compareStrings } from "../comparators";

export default {
  namespaced: true,
  state: {
    labels: {}
  },
  mutations: {
    setLabels(state, payload) {
      state.labels = {};
      for (let label of payload) {
        state.labels[label.id] = label;
      }
    },
    setLabel(state, { id, label }) {
      if (state.labels[id]) {
        Vue.delete(state.labels, id);
      }
      Vue.set(state.labels, id, label);
    },
    removeLabel(state, id) {
      Vue.delete(state.labels, id);
    }
  },
  actions: {
    index({ commit, rootState }) {
      return index(rootState.auth)
        .then(result => {
          commit("setLabels", result);
          return Promise.resolve(true);
        })
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    create({ commit, rootState }, newLabel) {
      return create(rootState.auth, newLabel)
        .then(result => {
          commit("setLabel", { id: result.id, label: result });
          return Promise.resolve(result.id);
        })
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    update({ commit, rootState }, { id, newLabel }) {
      return update(rootState.auth, id, newLabel)
        .then(result => {
          commit("setLabel", { id, label: result });
          return Promise.resolve(true);
        })
        .catch(error => {
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
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    },
    destroyEmpty({ rootState }) {
      return destroyEmpty(rootState.auth)
        .then(() => {
          return this.dispatch("labels/index");
        })
        .catch(error => {
          this.commit("addError", error);
          return Promise.resolve(false);
        });
    }
  },
  getters: {
    labels: state => Object.values(state.labels),
    labelsByName: (state, getters) =>
      getters.labels.sort((g1, g2) => compareStrings(g1.name, g2.name))
  }
};
