import Vue from "vue";
import api from "@/api";
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
      const loaded = new Date();
      for (let obj of payload) {
        obj.loaded = loaded;
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
      const generator = api.labels.index(rootState.auth.apiToken);
      try {
        await this.labelsRestored;
        await fetchAll(commit, generator, "setLabels");
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async create({ commit, rootState }, newLabel) {
      try {
        const result = await api.labels.create(rootState.auth.apiToken, {
          label: newLabel,
        });
        commit("setLabel", { id: result.id, label: result });
        return result.id;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async read({ commit, rootState }, id) {
      try {
        const result = await api.labels.read(rootState.auth.apiToken, id);
        await this.labelsRestored;
        commit("setLabel", { id, label: result });
        return result.id;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async update({ commit, rootState }, { id, newLabel }) {
      try {
        const result = await api.labels.update(rootState.auth.apiToken, id, {
          label: newLabel,
        });
        commit("setLabel", { id, label: result });
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async destroy({ commit, rootState }, id) {
      try {
        await api.labels.destroy(rootState.auth.apiToken, id);
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
        await api.labels.destroyEmpty(rootState.auth.apiToken);
        await dispatch("index");
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async merge({ commit, rootState }, { newID, oldID }) {
      try {
        await api.labels.merge(rootState.auth.apiToken, newID, oldID);
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
        compareStrings(g1.normalized_name, g2.normalized_name),
      ),
  },
};
