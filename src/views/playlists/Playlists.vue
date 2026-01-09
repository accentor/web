<template>
  <VContainer fluid>
    <VDataIterator
      v-model:page="page"
      :items="filteredPlaylists"
      :items-per-page="numberOfItems"
    >
      <template #header>
        <VRow class="mb-2" justify="end" align="center">
          <VCol lg="4" md="6" sm="8" xl="2" cols="12">
            <VTextField
              v-if="playlists.length > numberOfItems"
              v-model="search"
              :label="$t('common.search')"
              hide-details
              prepend-inner-icon="mdi-magnify"
              single-line
            />
          </VCol>
          <VBtn :to="{ name: 'new-playlist' }" color="success" class="ma-2">
            <VIcon start>mdi-plus</VIcon>
            {{ $t("music.playlist.new") }}
          </VBtn>
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
            <VCard :to="{ name: 'playlist', params: { id: item.raw.id } }">
              <VCardTitle>
                {{ item.raw.name }}
              </VCardTitle>
              <VCardText>
                <span class="d-block">
                  {{ users[`${item.raw.user_id}`]?.name }} &bull;
                  {{ $t(`music.playlist.access_options.${item.raw.access}`) }}
                </span>
                <span>
                  {{
                    $tc(
                      `music.playlist.item_counts.${item.raw.playlist_type}`,
                      item.raw.item_ids.length,
                    )
                  }}
                </span>
              </VCardText>
              <VCardActions>
                <PlaylistActions :playlist="item.raw" />
              </VCardActions>
            </VCard>
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
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useHead } from "@unhead/vue";
import { useDisplay } from "vuetify/framework";
import PlaylistActions from "@/components/PlaylistActions.vue";
import { usePlaylistsStore } from "@/store/playlists";
import { useUsersStore } from "@/store/users";
import i18n from "@/i18n";
import { useSearch } from "@/composables/search";
import { usePagination } from "@/composables/pagination";

useHead({ title: i18n.global.tc("music.playlists", 2) });

const playlistsStore = usePlaylistsStore();
const { playlistsByName: playlists } = storeToRefs(playlistsStore);
const { users } = storeToRefs(useUsersStore());

const { page } = usePagination();
const { search } = useSearch();
const filteredPlaylists = computed(() => {
  const lookup = search.value.toLowerCase();
  return playlists.value.filter(
    (item) => !lookup || item.name.toLowerCase().indexOf(lookup) >= 0,
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

onMounted(() => playlistsStore.index());
</script>
