<template>
  <VContainer fluid v-if="playlist">
    <VRow class="mb-2" justify="space-between" align="baseline">
      <VCol cols="12" sm="4" md="6" lg="8" xl="10">
        <div>
          <h2 class="text-h4">{{ playlist.name }}</h2>
          <span class="grey--text">{{ playlist.description }}</span>
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
import { mapState } from "vuex";
import AlbumCard from "../../components/AlbumCard";
import ArtistCard from "../../components/ArtistCard";
import TracksTable from "../../components/TracksTable";
import PlaylistActions from "../../components/PlaylistActions";
import Paginated from "../../mixins/Paginated";

export default {
  name: "Playlist",
  components: { AlbumCard, ArtistCard, TracksTable, PlaylistActions },
  props: {
    id: {
      type: [String, Number],
      required: false,
    },
  },
  mixins: [Paginated],
  computed: {
    ...mapState("playlists", ["playlists"]),
    ...mapState("albums", ["albums"]),
    ...mapState("artists", ["artists"]),
    ...mapState("tracks", ["tracks"]),
    playlist() {
      return this.playlists[this.$route.params.id];
    },
    items() {
      let key = `${this.playlist?.playlist_type}s`;
      return this.playlist?.item_ids.map((id) => this[key][id]) || [];
    },
  },
};
</script>
