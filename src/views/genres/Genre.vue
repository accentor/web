<template>
  <VContainer fluid grid-list-xl v-if="genre">
    <VLayout wrap>
      <VFlex xs12>
        <h2 class="display-1">{{ genre.name }}</h2>
      </VFlex>
    </VLayout>
    <VLayout wrap>
      <VFlex>
        <TracksTable :tracks="tracks" :show-search="true" />
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import TracksTable from "../../components/TracksTable";

export default {
  name: "Genre",
  components: { TracksTable },
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
