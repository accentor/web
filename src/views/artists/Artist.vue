<template>
  <VContainer fluid v-if="artist">
    <vue-headful :title="artist.name + ' | Accentor'" />
    <VRow>
      <VCol
        lg="3"
        md="4"
        sm="6"
        v-if="artist.image500 && !imageUnavailable"
        cols="12"
      >
        <VImg :src="artist.image500" class="elevation-3" />
      </VCol>
      <VCol
        lg="3"
        md="4"
        sm="6"
        v-else-if="artist.image && !imageUnavailable"
        cols="12"
      >
        <VImg :src="artist.image" class="elevation-3" />
      </VCol>
      <VCol lg="9" md="8" sm="6" cols="12">
        <div>
          <h2 class="text-h4">{{ artist.name }}</h2>
        </div>
        <div>
          <ArtistActions :artist="artist" />
        </div>
      </VCol>
    </VRow>
    <VRow>
      <VCol
        :key="item.id"
        lg="3"
        md="4"
        sm="6"
        v-for="item of albums"
        xl="2"
        cols="12"
      >
        <AlbumCard :album="item" />
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <TracksTable
          :tracks="tracks"
          :show-search="true"
          :save-search="false"
        />
      </VCol>
    </VRow>
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
    ArtistActions,
  },
  data() {
    return {
      imageUnavailable: false,
    };
  },
  watch: {
    artist: function () {
      if (this.artist === undefined) {
        this.$router.go(-1);
      }
    },
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapState("artists", ["artists"]),
    albums: function () {
      return this.$store.getters["albums/albumsFilterByArtist"](
        this.$route.params.id
      );
    },
    tracks: function () {
      return this.$store.getters["tracks/tracksFilterByArtist"](
        this.$route.params.id
      );
    },
    artist: function () {
      return this.artists[this.$route.params.id];
    },
  },
  methods: {
    setImageUnavailable() {
      this.imageUnavailable = true;
    },
  },
};
</script>
