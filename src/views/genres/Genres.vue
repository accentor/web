<template>
  <VContainer fluid grid-list-xl>
    <VDataIterator
      :items="genres"
      :search="search"
      :custom-filter="filter"
      :rows-per-page-items="[numberOfItems]"
      :pagination.sync="pagination"
      v-if="genres.length > 0"
      content-class="layout row wrap"
    >
      <template v-slot:header>
        <VLayout justify-end align-baseline row wrap mb-2>
          <VFlex xs12 sm8 md6 lg4 xl2>
            <VTextField
              v-if="genres.length > numberOfItems"
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              :label="$t('common.search')"
              single-line
              hide-details
            />
          </VFlex>
        </VLayout>
      </template>
      <template v-slot:item="props">
        <VFlex lg3 md4 sm6 xl2 xs12>
          <GenreCard :genre="props.item" />
        </VFlex>
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
  data() {
    return {
      filter: (items, search, filter) => {
        search = search.toString().toLowerCase();
        if (search.trim() === "") return items;

        return items.filter(val => filter(val.name, search));
      }
    };
  },
  computed: {
    ...mapGetters("genres", {
      genres: "genresByName"
    }),
    numberOfItems() {
      switch (this.$vuetify.breakpoint.name) {
        case "xl":
          return "30";
        case "lg":
          return "20";
        case "md":
          return "15";
        default:
          return "12";
      }
    }
  }
};
</script>
