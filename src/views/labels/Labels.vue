<template>
  <VContainer fluid grid-list-xl>
    <VDataIterator
      :footer-props="{ disableItemsPerPage: true, itemsPerPageOptions: [12] }"
      :items="filteredItems"
      :items-per-page="numberOfItems"
      :page.sync="pagination.page"
      v-if="labels.length > 0"
    >
      <template v-slot:header>
        <VLayout justify-end mb-2 wrap>
          <VFlex lg4 md6 sm8 xl2 xs12>
            <VTextField
              :label="$t('common.search')"
              hide-details
              prepend-inner-icon="mdi-magnify"
              single-line
              v-if="labels.length > numberOfItems"
              v-model="search"
            />
          </VFlex>
        </VLayout>
      </template>
      <template v-slot:default="props">
        <VLayout wrap>
          <VFlex
            :key="item.name"
            lg3
            md4
            sm6
            v-for="item in props.items"
            xl2
            xs12
          >
            <LabelCard :label="item" />
          </VFlex>
        </VLayout>
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
      labels: "labelsByName"
    }),
    filteredItems() {
      return this.labels.filter(
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
