<template>
  <VContainer fluid v-if="genre">
    <VRow>
      <VCol cols="12">
        <div>
          <h2 class="text-h4">{{ genre.name }}</h2>
        </div>
        <div>
          <GenreActions :genre="genre" />
        </div>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <TracksTable :tracks="tracks" :show-search="true" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import GenreActions from "@/components/GenreActions";
import TracksTable from "../../components/TracksTable";
import { TracksScope } from "@/api/scopes";

export default {
  name: "Genre",
  components: { GenreActions, TracksTable },
  metaInfo() {
    return { title: this.genre?.name };
  },
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  watch: {
    id: "fetchContent",
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapState("genres", ["genres"]),
    tracks: function () {
      return this.$store.getters["tracks/tracksFilterByGenre"](
        this.$route.params.id
      );
    },
    genre: function () {
      return this.genres[this.$route.params.id];
    },
  },
  methods: {
    ...mapActions("genres", ["read"]),
    ...mapActions("tracks", { indexTracks: "index" }),
    async fetchContent() {
      const genre = this.read(this.id);
      const tracks = this.indexTracks(new TracksScope().genre(this.id));
      Promise.all([genre, tracks]).finally(() => {
        // If the genre is undefined after loading, we assume that it doesn't exist.
        if (this.genre === undefined) {
          this.$router.go(-1);
        }
      });
    },
  },
};
</script>
