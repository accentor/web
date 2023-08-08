<template>
  <div>
    <VRow class="mb-2" justify="end" align="baseline">
      <VCol cols="12" md="6" lg="8" xl="10" v-if="title !== null">
        <h2 class="text-h4">{{ title }}</h2>
      </VCol>
      <VCol v-if="showSearch" cols="12" sm="8" md="6" lg="4" xl="2">
        <VTextField
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          :label="$t('common.search')"
          single-line
          hide-details
        ></VTextField>
      </VCol>
    </VRow>
    <VDataTable
      v-model="selected"
      :footer-props="{
        disableItemsPerPage: true,
        itemsPerPageOptions: [30],
        showFirstLastPage: true,
      }"
      :headers="headers"
      :items="filteredItems"
      :items-per-page="30"
      :page.sync="pagination.page"
      :sort-by.sync="sortable.sortBy"
      :sort-desc.sync="sortable.sortDesc"
      :show-select="isModerator"
      :single-select="singleSelect"
      :custom-sort="sortFunction"
      class="elevation-3"
      ref="table"
      @item-selected="emitSelected"
    >
      <template v-slot:header.actions v-if="isModerator && showMassEdit">
        <MassEditDialog :tracks="selected" @close="reloadSelected" />
      </template>
      <template v-slot:header.data-table-select="props" v-if="!singleSelect">
        <VCheckbox
          :input-value="props.props.value"
          :value="props.props.value"
          :indeterminate="props.props.indeterminate"
          hide-details
          primary
          @click.stop="toggleAll"
          class="pb-4"
        />
      </template>
      <template v-slot:item.data-table-select="item" v-if="singleSelect">
        <VRadioGroup v-model="selectedIds" :multiple="true" :mandatory="false">
          <VRadio
            :value="item.item.id"
            :input-value="item.isSelected"
            @click="(val) => item.select(val)"
          />
        </VRadioGroup>
      </template>
      <template v-slot:item.number="props">
        <span v-if="currentTrack !== null && props.item.id === currentTrack.id">
          <VIcon>mdi-volume-high</VIcon>
        </span>
        <span v-else>{{ props.value }}</span>
      </template>
      <template v-slot:item.length="props">
        <span v-if="props.value !== null">
          {{ props.value | length }}
        </span>
        <VTooltip v-else bottom>
          <template v-slot:activator="{ on }">
            <span v-on="on" class="white-space-nowrap">
              <VIcon small color="red" class="pr-2">mdi-alert</VIcon>--:--
            </span>
          </template>
          <span>
            {{ $t("music.track.empty") }}
          </span>
        </VTooltip>
      </template>
      <template v-slot:item.album_id="props">
        <RouterLink :to="{ name: 'album', params: { id: props.value } }">
          {{ albums[props.value] ? albums[props.value].title : "" }}
        </RouterLink>
      </template>
      <template v-slot:item.track_artists="props">
        <TrackArtists :track="props.item" />
      </template>
      <template v-slot:item.genre_ids="props">
        <TrackGenres :track="props.item" />
      </template>
      <template v-slot:item.play_count="props">
        {{
          (playStatsByTrack[props.item.id] &&
            playStatsByTrack[props.item.id].count) ||
          0
        }}
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
import Sortable from "../mixins/Sortable";
import TrackArtists from "./TrackArtists";
import TrackGenres from "./TrackGenres";
import MassEditDialog from "./MassEditDialog";
import {
  compareStrings,
  compareTracks,
  compareTracksByArtist,
  compareTracksByGenre,
} from "@/comparators";

export default {
  name: "TracksTable",
  components: { TrackGenres, TrackActions, TrackArtists, MassEditDialog },
  mixins: [Paginated, Searchable, Sortable],
  props: {
    tracks: { default: () => [], type: Array },
    savePagination: { default: true, type: Boolean },
    showActions: { default: true, type: Boolean },
    showAlbum: { default: true, type: Boolean },
    showMassEdit: { default: true, type: Boolean },
    showSearch: { default: false, type: Boolean },
    singleSelect: { default: false, type: Boolean },
    title: { required: false, type: String },
  },
  data() {
    const headers = [
      {
        text: "#",
        value: "number",
        sortable: true,
        align: "center",
        width: "1px",
        class: "text-no-wrap",
      },
      {
        text: this.$t("music.title"),
        value: "title",
        class: "text-no-wrap",
      },
      {
        text: this.$t("music.track.length"),
        value: "length",
        align: "end",
        width: "1px",
        class: "text-no-wrap",
      },
      {
        text: this.$tc("music.albums", 1),
        value: "album_id",
        class: "text-no-wrap",
      },
      {
        text: this.$t("music.artist.artist-s"),
        value: "track_artists",
        class: "text-no-wrap",
      },
      {
        text: this.$t("music.genre-s"),
        value: "genre_ids",
        class: "text-no-wrap",
      },
      {
        text: this.$t("music.play-count"),
        value: "play_count",
        align: "end",
        width: "1px",
        class: "text-no-wrap",
      },
      {
        text: this.$t("common.actions"),
        value: "actions",
        sortable: false,
        align: "end",
        width: "1px",
        class: "text-no-wrap",
      },
    ];
    if (!this.showAlbum) {
      headers.splice(3, 1);
    }
    if (!this.showActions) {
      headers.splice(-1, 1);
    }
    return {
      headers,
      selected: [],
    };
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapGetters("player", ["currentTrack"]),
    ...mapGetters("plays", ["playStatsByTrack"]),
    ...mapState("albums", ["albums"]),
    ...mapState("genres", ["genres"]),
    ...mapState("tracks", { tracksObj: "tracks" }),
    filteredItems() {
      return this.tracks.filter(
        (item) =>
          !this.search ||
          item.title
            .toLocaleLowerCase()
            .indexOf(this.search.toLocaleLowerCase()) >= 0 ||
          item.normalized_title.indexOf(this.search.toLocaleLowerCase()) >= 0,
      );
    },
    selectedIds() {
      return this.selected.map((t) => t.id);
    },
  },
  methods: {
    emitSelected(o) {
      this.$emit("selected", o.value ? o.item.id : null);
    },
    toggleAll() {
      if (this.selected.length > 0) {
        this.selected = [];
      } else {
        this.selected = this.filteredItems;
      }
    },
    reloadSelected() {
      this.selected = this.selected.map((s) => this.tracksObj[s.id]);
    },
    sortFunction(items, sortBy, sortDesc) {
      let sortFunction = null;
      switch (sortBy[0]) {
        case "album_id":
          sortFunction = compareTracks(this.albums);
          break;
        case "genre_ids":
          sortFunction = compareTracksByGenre(this.genres);
          break;
        case "length":
          sortFunction = (t1, t2) => t1.length - t2.length;
          break;
        case "number":
          sortFunction = (t1, t2) => t1.number - t2.number;
          break;
        case "play_count":
          sortFunction = (t1, t2) =>
            (this.playStatsByTrack[t1.id]?.count || 0) -
            (this.playStatsByTrack[t2.id]?.count || 0);
          break;
        case "title":
          sortFunction = (t1, t2) =>
            compareStrings(t1.normalized_title, t2.normalized_title);
          break;
        case "track_artists":
          sortFunction = compareTracksByArtist;
      }
      const sorted = sortFunction ? items.sort(sortFunction) : items;
      return sortDesc[0] ? sorted.reverse() : sorted;
    },
  },
};
</script>
