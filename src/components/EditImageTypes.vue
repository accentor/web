<template>
  <div v-if="isModerator">
    <ImageTypeForm v-for="i of imageTypes" :key="i.id" :image-type="i" />
    <ImageTypeForm />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import ImageTypeForm from "./ImageTypeForm.vue";
import { useAuthStore } from "@/store/auth";
import { useImageTypesStore } from "@/store/image_types";

const { isModerator } = storeToRefs(useAuthStore());
const { allImageTypes: imageTypes } = storeToRefs(useImageTypesStore());
</script>
