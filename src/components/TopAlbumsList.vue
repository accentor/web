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
import { mapState } from "vuex";
import { calcPlayCountForAlbums, calcPlayTimeForAlbums } from "@/reducers";
import TopList from "@/components/TopList";

export default {
  name: "TopAlbumsList",
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
  data() {
    return {
      useAverage: true,
    };
  },
  components: {
    TopList,
  },
  computed: {
    ...mapState("albums", ["albums"]),
    ...mapState("tracks", ["tracks"]),
    topAlbums() {
      return Object.entries(
        this.useTrackLength
          ? calcPlayTimeForAlbums(this.plays, this.tracks, this.useAverage)
          : calcPlayCountForAlbums(this.plays, this.tracks, this.useAverage)
      )
        .sort((a1, a2) => a2[1] - a1[1])
        .slice(0, 10);
    },
    listData() {
      return [...this.topAlbums].map((tt) => {
        const album = this.albums[tt[0]];
        const albumArtists = album?.album_artists
          .map((aa) => aa)
          .sort((a1, a2) => a1.order - a2.order)
          .map((a) => a.name)
          .join(" / ");
        return {
          count: this.useAverage ? tt[1].toFixed(2) : tt[1],
          label: `${albumArtists} - ${album?.title}`,
          image: album?.image100 || require("@mdi/svg/svg/album.svg"),
        };
      });
    },
  },
};
</script>

<style></style>
