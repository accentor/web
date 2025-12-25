<template>
  <VContainer fluid v-if="artist">
    <VRow>
      <VCol
        lg="3"
        md="4"
        sm="6"
        v-if="artist.image500 && !imageUnavailable"
        cols="12"
      >
        <VImg :src="artist.image500" class="elevation-3" />
      </VCol>
      <VCol
        lg="3"
        md="4"
        sm="6"
        v-else-if="artist.image && !imageUnavailable"
        cols="12"
      >
        <VImg :src="artist.image" class="elevation-3" />
      </VCol>
      <VCol lg="9" md="8" sm="6" cols="12">
        <div>
          <h2 class="text-h4">{{ artist.name }}</h2>
        </div>
        <div class="grey--text mt-4 mb-4" v-if="playlists.length">
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
        :key="item.id"
        lg="3"
        md="4"
        sm="6"
        v-for="item of albums"
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
import { mapActions, mapState } from "vuex";
import { mapState as mapPiniaState } from "pinia";
import AlbumCard from "../../components/AlbumCard.vue";
import ArtistActions from "../../components/ArtistActions.vue";
import TracksTable from "../../components/TracksTable.vue";
import { AlbumsScope, TracksScope } from "@accentor/api-client-js";
import { useAuthStore } from "../../store/auth";
import { usePlaylistsStore } from "../../store/playlists";

export default {
  name: "Artist",
  metaInfo() {
    return { title: this.artist?.name };
  },
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
  watch: {
    id: {
      handler: "fetchContent",
      immediate: true,
    },
  },
  computed: {
    ...mapPiniaState(useAuthStore, ["isModerator"]),
    ...mapPiniaState(usePlaylistsStore, { storePlaylists: "artistPlaylists" }),
    ...mapState("artists", ["artists"]),
    albums: function () {
      return this.$store.getters["albums/albumsFilterByArtist"](
        this.$route.params.id,
      );
    },
    tracks: function () {
      return this.$store.getters["tracks/tracksFilterByArtist"](
        this.$route.params.id,
      );
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
  methods: {
    ...mapActions("albums", { indexAlbums: "index" }),
    ...mapActions("artists", ["read"]),
    ...mapActions("tracks", { indexTracks: "index" }),
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
