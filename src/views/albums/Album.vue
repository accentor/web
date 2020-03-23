<template>
  <VContainer fluid v-if="album">
    <vue-headful :title="album.title + ' | Accentor'" />
    <VRow>
      <VCol lg="3" md="4" sm="6" v-if="album.image500" cols="12">
        <VImg :src="album.image500" class="elevation-3" />
      </VCol>
      <VCol lg="3" md="4" sm="6" v-else-if="album.image" cols="12">
        <VImg :src="album.image" class="elevation-3" />
      </VCol>
      <VCol lg="9" md="8" sm="6" cols="12">
        <div>
          <div class="display-1">
            {{ album.title }}
            <span v-if="album.edition_description !== null" class="grey--text">
              ({{ album.edition_description }})
            </span>
          </div>
          <AlbumArtists :album="album" />
          <div class="grey--text" v-if="album.edition === null">
            {{ album.release }}
          </div>
          <div class="grey--text" v-else>
            <div>{{ album.release }} ({{ $t("music.album.original") }})</div>
            <div>{{ album.edition }} ({{ $t("music.album.edition") }})</div>
          </div>
          <div
            class="grey--text"
            v-for="al of album.album_labels"
            :key="`${al.label_id} ${al.catalogue_number}`"
          >
            <RouterLink :to="{ name: 'label', params: { id: al.label_id } }">
              {{ labels[al.label_id].name }}
            </RouterLink>
            -
            {{ al.catalogue_number || $t("music.label.catalogue-number-none") }}
          </div>
          <div>
            <AlbumActions :album="album" />
          </div>
        </div>
      </VCol>
      <VRow>
        <VCol>
          <TracksTable :tracks="tracks" :show-album="false" />
        </VCol>
      </VRow>
    </VRow>
  </VContainer>
</template>

<script>
import { mapState } from "vuex";
import AlbumActions from "../../components/AlbumActions";
import TracksTable from "../../components/TracksTable";
import AlbumArtists from "../../components/AlbumArtists";

export default {
  name: "Album",
  components: { AlbumArtists, TracksTable, AlbumActions },
  watch: {
    album: function () {
      if (this.album === undefined) {
        this.$router.go(-1);
      }
    },
  },
  computed: {
    ...mapState("albums", ["albums"]),
    ...mapState("labels", ["labels"]),
    tracks: function () {
      return this.$store.getters["tracks/tracksFilterByAlbum"](
        this.$route.params.id
      );
    },
    album: function () {
      return this.albums[this.$route.params.id];
    },
  },
};
</script>
