<template>
  <div>
    <VLayout justify-end align-baseline row wrap mb-2>
      <VFlex v-if="showSearch" xs12 sm8 md6 lg4 xl2>
        <VTextField
          v-if="tracks.length > 30"
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
      :headers="headers"
      :search="search"
      :custom-filter="customFilter"
      :filter="filter"
      :items="tracks"
      :rows-per-page-items="[30]"
      :pagination.sync="pagination"
      :select-all="isModerator && showMassEdit"
      class="elevation-3"
      ref="table"
    >
      <template v-slot:actions-prepend>
        <MassEditDialog
          :tracks="selected"
          v-if="isModerator && showMassEdit"
          @close="reloadSelected"
        />
      </template>
      <template v-slot:headers="props">
        <tr>
          <th v-if="isModerator && showMassEdit" class="td-no-grow">
            <VCheckbox
              :input-value="props.all"
              :value="props.all"
              :indeterminate="props.indeterminate"
              primary
              hide-details
              @click.stop="toggleAll"
            />
          </th>
          <th
            v-for="header in props.headers"
            :key="header.text"
            :class="[
            header.align == null ? 'text-xs-left' : header.align
            ]"
          >
            {{ header.text }}
          </th>
        </tr>
      </template>
      <template v-slot:items="props" class="td-no-grow">
        <td v-if="isModerator && showMassEdit">
          <VCheckbox v-model="props.selected" primary hide-details></VCheckbox>
        </td>
        <td v-if="currentTrack == null || props.item.id !== currentTrack.id" class="text-xs-center">
          {{ props.item.number }}
        </td>
        <td v-else class="text-xs-center">
          <VIcon>mdi-volume-high</VIcon>
        </td>
        <td>{{ props.item.title }}</td>
        <td class="text-xs-right">
          {{ props.item.length | length }}
        </td>
        <td v-if="showAlbum">
          <RouterLink
            :to="{ name: 'album', params: { id: props.item.album_id } }"
          >
            {{ albums[props.item.album_id].title }}
          </RouterLink>
        </td>
        <td>
          <TrackArtists :track="props.item" />
        </td>
        <td>
          <TrackGenres :track="props.item" />
        </td>
        <td class="text-xs-right">
          <TrackActions :track="props.item" />
        </td>
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
    showAlbum: { default: true, type: Boolean },
    showSearch: { default: false, type: Boolean },
    savePagination: { default: true, type: Boolean },
    showMassEdit: { default: true, type: Boolean }
  },
  data() {
    const headers = [
      {
        text: "#",
        value: "number",
        sortable: false,
        align: "text-xs-center"
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
        align: "text-xs-right"
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
        sortable: false,
        align: "text-xs-right"
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
    ...mapState("tracks", {
      tracksObj: "tracks"
    }),
    filteredItems() {
      return this.customFilter(this.tracks, this.search, this.filter);
    }
  },
  methods: {
    customFilter(items, search, filter) {
      search = search ? search.toString().toLowerCase() : "";
      if (search.trim() === "") return items;

      return items.filter(val => filter(val.title, search));
    },
    filter(title, search) {
      return title.toLowerCase().indexOf(search) !== -1;
    },
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
.td-no-grow {
  width: 1px;
}
</style>
