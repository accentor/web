<template>
  <VContainer fluid grid-list-xl v-if="album">
    <VLayout row wrap>
      <VFlex lg3 md4 sm6 v-if="album.image" xs12>
        <VImg :src="album.image" class="elevation-3" />
      </VFlex>
      <VFlex lg9 md8 sm6 xs12>
        <div>
          <div class="headline">{{ album.title }}</div>
          <div>
            {{ album.album_artists | album_artists }}
          </div>
          <div class="grey--text">
            {{ album.release }}
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
import TracksTable from "../../components/TracksTable";

export default {
  name: "Album",
  components: { TracksTable },
  mixins: [Paginated],
  computed: {
    ...mapState("albums", ["albums"]),
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
