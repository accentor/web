<template>
  <VContainer fluid>
    <VDataIterator
      :footer-props="{
        disableItemsPerPage: true,
        itemsPerPageOptions: [numberOfItems],
        showFirstLastPage: true,
      }"
      :items="filteredItems"
      :items-per-page="numberOfItems"
      :page.sync="pagination.page"
    >
      <template v-slot:header>
        <VRow class="mb-2" justify="end">
          <VCol lg="4" md="6" sm="8" xl="2" cols="12">
            <VTextField
              :label="$t('common.search')"
              hide-details
              prepend-inner-icon="mdi-magnify"
              single-line
              v-if="playlists.length > numberOfItems"
              v-model="search"
            />
          </VCol>
          <VBtn :to="{ name: 'new-playlist' }" color="success" class="ma-2">
            <VIcon left>mdi-plus</VIcon>
            {{ $t("music.playlist.new") }}
          </VBtn>
        </VRow>
      </template>
      <template v-slot:default="props">
        <VRow>
          <VCol
            :key="item.id"
            lg="3"
            md="4"
            sm="6"
            v-for="item in props.items"
            xl="2"
            cols="6"
          >
            <VCard :to="{ name: 'playlist', params: { id: item.id } }">
              <VCardTitle>
                {{ item.name }}
              </VCardTitle>
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
import { mapGetters } from "vuex";
import Paginated from "../../mixins/Paginated";
import Searchable from "../../mixins/Searchable";
import PlaylistActions from "../../components/PlaylistActions";

export default {
  name: "playlists",
  metaInfo() {
    return { title: this.$tc("music.labels", 2) };
  },
  components: { PlaylistActions },
  mixins: [Paginated, Searchable],
  computed: {
    ...mapGetters("playlists", {
      playlists: "playlists",
    }),
    filteredItems() {
      return this.playlists.filter(
        (item) =>
          !this.search ||
          item.name
            .toLocaleLowerCase()
            .indexOf(this.search.toLocaleLowerCase()) >= 0 ||
          item.normalized_name.indexOf(this.search.toLocaleLowerCase()) >= 0
      );
    },
    numberOfItems() {
      if (this.$vuetify.breakpoint.name === "xl") {
        return 30;
      } else if (this.$vuetify.breakpoint.name === "lg") {
        return 20;
      } else if (this.$vuetify.breakpoint.name === "md") {
        return 15;
      } else {
        return 12;
      }
    },
  },
};
</script>
