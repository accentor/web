import { computed } from "vue";
import { defineStore } from "pinia";
import vuexStore from "./store";
import api from "@/api";
import { compareStrings } from "../comparators";
import { useBaseModelStore } from "./base";

export const useLabelsStore = defineStore("labels", () => {
  const {
    items: labels,
    index,
    create,
    read,
    update,
    destroy,
    destroyEmpty,
    merge,
    startLoading,
  } = useBaseModelStore(api.labels, "labels.labels", "label", {
    extraDestroyOperations: (id) => vuexStore.commit("albums/removeLabelOccurence", id, { root: true }),
    extraMergeOperations: (newId, oldId) => {
      vuexStore.commit(
        "albums/updateLabelOccurence",
        { newId, oldId },
        { root: true },
      );
    },
  });

  const allLabels = computed(() => Object.values(labels.value));
  const labelsByName = computed(() =>
    [...allLabels.value].sort((g1, g2) =>
      compareStrings(g1.normalized_name, g2.normalized_name),
    ),
  );

  return {
    labels,
    allLabels,
    labelsByName,
    startLoading,
    index,
    create,
    read,
    update,
    destroy,
    destroyEmpty,
    merge,
  };
});
