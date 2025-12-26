import { computed } from "vue";
import { defineStore } from "pinia";
import api from "@/api";
import { compareStrings } from "../comparators";
import { useBaseModelStore } from "./base";
import { useAlbumsStore } from "./albums";

export const useLabelsStore = defineStore("labels", () => {
  const albumsStore = useAlbumsStore();

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
    extraDestroyOperations: (id) => albumsStore.removeLabelOccurence(id),
    extraMergeOperations: (newId, oldId) =>
      albumsStore.updateLabelOccurence(newId, oldId),
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
