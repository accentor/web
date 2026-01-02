<template>
  <VContainer fluid>
    <VDataIterator
      v-if="artists.length > 0"
      v-model:page="pagination.page"
      :items="filteredItems"
      :items-per-page="12"
    >
      <template #header>
        <VRow class="mb-2" align="center" justify="end">
          <VCol lg="4" md="6" sm="8" xl="2" cols="12">
            <VTextField
              v-model="search"
              :label="$t('common.search')"
              hide-details
              prepend-inner-icon="mdi-magnify"
              single-line
            />
          </VCol>
          <VBtn
            v-if="isModerator"
            :to="{ name: 'new-artist' }"
            class="ma-2"
            color="success"
          >
            <VIcon start>mdi-plus</VIcon>
            {{ $t("music.artist.new") }}
          </VBtn>
        </VRow>
      </template>
      <template #default="props">
        <VRow>
          <VCol
            v-for="item in props.items"
            :key="item.raw.id"
            cols="6"
            sm="6"
            md="4"
            lg="3"
            xl="2"
          >
            <ArtistCard :artist="item.raw" />
          </VCol>
        </VRow>
      </template>
      <template #footer="{ pageCount }">
        <VRow class="mt-2" justify="center">
          <VPagination v-model="pagination.page" :length="pageCount" total-visible="5" />
        </VRow>
      </template>
    </VDataIterator>
  </VContainer>
</template>

<script>
import ArtistCard from "../../components/ArtistCard.vue";
import Paginated from "../../mixins/Paginated";
import Searchable from "../../mixins/Searchable";
import { useAuthStore } from "../../store/auth";
import { mapState } from "pinia";
import { useArtistsStore } from "../../store/artists";

export default {
  name: "Artists",
  components: { ArtistCard },
  mixins: [Paginated, Searchable],
  head() {
    return { title: this.$tc("music.artists", 2) };
  },
  computed: {
    ...mapState(useAuthStore, ["isModerator"]),
    ...mapState(useArtistsStore, { artists: "artistsByName" }),
    filteredItems() {
      return this.artists.filter(
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
