<template>
  <VCard class="pa-2">
    <VRow>
      <VCol>
        <VCardTitle>{{ title }}</VCardTitle>
      </VCol>
      <VCol class="d-flex justify-end">
        <VSwitch
          v-model="useAverage"
          :label="$t('stats.useAverage')"
          class="mr-4"
        />
      </VCol>
    </VRow>
    <TopList
      :list-data="listData"
      :show-length="!useAverage && useTrackLength"
    />
  </VCard>
</template>

<script>
import { mapState } from "pinia";
import { calcPlayCountForAlbums, calcPlayTimeForAlbums } from "@/reducers";
import TopList from "@/components/TopList.vue";
import { useAlbumsStore } from "../store/albums";
import { useTracksStore } from "../store/tracks";
import albumSvgUrl from "@mdi/svg/svg/album.svg";

export default {
  name: "TopAlbumsList",
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
  data() {
    return {
      useAverage: true,
    };
  },
  computed: {
    ...mapState(useAlbumsStore, ["albums"]),
    ...mapState(useTracksStore, ["tracks"]),
    topAlbums() {
      return Object.entries(
        this.useTrackLength
          ? calcPlayTimeForAlbums(this.playStats, this.tracks, this.useAverage)
          : calcPlayCountForAlbums(
              this.playStats,
              this.tracks,
              this.useAverage,
            ),
      )
        .sort((a1, a2) => a2[1] - a1[1])
        .slice(0, 10);
    },
    listData() {
      return [...this.topAlbums].map((tt) => {
        const album = this.albums[tt[0]];
        const albumArtists = [...(album?.album_artists || [])]
          .sort((a1, a2) => a1.order - a2.order)
          .map((a) => a.name)
          .join(" / ");
        return {
          count: this.useAverage ? tt[1].toFixed(2) : tt[1],
          label: `${albumArtists} - ${album?.title}`,
          image: album?.image100 || albumSvgUrl,
        };
      });
    },
  },
};
</script>

<style></style>
