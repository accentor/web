<template>
  <VDataIterator
    v-model:page="page"
    :items="artists"
    :items-per-page="itemsPerPage"
  >
    <template v-if="slots.header" #header>
      <slot name="header" />
    </template>
    <template #default="itemProps">
      <VRow :class="{ 'my-0': !!slots.header }">
        <VCol
          v-for="item in itemProps.items"
          :key="item.raw.id"
          lg="3"
          md="4"
          sm="6"
          xl="2"
          cols="6"
        >
          <ArtistCard :artist="item.raw" />
        </VCol>
      </VRow>
    </template>
    <template #footer="{ pageCount }">
      <VRow class="mt-2" justify="center">
        <VPagination
          v-if="artists.length > 0"
          v-model="page"
          density="compact"
          :length="pageCount"
          total-visible="5"
        />
      </VRow>
    </template>
  </VDataIterator>
</template>

<script setup lang="ts">
import type { Artist } from "@accentor/api-client-js";
import ArtistCard from "@/components/ArtistCard.vue";
import { usePagination } from "@/composables/pagination";
import { useSlots } from "vue";
import type { Loaded } from "@/store/base.ts";

interface Props {
  artists: Loaded<Artist>[];
  savePagination?: boolean;
  itemsPerPage?: number;
}

const props = withDefaults(defineProps<Props>(), {
  savePagination: true,
  itemsPerPage: 12,
});

const slots = useSlots();

const { page } = usePagination(props.savePagination);
</script>
