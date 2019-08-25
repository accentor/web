<template>
  <span>
    <VBtn
      @click="destroyEmptyArtists"
      color="danger"
      class="ma-2"
      :disabled="artistsDisabled"
      dark
    >
      <VIcon left>
        {{ artistsDisabled ? "mdi-refresh mdi-spin" : "mdi-alert-octagon" }}
      </VIcon>
      {{ $t("library.delete-empty-artists") }}
    </VBtn>
    <VBtn
      @click="destroyEmptyAlbums"
      color="danger"
      class="ma-2"
      :disabled="albumsDisabled"
      dark
    >
      <VIcon left>
        {{ albumsDisabled ? "mdi-refresh mdi-spin" : "mdi-alert-octagon" }}
      </VIcon>
      {{ $t("library.delete-empty-albums") }}
    </VBtn>
    <VBtn
      @click="destroyEmptyGenres"
      color="danger"
      class="ma-2"
      :disabled="genresDisabled"
      dark
    >
      <VIcon left>
        {{ genresDisabled ? "mdi-refresh mdi-spin" : "mdi-alert-octagon" }}
      </VIcon>
      {{ $t("library.delete-empty-genres") }}
    </VBtn>
    <VBtn
      @click="destroyEmptyLabels"
      color="danger"
      class="ma-2"
      :disabled="labelsDisabled"
      dark
    >
      <VIcon left>
        {{ labelsDisabled ? "mdi-refresh mdi-spin" : "mdi-alert-octagon" }}
      </VIcon>
      {{ $t("library.delete-empty-labels") }}
    </VBtn>
  </span>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "MaintenanceActions",
  data() {
    return {
      albumsDisabled: false,
      artistsDisabled: false,
      labelsDisabled: false,
      genresDisabled: false
    };
  },
  methods: {
    ...mapActions({
      destroyArtists: "artists/destroyEmpty",
      destroyAlbums: "albums/destroyEmpty",
      destroyGenres: "genres/destroyEmpty",
      destroyLabels: "labels/destroyEmpty"
    }),
    destroyEmptyArtists: function() {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.artistsDisabled = true;
        this.destroyArtists().finally(() => {
          this.artistsDisabled = false;
        });
      }
    },
    destroyEmptyAlbums: function() {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.albumsDisabled = true;
        this.destroyAlbums().finally(() => {
          this.albumsDisabled = false;
        });
      }
    },
    destroyEmptyGenres: function() {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.genresDisabled = true;
        this.destroyGenres().finally(() => {
          this.genresDisabled = false;
        });
      }
    },
    destroyEmptyLabels: function() {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.labelsDisabled = true;
        this.destroyLabels().finally(() => {
          this.labelsDisabled = false;
        });
      }
    }
  }
};
</script>
