import { computed } from "vue";
import api from "@/api";
import { compareStrings } from "@/comparators.ts";
import { defineStore } from "pinia";
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
import { useTracksStore } from "./tracks";
import { useAuthStore } from "@/store/auth";
import { useErrorsStore } from "@/store/errors";
import type { Genre, GenreParams } from "@accentor/api-client-js";

export const useGenresStore = defineStore("genres", () => {
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();
  const tracksStore = useTracksStore();

  const {
    items: genres,
    addItems,
    removeItem,
    removeOld,
    restored,
    setItem,
    startLoading,
    setStartLoading,
  } = useBaseModelStore<Genre>("genres.genres");
  const allGenres = computed(() => Object.values(genres.value));
  const genresByName = computed(() =>
    [...allGenres.value].sort((g1, g2) =>
      compareStrings(g1.normalized_name, g2.normalized_name),
    ),
  );

  const index = baseIndex(
    api.genres,
    authStore,
    errorsStore,
    restored,
    addItems,
    setStartLoading,
    removeOld,
  );
  const create = baseCreate<Genre, GenreParams["genre"], GenreParams>(
    api.genres,
    authStore,
    errorsStore,
    setItem,
    (val) => ({ genre: val }),
  );
  const read = baseRead(api.genres, authStore, errorsStore, restored, setItem);
  const update = baseUpdate<Genre, GenreParams["genre"], GenreParams>(
    api.genres,
    authStore,
    errorsStore,
    setItem,
    (val) => ({ genre: val }),
  );
  const destroy = baseDestroy(
    api.genres,
    authStore,
    errorsStore,
    removeItem,
    (id) => tracksStore.removeGenreOccurrence(id),
  );
  const destroyEmpty = baseDestroyEmpty(
    api.genres,
    authStore,
    errorsStore,
    index,
  );
  const merge = baseMerge(
    api.genres,
    read,
    authStore,
    errorsStore,
    removeItem,
    (newId, oldId) => tracksStore.updateGenreOccurrence(newId, oldId),
  );

  return {
    genres,
    restored,
    allGenres,
    genresByName,
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
