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
      v-model:page="page"
      item-value="id"
      :headers="headers"
      :items="filteredItems"
      :items-per-page="30"
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
            v-model="page"
            density="compact"
            :length="pageCount"
            total-visible="5"
          />
        </div>
      </template>
      <template #item.number="{ item, value }">
        <span v-if="currentTrack !== null && item.id === currentTrack.id">
          <VIcon>mdi-volume-high</VIcon>
        </span>
        <span v-else>{{ value }}</span>
      </template>
      <template #item.length="{ value }">
        <span v-if="value !== null">
          {{ formatLength(value) }}
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
      <template #item.album_id="{ value }">
        <RouterLink :to="{ name: 'album', params: { id: `${value}` } }">
          {{ albums[`${value}`]?.title ?? "" }}
        </RouterLink>
      </template>
      <template #item.track_artists="{ item }">
        <TrackArtists :track="item" />
      </template>
      <template #item.genre_ids="{ item }">
        <TrackGenres :track="item" />
      </template>
      <template #item.play_count="{ item }">
        {{ playStatsByTrack[`${item.id}`]?.count ?? 0 }}
      </template>
      <template #item.actions="{ item }">
        <TrackActions :track="item" />
      </template>
    </VDataTable>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import TrackActions from "./TrackActions.vue";
import TrackArtists from "./TrackArtists.vue";
import TrackGenres from "./TrackGenres.vue";
import MassEditDialog from "./MassEditDialog.vue";
import {
  compareStrings,
  compareTracks,
  compareTracksByArtist,
  compareTracksByGenre,
} from "@/comparators.ts";
import { useAuthStore } from "../store/auth";
import { useGenresStore } from "../store/genres";
import { useAlbumsStore } from "../store/albums";
import { usePlaysStore } from "../store/plays";
import { usePlayerStore } from "../store/player";
import type { Track } from "@accentor/api-client-js";
import i18n from "@/i18n";
import { computed, ref, watch } from "vue";
import { useSearch } from "@/composables/search";
import { useTracksStore } from "@/store/tracks";
import { usePagination } from "@/composables/pagination";
import { formatLength } from "@/util";

const tracksStore = useTracksStore();

interface Props {
  tracks?: (Track & { loaded: Date })[];
  savePagination?: boolean;
  saveSort?: boolean;
  showActions?: boolean;
  showAlbum?: boolean;
  showMassEdit?: boolean;
  showSearch?: boolean;
  singleSelect?: boolean;
  title?: string | undefined;
}

const props = withDefaults(defineProps<Props>(), {
  tracks: () => [],
  savePagination: true,
  saveSort: true,
  showActions: true,
  showAlbum: true,
  showMassEdit: true,
  showSearch: false,
  singleSelect: false,
  title: undefined,
});
const showSelect = computed(() => props.singleSelect || props.showMassEdit);

const emit = defineEmits<{ selected: [number] }>();

const headers = computed(() => {
  const result = [
    {
      title: "#",
      value: "number",
      align: "center" as const,
      width: "1px",
      class: "text-no-wrap",
      key: "number",
    },
    {
      title: i18n.global.t("music.title"),
      value: "title",
      class: "text-no-wrap",
      sortable: true,
      sortRaw: (t1: Track, t2: Track): number =>
        compareStrings(t1.normalized_title, t2.normalized_title),
    },
    {
      title: i18n.global.t("music.track.length"),
      value: "length",
      align: "end" as const,
      width: "1px",
      class: "text-no-wrap",
      key: "length",
    },
    {
      title: i18n.global.tc("music.albums", 1),
      value: "album_id",
      class: "text-no-wrap",
      sortable: true,
      sortRaw: compareTracks(albums.value),
    },
    {
      title: i18n.global.t("music.artist.artist-s"),
      value: "track_artists",
      class: "text-no-wrap",
      sortable: true,
      sortRaw: compareTracksByArtist,
    },
    {
      title: i18n.global.t("music.genre-s"),
      value: "genre_ids",
      class: "text-no-wrap",
      sortable: true,
      sortRaw: compareTracksByGenre(genres.value),
    },
    {
      title: i18n.global.t("music.play-count"),
      value: "play_count",
      align: "end" as const,
      width: "1px",
      class: "text-no-wrap",
      sortable: true,
      sortRaw: (t1: Track, t2: Track): number =>
        (playStatsByTrack.value[`${t1.id}`]?.count || 0) -
        (playStatsByTrack.value[`${t2.id}`]?.count || 0),
    },
    {
      title: i18n.global.t("common.actions"),
      value: "actions",
      sortable: false,
      align: "end" as const,
      width: "1px",
      class: "text-no-wrap",
    },
  ];
  if (!props.showAlbum) {
    result.splice(3, 1);
  }
  if (!props.showActions) {
    result.splice(-1, 1);
  }
  return result;
});

const { page } = usePagination();

const { search } = useSearch();
const filteredItems = computed(() => {
  const lookup = search.value.toLowerCase();
  return props.tracks.filter(
    (item) =>
      !lookup ||
      item.title.toLowerCase().indexOf(lookup) >= 0 ||
      item.normalized_title.indexOf(lookup) >= 0,
  );
});

const selected = ref<Track[]>([]);
const pageCount = computed(() => Math.ceil(filteredItems.value.length / 30));

const { isModerator } = storeToRefs(useAuthStore());
const { currentTrack } = storeToRefs(usePlayerStore());
const { albums } = storeToRefs(useAlbumsStore());
const { genres } = storeToRefs(useGenresStore());
const { playStatsByTrack } = storeToRefs(usePlaysStore());

watch(selected, (newValue, oldValue) => {
  const newItem = newValue.filter((el) => !oldValue.includes(el))[0];
  if (newItem) {
    emit("selected", newItem.id);
  }
});

function reloadSelected(): void {
  selected.value = selected.value.map((s) => tracksStore.tracks[`${s.id}`]!);
}
</script>
