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
import { useI18n } from "vue-i18n";

const I18n = useI18n();
useHead({ title: I18n.t("music.tracks", 2) });

const { tracksByAlbumAndNumber: tracks } = storeToRefs(useTracksStore());
</script>
