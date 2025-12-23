<template>
  <VContainer fluid>
    <VDataIterator
      v-model:page="pagination.page"
      :footer-props="{
        disableItemsPerPage: true,
        itemsPerPageOptions: [numberOfItems],
        showFirstLastPage: true,
      }"
      :items="filteredItems"
      :items-per-page="numberOfItems"
    >
      <template #header>
        <VRow class="mb-2" justify="end">
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
            <VIcon start> mdi-plus </VIcon>
            {{ $t("music.playlist.new") }}
          </VBtn>
        </VRow>
      </template>
      <template #default="props">
        <VRow>
          <VCol
            v-for="item in props.items"
            :key="item.id"
            lg="3"
            md="4"
            sm="6"
            xl="2"
            cols="6"
          >
            <VCard :to="{ name: 'playlist', params: { id: item.id } }">
              <VCardTitle>
                {{ item.name }}
              </VCardTitle>
              <VCardText>
                <span class="d-block">
                  {{ users[item.user_id].name }} &bull;
                  {{ $t(`music.playlist.access_options.${item.access}`) }}
                </span>
                <span>
                  {{
                    $tc(
                      `music.playlist.item_counts.${item.playlist_type}`,
                      item.item_ids.length,
                    )
                  }}
                </span>
              </VCardText>
              <VCardActions>
                <PlaylistActions :playlist="item" />
              </VCardActions>
            </VCard>
          </VCol>
        </VRow>
      </template>
    </VDataIterator>
  </VContainer>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import Paginated from "../../mixins/Paginated";
import Searchable from "../../mixins/Searchable";
import PlaylistActions from "../../components/PlaylistActions.vue";

export default {
  name: "Playlists",
  metaInfo() {
    return { title: this.$tc("music.playlists", 2) };
  },
  components: { PlaylistActions },
  mixins: [Paginated, Searchable],
  computed: {
    ...mapState("users", ["users"]),
    ...mapGetters("playlists", {
      playlists: "playlistsByName",
    }),
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
      if (this.$vuetify.display.xl) {
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
    ...mapActions("playlists", ["index"]),
    async fetchContent() {
      await this.index();
    },
  },
};
</script>
