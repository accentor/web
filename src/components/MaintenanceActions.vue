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
            {{ $t("library.overview-tracks-without-audio") }}
          </VBtn>
        </span>
      </template>
      <span>{{ $t("library.no-tracks-without-audio") }}</span>
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
      {{ $t("library.delete-empty-artists") }}
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
      {{ $t("library.delete-empty-albums") }}
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
      {{ $t("library.delete-empty-genres") }}
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
      {{ $t("library.delete-empty-labels") }}
    </VBtn>
  </span>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useLabelsStore } from "../store/labels";
import { useGenresStore } from "../store/genres";
import { useArtistsStore } from "../store/artists";
import { useAlbumsStore } from "../store/albums";
import { useTracksStore } from "../store/tracks";

export default {
  name: "MaintenanceActions",
  data() {
    return {
      albumsDisabled: false,
      artistsDisabled: false,
      labelsDisabled: false,
      genresDisabled: false,
    };
  },
  computed: {
    ...mapState(useTracksStore, ["tracksEmpty"]),
  },
  methods: {
    ...mapActions(useAlbumsStore, { destroyAlbums: "destroyEmpty" }),
    ...mapActions(useArtistsStore, { destroyArtists: "destroyEmpty" }),
    ...mapActions(useLabelsStore, { destroyLabels: "destroyEmpty" }),
    ...mapActions(useGenresStore, { destroyGenres: "destroyEmpty" }),
    destroyEmptyArtists() {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.artistsDisabled = true;
        this.destroyArtists().finally(() => {
          this.artistsDisabled = false;
        });
      }
    },
    destroyEmptyAlbums() {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.albumsDisabled = true;
        this.destroyAlbums().finally(() => {
          this.albumsDisabled = false;
        });
      }
    },
    destroyEmptyGenres() {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.genresDisabled = true;
        this.destroyGenres().finally(() => {
          this.genresDisabled = false;
        });
      }
    },
    destroyEmptyLabels() {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.labelsDisabled = true;
        this.destroyLabels().finally(() => {
          this.labelsDisabled = false;
        });
      }
    },
  },
};
</script>
