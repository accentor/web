import { computed } from "vue";
import api from "@/api";
import { compareStrings } from "../comparators";
import { defineStore } from "pinia";
import { useBaseModelStore } from "./base";
import { useTracksStore } from "./tracks";

export const useGenresStore = defineStore("genres", () => {
  const tracksStore = useTracksStore();

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
    extraDestroyOperations: (id) => tracksStore.removeGenreOccurence(id),
    extraMergeOperations: (newId, oldId) =>
      tracksStore.updateGenreOccurence(newId, oldId),
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
