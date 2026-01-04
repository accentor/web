import { computed } from "vue";
import { defineStore } from "pinia";
import api from "@/api";
import { compareStrings } from "../comparators";
import {
  create as baseCreate,
  destroy as baseDestroy,
  destroyEmpty as baseDestroyEmpty,
  index as baseIndex,
  merge as baseMerge,
  read as baseRead,
  update as baseUpdate,
  useBaseModelStore,
} from "./base";
import { useAlbumsStore } from "./albums";
import { useAuthStore } from "@/store/auth";
import { useErrorsStore } from "@/store/errors";
import type { Label, LabelParams } from "@accentor/api-client-js";

export const useLabelsStore = defineStore("labels", () => {
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();
  const albumsStore = useAlbumsStore();

  const {
    items: labels,
    addItems,
    removeItem,
    removeOld,
    restored,
    setItem,
    startLoading,
    setStartLoading,
  } = useBaseModelStore<Label>("labels.labels");

  const allLabels = computed(() => Object.values(labels.value));
  const labelsByName = computed(() =>
    [...allLabels.value].sort((g1, g2) =>
      compareStrings(g1.normalized_name, g2.normalized_name),
    ),
  );

  const index = baseIndex(
    api.labels,
    authStore,
    errorsStore,
    restored,
    addItems,
    setStartLoading,
    removeOld,
  );
  const create = baseCreate<Label, LabelParams["label"], LabelParams>(
    api.labels,
    authStore,
    errorsStore,
    setItem,
    (val) => ({ label: val }),
  );
  const read = baseRead(api.labels, authStore, errorsStore, restored, setItem);
  const update = baseUpdate<Label, LabelParams["label"], LabelParams>(
    api.labels,
    authStore,
    errorsStore,
    setItem,
    (val) => ({ label: val }),
  );
  const destroy = baseDestroy(
    api.labels,
    authStore,
    errorsStore,
    removeItem,
    (id) => albumsStore.removeLabelOccurence(id),
  );
  const destroyEmpty = baseDestroyEmpty(
    api.labels,
    authStore,
    errorsStore,
    index,
  );
  const merge = baseMerge(
    api.labels,
    authStore,
    errorsStore,
    removeItem,
    (newId, oldId) => albumsStore.updateLabelOccurence(newId, oldId),
  );

  return {
    labels,
    restored,
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
