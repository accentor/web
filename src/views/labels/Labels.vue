<template>
  <VContainer fluid>
    <vue-headful :title="$tc('music.labels', 2) + ' | Accentor'" />
    <VDataIterator
      :footer-props="{
        disableItemsPerPage: true,
        itemsPerPageOptions: [numberOfItems],
        showFirstLastPage: true,
      }"
      :items="filteredItems"
      :items-per-page="numberOfItems"
      :page.sync="pagination.page"
      v-if="labels.length > 0"
    >
      <template v-slot:header>
        <VRow class="mb-2" justify="end">
          <VCol lg="4" md="6" sm="8" xl="2" cols="12">
            <VTextField
              :label="$t('common.search')"
              hide-details
              prepend-inner-icon="mdi-magnify"
              single-line
              v-if="labels.length > numberOfItems"
              v-model="search"
            />
          </VCol>
        </VRow>
      </template>
      <template v-slot:default="props">
        <VRow>
          <VCol
            :key="item.id"
            lg="3"
            md="4"
            sm="6"
            v-for="item in props.items"
            xl="2"
            cols="12"
          >
            <LabelCard :label="item" />
          </VCol>
        </VRow>
      </template>
    </VDataIterator>
  </VContainer>
</template>

<script>
import { mapGetters } from "vuex";
import LabelCard from "../../components/LabelCard";
import Paginated from "../../mixins/Paginated";
import Searchable from "../../mixins/Searchable";

export default {
  name: "labels",
  components: { LabelCard },
  mixins: [Paginated, Searchable],
  computed: {
    ...mapGetters("labels", {
      labels: "labelsByName",
    }),
    filteredItems() {
      return this.labels.filter(
        (item) =>
          !this.search ||
          item.name
            .toLocaleLowerCase()
            .indexOf(this.search.toLocaleLowerCase()) >= 0 ||
          item.normalized_name.indexOf(this.search.toLocaleLowerCase()) >= 0
      );
    },
    numberOfItems() {
      if (this.$vuetify.breakpoint.name === "xl") {
        return 30;
      } else if (this.$vuetify.breakpoint.name === "lg") {
        return 20;
      } else if (this.$vuetify.breakpoint.name === "md") {
        return 15;
      } else {
        return 12;
      }
    },
  },
};
</script>
