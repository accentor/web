<template>
  <VContainer class="fill-height" fluid>
    <VRow no-gutters>
      <VCol>
        <TracksTable :tracks="tracks" show-search :show-mass-edit="false" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useHead } from "@unhead/vue";
import TracksTable from "@/components/TracksTable.vue";
import { useTracksStore } from "@/store/tracks";
import i18n from "@/i18n";

useHead({ title: i18n.global.tc("music.tracks", 2) });

const { tracksByAlbumAndNumber: tracks } = storeToRefs(useTracksStore());
</script>
