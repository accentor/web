<template>
  <VContainer fluid>
    <AlbumsRow :albums="filteredAlbums" :items-per-page="12">
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
          <VBtn
            v-if="isModerator"
            :to="{ name: 'new-album' }"
            color="success"
            class="ma-2"
          >
            <VIcon start>mdi-plus</VIcon>
            {{ $t("music.album.new") }}
          </VBtn>
        </VRow>
      </template>
    </AlbumsRow>
  </VContainer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useHead } from "@unhead/vue";
import { useAuthStore } from "@/store/auth";
import { useAlbumsStore } from "@/store/albums";
import i18n from "@/i18n";
import { useSearch } from "@/composables/search";
import AlbumsRow from "@/components/AlbumsRow.vue";

const { albumsByTitle: albums } = storeToRefs(useAlbumsStore());
const { isModerator } = storeToRefs(useAuthStore());

useHead({ title: i18n.global.tc("music.albums", 2) });

const { search } = useSearch();
const filteredAlbums = computed(() => {
  const lookup = search.value;
  return albums.value.filter(
    (item) =>
      !lookup ||
      item.title.toLowerCase().indexOf(lookup) >= 0 ||
      item.normalized_title.indexOf(lookup) >= 0,
  );
});
</script>
