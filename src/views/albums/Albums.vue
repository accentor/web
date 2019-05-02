<template>
  <VContainer fluid grid-list-xl>
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
        <VLayout justify-end align-baseline row wrap mb-2>
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
          <VBtn :to="{ name: 'new-album' }" color="success" v-if="isModerator">
            <VIcon left>mdi-plus</VIcon>
            New album
          </VBtn>
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
import { mapActions, mapGetters } from "vuex";
import AlbumCard from "../../components/AlbumCard";
import Paginated from "../../mixins/Paginated";
import Searchable from "../../mixins/Searchable";

export default {
  name: "albums",
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
  methods: {
    ...mapActions("albums", ["destroy"]),
    deleteAlbum: function(id) {
      if (confirm("Are you sure?")) {
        this.destroy(id);
      }
    }
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapGetters("albums", {
      albums: "albumsByTitle"
    })
  }
};
</script>
