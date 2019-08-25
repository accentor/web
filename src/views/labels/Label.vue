<template>
  <VContainer fluid grid-list-xl v-if="label">
    <VDataIterator
      :footer-props="{
        disableItemsPerPage: true,
        itemsPerPageOptions: [12],
        showFirstLastPage: true
      }"
      :items="filteredItems"
      :rows-per-page-items="[12]"
      :page.sync="pagination.page"
      v-if="albums.length > 0"
    >
      <template v-slot:header>
        <VLayout justify-space-between align-baseline wrap mb-2>
          <VFlex xs12 sm4 md6 lg8 xl10>
            <h2 class="display-1">{{ label.name }}</h2>
          </VFlex>
          <VFlex xs12 sm8 md6 lg4 xl2>
            <VTextField
              v-if="albums.length > 12"
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
            :key="item.id"
            lg3
            md4
            sm6
            xl2
            xs12
          >
            <AlbumCard :album="item" />
          </VFlex>
        </VLayout>
      </template>
    </VDataIterator>
  </VContainer>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import AlbumCard from "../../components/AlbumCard";
import Paginated from "../../mixins/Paginated";
import Searchable from "../../mixins/Searchable";

export default {
  name: "Label",
  components: { AlbumCard },
  mixins: [Paginated, Searchable],
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapState("labels", ["labels"]),
    albums: function() {
      return this.$store.getters["albums/albumsFilterByLabel"](
        this.$route.params.id
      );
    },
    label: function() {
      return this.labels[this.$route.params.id];
    },
    filteredItems() {
      return this.albums.filter(
        item =>
          !this.search ||
          item.title
            .toLocaleLowerCase()
            .indexOf(this.search.toLocaleLowerCase()) >= 0
      );
    }
  }
};
</script>
