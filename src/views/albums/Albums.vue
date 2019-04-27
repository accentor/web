<template>
  <VContainer fluid grid-list-xl>
    <VDataIterator
      :items="albums"
      :filter="(obj, search) => obj.title.contains(search)"
      :rows-per-page-items="[12]"
      :pagination.sync="pagination"
      v-if="albums.length > 0"
      content-class="layout row wrap"
    >
      <template v-slot:header>
        <VLayout justify-end row wrap>
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

export default {
  name: "albums",
  components: { AlbumCard },
  mixins: [Paginated],
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
