<template>
  <VContainer v-if="artist" fluid>
    <VRow>
      <VCol
        v-if="artist.image500 && !imageUnavailable"
        lg="3"
        md="4"
        sm="6"
        cols="12"
      >
        <VImg :src="artist.image500" class="elevation-3" />
      </VCol>
      <VCol
        v-else-if="artist.image && !imageUnavailable"
        lg="3"
        md="4"
        sm="6"
        cols="12"
      >
        <VImg :src="artist.image" class="elevation-3" />
      </VCol>
      <VCol lg="9" md="8" sm="6" cols="12">
        <div>
          <h2 class="text-h4">{{ artist.name }}</h2>
        </div>
        <div v-if="playlists.length" class="text-grey mt-4 mb-4">
          {{ $tc("music.artist.in-playlists", playlists.length) }}
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
          <ArtistActions :artist="artist" class="actions" :extended="true" />
        </div>
      </VCol>
    </VRow>
    <VRow>
      <VCol
        v-for="item of albums"
        :key="item.id"
        lg="3"
        md="4"
        sm="6"
        xl="2"
        cols="6"
      >
        <AlbumCard :album="item" />
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <TracksTable
          :tracks="tracks"
          :show-search="true"
          :save-search="false"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapState, mapActions } from "pinia";
import AlbumCard from "../../components/AlbumCard.vue";
import ArtistActions from "../../components/ArtistActions.vue";
import TracksTable from "../../components/TracksTable.vue";
import { AlbumsScope, TracksScope } from "@accentor/api-client-js";
import { useAuthStore } from "../../store/auth";
import { usePlaylistsStore } from "../../store/playlists";
import { useArtistsStore } from "../../store/artists";
import { useAlbumsStore } from "../../store/albums";
import { useTracksStore } from "../../store/tracks";

export default {
  name: "Artist",
  components: {
    TracksTable,
    AlbumCard,
    ArtistActions,
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
  head() {
    return { title: this.artist?.name };
  },
  computed: {
    ...mapState(useAuthStore, ["isModerator"]),
    ...mapState(usePlaylistsStore, { storePlaylists: "artistPlaylists" }),
    ...mapState(useArtistsStore, ["artists"]),
    albums: function () {
      return useAlbumsStore().albumsFilterByArtist(this.$route.params.id);
    },
    tracks: function () {
      return useTracksStore().tracksFilterByArtist(this.$route.params.id);
    },
    artist: function () {
      return this.artists[this.$route.params.id];
    },
    playlists: function () {
      return this.storePlaylists.filter((p) =>
        p.item_ids.includes(this.artist.id),
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
    ...mapActions(useAlbumsStore, { indexAlbums: "index" }),
    ...mapActions(useArtistsStore, ["read"]),
    ...mapActions(useTracksStore, { indexTracks: "index" }),
    async fetchContent(newValue, oldValue) {
      // After loading the content, the router will change the id from a string to a number
      // but we don't actually want to load the content twice
      if (newValue == oldValue) {
        return;
      }

      const artist = this.read(this.id);
      const albums = this.indexAlbums(new AlbumsScope().artist(this.id));
      const tracks = this.indexTracks(new TracksScope().artist(this.id));
      await Promise.all([artist, albums, tracks]);
      // If the artist is undefined after loading, we assume that it doesn't exist.
      if (this.artist === undefined) {
        this.$router.go(-1);
      }
    },
    setImageUnavailable() {
      this.imageUnavailable = true;
    },
  },
};
</script>
