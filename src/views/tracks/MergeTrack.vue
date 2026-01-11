<template>
  <div>
    <VContainer v-if="track" class="fill-height">
      <VRow>
        <VCol lg="9" md="8" sm="6" cols="12">
          <div class="text-h4">
            {{ I18n.t("music.track.merge.title", { obj: track.title }) }}
          </div>
          <div class="text-grey">
            {{ I18n.t("music.track.merge.explanation") }}
          </div>
        </VCol>
      </VRow>
      <VRow>
        <VTable class="text-left merge-table">
          <template #default>
            <thead>
              <tr>
                <th>{{ I18n.t("music.track.merge.original") }}</th>
                <th class="text-center">
                  {{ I18n.t("music.track.merge.result") }}
                </th>
                <th class="text-right">
                  {{ I18n.t("music.track.merge.selected") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  class="align-center"
                  :class="{ 'd-flex justify-space-between': !reversed }"
                >
                  <span class="my-auto"
                    >{{ track.number }}. {{ track.title }}</span
                  >
                  <VIcon v-if="!reversed && newID">mdi-arrow-right</VIcon>
                </td>
                <td class="text-center">
                  <span v-if="result.number">{{ result.number }}. </span
                  >{{ result.title }}
                </td>
                <td
                  class="text-right align-center"
                  :class="{ 'd-flex justify-space-between': reversed }"
                >
                  <VIcon v-if="reversed && newID">mdi-arrow-left</VIcon>
                  <span class="my-auto">
                    <span v-if="selectedTrack.number"
                      >{{ selectedTrack.number }}. </span
                    >{{ selectedTrack.title }}
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  class="align-center"
                  :class="{ 'd-flex justify-space-between': !reversed }"
                >
                  <span class="my-auto">{{
                    albums[track.album_id]?.title
                  }}</span>
                  <VIcon v-if="!reversed && newID">mdi-arrow-right</VIcon>
                </td>
                <td class="text-center">
                  {{ result.album_id ? albums[result.album_id]?.title : "-" }}
                </td>
                <td
                  class="text-right align-center"
                  :class="{ 'd-flex justify-space-between': reversed }"
                >
                  <VIcon v-if="reversed && newID">mdi-arrow-left</VIcon>
                  <span class="my-auto">
                    {{
                      selectedTrack.album_id
                        ? albums[selectedTrack.album_id]?.title
                        : "-"
                    }}
                  </span>
                </td>
              </tr>
              <tr>
                <td
                  class="align-center"
                  :class="{ 'd-flex justify-space-between': !reversed }"
                >
                  <TrackArtists class="my-auto" :track="track" />
                  <VIcon v-if="!reversed && newID">mdi-arrow-right</VIcon>
                </td>
                <td class="text-center">
                  <TrackArtists v-if="result.track_artists" :track="result" />
                  <span v-else>-</span>
                </td>
                <td
                  class="align-center"
                  :class="{ 'd-flex justify-space-between': reversed }"
                >
                  <VIcon v-if="reversed && newID">mdi-arrow-left</VIcon>
                  <TrackArtists
                    v-if="selectedTrack.track_artists"
                    class="my-auto text-right"
                    :track="selectedTrack"
                  />
                  <span v-else>-</span>
                </td>
              </tr>
              <tr>
                <td
                  class="align-center"
                  :class="{ 'd-flex justify-space-between': !reversed }"
                >
                  <TrackGenres class="my-auto" :track="track" />
                  <VIcon v-if="!reversed && newID">mdi-arrow-right</VIcon>
                </td>
                <td class="text-center">
                  <TrackGenres v-if="result.genre_ids" :track="result" />
                  <span v-else>-</span>
                </td>
                <td
                  class="align-center"
                  :class="{ 'd-flex justify-space-between': reversed }"
                >
                  <VIcon v-if="reversed && newID">mdi-arrow-left</VIcon>
                  <TrackGenres
                    v-if="selectedTrack.genre_ids"
                    class="my-auto text-right"
                    :track="selectedTrack"
                  />
                  <span v-else>-</span>
                </td>
              </tr>
              <tr>
                <td
                  class="align-center"
                  :class="{
                    'd-flex justify-space-between': !result.file.selected,
                  }"
                >
                  <span class="my-auto">
                    {{
                      track.filename
                        ? track.filename
                        : I18n.t("music.track.empty")
                    }}
                  </span>
                  <VIcon v-if="!result.file.selected && track.filename && newID"
                    >mdi-arrow-right</VIcon
                  >
                </td>
                <td class="text-center">
                  {{
                    result.file.name
                      ? result.file.name
                      : I18n.t("music.track.merge.result-empty")
                  }}
                </td>
                <td
                  class="align-center text-right"
                  :class="{
                    'd-flex justify-space-between': result.file.selected,
                  }"
                >
                  <VIcon
                    v-if="
                      result.file.selected && selectedTrack.filename && newID
                    "
                    >mdi-arrow-left</VIcon
                  >
                  <span v-if="selectedTrack" class="my-auto text-right">
                    {{
                      selectedTrack.filename
                        ? selectedTrack.filename
                        : I18n.t("music.track.empty")
                    }}
                  </span>
                  <span v-else class="my-auto text-right"> - </span>
                </td>
              </tr>
            </tbody>
          </template>
        </VTable>
      </VRow>
      <VRow>
        <VCol class="d-flex justify-center">
          <VBtn color="primary" class="ma-2" :disabled="!newID" @click="submit">
            {{ I18n.t("music.track.merge.submit") }}
          </VBtn>
        </VCol>
        <VCol class="d-flex justify-center">
          <VBtn
            color="success"
            class="ma-2"
            :disabled="!newID"
            @click="reversed = !reversed"
          >
            <VIcon>mdi-swap-horizontal-bold</VIcon>
            {{ I18n.t("music.track.merge.swap-tracks") }}
          </VBtn>
        </VCol>
        <VCol class="d-flex justify-center">
          <VBtn
            color="secondary"
            class="ma-2"
            @click="limitTracksToAlbum = !limitTracksToAlbum"
          >
            {{
              limitTracksToAlbum
                ? I18n.t("music.track.merge.show-all-tracks")
                : I18n.t("music.track.merge.show-only-album-tracks")
            }}
          </VBtn>
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <TracksTable
            :tracks="mergeOptions"
            :show-search="true"
            :show-actions="false"
            :show-mass-edit="false"
            :single-select="true"
            @selected="setNewID"
          />
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import TrackGenres from "@/components/TrackGenres.vue";
import TrackArtists from "@/components/TrackArtists.vue";
import TracksTable from "@/components/TracksTable.vue";
import { useAlbumsStore } from "@/store/albums";
import { useTracksStore } from "@/store/tracks";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHead } from "@unhead/vue";
import type { Track, TrackArtist } from "@accentor/api-client-js";
import { useI18n } from "vue-i18n";

