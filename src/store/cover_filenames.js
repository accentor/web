import { computed } from "vue";
import api from "@/api";
import { defineStore } from "pinia";
import { useBaseModelStore } from "./base";

export const useCoverFilenamesStore = defineStore("cover-filenames", () => {
  const {
    items: coverFilenames,
    index,
    create,
    destroy,
  } = useBaseModelStore(
    api.cover_filenames,
    "coverFilenames.coverFilenames",
    "cover_filename",
  );

  const allCoverFilenames = computed(() =>
    Object.values(coverFilenames.value).sort((cf1, cf2) => cf1.id - cf2.id),
  );

  return {
    coverFilenames,
    allCoverFilenames,
    index,
    create,
    destroy,
  };
});
