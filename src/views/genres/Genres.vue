<template>
  <VContainer fluid>
    <vue-headful :title="$tc('music.genres', 2) + ' | Accentor'" />
    <VDataIterator
      :footer-props="{
        disableItemsPerPage: true,
        itemsPerPageOptions: [12],
        showFirstLastPage: true,
      }"
      :items="filteredItems"
      :items-per-page="12"
      :page.sync="pagination.page"
      v-if="genres.length > 0"
    >
      <template v-slot:header>
        <VRow class="mb-2" justify="end" align="baseline">
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
      <template v-slot:default="props">
        <VRow>
          <VCol
            v-for="item in props.items"
            :key="item.name"
            lg="3"
            md="4"
            sm="6"
            xl="2"
            cols="12"
          >
            <GenreCard :genre="item" />
          </VCol>
        </VRow>
      </template>
    </VDataIterator>
  </VContainer>
</template>

<script>
import { mapGetters } from "vuex";
import Paginated from "../../mixins/Paginated";
import GenreCard from "../../components/GenreCard";
import Searchable from "../../mixins/Searchable";

export default {
  name: "genres",
  components: { GenreCard },
  mixins: [Paginated, Searchable],
  computed: {
    ...mapGetters("genres", {
      genres: "genresByName",
    }),
    filteredItems() {
      return this.genres.filter(
        (item) =>
          !this.search ||
          item.name
            .toLocaleLowerCase()
            .indexOf(this.search.toLocaleLowerCase()) >= 0
      );
    },
  },
};
</script>
