<template>
  <VContainer class="fill-height" fluid>
    <AlbumForm />
  </VContainer>
</template>

<script setup lang="ts">
import AlbumForm from "@/components/AlbumForm.vue";
import { useHead } from "@unhead/vue";
import { useI18n } from "vue-i18n";

const I18n = useI18n();
useHead({ title: I18n.t("music.album.new") });
</script>
