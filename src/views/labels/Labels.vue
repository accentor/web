<template>
  <VContainer fluid>
    <VDataIterator
      v-if="labels.length > 0"
      v-model:page="page"
      :items="filteredLabels"
      :items-per-page="numberOfItems"
    >
      <template #header>
        <VRow class="mb-2" justify="end" align="center">
          <VCol lg="4" md="6" sm="8" xl="2" cols="12">
            <VTextField
              v-if="labels.length > numberOfItems"
              v-model="search"
              :label="$t('common.search')"
              hide-details
              prepend-inner-icon="mdi-magnify"
              single-line
            />
          </VCol>
        </VRow>
      </template>
      <template #default="props">
        <VRow>
          <VCol
            v-for="item in props.items"
            :key="item.raw.id"
            lg="3"
            md="4"
            sm="6"
            xl="2"
            cols="6"
          >
            <LabelCard :label="item.raw" />
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
import { computed } from "vue";
import { useDisplay } from "vuetify/framework";
import { storeToRefs } from "pinia";
import { useHead } from "@unhead/vue";
import LabelCard from "@/components/LabelCard.vue";
import { useLabelsStore } from "@/store/labels";
import { usePagination } from "@/composables/pagination";
import { useSearch } from "@/composables/search";
import i18n from "@/i18n";

const { labelsByName: labels } = storeToRefs(useLabelsStore());
const { page } = usePagination();
const { search } = useSearch();

useHead({ title: i18n.global.tc("music.labels", 2) });

const filteredLabels = computed(() => {
  const lookup = search.value.toLowerCase();
  return labels.value.filter(
    (item) =>
      !lookup ||
      item.name.toLowerCase().indexOf(lookup) >= 0 ||
      item.normalized_name.indexOf(lookup) >= 0,
  );
});

const display = useDisplay();
const numberOfItems = computed(() => {
  if (display.xlAndUp) {
    return 30;
  } else if (display.lg) {
    return 20;
  } else if (display.md) {
    return 15;
  } else {
    return 12;
  }
});
</script>
