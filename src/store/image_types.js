import { computed } from "vue";
import api from "@/api";
import { defineStore } from "pinia";
import { useBaseModelStore } from "./base";

export const useImageTypesStore = defineStore("image-types", () => {
  const {
    items: imageTypes,
    index,
    create,
    update,
    destroy,
  } = useBaseModelStore(api.image_types, "imageTypes.imageTypes", "image_type");

  const allImageTypes = computed(() =>
    Object.values(imageTypes.value).sort((i1, i2) => i1.id - i2.id),
  );

  return {
    imageTypes,
    allImageTypes,
    index,
    create,
    update,
    destroy,
  };
});
