<template>
  <VContainer v-if="genre" fluid>
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
import { mapState, mapActions } from "pinia";
import GenreActions from "@/components/GenreActions.vue";
import TracksTable from "@/components/TracksTable.vue";
import { TracksScope } from "@accentor/api-client-js";
import { useAuthStore } from "../../store/auth";
import { useGenresStore } from "../../store/genres";
import { useTracksStore } from "../../store/tracks";

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
  computed: {
    ...mapState(useAuthStore, ["isModerator"]),
    ...mapState(useGenresStore, ["genres"]),
    tracks: function () {
      return useTracksStore().tracksFilterByGenre(this.$route.params.id);
    },
    genre: function () {
      return this.genres[this.$route.params.id];
    },
  },
  watch: {
    id: {
      handler: "fetchContent",
      immediate: true,
    },
  },
  methods: {
    ...mapActions(useGenresStore, ["read"]),
    ...mapActions(useTracksStore, { indexTracks: "index" }),
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
