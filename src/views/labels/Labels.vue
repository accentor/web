<template>
  <VContainer fluid>
    <VDataIterator
      v-if="labels.length > 0"
      v-model:page="pagination.page"
      :footer-props="{
        disableItemsPerPage: true,
        itemsPerPageOptions: [numberOfItems],
        showFirstLastPage: true,
      }"
      :items="filteredItems"
      :items-per-page="numberOfItems"
    >
      <template #header>
        <VRow class="mb-2" justify="end">
          <VCol lg="4" md="6" sm="8" xl="2" cols="12">
            <VTextField
              v-if="labels.length > numberOfItems"
              v-model="search"
              :label="$t('common.search')"
              hide-details
              prepend-inner-icon="mdi-magnify"
              single-line
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
            <LabelCard :label="item.raw" />
          </VCol>
        </VRow>
      </template>
    </VDataIterator>
  </VContainer>
</template>

<script>
import { mapState } from "pinia";
import LabelCard from "../../components/LabelCard.vue";
import Paginated from "../../mixins/Paginated";
import Searchable from "../../mixins/Searchable";
import { useLabelsStore } from "../../store/labels";

export default {
  name: "Labels",
  components: { LabelCard },
  mixins: [Paginated, Searchable],
  head() {
    return { title: this.$tc("music.labels", 2) };
  },
  computed: {
    ...mapState(useLabelsStore, { labels: "labelsByName" }),
    filteredItems() {
      return this.labels.filter(
        (item) =>
          !this.search ||
          item.name
            .toLocaleLowerCase()
            .indexOf(this.search.toLocaleLowerCase()) >= 0 ||
          item.normalized_name.indexOf(this.search.toLocaleLowerCase()) >= 0,
      );
    },
    numberOfItems() {
      if (this.$vuetify.display.xl) {
        return 30;
      } else if (this.$vuetify.display.lg) {
        return 20;
      } else if (this.$vuetify.display.md) {
        return 15;
      } else {
        return 12;
      }
    },
  },
};
</script>
