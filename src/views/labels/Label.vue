<template>
  <VContainer v-if="label" fluid>
    <VDataIterator
      v-if="albums.length > 0"
      v-model:page="pagination.page"
      :items="filteredItems"
      :items-per-page="12"
    >
      <template #header>
        <VRow class="mb-2" justify="space-between" align="baseline">
          <VCol cols="12" sm="4" md="6" lg="8" xl="10">
            <div>
              <h2 class="text-h4">{{ label.name }}</h2>
            </div>
            <div>
              <LabelActions :label="label" />
            </div>
          </VCol>
          <VCol cols="12" sm="8" md="6" lg="4" xl="2">
            <VTextField
              v-if="albums.length > 12"
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              :label="$t('common.search')"
              single-line
              hide-details
            />
          </VCol>
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
            <AlbumCard :album="item.raw" :label-for-cat-nr="label" />
          </VCol>
        </VRow>
      </template>
      <template #footer="{ pageCount }">
        <VRow class="mt-2" justify="center">
          <VPagination
            v-model="pagination.page"
            density="compact"
            :length="pageCount"
            total-visible="5"
          />
        </VRow>
      </template>
    </VDataIterator>
  </VContainer>
</template>

<script>
// @ts-nocheck
import { mapState, mapActions } from "pinia";
import AlbumCard from "../../components/AlbumCard.vue";
import LabelActions from "@/components/LabelActions.vue";
import Paginated from "../../mixins/Paginated";
import Searchable from "../../mixins/Searchable";
import { AlbumsScope } from "@accentor/api-client-js";
import { useAuthStore } from "../../store/auth";
import { useLabelsStore } from "../../store/labels";
import { useAlbumsStore } from "../../store/albums";

export default {
  name: "LabelView",
  components: { AlbumCard, LabelActions },
  mixins: [Paginated, Searchable],
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  head() {
    return { title: this.label.name };
  },
  computed: {
    ...mapState(useAuthStore, ["isModerator"]),
    ...mapState(useLabelsStore, ["labels"]),
    albums: function () {
      return useAlbumsStore().albumsFilterByLabel(this.$route.params.id);
    },
    label: function () {
      return this.labels[this.$route.params.id];
    },
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
  watch: {
    id: {
      handler: "fetchContent",
      immediate: true,
    },
  },
  methods: {
    ...mapActions(useLabelsStore, ["read"]),
    ...mapActions(useAlbumsStore, { indexAlbums: "index" }),
    async fetchContent(newValue, oldValue) {
      // After loading the content, the router will change the id from a string to a number
      // but we don't actually want to load the content twice
      if (`${newValue}` === `${oldValue}`) {
        return;
      }

      const label = this.read(this.id);
      const albums = this.indexAlbums(new AlbumsScope().label(this.id));
      await Promise.all([label, albums]);
      // If the label is undefined after loading, we assume that it doesn't exist.
      if (this.label === undefined) {
        this.$router.go(-1);
      }
    },
  },
};
</script>
