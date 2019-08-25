<template>
  <VContainer fluid grid-list-xl>
    <VDataIterator
      :footer-props="{
        disableItemsPerPage: true,
        itemsPerPageOptions: [12],
        showFirstLastPage: true
      }"
      :items="filteredItems"
      :items-per-page="12"
      :page.sync="pagination.page"
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
          <VBtn
            :to="{ name: 'new-album' }"
            color="success"
            class="ma-2"
            v-if="isModerator"
          >
            <VIcon left>mdi-plus</VIcon>
            {{ $t("music.album.new") }}
          </VBtn>
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
import { mapActions, mapGetters } from "vuex";
import AlbumCard from "../../components/AlbumCard";
import Paginated from "../../mixins/Paginated";
import Searchable from "../../mixins/Searchable";

export default {
  name: "albums",
  components: { AlbumCard },
  mixins: [Paginated, Searchable],
  methods: {
    ...mapActions("albums", ["destroy"]),
    deleteAlbum: function(id) {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(id);
      }
    }
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapGetters("albums", {
      albums: "albumsByTitle"
    }),
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
