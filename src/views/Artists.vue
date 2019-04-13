<template>
  <div>
    <VContainer fluid grid-list-xl>
      <VLayout row wrap justify-end>
        <VBtn :to="{name: 'new-artist'}" color="success">
          <VIcon left>mdi-plus</VIcon>
          New artist
        </VBtn>
      </VLayout>
      <VLayout row wrap v-if="artists.length > 0">
        <VFlex v-for="artist in artists" :key="artist.id" xs12 sm6 md4 lg3 xl2>
          <VCard :to="{ path: `/app/artists/${artist.id}` }">
            <VImg v-if="artist.image" :src="artist.image" :aspect-ratio="1" />
            <VCardTitle primary-title>
              <h3>{{ artist.name }}</h3>
            </VCardTitle>
            <VCardActions v-if="isModerator">
              <VBtn
                fab
                dark
                small
                outline
                color="red"
                href="#"
                @click.stop.prevent="deleteArtist(artist.id)"
              >
                <VIcon>mdi-delete</VIcon>
              </VBtn>
              <VBtn
                fab
                dark
                small
                outline
                color="orange"
                :to="{ path: `/app/artists/${artist.id}/edit` }"
              >
                <VIcon>mdi-pencil</VIcon>
              </VBtn>
            </VCardActions>
          </VCard>
        </VFlex>
      </VLayout>
    </VContainer>
  </div>
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
    ...mapGetters("artists", ["artists"])
  }
};
</script>
