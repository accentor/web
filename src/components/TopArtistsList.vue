<template>
  <VCard class="pa-2">
    <VCardTitle>{{ title }}</VCardTitle>
    <TopList :list-data="listData" :show-length="useTrackLength" />
  </VCard>
</template>

<script>
// @ts-nocheck
import { mapState } from "pinia";
import { calcPlayStatsForArtists } from "@/reducers";
import TopList from "@/components/TopList.vue";
import { useArtistsStore } from "../store/artists";
import { useTracksStore } from "../store/tracks";
import artistSvgUrl from "@mdi/svg/svg/account-music.svg";

export default {
  name: "TopArtistsList",
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
    ...mapState(useArtistsStore, ["artists"]),
    ...mapState(useTracksStore, ["tracks"]),
    topTracks() {
      return Object.entries(
        calcPlayStatsForArtists(
          this.playStats,
          this.tracks,
          this.useTrackLength,
        ),
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
          image: artist?.image100 || artistSvgUrl,
        };
      });
    },
  },
};
</script>

<style></style>
