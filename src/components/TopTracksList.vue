<template>
  <VCard class="pa-2">
    <VCardTitle> {{ title }}</VCardTitle>
    <TopList :list-data="listData" :show-length="useTrackLength" />
  </VCard>
</template>

<script>
// @ts-nocheck
import { mapState } from "pinia";
import TopList from "@/components/TopList.vue";
import { useTracksStore } from "../store/tracks";

export default {
  name: "TopTracksList",
  components: {
    TopList,
  },
  props: {
    playStats: {
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
  computed: {
    ...mapState(useTracksStore, ["tracks"]),
    useProp() {
      return this.useTrackLength ? "total_length" : "count";
    },
    topTracks() {
      return [...this.playStats]
        .sort((t1, t2) => t2[this.useProp] - t1[this.useProp])
        .slice(0, 10);
    },
    listData() {
      return [...this.topTracks].map((tt) => {
        const track = this.tracks[tt.track_id];
        const trackArtists = (track?.track_artists || [])
          .filter((a) => !a.hidden)
          .sort((a1, a2) => a1.order - a2.order)
          .map((a) => a.name)
          .join(" / ");
        const label = `${trackArtists} - ${track?.title}`;
        return {
          count: tt[this.useProp],
          label,
        };
      });
    },
  },
};
</script>

<style></style>
