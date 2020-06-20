<template>
  <VContainer class="fill-height" v-if="track">
    <vue-headful
      :title="$t('page-titles.merge', { obj: track.title }) + ' | Accentor'"
    />
    <VRow>
      <VCol lg="9" md="8" sm="6" cols="12">
        <div class="text-h4">
          {{ $t("music.track.merge-into", { obj: track.title }) }}
        </div>
        <div class="grey--text">
          {{ $t("music.track.merge-explanation") }}
        </div>
      </VCol>
    </VRow>
    <VRow v-if="newID">
      <VSimpleTable class="text-center merge-table">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Original</th>
              <th class="text-center">New Track</th>
              <th class="text-center">Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ track.title }}</td>
              <td>{{ selectedTrack.title }}</td>
              <td>{{ selectedTrack.title }}</td>
            </tr>
            <tr>
              <td>{{ albums[track.album_id].title }}</td>
              <td>{{ albums[selectedTrack.album_id].title }}</td>
              <td>{{ albums[selectedTrack.album_id].title }}</td>
            </tr>
            <tr>
              <td><TrackArtists :track="track" /></td>
              <td><TrackArtists :track="selectedTrack" /></td>
              <td><TrackArtists :track="selectedTrack" /></td>
            </tr>
            <tr>
              <td><TrackGenres :track="track" /></td>
              <td><TrackGenres :track="selectedTrack" /></td>
              <td><TrackGenres :track="selectedTrack" /></td>
            </tr>
          </tbody>
        </template>
      </VSimpleTable>
    </VRow>
    <VRow>
      <VCol>
        <TracksTable
          :tracks="mergeOptions"
          :showSearch="true"
          :showActions="false"
          :showMassEdit="false"
          :singleSelect="true"
          @selected="setNewID"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import TrackGenres from "@/components/TrackGenres";
import TrackArtists from "@/components/TrackArtists";
import TracksTable from "@/components/TracksTable";

export default {
  name: "MergeTrack",
  components: { TrackArtists, TrackGenres, TracksTable },
  data() {
    return {
      reversed: false,
      newID: null,
    };
  },
  computed: {
    ...mapState("albums", ["albums"]),
    ...mapGetters({ tracks: "tracks/tracksByAlbumAndNumber" }),
    mergeOptions: function () {
      return this.tracks.filter((t) => t.id != this.$route.params.id);
    },
    track: function () {
      return this.tracks.find(({ id }) => id == this.$route.params.id);
    },
    selectedTrack: function () {
      return this.tracks.find(({ id }) => id === this.newID);
    },
  },
  methods: {
    setNewID(id) {
      this.newID = id;
    },
  },
};
</script>

<style lang="scss">

.merge-table {
  width: 100%;

  table {
    table-layout: fixed;
  }
}

</style>
