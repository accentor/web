<template>
  <VContainer fluid grid-list-xl>
    <VDataIterator
      :items="artists"
      :filter="(obj, search) => obj.name.contains(search)"
      :rows-per-page-items="[12]"
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
          <VCard :to="{ name: 'artist', params: { id: props.item.id } }">
            <VImg
              :aspect-ratio="1"
              :src="props.item.image"
              v-if="props.item.image"
            />
            <VCardTitle primary-title>
              <h3>{{ props.item.name }}</h3>
            </VCardTitle>
            <VCardActions v-if="isModerator">
              <VBtn
                @click.stop.prevent="deleteArtist(props.item.id)"
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
                :to="{
                  name: 'edit-artist',
                  params: { id: props.item.id },
                  query: { redirect: $route.fullPath }
                }"
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
      </template>
    </VDataIterator>
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
