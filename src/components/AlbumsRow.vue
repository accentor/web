<template>
  <VDataIterator
    v-model:page="page"
    :items="albums"
    :items-per-page="itemsPerPage"
  >
    <template v-if="slots.header" #header>
      <slot name="header" />
    </template>
    <template v-if="slots['no-data']" #no-data>
      <slot name="no-data" />
    </template>
    <template #default="itemProps">
      <VRow :class="{ 'my-0': !!slots.header }">
        <VCol
          v-for="item in itemProps.items"
          :key="item.raw!.id"
          lg="3"
          md="4"
          sm="6"
          xl="2"
          cols="6"
        >
          <slot name="album-card" :album="item.raw">
            <AlbumCard :album="item.raw" />
          </slot>
        </VCol>
      </VRow>
    </template>
    <template #footer="{ pageCount }">
      <VRow class="mt-2" justify="end">
        <VPagination
          v-if="albums.length > 0"
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
import AlbumCard from "@/components/AlbumCard.vue";
import type { Album } from "@accentor/api-client-js";
import { usePagination } from "@/composables/pagination";
import { useSlots } from "vue";
import type { Loaded } from "@/store/base.ts";

interface Props {
  albums: Loaded<Album>[];
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
