<template>
  <VContainer v-if="playlist" fluid>
    <VRow class="mb-2" justify="space-between" align="baseline">
      <VCol cols="12" sm="4" md="6" lg="8" xl="10">
        <div>
          <h2 class="text-h4">{{ playlist.name }}</h2>
          <p class="text-grey mb-1">
            {{ users[playlist.user_id].name }} &bull;
            {{ $t(`music.playlist.access_options.${playlist.access}`) }}
          </p>
          <p class="text-grey mb-1">
            {{
              $tc(
                `music.playlist.item_counts.${playlist.playlist_type}`,
                playlist.item_ids.length,
              )
            }}
          </p>
          <p class="text-grey mb-1">{{ playlist.description }}</p>
        </div>
        <div class="actions">
          <PlaylistActions :playlist="playlist" />
        </div>
      </VCol>
      <VCol cols="12" sm="8" md="6" lg="4" xl="2"> </VCol>
    </VRow>
    <VRow v-if="playlist.playlist_type === 'track'" no-gutters>
      <VCol>
        <TracksTable
          :tracks="items"
          :show-search="true"
          :show-mass-edit="false"
        />
      </VCol>
    </VRow>
    <VDataIterator
      v-else
      v-model:page="pagination.page"
      :footer-props="{
        disableItemsPerPage: true,
        itemsPerPageOptions: [12],
        showFirstLastPage: true,
      }"
      :items="items"
      :items-per-page="12"
    >
      <template #default="props">
        <VRow>
          <VCol
            v-for="item in props.items"
            :key="item.raw.id"
            lg="3"
            md="4"
            sm="6"
            xl="2"
            cols="6"
          >
            <AlbumCard
              v-if="playlist.playlist_type === 'album'"
              :album="item.raw"
            />
            <ArtistCard v-else :artist="item.raw" />
          </VCol>
        </VRow>
      </template>
    </VDataIterator>
  </VContainer>
</template>

<script>
import { mapActions, mapState } from "pinia";
import AlbumCard from "../../components/AlbumCard.vue";
import ArtistCard from "../../components/ArtistCard.vue";
import TracksTable from "../../components/TracksTable.vue";
import PlaylistActions from "../../components/PlaylistActions.vue";
import Paginated from "../../mixins/Paginated";
import { usePlaylistsStore } from "../../store/playlists";
import { useUsersStore } from "../../store/users";
import { useArtistsStore } from "../../store/artists";
import { useAlbumsStore } from "../../store/albums";
import { useTracksStore } from "../../store/tracks";

export default {
  name: "Playlist",
  components: { AlbumCard, ArtistCard, TracksTable, PlaylistActions },
  mixins: [Paginated],
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  head() {
    return { title: this.playlist?.title };
  },
  computed: {
    ...mapState(usePlaylistsStore, ["playlists"]),
    ...mapState(useAlbumsStore, ["albums"]),
    ...mapState(useArtistsStore, ["artists"]),
    ...mapState(useTracksStore, ["tracks"]),
    ...mapState(useUsersStore, ["users"]),
    playlist() {
      return this.playlists[this.$route.params.id];
    },
    items() {
      let key = `${this.playlist?.playlist_type}s`;
      return this.playlist?.item_ids.map((id) => this[key][id]) || [];
    },
  },
  watch: {
    id: {
      handler: "fetchContent",
      immediate: true,
    },
  },
  methods: {
    ...mapActions(usePlaylistsStore, ["read"]),
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
