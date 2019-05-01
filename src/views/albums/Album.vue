<template>
  <VContainer fluid grid-list-xl v-if="album">
    <VLayout row wrap>
      <VFlex lg3 md4 sm6 v-if="album.image" xs12>
        <VImg :src="album.image" class="elevation-3" />
      </VFlex>
      <VFlex lg9 md8 sm6 xs12>
        <div>
          <div class="headline">{{ album.title }}</div>
          <AlbumArtists :album="album" />
          <div class="grey--text">
            {{ album.release }}
          </div>
          <div
            class="grey--text"
            v-for="al of album.album_labels"
            :key="`${al.label_id} ${al.catalogue_number}`"
          >
            <RouterLink :to="{ name: 'label', params: { id: al.label_id } }">
              {{ labels[al.label_id].name }}
            </RouterLink>
            - {{ al.catalogue_number }}
          </div>
          <div>
            <AlbumActions :album="album" />
          </div>
        </div>
      </VFlex>
      <VLayout row>
        <VFlex>
          <TracksTable :tracks="tracks" :show-album="false" />
        </VFlex>
      </VLayout>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapState } from "vuex";
import Paginated from "../../mixins/Paginated";
import AlbumActions from "../../components/AlbumActions";
import TracksTable from "../../components/TracksTable";
import AlbumArtists from "../../components/AlbumArtists";

export default {
  name: "Album",
  components: { AlbumArtists, TracksTable, AlbumActions },
  mixins: [Paginated],
  computed: {
    ...mapState("albums", ["albums"]),
    ...mapState("labels", ["labels"]),
    tracks: function() {
      return this.$store.getters["tracks/tracksFilterByAlbum"](
        this.$route.params.id
      );
    },
    album: function() {
      return this.albums[this.$route.params.id];
    }
  }
};
</script>
