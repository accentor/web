<template>
  <VContainer fluid grid-list-xl>
    <VLayout justify-end row wrap>
      <VBtn :to="{ name: 'new-artist' }" color="success" v-if="isModerator">
        <VIcon left>mdi-plus</VIcon>
        New artist
      </VBtn>
    </VLayout>
    <VLayout row v-if="artists.length > 0" wrap>
      <VFlex :key="artist.id" lg3 md4 sm6 v-for="artist in artists" xl2 xs12>
        <VCard :to="{ name: 'artist', params: { id: artist.id } }">
          <VImg :aspect-ratio="1" :src="artist.image" v-if="artist.image" />
          <VCardTitle primary-title>
            <h3>{{ artist.name }}</h3>
          </VCardTitle>
          <VCardActions v-if="isModerator">
            <VBtn
              @click.stop.prevent="deleteArtist(artist.id)"
              color="red"
              dark
              fab
              href="#"
              outline
              small
            >
              <VIcon>mdi-delete</VIcon>
            </VBtn>
            <VBtn
              :to="{ name: 'edit-artist', params: { id: artist.id } }"
              color="orange"
              dark
              fab
              outline
              small
            >
              <VIcon>mdi-pencil</VIcon>
            </VBtn>
          </VCardActions>
        </VCard>
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "artists",
  methods: {
    ...mapActions("artists", ["destroy"]),
    deleteArtist: function(id) {
      if (confirm("Are you sure?")) {
        this.destroy(id);
      }
    }
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapGetters("artists", {
      artists: "artistsByName"
    })
  }
};
</script>
