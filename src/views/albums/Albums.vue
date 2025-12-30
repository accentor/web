<template>
  <VContainer fluid>
    <VDataIterator
      v-model:page="pagination.page"
      :footer-props="{
        disableItemsPerPage: true,
        itemsPerPageOptions: [12],
        showFirstLastPage: true,
      }"
      :items="filteredItems"
      :items-per-page="12"
    >
      <template #header>
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
            v-if="isModerator"
            :to="{ name: 'new-album' }"
            color="success"
            class="ma-2"
          >
            <VIcon start>mdi-plus</VIcon>
            {{ $t("music.album.new") }}
          </VBtn>
        </VRow>
      </template>
      <template #default="props">
        <VRow>
          <VCol
            v-for="item in props.items"
            :key="item.raw.id"
            lg="3"
            md="4"
            sm="6"
            xl="2"
            cols="6"
          >
            <AlbumCard :album="item.raw" />
          </VCol>
        </VRow>
      </template>
    </VDataIterator>
  </VContainer>
</template>

<script>
import { mapState, mapActions } from "pinia";
import AlbumCard from "../../components/AlbumCard.vue";
import Paginated from "../../mixins/Paginated";
import Searchable from "../../mixins/Searchable";
import { useAuthStore } from "@/store/auth";
import { useAlbumsStore } from "../../store/albums";

export default {
  name: "Albums",
  components: { AlbumCard },
  mixins: [Paginated, Searchable],
  head() {
    return { title: this.$tc("music.albums", 2) };
  },
  computed: {
    ...mapState(useAuthStore, ["isModerator"]),
    ...mapState(useAlbumsStore, { albums: "albumsByTitle" }),
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
  methods: {
    ...mapActions(useAlbumsStore, ["destroy"]),
    deleteAlbum: function (id) {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(id);
      }
    },
  },
};
</script>
