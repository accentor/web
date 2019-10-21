<template>
  <VContainer fluid grid-list-xl v-if="artist">
    <VLayout wrap>
      <VFlex lg3 md4 sm6 v-if="artist.image500" xs12>
        <VImg :src="artist.image500" class="elevation-3" />
      </VFlex>
      <VFlex lg3 md4 sm6 v-if="artist.image" xs12>
        <VImg :src="artist.image" class="elevation-3" />
      </VFlex>
      <VFlex lg9 md8 sm6 xs12>
        <div>
          <h2 class="display-1">{{ artist.name }}</h2>
        </div>
        <div>
          <ArtistActions :artist="artist" />
        </div>
      </VFlex>
    </VLayout>
    <VLayout wrap>
      <VFlex :key="item.id" lg3 md4 sm6 v-for="item of albums" xl2 xs12>
        <AlbumCard :album="item" />
      </VFlex>
    </VLayout>
    <VLayout wrap>
      <VFlex>
        <TracksTable
          :tracks="tracks"
          :show-search="true"
          :save-search="false"
        />
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
    ...mapState("artists", ["artists"]),
    albums: function() {
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
