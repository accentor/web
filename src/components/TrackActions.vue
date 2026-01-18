<template>
  <span class="text-no-wrap actions">
    <VTooltip location="bottom" :disabled="track.length !== null">
      <template #activator="{ props: tooltipProps }">
        <span v-bind="tooltipProps">
          <VBtn
            :disabled="track.length === null"
            color="primary"
            variant="text"
            icon
            size="small"
            @click="startTrack"
          >
            <VIcon size="x-large">mdi-play</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ I18n.t("music.track.empty") }}</span>
    </VTooltip>
    <VTooltip location="bottom" :disabled="track.length !== null">
      <template #activator="{ props: tooltipProps }">
        <span v-bind="tooltipProps">
          <VBtn
            :disabled="track.length === null"
            color="success"
            variant="text"
            icon
            size="small"
            @click="addTrack"
          >
            <VIcon size="x-large">mdi-plus</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ I18n.t("music.track.empty") }}</span>
    </VTooltip>
    <AddToPlaylist :item="track" type="track" />
    <EditReviewComment :item="track" :update="flag" />
    <VMenu>
      <template #activator="{ props: menuProps }">
        <VBtn class="mr-0" size="small" icon variant="text" v-bind="menuProps">
          <VIcon size="x-large">mdi-dots-vertical</VIcon>
        </VBtn>
      </template>
      <VList density="compact">
        <VMenu v-if="track.length && isModerator" open-on-hover location="left">
          <template #activator="{ props: innerMenuProps }">
            <VListItem v-bind="innerMenuProps">
              <template #prepend>
                <VIcon color="info">mdi-file-music</VIcon>
              </template>

              <VListItemTitle>
                {{ I18n.t("music.track.file") }}
              </VListItemTitle>
            </VListItem>
          </template>
          <VList density="compact">
            <VListItem v-if="Object.keys(locations).length > 1">
              <VListItemTitle>
                {{ I18n.t("library.location") }}:
              </VListItemTitle>
              <VListItemSubtitle>
                {{ locations[`${track.location_id}`]?.path }}
              </VListItemSubtitle>
            </VListItem>
            <VListItem>
              <VListItemTitle>
                {{ I18n.t("library.filename") }}:
              </VListItemTitle>
              <VListItemSubtitle>
                {{ track.filename }}
              </VListItemSubtitle>
            </VListItem>
            <VListItem>
              <VListItemTitle>
                {{ I18n.t("music.track.bitrate") }}:
              </VListItemTitle>
              <VListItemSubtitle>
                {{ track.bitrate }}
              </VListItemSubtitle>
            </VListItem>
            <VListItem v-if="track.hasOwnProperty('sample_rate')">
              <VListItemTitle>
                {{ I18n.t("music.track.sample_rate") }}:
              </VListItemTitle>
              <VListItemSubtitle>
                {{ track.sample_rate }}
              </VListItemSubtitle>
            </VListItem>
            <VListItem v-if="track.hasOwnProperty('bit_depth')">
              <VListItemTitle>
                {{ I18n.t("music.track.bit_depth") }}:
              </VListItemTitle>
              <VListItemSubtitle>
                {{ track.bit_depth }}
              </VListItemSubtitle>
            </VListItem>
            <VListItem>
              <VListItemTitle>
                {{ I18n.t("common.added-on") }}:
              </VListItemTitle>
              <VListItemSubtitle>
                {{ I18n.d(new Date(track.created_at), "long") }}
              </VListItemSubtitle>
            </VListItem>
          </VList>
        </VMenu>
        <VListItem
          v-if="track.length"
          :href="downloadURL"
          download
          target="_blank"
        >
          <template #prepend>
            <VIcon color="info">mdi-download</VIcon>
          </template>

          <VListItemTitle>{{ I18n.t("music.track.download") }}</VListItemTitle>
        </VListItem>
        <VTooltip
          v-if="isModerator"
          location="bottom"
          :disabled="!waitingForReload"
        >
          <template #activator="{ props: tooltipProps }">
            <VListItem
              :to="{
                name: 'edit-track',
                params: { id: track.id },
                query: { redirect: route.fullPath },
              }"
              :disabled="waitingForReload"
              v-bind="tooltipProps"
            >
              <template #prepend>
                <VIcon color="warning">mdi-pencil</VIcon>
              </template>

              <VListItemTitle>{{ I18n.t("music.track.edit") }}</VListItemTitle>
            </VListItem>
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
              :to="{
                name: 'merge-track',
                params: { id: `${track.id}` },
                query: { redirect: route.fullPath },
              }"
              :disabled="waitingForReload"
              v-bind="tooltipProps"
            >
              <template #prepend>
                <VIcon color="warning">mdi-merge</VIcon>
              </template>

              <VListItemTitle>
                {{ I18n.t("music.track.merge.merge") }}
              </VListItemTitle>
            </VListItem>
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
              @click.stop.prevent="deleteTrack"
            >
              <template #prepend>
                <VIcon color="error">mdi-delete</VIcon>
              </template>

              <VListItemTitle>{{
                I18n.t("music.track.delete")
              }}</VListItemTitle>
            </VListItem>
          </template>
          <span>{{ I18n.t("common.disabled-while-loading") }}</span>
        </VTooltip>
      </VList>
    </VMenu>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import type { Track } from "@accentor/api-client-js";
import { baseURL } from "@/api";
import EditReviewComment from "./EditReviewComment.vue";
import AddToPlaylist from "./AddToPlaylist.vue";
import { useAuthStore } from "@/store/auth";
import { useLocationsStore } from "@/store/locations";
import { useTracksStore } from "@/store/tracks";
import { usePlayerStore } from "@/store/player";
import { useErrorsStore } from "@/store/errors";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import type { Loaded } from "@/store/base.ts";

const I18n = useI18n();
const route = useRoute();
const authStore = useAuthStore();
const errorsStore = useErrorsStore();
const locationsStore = useLocationsStore();
const playerStore = usePlayerStore();
const tracksStore = useTracksStore();

const { isModerator } = storeToRefs(authStore);
const { locations } = storeToRefs(locationsStore);

interface Props {
  track: Loaded<Track>;
}

const props = defineProps<Props>();

const waitingForReload = computed(
  () => tracksStore.startLoading > props.track.loaded,
);
const downloadURL = computed(
  () =>
    `${baseURL}/tracks/${props.track.id}/download?token=${authStore.apiToken}`,
);

async function deleteTrack(): Promise<void> {
  let message = I18n.t("common.are-you-sure");
  if (props.track.length) {
    message += ` ${I18n.t("music.track.delete-file-explanation")}`;
  }
  if (confirm(message)) {
    await tracksStore.destroy(props.track.id);
  }
}

function startTrack(): void {
  if (props.track.length !== null) {
    playerStore.playTrack(props.track.id);
  } else {
    errorsStore.addError({ playlist: ["player.no-tracks-added"] });
  }
}

function addTrack(): void {
  if (props.track.length !== null) {
    playerStore.addTrack(props.track.id);
  } else {
    errorsStore.addError({ playlist: ["player.no-tracks-added"] });
  }
}

async function flag(id: number, reviewComment: string): Promise<boolean> {
  return await tracksStore.update(id, { review_comment: reviewComment });
}
</script>
