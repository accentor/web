<template>
  <VContainer v-if="album" class="fill-height" fluid>
    <AlbumForm :album="album" />
  </VContainer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useHead } from "@unhead/vue";
import AlbumForm from "@/components/AlbumForm.vue";
import { useAlbumsStore } from "@/store/albums";
import i18n from "@/i18n";

const albumsStore = useAlbumsStore();

const props = defineProps<{ id: string }>();

const album = computed(() => albumsStore.albums[props.id]);
const title = computed(() =>
  i18n.global.t("page-titles.edit", { obj: album.value?.title ?? "" }),
);
useHead({ title });
</script>
