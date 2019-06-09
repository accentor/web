<template>
  <span>
    <VBtn
      @click="destroyEmptyArtists"
      color="warning"
      :disabled="artistsDisabled"
    >
      <VIcon left>
        {{ artistsDisabled ? "mdi-refresh mdi-spin" : "mdi-alert-octagon" }}
      </VIcon>
      Delete empty artists
    </VBtn>
    <VBtn
      @click="destroyEmptyAlbums"
      color="warning"
      :disabled="albumsDisabled"
    >
      <VIcon left>
        {{ albumsDisabled ? "mdi-refresh mdi-spin" : "mdi-alert-octagon" }}
      </VIcon>
      Delete empty albums
    </VBtn>
    <VBtn
      @click="destroyEmptyGenres"
      color="warning"
      :disabled="genresDisabled"
    >
      <VIcon left>
        {{ genresDisabled ? "mdi-refresh mdi-spin" : "mdi-alert-octagon" }}
      </VIcon>
      Delete empty genres
    </VBtn>
    <VBtn
      @click="destroyEmptyLabels"
      color="warning"
      :disabled="labelsDisabled"
    >
      <VIcon left>
        {{ labelsDisabled ? "mdi-refresh mdi-spin" : "mdi-alert-octagon" }}
      </VIcon>
      Delete empty labels
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
      if (confirm("Are you sure?")) {
        this.artistsDisabled = true;
        this.destroyArtists().finally(() => {
          this.artistsDisabled = false;
        });
      }
    },
    destroyEmptyAlbums: function() {
      if (confirm("Are you sure?")) {
        this.albumsDisabled = true;
        this.destroyAlbums().finally(() => {
          this.albumsDisabled = false;
        });
      }
    },
    destroyEmptyGenres: function() {
      if (confirm("Are you sure?")) {
        this.genresDisabled = true;
        this.destroyGenres().finally(() => {
          this.genresDisabled = false;
        });
      }
    },
    destroyEmptyLabels: function() {
      if (confirm("Are you sure?")) {
        this.labelsDisabled = true;
        this.destroyLabels().finally(() => {
          this.labelsDisabled = false;
        });
      }
    }
  }
};
</script>
