<template>
  <VContainer class="fill-height" fluid>
    <ArtistForm />
  </VContainer>
</template>

<script setup lang="ts">
import { useHead } from "@unhead/vue";
import i18n from "@/i18n";
import ArtistForm from "@/components/ArtistForm.vue";

useHead({ title: i18n.global.t("music.artist.new") });
</script>
