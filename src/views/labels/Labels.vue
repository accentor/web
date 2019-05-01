<template>
  <VContainer fluid grid-list-xl>
    <VDataIterator
      :items="labels"
      :search="search"
      :custom-filter="filter"
      :rows-per-page-items="[12]"
      :pagination.sync="pagination"
      v-if="labels.length > 0"
      content-class="layout row wrap"
    >
      <template v-slot:header>
        <VLayout justify-end row wrap mb-2>
          <VFlex xs12 sm8 md6 lg4 xl2>
            <VTextField
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
          </VFlex>
        </VLayout>
      </template>
      <template v-slot:item="props">
        <VFlex lg3 md4 sm6 xl2 xs12>
          <LabelCard :label="props.item" />
        </VFlex>
      </template>
    </VDataIterator>
  </VContainer>
</template>

<script>
import { mapGetters } from "vuex";
import Paginated from "../../mixins/Paginated";
import LabelCard from "../../components/LabelCard";
import Searchable from "../../mixins/Searchable";

export default {
  name: "labels",
  components: { LabelCard },
  mixins: [Paginated, Searchable],
  data() {
    return {
      filter: (items, search, filter) => {
        search = search.toString().toLowerCase();
        if (search.trim() === "") return items;

        return items.filter(val => filter(val.name, search));
      }
    };
  },
  computed: {
    ...mapGetters("labels", {
      labels: "labelsByName"
    })
  }
};
</script>
