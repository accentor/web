<template>
  <VCard class="pa-2">
    <VCardTitle> {{ title }}</VCardTitle>
    <ol class="top-list">
      <li v-for="(item, index) in listData" :key="index" class="top-item">
        <span class="top-item__text">
          <span class="top-item__position font-weight-medium">
            {{ index + 1 }}.
          </span>
          <span class="top-item__name">
            {{ item.trackArtists.filter((a) => !a.hidden).map((a) => a.name).join(" / ") }}
            - {{ item.title }}
          </span>
        </span>
        <div class="top-item__bg-wrapper">
          <div
            class="top-item__bg primary"
            :style="{ width: `${animatedWidths[index]}%` }"
          >
            <span
              class="top-item__count font-weight-medium white--text"
              v-if="useTrackLength"
            >
              {{ item.count | length }}
            </span>
            <span class="top-item__count font-weight-medium white--text" v-else>
              {{ item.count }}
            </span>
          </div>
        </div>
      </li>
    </ol>
  </VCard>
</template>

<script>
import { mapState } from "vuex";
import { calcPlayCountForTracks, calcPlayTimeForTracks } from "@/reducers";

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
  data() {
    return {
      animatedWidths: Array(10).fill(0),
    };
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
      const max = (this.topTracks[0] && this.topTracks[0][1]) || 0;
      return [...this.topTracks].map((tt) => {
        const track = this.tracks[tt[0]];
        return {
          count: tt[1],
          title: track?.title,
          width: (tt[1] * 100.0) / max,
          trackArtists:
            track?.track_artists
              .map((ta) => ta)
              .sort((a1, a2) => a1.order - a2.order) || [],
        };
      });
    },
  },
  watch: {
    listData() {
      setTimeout(() => {
        this.animatedWidths = this.listData.map((i) => i.width);
      }, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
.top-list {
  list-style: none;
  padding-left: 0;
}

.top-item {
  width: 100%;
  display: block;
  padding: 0.375rem 1rem;

  &__bg-wrapper {
    width: 100%;
    height: 2rem;
  }

  &__bg {
    height: 100%;
    border-radius: 0.5rem;
    transition-property: width;
    transition-timing-function: ease-in-out;
    transition-duration: 500ms;
  }

  &__text {
    display: flex;
    line-height: 1.2;
    margin-bottom: 0.125rem;
  }

  &__position {
    margin-right: 0.25rem;
  }

  &__count {
    float: right;
    padding: 0.25rem 0.5rem;
  }
}
</style>
