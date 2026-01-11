<template>
  <VContainer class="fill-height" fluid>
    <ArtistForm />
  </VContainer>
</template>

<script setup lang="ts">
import { useHead } from "@unhead/vue";
import ArtistForm from "@/components/ArtistForm.vue";
import { useI18n } from "vue-i18n";

const I18n = useI18n();
useHead({ title: I18n.t("music.artist.new") });
</script>
