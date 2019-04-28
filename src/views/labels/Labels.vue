<template>
  <VContainer fluid grid-list-xl>
    <VDataIterator
      :items="labels"
      :rows-per-page-items="[12]"
      :pagination.sync="pagination"
      v-if="labels.length > 0"
      content-class="layout row wrap"
    >
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

export default {
  name: "labels",
  components: { LabelCard },
  mixins: [Paginated],
  computed: {
    ...mapGetters("labels", {
      labels: "labelsByName"
    })
  }
};
</script>
