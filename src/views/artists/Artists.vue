<template>
  <VContainer fluid>
    <VDataIterator
      :footer-props="{
        disableItemsPerPage: true,
        itemsPerPageOptions: [12],
        showFirstLastPage: true,
      }"
      :items="filteredItems"
      :items-per-page="12"
      :page.sync="pagination.page"
      v-if="artists.length > 0"
    >
      <template v-slot:header>
        <VRow class="mb-2" align="baseline" justify="end">
          <VCol lg="4" md="6" sm="8" xl="2" cols="12">
            <VTextField
              :label="$t('common.search')"
              v-model="search"
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
            <VIcon left>mdi-plus</VIcon>
            {{ $t("music.artist.new") }}
          </VBtn>
        </VRow>
      </template>
      <template v-slot:default="props">
        <VRow>
          <VCol
            v-for="item in props.items"
            :key="item.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            xl="2"
          >
            <ArtistCard :artist="item" />
          </VCol>
        </VRow>
      </template>
    </VDataIterator>
  </VContainer>
</template>

<script>
import { mapGetters } from "vuex";
import ArtistCard from "../../components/ArtistCard";
import Paginated from "../../mixins/Paginated";
import Searchable from "../../mixins/Searchable";

export default {
  name: "artists",
  components: { ArtistCard },
  metaInfo() {
    return { title: this.$tc("music.artists", 2) };
  },
  mixins: [Paginated, Searchable],
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapGetters("artists", {
      artists: "artistsByName",
    }),
    filteredItems() {
      return this.artists.filter(
        (item) =>
          !this.search ||
          item.name
            .toLocaleLowerCase()
            .indexOf(this.search.toLocaleLowerCase()) >= 0 ||
          item.normalized_name.indexOf(this.search.toLocaleLowerCase()) >= 0
      );
    },
  },
};
</script>
