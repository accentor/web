<template>
  <VContainer fluid grid-list-xl v-if="artist">
    <VLayout row wrap>
      <VFlex lg3 md4 sm6 v-if="artist.image" xs12>
        <VImg :src="artist.image" class="elevation-3" />
      </VFlex>
      <VFlex lg9 md8 sm6 xs12>
        <div>
          <h3>{{ artist.name }}</h3>
        </div>
        <div>
          <ArtistActions :artist="artist" />
        </div>
      </VFlex>
    </VLayout>
    <VLayout row wrap>
      <VFlex :key="item.id" lg3 md4 sm6 v-for="item of artistAlbums" xl2 xs12>
        <AlbumCard :album="item" />
      </VFlex>
    </VLayout>
    <VLayout row wrap>
      <VFlex>
        <TracksTable :tracks="tracks" :save-pagination="false" />
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import AlbumCard from "../../components/AlbumCard";
import ArtistActions from "../../components/ArtistActions";
import TracksTable from "../../components/TracksTable";

export default {
  name: "Artist",
  components: {
    TracksTable,
    AlbumCard,
    ArtistActions
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapState("albums", ["albums"]),
    ...mapState("artists", ["artists"]),
    artistAlbums: function() {
      return this.$store.getters["albums/albumsFilterByArtist"](
        this.$route.params.id
      );
    },
    tracks: function() {
      return this.$store.getters["tracks/tracksFilterByArtist"](
        this.$route.params.id
      );
    },
    artist: function() {
      return this.artists[this.$route.params.id];
    }
  }
};
</script>
