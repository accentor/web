<template>
  <VContainer v-if="isModerator" class="fill-height" fluid>
    <VRow no-gutters>
      <VCol>
        <TracksTable
          :tracks="tracks"
          :title="$t('music.tracks-without-audio')"
          :show-search="true"
          :show-mass-edit="true"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import TracksTable from "@/components/TracksTable.vue";
import { useAuthStore } from "@/store/auth";
import { useTracksStore } from "@/store/tracks";
import { useHead } from "@unhead/vue";
import i18n from "@/i18n";

const { isModerator } = storeToRefs(useAuthStore());
const { tracksEmpty: tracks } = storeToRefs(useTracksStore());

useHead({ title: i18n.global.t("music.tracks-without-audio") });
</script>
