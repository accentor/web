<template>
  <VCard class="pa-2">
    <VCardTitle>{{ title }}</VCardTitle>
    <TopList :list-data="listData" :show-length="useTrackLength" />
  </VCard>
</template>

<script>
import { mapState } from "vuex";
import { calcPlayStatsForArtists } from "@/reducers";
import TopList from "@/components/TopList";

export default {
  name: "TopArtistsList",
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
  components: {
    TopList,
  },
  computed: {
    ...mapState("artists", ["artists"]),
    ...mapState("tracks", ["tracks"]),
    topTracks() {
      return Object.entries(
        calcPlayStatsForArtists(
          this.playStats,
          this.tracks,
          this.useTrackLength
        )
      )
        .sort((t1, t2) => t2[1] - t1[1])
        .slice(0, 10);
    },
    listData() {
      return [...this.topTracks].map((tt) => {
        const artist = this.artists[tt[0]];
        return {
          count: tt[1],
          label: artist?.name,
          image: artist?.image100 || require("@mdi/svg/svg/account-music.svg"),
        };
      });
    },
  },
};
</script>

<style></style>
