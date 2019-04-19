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
          <VCard :to="{ name: 'album', params: { id: props.item.id } }">
            <VImg
              :aspect-ratio="1"
              :src="props.item.image"
              v-if="props.item.image"
            />
            <VCardTitle primary-title>
              <div>
                <div class="headline">{{ props.item.title }}</div>
                <span>
                  {{ props.item.albumartist }}
                </span>
              </div>
            </VCardTitle>
            <VCardText>
              <span class="grey--text">
                {{ props.item.release }}
              </span>
            </VCardText>
            <VCardActions v-if="isModerator">
              <AlbumActions :album="props.item" />
            </VCardActions>
          </VCard>
        </VFlex>
      </template>
    </VDataIterator>
  </VContainer>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AlbumActions from "../../components/AlbumActions";
import Paginated from "../../mixins/Paginated";

export default {
  name: "albums",
  components: { AlbumActions },
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
