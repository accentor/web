<template>
  <div>
    <VLayout justify-end align-baseline wrap mb-2>
      <VFlex v-if="showSearch" xs12 sm8 md6 lg4 xl2>
        <VTextField
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          :label="$t('common.search')"
          single-line
          hide-details
        ></VTextField>
      </VFlex>
    </VLayout>
    <VDataTable
      v-model="selected"
      :footer-props="{
        disableItemsPerPage: true,
        itemsPerPageOptions: [30],
        showFirstLastPage: true
      }"
      :headers="headers"
      :items="filteredItems"
      :items-per-page="30"
      :page.sync="pagination.page"
      :show-select="isModerator && showMassEdit"
      class="elevation-3"
      ref="table"
    >
      <template v-slot:header.actions v-if="isModerator && showMassEdit">
        <MassEditDialog :tracks="selected" @close="reloadSelected" />
      </template>
      <template v-slot:header.data-table-select="props">
        <VCheckbox
          :input-value="props.props.value"
          :value="props.props.value"
          :indeterminate="props.props.indeterminate"
          hide-details
          primary
          @click.stop="toggleAll"
          class="bottom-padding-fix"
        />
      </template>
      <template v-slot:item.number="props">
        <span v-if="currentTrack !== null && props.item.id === currentTrack.id">
          <VIcon>mdi-volume-high</VIcon>
        </span>
        <span v-else>{{ props.value }}</span>
      </template>
      <template v-slot:item.length="props">
        {{ props.value | length }}
      </template>
      <template v-slot:item.album_id="props">
        <RouterLink :to="{ name: 'album', params: { id: props.value } }">
          {{ albums[props.value].title }}
        </RouterLink>
      </template>
      <template v-slot:item.track_artists="props">
        <TrackArtists :track="props.item" />
      </template>
      <template v-slot:item.genre_ids="props">
        <TrackGenres :track="props.item" />
      </template>
      <template v-slot:item.actions="props">
        <TrackActions :track="props.item" />
      </template>
    </VDataTable>
  </div>
</template>

<script>
import TrackActions from "./TrackActions";
import Paginated from "../mixins/Paginated";
import { mapGetters, mapState } from "vuex";
import Searchable from "../mixins/Searchable";
import TrackArtists from "./TrackArtists";
import TrackGenres from "./TrackGenres";
import MassEditDialog from "./MassEditDialog";

export default {
  name: "TracksTable",
  components: { TrackGenres, TrackActions, TrackArtists, MassEditDialog },
  mixins: [Paginated, Searchable],
  props: {
    tracks: { default: () => [], type: Array },
    savePagination: { default: true, type: Boolean },
    showAlbum: { default: true, type: Boolean },
    showMassEdit: { default: true, type: Boolean },
    showSearch: { default: false, type: Boolean }
  },
  data() {
    const headers = [
      {
        text: "#",
        value: "number",
        sortable: false,
        align: "center",
        width: "1px"
      },
      {
        text: this.$t("music.title"),
        value: "title",
        sortable: false
      },
      {
        text: this.$t("music.track.length"),
        value: "length",
        sortable: false,
        align: "end"
      },
      {
        text: this.$tc("music.albums", 1),
        value: "album_id",
        sortable: false
      },
      {
        text: this.$t("music.artist.artist-s"),
        value: "track_artists",
        sortable: false
      },
      {
        text: this.$t("music.genre-s"),
        value: "genre_ids",
        sortable: false
      },
      {
        text: this.$t("common.actions"),
        value: "actions",
        sortable: false,
        align: "end"
      }
    ];
    if (!this.showAlbum) {
      headers.splice(3, 1);
    }
    return {
      headers,
      selected: []
    };
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapGetters("player", ["currentTrack"]),
    ...mapState("albums", ["albums"]),
    ...mapState("tracks", { tracksObj: "tracks" }),
    filteredItems() {
      return this.tracks.filter(
        item =>
          !this.search ||
          item.title
            .toLocaleLowerCase()
            .indexOf(this.search.toLocaleLowerCase()) >= 0
      );
    }
  },
  methods: {
    toggleAll() {
      if (this.selected.length > 0) {
        this.selected = [];
      } else {
        this.selected = this.filteredItems;
      }
    },
    reloadSelected() {
      this.selected = this.selected.map(s => this.tracksObj[s.id]);
    }
  }
};
</script>

<style scoped>
.bottom-padding-fix {
  padding-bottom: 16px;
}
</style>
