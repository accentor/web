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
import { mapGetters, mapState } from "vuex";
import GenreActions from "@/components/GenreActions";
import TracksTable from "../../components/TracksTable";

export default {
  name: "Genre",
  components: { GenreActions, TracksTable },
  metaInfo() {
    return { title: this.genre.name };
  },
  watch: {
    genre: function () {
      if (this.genre === undefined) {
        this.$router.go(-1);
      }
    },
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
};
</script>
