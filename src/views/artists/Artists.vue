<template>
  <VContainer fluid grid-list-xl>
    <VDataIterator
      :items="artists"
      :rows-per-page-items="[12]"
      :pagination.sync="pagination"
      v-if="artists.length > 0"
      content-class="layout row wrap"
    >
      <template v-slot:header>
        <VLayout justify-end row wrap>
          <VBtn :to="{ name: 'new-artist' }" color="success" v-if="isModerator">
            <VIcon left>mdi-plus</VIcon>
            New artist
          </VBtn>
        </VLayout>
      </template>
      <template v-slot:item="props">
        <VFlex lg3 md4 sm6 xl2 xs12>
          <ArtistCard :artist="props.item" />
        </VFlex>
      </template>
    </VDataIterator>
  </VContainer>
</template>

<script>
import { mapGetters } from "vuex";
import Paginated from "../../mixins/Paginated";
import ArtistCard from "../../components/ArtistCard";

export default {
  name: "artists",
  components: { ArtistCard },
  mixins: [Paginated],
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapGetters("artists", {
      artists: "artistsByName"
    })
  }
};
</script>
