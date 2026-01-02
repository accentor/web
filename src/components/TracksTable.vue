<template>
  <div>
    <VRow class="mb-2" justify="end" align="baseline">
      <VCol v-if="title !== null" cols="12" md="6" lg="8" xl="10">
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
      v-model:page="pagination.page"
      item-value="id"
      :headers="headers"
      :items="filteredItems"
      :items-per-page="30"
      :items-per-page-options="[30]"
      :show-select="isModerator && showSelect"
      :select-strategy="singleSelect ? 'single' : 'all'"
      return-object
      class="elevation-3"
    >
      <template v-if="isModerator && showMassEdit" #header.actions>
        <MassEditDialog :tracks="selected" @close="reloadSelected" />
      </template>
      <template #bottom>
        <VDivider />
        <div class="text-center py-2">
          <VPagination
            v-model="pagination.page"
            density="compact"
            :length="pageCount"
            total-visible="5"
          />
        </div>
      </template>
      <template #item.number="props">
        <span v-if="currentTrack !== null && props.item.id === currentTrack.id">
          <VIcon>mdi-volume-high</VIcon>
        </span>
        <span v-else>{{ props.value }}</span>
      </template>
      <template #item.length="props">
        <span v-if="props.value !== null">
          {{ $filters.length(props.value) }}
        </span>
        <VTooltip v-else location="bottom">
          <template #activator="{ props: innerProps }">
            <span class="white-space-nowrap" v-bind="innerProps">
              <VIcon size="small" color="red" class="pr-2">mdi-alert</VIcon
              >--:--
            </span>
          </template>
          <span>
            {{ $t("music.track.empty") }}
          </span>
        </VTooltip>
      </template>
      <template #item.album_id="props">
        <RouterLink :to="{ name: 'album', params: { id: props.value } }">
          {{ albums[props.value] ? albums[props.value].title : "" }}
        </RouterLink>
      </template>
      <template #item.track_artists="props">
        <TrackArtists :track="props.item" />
      </template>
      <template #item.genre_ids="props">
        <TrackGenres :track="props.item" />
      </template>
      <template #item.play_count="props">
        {{
          (playStatsByTrack[props.item.id] &&
            playStatsByTrack[props.item.id].count) ||
          0
        }}
      </template>
      <template #item.actions="props">
        <TrackActions :track="props.item" />
      </template>
    </VDataTable>
  </div>
</template>

<script>
import { mapState } from "pinia";
import TrackActions from "./TrackActions.vue";
import Paginated from "../mixins/Paginated";
import Searchable from "../mixins/Searchable";
import Sortable from "../mixins/Sortable";
import TrackArtists from "./TrackArtists.vue";
import TrackGenres from "./TrackGenres.vue";
import MassEditDialog from "./MassEditDialog.vue";
import {
  compareStrings,
  compareTracks,
  compareTracksByArtist,
  compareTracksByGenre,
} from "@/comparators";
import { useAuthStore } from "../store/auth";
import { useGenresStore } from "../store/genres";
import { useAlbumsStore } from "../store/albums";
import { useTracksStore } from "../store/tracks";
import { usePlaysStore } from "../store/plays";
import { usePlayerStore } from "../store/player";

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
    title: { required: false, type: String, default: undefined },
  },
  emits: ["selected"],
  data() {
    const headers = [
      {
        title: "#",
        value: "number",
        align: "center",
        width: "1px",
        class: "text-no-wrap",
        key: "number",
      },
      {
        title: this.$t("music.title"),
        value: "title",
        class: "text-no-wrap",
        sortRaw: (t1, t2) =>
          compareStrings(t1.normalized_title, t2.normalized_title),
      },
      {
        title: this.$t("music.track.length"),
        value: "length",
        align: "end",
        width: "1px",
        class: "text-no-wrap",
        key: "length",
      },
      {
        title: this.$tc("music.albums", 1),
        value: "album_id",
        class: "text-no-wrap",
        sortRaw: compareTracks(this.albums),
      },
      {
        title: this.$t("music.artist.artist-s"),
        value: "track_artists",
        class: "text-no-wrap",
        sortRaw: compareTracksByArtist,
      },
      {
        title: this.$t("music.genre-s"),
        value: "genre_ids",
        class: "text-no-wrap",
        sortRaw: compareTracksByGenre(this.genres),
      },
      {
        title: this.$t("music.play-count"),
        value: "play_count",
        align: "end",
        width: "1px",
        class: "text-no-wrap",
        sortRaw: (t1, t2) =>
          (this.playStatsByTrack[t1.id]?.count || 0) -
          (this.playStatsByTrack[t2.id]?.count || 0),
      },
      {
        title: this.$t("common.actions"),
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
    ...mapState(useAuthStore, ["isModerator"]),
    ...mapState(usePlayerStore, ["currentTrack"]),
    ...mapState(useAlbumsStore, ["albums"]),
    ...mapState(useGenresStore, ["genres"]),
    ...mapState(usePlaysStore, ["playStatsByTrack"]),
    ...mapState(useTracksStore, { tracksObj: "tracks" }),
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
    pageCount() {
      return Math.ceil(this.filteredItems.length / 30);
    },
    showSelect() {
      return this.showMassEdit || this.singleSelect;
    },
  },
  watch: {
    selected(newValue, oldValue) {
      const newItem = newValue.filter((el) => !oldValue.includes(el))[0];
      this.$emit("selected", newItem?.id || null);
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
  },
};
</script>
