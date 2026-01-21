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
    <span>{{ I18n.t("music.album.no-tracks-to-play") }}</span>
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
    <span>{{ I18n.t("music.album.no-tracks-to-add") }}</span>
  </VTooltip>
  <AddToPlaylist :item="album" type="album" />
  <EditReviewComment :item="album" :update="flag" />
  <VMenu v-if="isModerator" eager>
    <template #activator="{ props: menuProps }">
      <VBtn
        class="mr-0"
        size="small"
        icon
        variant="text"
        v-bind="menuProps"
        @click.stop.prevent
      >
        <VIcon size="x-large">mdi-dots-vertical</VIcon>
      </VBtn>
    </template>
    <VList density="compact">
      <VTooltip location="bottom" :disabled="!waitingForReload">
        <template #activator="{ props: tooltipProps }">
          <VListItem
            :to="{
              name: 'edit-album',
              params: { id: album.id },
              query: { redirect: route.fullPath },
            }"
            :disabled="waitingForReload"
            v-bind="tooltipProps"
          >
            <template #prepend>
              <VIcon color="warning">mdi-pencil</VIcon>
            </template>

            <VListItemTitle>{{ I18n.t("music.album.edit") }}</VListItemTitle>
          </VListItem>
        </template>
        <span>{{ I18n.t("common.disabled-while-loading") }}</span>
      </VTooltip>
      <VTooltip location="bottom" :disabled="!waitingForReload">
        <template #activator="{ props: tooltipProps }">
          <span v-bind="tooltipProps">
            <AlbumMergeDialog :album="album" :disabled="waitingForReload" />
          </span>
        </template>
        <span>{{ I18n.t("common.disabled-while-loading") }}</span>
      </VTooltip>
      <VTooltip
        v-if="isModerator"
        location="bottom"
        :disabled="!waitingForReload"
      >
        <template #activator="{ props: tooltipProps }">
          <VListItem
            :disabled="waitingForReload"
            v-bind="tooltipProps"
            @click.stop.prevent="deleteAlbum"
          >
            <template #prepend>
              <VIcon color="error">mdi-delete</VIcon>
            </template>

            <VListItemTitle>{{ I18n.t("music.album.delete") }}</VListItemTitle>
          </VListItem>
        </template>
        <span>{{ I18n.t("common.disabled-while-loading") }}</span>
      </VTooltip>
    </VList>
  </VMenu>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { computed } from "vue";
import type { Album } from "@accentor/api-client-js";
import EditReviewComment from "./EditReviewComment.vue";
import AddToPlaylist from "./AddToPlaylist.vue";
import AlbumMergeDialog from "./AlbumMergeDialog.vue";
import { useAuthStore } from "@/store/auth";
import { useAlbumsStore } from "@/store/albums";
import { useTracksStore } from "@/store/tracks";
import { usePlayerStore } from "@/store/player";
import { useErrorsStore } from "@/store/errors";
import { useI18n } from "vue-i18n";
import type { Loaded } from "@/store/base.ts";

const I18n = useI18n();
const route = useRoute();

const authStore = useAuthStore();
const albumsStore = useAlbumsStore();
const errorsStore = useErrorsStore();
const playerStore = usePlayerStore();
const tracksStore = useTracksStore();

interface Props {
  album: Loaded<Album>;
}
const props = defineProps<Props>();

const { isModerator } = storeToRefs(authStore);
const { startLoading } = storeToRefs(albumsStore);
const tracks = computed(() => tracksStore.tracksFilterByAlbum(props.album.id));
const playableTracks = computed(() =>
  tracks.value.filter((t) => t.length !== null).map((t) => t.id),
);
const waitingForReload = computed(
  () => startLoading.value > props.album.loaded,
);

async function deleteAlbum(): Promise<void> {
  if (confirm(I18n.t("common.are-you-sure"))) {
    await albumsStore.destroy(props.album.id);
  }
}

function startTracks(): void {
  if (playableTracks.value.length > 0) {
    playerStore.playTracks(playableTracks.value);
    if (playableTracks.value.length !== tracks.value.length) {
      errorsStore.addError({ playlist: ["player.not-all-tracks-added"] });
    }
  } else {
    errorsStore.addError({ playlist: ["player.no-tracks-added"] });
  }
}

function addTracks(): void {
  if (playableTracks.value.length > 0) {
    playerStore.addTracks(playableTracks.value);
    if (playableTracks.value.length !== tracks.value.length) {
      errorsStore.addError({ playlist: ["player.not-all-tracks-added"] });
    }
  } else {
    errorsStore.addError({ playlist: ["player.no-tracks-added"] });
  }
}

async function flag(id: number, reviewComment: string): Promise<boolean> {
  return await albumsStore.update(id, {
    review_comment: reviewComment,
  });
}
</script>
