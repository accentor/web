<template>
  <VContainer fluid grid-list-xl>
    <VDataIterator
      :footer-props="{ disableItemsPerPage: true, itemsPerPageOptions: [12] }"
      :items="filteredItems"
      :items-per-page="12"
      :page.sync="pagination.page"
      v-if="artists.length > 0"
    >
      <template v-slot:header>
        <VLayout align-baseline justify-end mb-2 wrap>
          <VFlex lg4 md6 sm8 xl2 xs12>
            <VTextField
              :label="$t('common.search')"
              v-model="search"
              hide-details
              prepend-inner-icon="mdi-magnify"
              single-line
            />
          </VFlex>
          <VBtn
            v-if="isModerator"
            :to="{ name: 'new-artist' }"
            class="ma-2"
            color="success"
          >
            <VIcon left>mdi-plus</VIcon>
            {{ $t("music.artist.new") }}
          </VBtn>
        </VLayout>
      </template>
      <template v-slot:default="props">
        <VLayout wrap>
          <VFlex
            v-for="item in props.items"
            :key="item.name"
            xs12
            sm6
            md4
            lg3
            xl2
          >
            <ArtistCard :artist="item" />
          </VFlex>
        </VLayout>
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
  mixins: [Paginated, Searchable],
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapGetters("artists", {
      artists: "artistsByName"
    }),
    filteredItems() {
      return this.artists.filter(
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
