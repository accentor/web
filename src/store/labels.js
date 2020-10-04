import Vue from "vue";
import {
  index,
  create,
  read,
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
    async index({ commit, rootState }) {
      const generator = index(rootState.auth);
      try {
        await fetchAll(commit, generator, "setLabels");
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async create({ commit, rootState }, newLabel) {
      try {
        const result = await create(rootState.auth, newLabel);
        commit("setLabel", { id: result.id, label: result });
        return result.id;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async read({ commit, rootState }, id) {
      try {
        const result = read(rootState.auth, id);
        commit("setLabel", { id, label: result });
        return result.id;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async update({ commit, rootState }, { id, newLabel }) {
      try {
        const result = await update(rootState.auth, id, newLabel);
        commit("setLabel", { id, label: result });
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async destroy({ commit, rootState }, id) {
      try {
        await destroy(rootState.auth, id);
        commit("albums/removeLabelOccurence", id, { root: true });
        commit("removeLabel", id);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async destroyEmpty({ commit, dispatch, rootState }) {
      try {
        await destroyEmpty(rootState.auth);
        dispatch("index");
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async merge({ commit, rootState }, { newID, oldID }) {
      try {
        await merge(rootState.auth, newID, oldID);
        commit("albums/updateLabelOccurence", { newID, oldID }, { root: true });
        commit("removeLabel", oldID);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
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
