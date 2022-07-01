<template>
  <VContainer fluid v-if="playlist">
    <VRow class="mb-2" justify="space-between" align="baseline">
      <VCol cols="12" sm="4" md="6" lg="8" xl="10">
        <div>
          <h2 class="text-h4">{{ playlist.name }}</h2>
          <p class="grey--text mb-1">
            {{ users[playlist.user_id].name }} &bull;
            {{ $t(`music.playlist.access_options.${playlist.access}`) }}
          </p>
          <p class="grey--text mb-1">
            {{
              $tc(
                `music.playlist.item_counts.${playlist.playlist_type}`,
                playlist.item_ids.length
              )
            }}
          </p>
          <p class="grey--text mb-1">{{ playlist.description }}</p>
        </div>
        <div class="actions">
          <PlaylistActions :playlist="playlist" />
        </div>
      </VCol>
      <VCol cols="12" sm="8" md="6" lg="4" xl="2"> </VCol>
    </VRow>
    <VRow no-gutters v-if="playlist.playlist_type === 'track'">
      <VCol>
        <TracksTable
          :tracks="items"
          :show-search="true"
          :show-mass-edit="false"
        />
      </VCol>
    </VRow>
    <VDataIterator
      :footer-props="{
        disableItemsPerPage: true,
        itemsPerPageOptions: [12],
        showFirstLastPage: true,
      }"
      :items="items"
      :items-per-page="12"
      :page.sync="pagination.page"
      v-else
    >
      <template v-slot:default="props">
        <VRow>
          <VCol
            v-for="item in props.items"
            :key="item.id"
            lg="3"
            md="4"
            sm="6"
            xl="2"
            cols="6"
          >
            <AlbumCard
              :album="item"
              v-if="playlist.playlist_type === 'album'"
            />
            <ArtistCard :artist="item" v-else />
          </VCol>
        </VRow>
      </template>
    </VDataIterator>
  </VContainer>
</template>

<script>
import { mapActions, mapState } from "vuex";
import AlbumCard from "../../components/AlbumCard";
import ArtistCard from "../../components/ArtistCard";
import TracksTable from "../../components/TracksTable";
import PlaylistActions from "../../components/PlaylistActions";
import Paginated from "../../mixins/Paginated";

export default {
  name: "Playlist",
  components: { AlbumCard, ArtistCard, TracksTable, PlaylistActions },
  metaInfo() {
    return { title: this.playlist?.title };
  },
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  watch: {
    id: {
      handler: "fetchContent",
      immediate: true,
    },
  },
  mixins: [Paginated],
  computed: {
    ...mapState("playlists", ["playlists"]),
    ...mapState("albums", ["albums"]),
    ...mapState("artists", ["artists"]),
    ...mapState("tracks", ["tracks"]),
    ...mapState("users", ["users"]),
    playlist() {
      return this.playlists[this.$route.params.id];
    },
    items() {
      let key = `${this.playlist?.playlist_type}s`;
      return this.playlist?.item_ids.map((id) => this[key][id]) || [];
    },
  },
  methods: {
    ...mapActions("playlists", ["read"]),
    async fetchContent(newValue, oldValue) {
      // After loading the content, the router will change the id from a string to a number
      // but we don't actually want to load the content twice
      if (newValue == oldValue) {
        return;
      }

      await this.read(this.id);
    },
  },
};
</script>
