<template>
  <VContainer v-if="playlist" class="fill-height" fluid>
    <PlaylistForm :playlist="playlist" />
  </VContainer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useHead } from "@unhead/vue";
import PlaylistForm from "@/components/PlaylistForm.vue";
import { usePlaylistsStore } from "@/store/playlists";
import i18n from "@/i18n";

const playlistsStore = usePlaylistsStore();

const props = defineProps<{ id: string }>();
const playlist = computed(() => playlistsStore.playlists[props.id]);
const title = computed(() =>
  i18n.global.t("page-titles.edit", { obj: playlist.value?.name ?? "" }),
);

useHead({ title });
</script>
