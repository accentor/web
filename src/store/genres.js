import { computed } from "vue";
import vuexStore from "./store";
import api from "@/api";
import { compareStrings } from "../comparators";
import { defineStore } from "pinia";
import { useBaseModelStore } from "./base";

export const useGenresStore = defineStore("genres", () => {
  const {
    items: genres,
    index,
    create,
    read,
    update,
    destroy,
    destroyEmpty,
    merge,
    startLoading,
  } = useBaseModelStore(api.genres, "genres.genres", "genre", {
    extraDestroyOperations: (id) => vuexStore.commit("tracks/removeGenreOccurence", id, { root: true }),
    extraMergeOperations: (newId, oldId) => {
      vuexStore.commit(
        "tracks/updateGenreOccurence",
        { newId, oldId },
        { root: true },
      );
    },
  });
  const allGenres = computed(() => Object.values(genres.value));
  const genresByName = computed(() =>
    [...allGenres.value].sort((g1, g2) =>
      compareStrings(g1.normalized_name, g2.normalized_name),
    ),
  );

  return {
    genres,
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
