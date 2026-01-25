<template>
  <div>
    <VContainer fluid>
      <AlbumsRow
        :albums="releaseAlbums"
        :items-per-page="numberOfItems"
        :save-pagination="false"
      >
        <template #header>
          <h2 class="text-h4">{{ I18n.t("home.recently-released") }}</h2>
        </template>
      </AlbumsRow>
    </VContainer>
    <VContainer fluid>
      <AlbumsRow
        :albums="addedAlbums"
        :items-per-page="numberOfItems"
        :save-pagination="false"
      >
        <template #header>
          <h2 class="text-h4">{{ I18n.t("home.recently-added-albums") }}</h2>
        </template>
      </AlbumsRow>
    </VContainer>
    <VContainer fluid>
      <ArtistsRow
        :artists="addedArtists"
        :items-per-page="numberOfItems"
        :save-pagination="false"
      >
        <template #header>
          <h2 class="text-h4">{{ I18n.t("home.recently-added-artists") }}</h2>
        </template>
      </ArtistsRow>
    </VContainer>
    <VContainer fluid>
      <AlbumsRow
        :albums="albumsOnThisDay"
        :items-per-page="numberOfItems"
        :save-pagination="false"
      >
        <template #header>
          <h2 class="text-h4">{{ I18n.t("home.on-this-day") }}</h2>
        </template>
        <template #no-data>
          <VAlert :model-value="true" color="info" icon="mdi-information">
            {{ I18n.t("home.on-this-day-empty") }}
          </VAlert>
        </template>
      </AlbumsRow>
    </VContainer>

    <VContainer fluid>
      <AlbumsRow
        :albums="randomAlbums"
        :items-per-page="numberOfItems"
        :save-pagination="false"
      >
        <template #header>
          <h2 class="text-h4">{{ I18n.t("home.random-albums") }}</h2>
        </template>
      </AlbumsRow>
    </VContainer>
    <VContainer fluid>
      <ArtistsRow
        :artists="randomArtists"
        :items-per-page="numberOfItems"
        :save-pagination="false"
      >
        <template #header>
          <h2 class="text-h4">
            {{ I18n.t("home.random-artists") }}
          </h2>
        </template>
      </ArtistsRow>
    </VContainer>
    <VContainer fluid>
      <AlbumsRow
        :albums="recentAlbums"
        :items-per-page="numberOfItems"
        :save-pagination="false"
      >
        <template #header>
          <h2 class="text-h4">{{ I18n.t("home.recently-played-albums") }}</h2>
        </template>
      </AlbumsRow>
    </VContainer>
    <VContainer fluid>
      <ArtistsRow
        :artists="recentArtists"
        :items-per-page="numberOfItems"
        :save-pagination="false"
      >
        <template #header>
          <h2 class="text-h4">{{ I18n.t("home.recently-played-artists") }}</h2>
        </template>
      </ArtistsRow>
    </VContainer>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useArtistsStore } from "@/store/artists";
import { useAlbumsStore } from "@/store/albums";
import { usePlaysStore } from "@/store/plays";
import AlbumsRow from "@/components/AlbumsRow.vue";
import ArtistsRow from "@/components/ArtistsRow.vue";
import { useHead } from "@unhead/vue";
import { computed } from "vue";
import { useDisplay } from "vuetify/framework";
import {
  compareAlbumsByReleaseFirst,
  compareByRecentlyPlayed,
  compareStrings,
} from "@/util";
import { useI18n } from "vue-i18n";

const albumsStore = useAlbumsStore();
const artistsStore = useArtistsStore();
const playsStore = usePlaysStore();

const RANDOM_SEED_MAX = 10000;
const randomSeed = Math.round(Math.random() * RANDOM_SEED_MAX);

const I18n = useI18n();
useHead({ title: I18n.t("common.home") });

function randomSort<T extends { id: number }>(items: T[]): T[] {
  return [...items].sort(
    (i1, i2) => Math.sin(i2.id + randomSeed) - Math.sin(i1.id + randomSeed),
  );
}

const { allAlbums: albums, albumsOnThisDay } = storeToRefs(albumsStore);
const { allArtists: artists } = storeToRefs(artistsStore);
const { playStatsByAlbum, playStatsByArtist } = storeToRefs(playsStore);

const addedAlbums = computed(() =>
  [...albums.value].sort((a1, a2) =>
    compareStrings(a2.created_at, a1.created_at),
  ),
);
const randomAlbums = computed(() => randomSort(albums.value));
const releaseAlbums = computed(() =>
  [...albums.value].sort(compareAlbumsByReleaseFirst(true)),
);
const recentAlbums = computed(() =>
  [...albums.value].sort(compareByRecentlyPlayed(playStatsByAlbum.value)),
);
const addedArtists = computed(() =>
  [...artists.value].sort((a1, a2) =>
    compareStrings(a2.created_at, a1.created_at),
  ),
);
const recentArtists = computed(() =>
  [...artists.value].sort(compareByRecentlyPlayed(playStatsByArtist.value)),
);
const randomArtists = computed(() => randomSort(artists.value));

const display = useDisplay();
const numberOfItems = computed(() => {
  if (display.xlAndUp.value) {
    return 6;
  } else if (display.md.value) {
    return 3;
  } else {
    return 4;
  }
});
</script>
