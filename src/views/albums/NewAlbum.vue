<template>
  <VContainer class="fill-height" fluid>
    <AlbumForm />
  </VContainer>
</template>

<script setup lang="ts">
import AlbumForm from "@/components/AlbumForm.vue";
import { useHead } from "@unhead/vue";
import i18n from "@/i18n";

useHead({ title: i18n.global.t("music.album.new") });
</script>
