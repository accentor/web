<template>
  <span>
    <VTooltip location="bottom" :disabled="tracksEmpty.length > 0">
      <template #activator="{ props }">
        <span v-bind="props">
          <VBtn
            :to="{ name: 'tracks-without-audio' }"
            :disabled="tracksEmpty.length === 0"
            color="info"
            class="ma-2 text-white"
          >
            <VIcon start>mdi-alert-octagon</VIcon>
            {{ I18n.t("library.overview-tracks-without-audio") }}
          </VBtn>
        </span>
      </template>
      <span>{{ I18n.t("library.no-tracks-without-audio") }}</span>
    </VTooltip>
    <VBtn
      color="error"
      class="ma-2 text-white"
      :disabled="artistsDisabled"
      @click="destroyEmptyArtists"
    >
      <VIcon start>
        {{ artistsDisabled ? "mdi-refresh mdi-spin" : "mdi-alert-octagon" }}
      </VIcon>
      {{ I18n.t("library.delete-empty-artists") }}
    </VBtn>
    <VBtn
      color="error"
      class="ma-2 text-white"
      :disabled="albumsDisabled"
      @click="destroyEmptyAlbums"
    >
      <VIcon start>
        {{ albumsDisabled ? "mdi-refresh mdi-spin" : "mdi-alert-octagon" }}
      </VIcon>
      {{ I18n.t("library.delete-empty-albums") }}
    </VBtn>
    <VBtn
      color="error"
      class="ma-2 text-white"
      :disabled="genresDisabled"
      @click="destroyEmptyGenres"
    >
      <VIcon start>
        {{ genresDisabled ? "mdi-refresh mdi-spin" : "mdi-alert-octagon" }}
      </VIcon>
      {{ I18n.t("library.delete-empty-genres") }}
    </VBtn>
    <VBtn
      color="error"
      class="ma-2 text-white"
      :disabled="labelsDisabled"
      @click="destroyEmptyLabels"
    >
      <VIcon start>
        {{ labelsDisabled ? "mdi-refresh mdi-spin" : "mdi-alert-octagon" }}
      </VIcon>
      {{ I18n.t("library.delete-empty-labels") }}
    </VBtn>
  </span>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useLabelsStore } from "@/store/labels";
import { useGenresStore } from "@/store/genres";
import { useArtistsStore } from "@/store/artists";
import { useAlbumsStore } from "@/store/albums";
import { useTracksStore } from "@/store/tracks";
import { useI18n } from "vue-i18n";

const I18n = useI18n();
const albumsStore = useAlbumsStore();
const artistsStore = useArtistsStore();
const labelsStore = useLabelsStore();
const genresStore = useGenresStore();

const albumsDisabled = ref(false);
const artistsDisabled = ref(false);
const labelsDisabled = ref(false);
const genresDisabled = ref(false);

const { tracksEmpty } = storeToRefs(useTracksStore());

async function destroyEmptyAlbums(): Promise<void> {
  if (confirm(I18n.t("common.are-you-sure"))) {
    albumsDisabled.value = true;
    try {
      await albumsStore.destroyEmpty();
    } finally {
      albumsDisabled.value = false;
    }
  }
}

async function destroyEmptyArtists(): Promise<void> {
  if (confirm(I18n.t("common.are-you-sure"))) {
    artistsDisabled.value = true;
    try {
      await artistsStore.destroyEmpty();
    } finally {
      artistsDisabled.value = false;
    }
  }
}

async function destroyEmptyGenres(): Promise<void> {
  if (confirm(I18n.t("common.are-you-sure"))) {
    genresDisabled.value = true;
    try {
      await genresStore.destroyEmpty();
    } finally {
      genresDisabled.value = false;
    }
  }
}

async function destroyEmptyLabels(): Promise<void> {
  if (confirm(I18n.t("common.are-you-sure"))) {
    labelsDisabled.value = true;
    try {
      await labelsStore.destroyEmpty();
    } finally {
      labelsDisabled.value = false;
    }
  }
}
</script>
