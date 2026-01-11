<template>
  <VContainer fluid>
    <VDataIterator
      v-if="genres.length > 0"
      v-model:page="page"
      :items="filteredGenres"
      :items-per-page="12"
    >
      <template #header>
        <VRow class="mb-2" justify="end" align="center">
          <VCol cols="12" sm="8" md="6" lg="4" xl="2">
            <VTextField
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              :label="$t('common.search')"
              single-line
              hide-details
            />
          </VCol>
        </VRow>
      </template>
      <template #default="props">
        <VRow>
          <VCol
            v-for="item in props.items"
            :key="item.raw.name"
            lg="3"
            md="4"
            sm="6"
            xl="2"
            cols="6"
          >
            <GenreCard :genre="item.raw" />
          </VCol>
        </VRow>
      </template>
      <template #footer="{ pageCount }">
        <VRow class="mt-2" justify="center">
          <VPagination
            v-model="page"
            density="compact"
            :length="pageCount"
            total-visible="5"
          />
        </VRow>
      </template>
    </VDataIterator>
  </VContainer>
</template>

<script setup lang="ts">
import GenreCard from "@/components/GenreCard.vue";
import { storeToRefs } from "pinia";
import { useGenresStore } from "@/store/genres";
import { usePagination } from "@/composables/pagination";
import { useSearch } from "@/composables/search";
import { useHead } from "@unhead/vue";
import i18n from "@/i18n";
import { computed } from "vue";

const { page } = usePagination();
const { search } = useSearch();

useHead({ title: i18n.global.tc("music.genres", 2) });

const { genresByName: genres } = storeToRefs(useGenresStore());
const filteredGenres = computed(() => {
  const lookup = search.value.toLowerCase();
  return genres.value.filter(
    (item) =>
      !lookup ||
      item.name.toLowerCase().indexOf(lookup) >= 0 ||
      item.normalized_name.indexOf(lookup) >= 0,
  );
});
</script>
