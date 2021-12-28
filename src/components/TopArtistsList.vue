<template>
  <VCard class="pa-2">
    <VCardTitle>{{ title }}</VCardTitle>
    <ol class="top-list">
      <li v-for="(item, index) in listData" :key="index" class="top-item">
        <VImg :src="item.image" class="top-item__cover" />
        <div class="top-item__stat">
          <span class="top-item__text">
            <span class="top-item__position font-weight-medium">
              {{ index + 1 }}.
            </span>
            <span class="top-item__name">
              {{ item.name }}
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
              <span
                class="top-item__count font-weight-medium white--text"
                v-else
              >
                {{ item.count }}
              </span>
            </div>
          </div>
        </div>
      </li>
    </ol>
  </VCard>
</template>

<script>
import { mapState } from "vuex";
import { calcPlayCountForArtists, calcPlayTimeForArtists } from "@/reducers";

export default {
  name: "TopArtistsList",
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
    ...mapState("artists", ["artists"]),
    ...mapState("tracks", ["tracks"]),
    topTracks() {
      return Object.entries(
        this.useTrackLength
          ? calcPlayTimeForArtists(this.plays, this.tracks)
          : calcPlayCountForArtists(this.plays, this.tracks)
      )
        .sort((t1, t2) => t2[1] - t1[1])
        .slice(0, 10);
    },
    listData() {
      const max = (this.topTracks[0] && this.topTracks[0][1]) || 0;
      return [...this.topTracks].map((tt) => {
        const artist = this.artists[tt[0]];
        return {
          count: tt[1],
          name: artist?.name,
          width: (tt[1] * 100.0) / max,
          image: artist?.image100 || require("@mdi/svg/svg/account-music.svg"),
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
  display: flex;
  align-items: center;
  padding: 0.375rem 1rem;

  &__cover {
    flex-grow: 0;
    object-fit: cover;
    height: 6rem;
    width: 6rem;
    margin-right: 1rem;
  }

  &__stat {
    flex-grow: 1;
  }
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
