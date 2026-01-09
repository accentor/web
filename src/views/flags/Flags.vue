<template>
  <div>
    <VContainer fluid>
      <ArtistsRow
        :artists="artists"
        :items-per-page="6"
        :save-pagination="false"
      >
        <template #header>
          <h2 class="text-h4">{{ $tc("music.artists", 2) }}</h2>
        </template>
      </ArtistsRow>
    </VContainer>
    <VContainer fluid>
      <AlbumsRow :albums="albums" :items-per-page="6" :save-pagination="false">
        <template #header>
          <h2 class="text-h4">{{ $tc("music.albums", 2) }}</h2>
        </template>
      </AlbumsRow>
    </VContainer>
    <VContainer class="fill-height" fluid>
      <VRow class="flex-column">
        <VRow>
          <VCol>
            <h2 class="text-h4">{{ $tc("music.tracks", 2) }}</h2>
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <TracksTable
              :tracks="tracks"
              :save-pagination="false"
              :save-search="false"
              :show-mass-edit="false"
            />
          </VCol>
        </VRow>
      </VRow>
    </VContainer>
  </div>
</template>

<script setup lang="ts">
import { useHead } from "@unhead/vue";
import AlbumsRow from "@/components/AlbumsRow.vue";
import ArtistsRow from "@/components/ArtistsRow.vue";
import TracksTable from "@/components/TracksTable.vue";
import { useAlbumsStore } from "@/store/albums";
import { useArtistsStore } from "@/store/artists";
import { useTracksStore } from "@/store/tracks";
import i18n from "@/i18n.ts";
import { storeToRefs } from "pinia";

useHead({ title: i18n.global.tc("music.flags", 2) });

const { tracksFlagged: tracks } = storeToRefs(useTracksStore());
const { albumsFlagged: albums } = storeToRefs(useAlbumsStore());
const { artistsFlagged: artists } = storeToRefs(useArtistsStore());
</script>
