<template>
  <VContainer fluid>
    <VDataIterator
      v-model:page="pagination.page"
      :items="filteredItems"
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
                  {{ users[item.raw.user_id].name }} &bull;
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
            v-model="pagination.page"
            density="compact"
            :length="pageCount"
            total-visible="5"
          />
        </VRow>
      </template>
    </VDataIterator>
  </VContainer>
</template>

<script>
// @ts-nocheck
import { mapActions, mapState } from "pinia";
import Paginated from "../../mixins/Paginated";
import Searchable from "../../mixins/Searchable";
import PlaylistActions from "../../components/PlaylistActions.vue";
import { usePlaylistsStore } from "../../store/playlists";
import { useUsersStore } from "../../store/users";

export default {
  name: "Playlists",
  components: { PlaylistActions },
  mixins: [Paginated, Searchable],
  head() {
    return { title: this.$tc("music.playlists", 2) };
  },
  computed: {
    ...mapState(usePlaylistsStore, { playlists: "playlistsByName" }),
    ...mapState(useUsersStore, ["users"]),
    filteredItems() {
      return this.playlists.filter(
        (item) =>
          !this.search ||
          item.name
            .toLocaleLowerCase()
            .indexOf(this.search.toLocaleLowerCase()) >= 0 ||
          item.normalized_name.indexOf(this.search.toLocaleLowerCase()) >= 0,
      );
    },
    numberOfItems() {
      if (this.$vuetify.display.xlAndUp) {
        return 30;
      } else if (this.$vuetify.display.lg) {
        return 20;
      } else if (this.$vuetify.display.md) {
        return 15;
      } else {
        return 12;
      }
    },
  },
  created() {
    this.fetchContent();
  },
  methods: {
    ...mapActions(usePlaylistsStore, ["index"]),
    async fetchContent() {
      await this.index();
    },
  },
};
</script>