const albumsStore = useAlbumsStore();
const tracksStore = useTracksStore();

const I18n = useI18n();
const router = useRouter();
const route = useRoute();

const props = defineProps<{ id: string }>();

const reversed = ref<boolean>(false);
const newID = ref<number | null>(null);
const limitTracksToAlbum = ref<boolean>(true);

const { albums } = storeToRefs(albumsStore);

const track = computed(() => tracksStore.tracks[props.id]);
const title = computed(() =>
  I18n.t("page-titles.merge", { obj: track.value?.title }),
);
useHead({ title });

const mergeOptions = computed(() => {
  if (!track.value) {
    return [];
  }

  let tracks;
  if (limitTracksToAlbum.value) {
    tracks = tracksStore.tracksFilterByAlbum(track.value.album_id);
  } else {
    tracks = tracksStore.tracksByAlbumAndNumber;
  }
  return tracks.filter((t: Track): boolean => `${t.id}` !== props.id);
});

interface TableValues {
  number: number | undefined;
  title: string;
  album_id: number | null;
  track_artists: TrackArtist[];
  genre_ids: number[];
  filename: string | null;
}

const selectedTrack = computed<TableValues>(() => {
  if (newID.value) {
    const track = tracksStore.tracks[`${newID.value}`];
    if (track) {
      return track;
    }
  }
  return {
    number: undefined,
    title: "-",
    album_id: null,
    track_artists: [],
    genre_ids: [],
    filename: "-",
  };
});

const result = computed<
  TableValues & { file: { name: string | null; selected: boolean } }
>(() => {
  if (!track.value) {
    return {
      ...selectedTrack.value,
      file: { name: "-", selected: false },
    };
  }

  if (reversed.value) {
    const file = track.value.filename
      ? { name: track.value.filename, selected: false }
      : { name: selectedTrack.value.filename, selected: true };
    return {
      ...selectedTrack.value,
      file,
    };
  } else {
    const file = selectedTrack.value.filename
      ? { name: selectedTrack.value.filename, selected: true }
      : { name: track.value.filename, selected: false };
    return {
      ...track.value,
      file,
    };
  }
});

function setNewID(id: number): void {
  newID.value = id;
}

async function submit(): Promise<void> {
  if (!newID.value || !track.value) {
    return;
  }

  try {
    const newId = reversed.value ? newID.value : track.value.id;
    const oldId = reversed.value ? track.value.id : newID.value;
    await tracksStore.merge(newId, oldId);
  } finally {
    await router.push(
      (route.query.redirect as string | undefined) || { name: "tracks" },
    );
  }
}
</script>

<style lang="scss">
// We do not follow BEM here, since Vuetify doesn't allow us to directly add a class to the table
.merge-table {
  width: 100%;

  table {
    table-layout: fixed;
  }
}
</style>
