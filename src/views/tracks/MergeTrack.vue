<template>
  <VContainer class="fill-height" v-if="track">
    <vue-headful
      :title="$t('page-titles.merge', { obj: track.title }) + ' | Accentor'"
    />
    <VRow>
      <VCol lg="9" md="8" sm="6" cols="12">
        <div class="text-h4">
          {{ $t("music.track.merge.title", { obj: track.title }) }}
        </div>
        <div class="grey--text">
          {{ $t("music.track.merge.explanation") }}
        </div>
      </VCol>
    </VRow>
    <VRow>
      <VSimpleTable class="text-left merge-table">
        <template v-slot:default>
          <thead>
            <tr>
              <th>{{ $t("music.track.merge.original") }}</th>
              <th>{{ $t("music.track.merge.selected") }}</th>
              <th class="d-flex justify-space-between">
                <VIcon>mdi-arrow-right</VIcon>
                <span class="text-right my-auto">{{
                  $t("music.track.merge.result")
                }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ track.number }}. {{ track.title }}</td>
              <td>
                <span v-if="selectedTrack.number"
                  >{{ selectedTrack.number }}. </span
                >{{ selectedTrack.title }}
              </td>
              <td class="text-right">
                <span v-if="result.number">{{ result.number }}. </span
                >{{ result.title }}
              </td>
            </tr>
            <tr>
              <td>{{ albums[track.album_id].title }}</td>
              <td>
                {{
                  selectedTrack.album_id
                    ? albums[selectedTrack.album_id].title
                    : "-"
                }}
              </td>
              <td class="text-right">
                {{ result.album_id ? albums[result.album_id].title : "-" }}
              </td>
            </tr>
            <tr>
              <td><TrackArtists :track="track" /></td>
              <td>
                <TrackArtists
                  :track="selectedTrack"
                  v-if="selectedTrack.track_artists"
                />
                <span v-else>-</span>
              </td>
              <td class="text-right">
                <TrackArtists :track="result" v-if="result.track_artists" />
                <span v-else>-</span>
              </td>
            </tr>
            <tr>
              <td><TrackGenres :track="track" /></td>
              <td>
                <TrackGenres
                  :track="selectedTrack"
                  v-if="selectedTrack.genre_ids"
                />
                <span v-else>-</span>
              </td>
              <td class="text-right">
                <TrackGenres :track="result" v-if="result.genre_ids" />
                <span v-else>-</span>
              </td>
            </tr>
            <tr>
              <td>
                {{ track.filename ? track.filename : $t("music.track.empty") }}
              </td>
              <td>
                <span v-if="selectedTrack">
                  {{
                    selectedTrack.filename
                      ? selectedTrack.filename
                      : $t("music.track.empty")
                  }}
                </span>
                <span v-else>
                  -
                </span>
              </td>
              <td class="text-right">
                {{
                  result.filename
                    ? result.filename
                    : $t("music.track.merge.result-empty")
                }}
              </td>
            </tr>
          </tbody>
        </template>
      </VSimpleTable>
    </VRow>
    <VRow>
      <VCol class="d-flex justify-center">
        <VBtn color="primary" class="ma-2" :disabled="!newID" @click="submit">
          {{ $t("music.track.merge.submit") }}
        </VBtn>
      </VCol>
      <VCol class="d-flex justify-center">
        <VBtn
          color="secondary"
          class="ma-2"
          @click="limitTracksToAlbum = !limitTracksToAlbum"
        >
          {{
            limitTracksToAlbum
              ? $t("music.track.merge.show-all-tracks")
              : $t("music.track.merge.show-only-album-tracks")
          }}
        </VBtn>
      </VCol>
      <VCol class="d-flex justify-center">
        <VBtn
          color="success"
          class="ma-2"
          :disabled="!newID"
          @click="reversed = !reversed"
        >
          <VIcon>mdi-swap-horizontal-bold</VIcon>
          {{ $t("music.track.merge.swap-tracks") }}
        </VBtn>
      </VCol>
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
import { mapGetters, mapState, mapActions } from "vuex";
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
      limitTracksToAlbum: true,
    };
  },
  computed: {
    ...mapState("albums", ["albums"]),
    ...mapGetters({ tracks: "tracks/tracksByAlbumAndNumber" }),
    mergeOptions: function () {
      if (this.limitTracksToAlbum) {
        return this.$store.getters["tracks/tracksFilterByAlbum"](
          this.track.album_id
        ).filter((t) => t.id != this.$route.params.id);
      } else {
        return this.tracks.filter((t) => t.id != this.$route.params.id);
      }
    },
    track: function () {
      return this.tracks.find(({ id }) => id == this.$route.params.id);
    },
    result: function () {
      const filename =
        this.track.filename && !this.reversed
          ? this.track.filename
          : this.selectedTrack.filename;
      if (!this.reversed) {
        return {
          ...this.selectedTrack,
          filename,
        };
      } else {
        return {
          ...this.track,
          filename,
        };
      }
    },
    selectedTrack: function () {
      if (this.newID) {
        return this.tracks.find(({ id }) => id === this.newID);
      } else {
        return {
          title: "-",
          album_id: null,
          track_artists: null,
          genre_ids: null,
          filename: "-",
        };
      }
    },
  },
  methods: {
    ...mapActions("tracks", ["merge"]),
    setNewID(id) {
      this.newID = id;
    },
    submit() {
      const newID = this.reversed ? this.track.id : this.newID;
      const oldID = this.reversed ? this.newID : this.track.id;
      this.merge({ newID, oldID }).finally(() => {
        this.$router.push(this.$route.query.redirect || { name: "tracks" });
      });
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
