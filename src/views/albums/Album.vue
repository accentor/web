<template>
  <VContainer fluid v-if="album">
    <VRow>
      <VCol
        lg="3"
        md="4"
        sm="6"
        v-if="album.image500 && !imageUnavailable"
        cols="12"
      >
        <VImg :src="album.image500" class="elevation-3" />
      </VCol>
      <VCol
        lg="3"
        md="4"
        sm="6"
        v-else-if="album.image && !imageUnavailable"
        cols="12"
      >
        <VImg :src="album.image" class="elevation-3" />
      </VCol>
      <VCol lg="9" md="8" sm="6" cols="12">
        <div>
          <div class="text-h4">
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
            v-for="al of album_labels"
            :key="`${al.label_id} ${al.catalogue_number}`"
          >
            <RouterLink :to="{ name: 'label', params: { id: al.label_id } }">
              {{ labels[al.label_id].name }}
            </RouterLink>
            -
            {{ al.catalogue_number || $t("music.label.catalogue-number-none") }}
          </div>
          <div>
            <AlbumActions :album="album" class="actions--wide" />
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
import { mapState, mapActions } from "vuex";
import AlbumActions from "../../components/AlbumActions";
import TracksTable from "../../components/TracksTable";
import AlbumArtists from "../../components/AlbumArtists";
import { PlaysScope, TracksScope } from "@accentor/api-client-js";

export default {
  name: "Album",
  components: { AlbumArtists, TracksTable, AlbumActions },
  metaInfo() {
    return { title: this.album?.title };
  },
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      imageUnavailable: false,
    };
  },
  watch: {
    id: {
      handler: "fetchContent",
      immediate: true,
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
    album_labels: function () {
      return this.album.album_labels.filter(
        (al) => `${al.label_id}` in this.labels
      );
    },
  },
  methods: {
    ...mapActions("albums", ["read"]),
    ...mapActions("plays", { indexPlays: "index" }),
    ...mapActions("tracks", { indexTracks: "index" }),
    async fetchContent(newValue, oldValue) {
      // After loading the content, the router will change the id from a string to a number
      // but we don't actually want to load the content twice
      if (newValue == oldValue) {
        return;
      }

      const album = this.read(this.id);
      const plays = this.indexPlays(new PlaysScope().album(this.id));
      const tracks = this.indexTracks(new TracksScope().album(this.id));
      await Promise.all([album, plays, tracks]);
      // If the album is undefined after loading, we assume that it doesn't exist.
      if (this.album === undefined) {
        this.$router.go(-1);
      }
    },
    setImageUnavailable() {
      this.imageUnavailable = true;
    },
  },
};
</script>
