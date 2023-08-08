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
          <VBtn
            :to="{ name: 'new-album' }"
            color="success"
            class="ma-2"
            v-if="isModerator"
          >
            <VIcon left>mdi-plus</VIcon>
            {{ $t("music.album.new") }}
          </VBtn>
        </VRow>
      </template>
      <template v-slot:default="props">
        <VRow>
          <VCol
            v-for="item in props.items"
            :key="item.id"
            lg="3"
            md="4"
            sm="6"
            xl="2"
            cols="6"
          >
            <AlbumCard :album="item" />
          </VCol>
        </VRow>
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
  metaInfo() {
    return { title: this.$tc("music.albums", 2) };
  },
  mixins: [Paginated, Searchable],
  methods: {
    ...mapActions("albums", ["destroy"]),
    deleteAlbum: function (id) {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(id);
      }
    },
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapGetters("albums", {
      albums: "albumsByTitle",
    }),
    filteredItems() {
      return this.albums.filter(
        (item) =>
          !this.search ||
          item.title
            .toLocaleLowerCase()
            .indexOf(this.search.toLocaleLowerCase()) >= 0 ||
          item.normalized_title.indexOf(this.search.toLocaleLowerCase()) >= 0,
      );
    },
  },
};
</script>
