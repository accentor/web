<template>
  <VContainer fluid grid-list-xl>
    <VDataIterator
      :items="artists"
      :search="search"
      :custom-filter="filter"
      :rows-per-page-items="[12]"
      :pagination.sync="pagination"
      v-if="artists.length > 0"
      content-class="layout row wrap"
    >
      <template v-slot:header>
        <VLayout justify-end align-baseline row wrap mb-2>
          <VFlex xs12 sm8 md6 lg4 xl2>
            <VTextField
              v-if="artists.length > 12"
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
          </VFlex>
          <VBtn :to="{ name: 'new-artist' }" color="success" v-if="isModerator">
            <VIcon left>mdi-plus</VIcon>
            New artist
          </VBtn>
        </VLayout>
      </template>
      <template v-slot:item="props">
        <VFlex lg3 md4 sm6 xl2 xs12>
          <ArtistCard :artist="props.item" />
        </VFlex>
      </template>
    </VDataIterator>
  </VContainer>
</template>

<script>
import { mapGetters } from "vuex";
import Paginated from "../../mixins/Paginated";
import ArtistCard from "../../components/ArtistCard";
import Searchable from "../../mixins/Searchable";

export default {
  name: "artists",
  components: { ArtistCard },
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
    ...mapGetters("auth", ["isModerator"]),
    ...mapGetters("artists", {
      artists: "artistsByName"
    })
  }
};
</script>
