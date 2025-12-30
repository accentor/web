<template>
  <span>
    <VTooltip bottom :disabled="tracksEmpty.length > 0">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <VBtn
            :to="{ name: 'tracks-without-audio' }"
            :disabled="tracksEmpty.length === 0"
            color="info"
            class="ma-2 white--text"
          >
            <VIcon left>mdi-alert-octagon</VIcon>
            {{ $t("library.overview-tracks-without-audio") }}
          </VBtn>
        </span>
      </template>
      <span>{{ $t("library.no-tracks-without-audio") }}</span>
    </VTooltip>
    <VBtn
      @click="destroyEmptyArtists"
      color="danger"
      class="ma-2 white--text"
      :disabled="artistsDisabled"
    >
      <VIcon left>
        {{ artistsDisabled ? "mdi-refresh mdi-spin" : "mdi-alert-octagon" }}
      </VIcon>
      {{ $t("library.delete-empty-artists") }}
    </VBtn>
    <VBtn
      @click="destroyEmptyAlbums"
      color="danger"
      class="ma-2 white--text"
      :disabled="albumsDisabled"
    >
      <VIcon left>
        {{ albumsDisabled ? "mdi-refresh mdi-spin" : "mdi-alert-octagon" }}
      </VIcon>
      {{ $t("library.delete-empty-albums") }}
    </VBtn>
    <VBtn
      @click="destroyEmptyGenres"
      color="danger"
      class="ma-2 white--text"
      :disabled="genresDisabled"
    >
      <VIcon left>
        {{ genresDisabled ? "mdi-refresh mdi-spin" : "mdi-alert-octagon" }}
      </VIcon>
      {{ $t("library.delete-empty-genres") }}
    </VBtn>
    <VBtn
      @click="destroyEmptyLabels"
      color="danger"
      class="ma-2 white--text"
      :disabled="labelsDisabled"
    >
      <VIcon left>
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
    destroyEmptyArtists: function () {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.artistsDisabled = true;
        this.destroyArtists().finally(() => {
          this.artistsDisabled = false;
        });
      }
    },
    destroyEmptyAlbums: function () {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.albumsDisabled = true;
        this.destroyAlbums().finally(() => {
          this.albumsDisabled = false;
        });
      }
    },
    destroyEmptyGenres: function () {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.genresDisabled = true;
        this.destroyGenres().finally(() => {
          this.genresDisabled = false;
        });
      }
    },
    destroyEmptyLabels: function () {
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
