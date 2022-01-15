<template>
  <VCard class="pa-2">
    <VCardTitle> {{ title }}</VCardTitle>
    <TopList :list-data="listData" :show-length="useTrackLength" />
  </VCard>
</template>

<script>
import { mapState } from "vuex";
import { calcPlayCountForTracks, calcPlayTimeForTracks } from "@/reducers";
import TopList from "@/components/TopList";

export default {
  name: "TopTracksList",
  props: {
    plays: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    useTrackLength: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    TopList,
  },
  computed: {
    ...mapState("tracks", ["tracks"]),
    topTracks() {
      return Object.entries(
        this.useTrackLength
          ? calcPlayTimeForTracks(this.plays, this.tracks)
          : calcPlayCountForTracks(this.plays)
      )
        .sort((t1, t2) => t2[1] - t1[1])
        .slice(0, 10);
    },
    listData() {
      return [...this.topTracks].map((tt) => {
        const track = this.tracks[tt[0]];
        const trackArtists = track?.track_artists
          .filter((a) => !a.hidden)
          .map((ta) => ta)
          .sort((a1, a2) => a1.order - a2.order)
          .map((a) => a.name)
          .join(" / ");
        const label = `${trackArtists} - ${track?.title}`;
        return {
          count: tt[1],
          label,
        };
      });
    },
  },
};
</script>

<style></style>
