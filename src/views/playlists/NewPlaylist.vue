<template>
  <VContainer class="fill-height" fluid>
    <PlaylistForm />
  </VContainer>
</template>

<script setup lang="ts">
import { useHead } from "@unhead/vue";
import i18n from "@/i18n";
import PlaylistForm from "@/components/PlaylistForm.vue";

useHead({ title: i18n.global.t("music.playlist.new") });
</script>
