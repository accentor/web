<template>
  <VTooltip location="bottom" :disabled="playableTracks.length !== 0">
    <template #activator="{ props: tooltipProps }">
      <span v-bind="tooltipProps">
        <VBtn
          :disabled="playableTracks.length === 0"
          color="primary"
          variant="text"
          icon
          size="small"
          @click.stop.prevent="startTracks"
        >
          <VIcon size="x-large">mdi-play</VIcon>
        </VBtn>
      </span>
    </template>
    <span>{{ I18n.t("music.playlist.no-tracks-to-play") }}</span>
  </VTooltip>
  <VTooltip location="bottom" :disabled="playableTracks.length !== 0">
    <template #activator="{ props: tooltipProps }">
      <span v-bind="tooltipProps">
        <VBtn
          :disabled="playableTracks.length === 0"
          color="success"
          variant="text"
          icon
          size="small"
          @click.stop.prevent="addTracks"
        >
          <VIcon size="x-large">mdi-plus</VIcon>
        </VBtn>
      </span>
    </template>
    <span>{{ I18n.t("music.playlist.no-tracks-to-add") }}</span>
  </VTooltip>
  <VTooltip
    v-if="isAllowedToEdit"
    location="bottom"
    :disabled="!waitingForReload"
  >
    <template #activator="{ props: tooltipProps }">
      <span v-bind="tooltipProps">
        <VBtn
          :to="{
            name: 'edit-playlist',
            params: { id: playlist.id },
            query: { redirect: route.fullPath },
          }"
          :disabled="waitingForReload"
          color="warning"
          variant="text"
          icon
          size="small"
        >
          <VIcon size="x-large">mdi-pencil</VIcon>
        </VBtn>
      </span>
    </template>
    <span>{{ I18n.t("common.disabled-while-loading") }}</span>
  </VTooltip>
  <VTooltip
    v-if="isAllowedToEdit"
    location="bottom"
    :disabled="!waitingForReload"
  >
    <template #activator="{ props: tooltipProps }">
      <span v-bind="tooltipProps">
        <VBtn
          :disabled="waitingForReload"
          color="error"
          class="mr-0"
          href="#"
          variant="text"
          icon
          size="small"
          @click.stop.prevent="deletePlaylist"
        >
          <VIcon size="x-large">mdi-delete</VIcon>
        </VBtn>
      </span>
    </template>
    <span>{{ I18n.t("common.disabled-while-loading") }}</span>
  </VTooltip>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth";
import { usePlaylistsStore } from "@/store/playlists";
import { useTracksStore } from "@/store/tracks";
import { useErrorsStore } from "@/store/errors";
import { usePlayerStore } from "@/store/player";
import type { Playlist } from "@accentor/api-client-js";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const I18n = useI18n();
const route = useRoute();
const authStore = useAuthStore();
const errorStore = useErrorsStore();
const playerStore = usePlayerStore();
const playlistsStore = usePlaylistsStore();

const props = defineProps<{ playlist: Playlist & { loaded: Date } }>();
const isAllowedToEdit = computed(
  () =>
    props.playlist.access === "shared" ||
    props.playlist.user_id === authStore.currentUser?.id,
);
const waitingForReload = computed(
  () => playlistsStore.startLoading > props.playlist.loaded,
);

const playlistTracks = computed(() => {
  const tracksStore = useTracksStore();
  switch (props.playlist.playlist_type) {
    case "album":
      return props.playlist.item_ids
        .map((album_id) => tracksStore.tracksFilterByAlbum(album_id))
        .flat();
    case "artist":
      return props.playlist.item_ids
        .map((artist_id) => tracksStore.tracksFilterByArtist(artist_id))
        .flat();
    case "track":
      return props.playlist.item_ids.map((id) => tracksStore.tracks[`${id}`]!);
    default:
      return [];
  }
});

const playableTracks = computed(() =>
  playlistTracks.value.filter((t) => t.length !== null).map((t) => t.id),
);

async function deletePlaylist(): Promise<void> {
  if (confirm(I18n.t("common.are-you-sure"))) {
    await playlistsStore.destroy(props.playlist.id);
  }
}

function startTracks(): void {
  if (playlistTracks.value.length > 0) {
    playerStore.playTracks(playableTracks.value);
    if (playableTracks.value.length !== playlistTracks.value.length) {
      errorStore.addError({ playlist: ["player.not-all-tracks-added"] });
    }
  } else {
    errorStore.addError({ playlist: ["player.no-tracks-added"] });
  }
}

function addTracks(): void {
  if (playlistTracks.value.length > 0) {
    playerStore.addTracks(playableTracks.value);
    if (playableTracks.value.length !== playlistTracks.value.length) {
      errorStore.addError({ playlist: ["player.not-all-tracks-added"] });
    }
  } else {
    errorStore.addError({ playlist: ["player.no-tracks-added"] });
  }
}
</script>
