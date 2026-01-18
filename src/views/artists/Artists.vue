<template>
  <VContainer fluid>
    <ArtistsRow
      v-if="artists.length > 0"
      :artists="filteredArtists"
      :items-per-page="12"
    >
      <template #header>
        <VRow class="mb-2" align="center" justify="end">
          <VCol lg="4" md="6" sm="8" xl="2" cols="12">
            <VTextField
              v-model="search"
              :label="I18n.t('common.search')"
              hide-details
              prepend-inner-icon="mdi-magnify"
              single-line
            />
          </VCol>
          <VBtn
            v-if="isModerator"
            :to="{ name: 'new-artist' }"
            class="ma-2"
            color="success"
          >
            <VIcon start>mdi-plus</VIcon>
            {{ I18n.t("music.artist.new") }}
          </VBtn>
        </VRow>
      </template>
    </ArtistsRow>
  </VContainer>
</template>

<script setup lang="ts">
import { useHead } from "@unhead/vue";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/store/auth";
import { useArtistsStore } from "@/store/artists";
import ArtistsRow from "@/components/ArtistsRow.vue";
import { useSearch } from "@/composables/search";
import { useI18n } from "vue-i18n";

const I18n = useI18n();
useHead({ title: I18n.t("music.artists", 2) });

const { isModerator } = storeToRefs(useAuthStore());

const { search } = useSearch();
const { artistsByName: artists } = storeToRefs(useArtistsStore());
const filteredArtists = computed(() => {
  return artists.value.filter((item) => {
    const lookup = search.value.toLowerCase();
    return (
      !lookup ||
      item.name.toLowerCase().indexOf(lookup) >= 0 ||
      item.normalized_name.indexOf(lookup) >= 0
    );
  });
});
</script>
