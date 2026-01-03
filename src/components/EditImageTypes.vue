<template>
  <div v-if="isModerator">
    <ImageTypeForm v-for="i of imageTypes" :key="i.id" :image-type="i" />
    <ImageTypeForm />
  </div>
</template>

<script>
// @ts-nocheck
import { mapState } from "pinia";
import ImageTypeForm from "./ImageTypeForm.vue";
import { useAuthStore } from "../store/auth";
import { useImageTypesStore } from "../store/image_types";

export default {
  name: "EditImageTypes",
  components: { ImageTypeForm },
  data() {
    return {};
  },
  computed: {
    ...mapState(useAuthStore, ["isModerator"]),
    ...mapState(useImageTypesStore, { imageTypes: "allImageTypes" }),
  },
};
</script>
