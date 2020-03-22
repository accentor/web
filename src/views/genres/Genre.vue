<template>
  <VContainer fluid v-if="genre">
    <vue-headful :title="genre.name + ' | Accentor'" />
    <VRow>
      <VCol cols="12">
        <h2 class="display-1">{{ genre.name }}</h2>
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
import TracksTable from "../../components/TracksTable";

export default {
  name: "Genre",
  components: { TracksTable },
  watch: {
    agenre: function() {
      if (this.genre === undefined) {
        this.$router.push({ name: "genres" });
      }
    }
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapState("genres", ["genres"]),
    tracks: function() {
      return this.$store.getters["tracks/tracksFilterByGenre"](
        this.$route.params.id
      );
    },
    genre: function() {
      return this.genres[this.$route.params.id];
    }
  }
};
</script>
