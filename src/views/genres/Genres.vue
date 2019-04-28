<template>
  <VContainer fluid grid-list-xl>
    <VDataIterator
      :items="genres"
      :rows-per-page-items="[12]"
      :pagination.sync="pagination"
      v-if="genres.length > 0"
      content-class="layout row wrap"
    >
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

export default {
  name: "genres",
  components: { GenreCard },
  mixins: [Paginated],
  computed: {
    ...mapGetters("genres", {
      genres: "genresByName"
    })
  }
};
</script>
