<template>
  <VContainer class="fill-height" v-if="track">
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
              <th class="text-center">
                {{ $t("music.track.merge.result") }}
              </th>
              <th class="text-right">{{ $t("music.track.merge.selected") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td :class="{ 'd-flex justify-space-between': !reversed }">
                <span class="my-auto"
                  >{{ track.number }}. {{ track.title }}</span
                >
                <VIcon v-if="!reversed && newID">mdi-arrow-right</VIcon>
              </td>
              <td class="text-center">
                <span v-if="result.number">{{ result.number }}. </span
                >{{ result.title }}
              </td>
              <td
                class="text-right"
                :class="{ 'd-flex justify-space-between': reversed }"
              >
                <VIcon v-if="reversed && newID">mdi-arrow-left</VIcon>
                <span class="my-auto">
                  <span v-if="selectedTrack.number"
                    >{{ selectedTrack.number }}. </span
                  >{{ selectedTrack.title }}
                </span>
              </td>
            </tr>
            <tr>
              <td :class="{ 'd-flex justify-space-between': !reversed }">
                <span class="my-auto">{{ albums[track.album_id].title }}</span>
                <VIcon v-if="!reversed && newID">mdi-arrow-right</VIcon>
              </td>
              <td class="text-center">
                {{ result.album_id ? albums[result.album_id].title : "-" }}
              </td>
              <td
                class="text-right"
                :class="{ 'd-flex justify-space-between': reversed }"
              >
                <VIcon v-if="reversed && newID">mdi-arrow-left</VIcon>
                <span class="my-auto">
                  {{
                    selectedTrack.album_id
                      ? albums[selectedTrack.album_id].title
                      : "-"
                  }}
                </span>
              </td>
            </tr>
            <tr>
              <td :class="{ 'd-flex justify-space-between': !reversed }">
                <TrackArtists class="my-auto" :track="track" />
                <VIcon v-if="!reversed && newID">mdi-arrow-right</VIcon>
              </td>
              <td class="text-center">
                <TrackArtists :track="result" v-if="result.track_artists" />
                <span v-else>-</span>
              </td>
              <td :class="{ 'd-flex justify-space-between': reversed }">
                <VIcon v-if="reversed && newID">mdi-arrow-left</VIcon>
                <TrackArtists
                  class="my-auto text-right"
                  :track="selectedTrack"
                  v-if="selectedTrack.track_artists"
                />
                <span v-else>-</span>
              </td>
            </tr>
            <tr>
              <td :class="{ 'd-flex justify-space-between': !reversed }">
                <TrackGenres class="my-auto" :track="track" />
                <VIcon v-if="!reversed && newID">mdi-arrow-right</VIcon>
              </td>
              <td class="text-center">
                <TrackGenres :track="result" v-if="result.genre_ids" />
                <span v-else>-</span>
              </td>
              <td :class="{ 'd-flex justify-space-between': reversed }">
                <VIcon v-if="reversed && newID">mdi-arrow-left</VIcon>
                <TrackGenres
                  class="my-auto text-right"
                  :track="selectedTrack"
                  v-if="selectedTrack.genre_ids"
                />
                <span v-else>-</span>
              </td>
            </tr>
            <tr>
              <td
                :class="{
                  'd-flex justify-space-between': !result.file.selected,
                }"
              >
                <span class="my-auto">
                  {{
                    track.filename ? track.filename : $t("music.track.empty")
                  }}
                </span>
                <VIcon v-if="!result.file.selected && track.filename && newID"
                  >mdi-arrow-right</VIcon
                >
              </td>
              <td class="text-center">
                {{
                  result.file.name
                    ? result.file.name
                    : $t("music.track.merge.result-empty")
                }}
              </td>
              <td
                :class="{
                  'd-flex justify-space-between': result.file.selected,
                }"
              >
                <VIcon
                  v-if="result.file.selected && selectedTrack.filename && newID"
                  >mdi-arrow-left</VIcon
                >
                <span class="my-auto text-right" v-if="selectedTrack">
                  {{
                    selectedTrack.filename
                      ? selectedTrack.filename
                      : $t("music.track.empty")
                  }}
                </span>
                <span class="my-auto text-right" v-else> - </span>
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
          color="success"
          class="ma-2"
          :disabled="!newID"
          @click="reversed = !reversed"
        >
          <VIcon>mdi-swap-horizontal-bold</VIcon>
          {{ $t("music.track.merge.swap-tracks") }}
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
  metaInfo() {
    return { title: this.$t("page-titles.merge", { obj: this.track.title }) };
  },
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
          this.track.album_id,
        ).filter((t) => t.id != this.$route.params.id);
      } else {
        return this.tracks.filter((t) => t.id != this.$route.params.id);
      }
    },
    track: function () {
      return this.tracks.find(({ id }) => id == this.$route.params.id);
    },
    result: function () {
      if (this.reversed) {
        const file = this.track.filename
          ? { name: this.track.filename, selected: false }
          : { name: this.selectedTrack.filename, selected: true };
        return {
          ...this.selectedTrack,
          file,
        };
      } else {
        const file = this.selectedTrack.filename
          ? { name: this.selectedTrack.filename, selected: true }
          : { name: this.track.filename, selected: false };
        return {
          ...this.track,
          file,
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
      const newID = this.reversed ? this.newID : this.track.id;
      const oldID = this.reversed ? this.track.id : this.newID;
      this.merge({ newID, oldID }).finally(() => {
        this.$router.push(this.$route.query.redirect || { name: "tracks" });
      });
    },
  },
};
</script>

<style lang="scss">
// We do not follow BEM here, since Vuetify doesn't allow us to directly add a class to the table
.merge-table {
  width: 100%;

  table {
    table-layout: fixed;
  }
}
</style>
