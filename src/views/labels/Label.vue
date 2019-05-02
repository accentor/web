<template>
  <VContainer fluid grid-list-xl v-if="label">
    <VDataIterator
      :items="albums"
      :search="search"
      :custom-filter="filter"
      :rows-per-page-items="[12]"
      :pagination.sync="pagination"
      v-if="albums.length > 0"
      content-class="layout row wrap"
    >
      <template v-slot:header>
        <VLayout justify-space-between align-baseline row wrap mb-2>
          <VFlex xs12 sm4 md6 lg8 xl10>
            <h3>{{ label.name }}</h3>
          </VFlex>
          <VFlex xs12 sm8 md6 lg4 xl2>
            <VTextField
              v-if="albums.length > 12"
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
          <AlbumCard :album="props.item" />
        </VFlex>
      </template>
    </VDataIterator>
  </VContainer>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import AlbumCard from "../../components/AlbumCard";
import Paginated from "../../mixins/Paginated";
import Searchable from "../../mixins/Searchable";

export default {
  name: "Label",
  components: { AlbumCard },
  mixins: [Paginated, Searchable],
  data() {
    return {
      filter: (items, search, filter) => {
        search = search.toString().toLowerCase();
        if (search.trim() === "") return items;

        return items.filter(val => filter(val.title, search));
      }
    };
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapState("labels", ["labels"]),
    albums: function() {
      return this.$store.getters["albums/albumsFilterByLabel"](
        this.$route.params.id
      );
    },
    label: function() {
      return this.labels[this.$route.params.id];
    }
  }
};
</script>
