<template>
  <div v-if="isModerator">
    <CoverFilenameForm
      v-for="c of coverFilenames"
      :key="c.id"
      :cover-filename="c"
    />
    <CoverFilenameForm />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import CoverFilenameForm from "./CoverFilenameForm.vue";
import { useAuthStore } from "@/store/auth";
import { useCoverFilenamesStore } from "@/store/cover_filenames";

const { isModerator } = storeToRefs(useAuthStore());
const { allCoverFilenames: coverFilenames } = storeToRefs(
  useCoverFilenamesStore(),
);
</script>
