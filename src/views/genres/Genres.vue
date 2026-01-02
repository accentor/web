<template>
  <VContainer fluid>
    <VDataIterator
      v-if="genres.length > 0"
      v-model:page="pagination.page"
      :items="filteredItems"
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
              v-model="pagination.page"
              :length="pageCount"
              total-visible="5"
          />
        </VRow>
      </template>
    </VDataIterator>
  </VContainer>
</template>

<script>
import Paginated from "../../mixins/Paginated";
import GenreCard from "../../components/GenreCard.vue";
import Searchable from "../../mixins/Searchable";
import { mapState } from "pinia";
import { useGenresStore } from "../../store/genres";

export default {
  name: "Genres",
  components: { GenreCard },
  mixins: [Paginated, Searchable],
  head() {
    return { title: this.$tc("music.genres", 2) };
  },
  computed: {
    ...mapState(useGenresStore, { genres: "genresByName" }),
    filteredItems() {
      return this.genres.filter(
        (item) =>
          !this.search ||
          item.name
            .toLocaleLowerCase()
            .indexOf(this.search.toLocaleLowerCase()) >= 0 ||
          item.normalized_name.indexOf(this.search.toLocaleLowerCase()) >= 0,
      );
    },
  },
};
</script>
