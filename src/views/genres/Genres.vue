<template>
  <VContainer fluid grid-list-xl>
    <VDataIterator
      :footer-props="{ disableItemsPerPage: true, itemsPerPageOptions: [12] }"
      :items="filteredItems"
      :items-per-page="12"
      :page.sync="pagination.page"
      v-if="genres.length > 0"
    >
      <template v-slot:header>
        <VLayout justify-end align-baseline wrap mb-2>
          <VFlex xs12 sm8 md6 lg4 xl2>
            <VTextField
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              :label="$t('common.search')"
              single-line
              hide-details
            />
          </VFlex>
        </VLayout>
      </template>
      <template v-slot:default="props">
        <VLayout wrap>
          <VFlex
            v-for="item in props.items"
            :key="item.name"
            lg3
            md4
            sm6
            xl2
            xs12
          >
            <GenreCard :genre="item" />
          </VFlex>
        </VLayout>
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
      genres: "genresByName"
    }),
    filteredItems() {
      return this.genres.filter(
        item =>
          !this.search ||
          item.name
            .toLocaleLowerCase()
            .indexOf(this.search.toLocaleLowerCase()) >= 0
      );
    }
  }
};
</script>
