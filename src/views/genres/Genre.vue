<template>
  <VContainer fluid v-if="genre">
    <VRow>
      <VCol cols="12">
        <div>
          <h2 class="text-h4">{{ genre.name }}</h2>
        </div>
        <div>
          <GenreActions :genre="genre" class="actions--wide" />
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
import { mapActions } from "vuex";
import { mapState, mapActions as mapPiniaActions } from "pinia";
import GenreActions from "@/components/GenreActions.vue";
import TracksTable from "@/components/TracksTable.vue";
import { TracksScope } from "@accentor/api-client-js";
import { useAuthStore } from "../../store/auth";
import { useGenresStore } from "../../store/genres";

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
    id: {
      handler: "fetchContent",
      immediate: true,
    },
  },
  computed: {
    ...mapState(useAuthStore, ["isModerator"]),
    ...mapState(useGenresStore, ["genres"]),
    tracks: function () {
      return this.$store.getters["tracks/tracksFilterByGenre"](
        this.$route.params.id,
      );
    },
    genre: function () {
      return this.genres[this.$route.params.id];
    },
  },
  methods: {
    ...mapPiniaActions(useGenresStore, ["read"]),
    ...mapActions("tracks", { indexTracks: "index" }),
    async fetchContent(newValue, oldValue) {
      // After loading the content, the router will change the id from a string to a number
      // but we don't actually want to load the content twice
      if (newValue == oldValue) {
        return;
      }

      const genre = this.read(this.id);
      const tracks = this.indexTracks(new TracksScope().genre(this.id));
      await Promise.all([genre, tracks]);
      // If the genre is undefined after loading, we assume that it doesn't exist.
      if (this.genre === undefined) {
        this.$router.go(-1);
      }
    },
  },
};
</script>
