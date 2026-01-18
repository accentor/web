<template>
  <VBtn
    v-if="extended"
    :to="{
      name: 'stats',
      query: { artist_id: artist.id },
    }"
    color="primary"
    variant="text"
    icon
    size="small"
  >
    <VIcon size="x-large">mdi-chart-bar</VIcon>
  </VBtn>
  <AddToPlaylist :item="artist" type="artist" />
  <EditReviewComment :item="artist" :update="flag" />
  <VTooltip v-if="isModerator" location="bottom" :disabled="!waitingForReload">
    <template #activator="{ props: tooltipProps }">
      <span v-bind="tooltipProps">
        <VBtn
          :to="{
            name: 'edit-artist',
            params: { id: artist.id },
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
  <VTooltip v-if="isModerator" location="bottom" :disabled="!waitingForReload">
    <template #activator="{ props: tooltipProps }">
      <span v-bind="tooltipProps">
        <ArtistMergeDialog :artist="artist" :disabled="waitingForReload" />
      </span>
    </template>
    <span>{{ I18n.t("common.disabled-while-loading") }}</span>
  </VTooltip>
  <VTooltip v-if="isModerator" location="bottom" :disabled="!waitingForReload">
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
          @click.stop.prevent="deleteArtist"
        >
          <VIcon size="x-large">mdi-delete</VIcon>
        </VBtn>
      </span>
    </template>
    <span>{{ I18n.t("common.disabled-while-loading") }}</span>
  </VTooltip>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";
import type { Artist } from "@accentor/api-client-js";
import EditReviewComment from "./EditReviewComment.vue";
import ArtistMergeDialog from "./ArtistMergeDialog.vue";
import AddToPlaylist from "./AddToPlaylist.vue";
import { useAuthStore } from "@/store/auth";
import { useArtistsStore } from "@/store/artists";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const I18n = useI18n();
const route = useRoute();
const authStore = useAuthStore();
const artistsStore = useArtistsStore();

interface Props {
  artist: Artist & { loaded: Date };
  extended?: boolean;
}

const props = defineProps<Props>();

const { isModerator } = storeToRefs(authStore);
const waitingForReload = computed(
  () => artistsStore.startLoading > props.artist.loaded,
);

async function deleteArtist(): Promise<void> {
  if (confirm(I18n.t("common.are-you-sure"))) {
    await artistsStore.destroy(props.artist.id);
  }
}

async function flag(id: number, reviewComment: string): Promise<boolean> {
  return await artistsStore.update(id, { review_comment: reviewComment });
}
</script>
