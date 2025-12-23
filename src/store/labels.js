import Vue from "vue";
import api from "@/api";
import { fetchAll } from "./actions";
import { compareStrings } from "../comparators";
import { useErrorsStore } from "./errors";
import { useAuthStore } from "./auth";

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
    async index({ commit }) {
      const generator = api.labels.index(useAuthStore().apiToken);
      try {
        await this.labelsRestored;
        await fetchAll(commit, generator, "setLabels");
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async create({ commit }, newLabel) {
      try {
        const result = await api.labels.create(useAuthStore().apiToken, {
          label: newLabel,
        });
        commit("setLabel", { id: result.id, label: result });
        return result.id;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async read({ commit }, id) {
      try {
        const result = await api.labels.read(useAuthStore().apiToken, id);
        await this.labelsRestored;
        commit("setLabel", { id, label: result });
        return result.id;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async update({ commit }, { id, newLabel }) {
      try {
        const result = await api.labels.update(useAuthStore().apiToken, id, {
          label: newLabel,
        });
        commit("setLabel", { id, label: result });
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async destroy({ commit }, id) {
      try {
        await api.labels.destroy(useAuthStore().apiToken, id);
        commit("albums/removeLabelOccurence", id, { root: true });
        commit("removeLabel", id);
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async destroyEmpty({ dispatch }) {
      try {
        await api.labels.destroyEmpty(useAuthStore().apiToken);
        await dispatch("index");
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
        return false;
      }
    },
    async merge({ commit }, { newID, oldID }) {
      try {
        await api.labels.merge(useAuthStore().apiToken, newID, oldID);
        commit("albums/updateLabelOccurence", { newID, oldID }, { root: true });
        commit("removeLabel", oldID);
        return true;
      } catch (error) {
        useErrorsStore().addError(error);
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
