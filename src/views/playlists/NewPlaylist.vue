<template>
  <VContainer class="fill-height" fluid>
    <PlaylistForm />
  </VContainer>
</template>

<script setup lang="ts">
import { useHead } from "@unhead/vue";
import PlaylistForm from "@/components/PlaylistForm.vue";
import { useI18n } from "vue-i18n";

const I18n = useI18n();
useHead({ title: I18n.t("music.playlist.new") });
</script>
