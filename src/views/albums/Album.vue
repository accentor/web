<template>
  <VContainer v-if="album" fluid>
    <VRow>
      <VCol
        v-if="album.image500 && !imageUnavailable"
        lg="3"
        md="4"
        sm="6"
        cols="12"
      >
        <VImg :src="album.image500" class="elevation-3" />
      </VCol>
      <VCol
        v-else-if="album.image && !imageUnavailable"
        lg="3"
        md="4"
        sm="6"
        cols="12"
      >
        <VImg :src="album.image" class="elevation-3" />
      </VCol>
      <VCol lg="9" md="8" sm="6" cols="12">
        <div>
          <div class="text-h4">
            {{ album.title }}
            <span v-if="album.edition_description !== null" class="text-grey">
              ({{ album.edition_description }})
            </span>
          </div>
          <AlbumArtists :album="album" />
          <div v-if="album.edition === null" class="text-grey">
            {{ album.release }}
          </div>
          <div v-else class="text-grey">
            <div>{{ album.release }} ({{ $t("music.album.original") }})</div>
            <div>{{ album.edition }} ({{ $t("music.album.edition") }})</div>
          </div>
          <div
            v-for="al of album_labels"
            :key="`${al.label_id} ${al.catalogue_number}`"
            class="text-grey"
          >
            <RouterLink :to="{ name: 'label', params: { id: al.label_id } }">
              {{ labels[al.label_id].name }}
            </RouterLink>
            -
            {{ al.catalogue_number || $t("music.label.catalogue-number-none") }}
          </div>
          <div v-if="playlists.length" class="text-grey mt-4 mb-4">
            {{ $tc("music.album.in-playlists", playlists.length) }}
            <ul>
              <li v-for="playlist in playlists" :key="playlist.id">
                <RouterLink
                  :to="{ name: 'playlist', params: { id: playlist.id } }"
                >
                  {{ playlist.name }}
                </RouterLink>
              </li>
            </ul>
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
import { mapState, mapActions } from "pinia";
import AlbumActions from "../../components/AlbumActions.vue";
import TracksTable from "../../components/TracksTable.vue";
import AlbumArtists from "../../components/AlbumArtists.vue";
import { PlaysScope, TracksScope } from "@accentor/api-client-js";
import { usePlaylistsStore } from "../../store/playlists";
import { useLabelsStore } from "../../store/labels";
import { useAlbumsStore } from "../../store/albums";
import { useTracksStore } from "../../store/tracks";
import { usePlaysStore } from "../../store/plays";

export default {
  name: "Album",
  components: { AlbumArtists, TracksTable, AlbumActions },
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
  head() {
    return { title: this.album?.title };
  },
  computed: {
    ...mapState(useAlbumsStore, ["albums"]),
    ...mapState(useLabelsStore, ["labels"]),
    ...mapState(usePlaylistsStore, { storePlaylists: "albumPlaylists" }),
    tracks: function () {
      return useTracksStore().tracksFilterByAlbum(this.$route.params.id);
    },
    album: function () {
      return this.albums[this.$route.params.id];
    },
    album_labels: function () {
      return this.album.album_labels.filter(
        (al) => `${al.label_id}` in this.labels,
      );
    },
    playlists: function () {
      return this.storePlaylists.filter((p) =>
        p.item_ids.includes(this.album.id),
      );
    },
  },
  watch: {
    id: {
      handler: "fetchContent",
      immediate: true,
    },
  },
  methods: {
    ...mapActions(useAlbumsStore, ["read"]),
    ...mapActions(usePlaysStore, { indexPlays: "index" }),
    ...mapActions(useTracksStore, { indexTracks: "index" }),
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
