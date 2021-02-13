<template>
  <VContainer fluid v-if="label">
    <VDataIterator
      :footer-props="{
        disableItemsPerPage: true,
        itemsPerPageOptions: [12],
        showFirstLastPage: true,
      }"
      :items="filteredItems"
      :page.sync="pagination.page"
      :items-per-page="12"
      v-if="albums.length > 0"
    >
      <template v-slot:header>
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
      <template v-slot:default="props">
        <VRow>
          <VCol
            v-for="item in props.items"
            :key="item.id"
            lg="3"
            md="4"
            sm="6"
            xl="2"
            cols="12"
          >
            <AlbumCard :album="item" :labelForCatNr="label" />
          </VCol>
        </VRow>
      </template>
    </VDataIterator>
  </VContainer>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import AlbumCard from "../../components/AlbumCard";
import LabelActions from "@/components/LabelActions";
import Paginated from "../../mixins/Paginated";
import Searchable from "../../mixins/Searchable";

export default {
  name: "Label",
  components: { AlbumCard, LabelActions },
  mixins: [Paginated, Searchable],
  metaInfo() {
    return { title: this.label.name };
  },
  watch: {
    label: function () {
      if (this.label === undefined) {
        this.$router.go(-1);
      }
    },
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapState("labels", ["labels"]),
    albums: function () {
      return this.$store.getters["albums/albumsFilterByLabel"](
        this.$route.params.id
      );
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
          item.normalized_title.indexOf(this.search.toLocaleLowerCase()) >= 0
      );
    },
  },
};
</script>
