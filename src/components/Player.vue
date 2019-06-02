<template>
  <div class="footer-container">
    <audio ref="audio" />
    <div class="tracks-list-container" v-if="open">
      <table class="tracks-list">
        <tr
          v-for="(track, index) of playlistTracks"
          :key="track.id"
          class="track"
        >
          <td class="icon">
            <VBtn small icon flat @click="removeIndex(index)">
              <VIcon>mdi-close</VIcon>
            </VBtn>
          </td>
          <td class="icon">
            <VIcon v-if="index === current">mdi-volume-high</VIcon>
          </td>
          <td>
            <a @click.stop.prevent="setCurrent(index)">{{ track.title }}</a>
          </td>
          <td>
            <RouterLink :to="{ name: 'album', params: { id: track.album_id } }">
              {{ albums[track.album_id].title }}
            </RouterLink>
          </td>
          <td class="text-xs-right">
            {{ track.length | length }}
          </td>
          <td>
            <TrackArtists :track="track" />
          </td>
          <td>
            {{ albums[track.album_id].release }}
          </td>
        </tr>
      </table>
    </div>

    <VLayout class="player-controls" row align-center>
      <div class="flex left">
        <div class="content">
          <VBtn @click="prevTrack" class="not-on-small" icon small>
            <VIcon>mdi-skip-previous</VIcon>
          </VBtn>
          <VBtn @click="setPlaying(!playing)" icon>
            <VIcon large>
              {{ playing ? "mdi-pause" : "mdi-play" }}
            </VIcon>
          </VBtn>
          <VBtn @click="nextTrack" class="not-on-small" icon small>
            <VIcon>mdi-skip-next</VIcon>
          </VBtn>
        </div>
      </div>
      <div class="flex center">
        <div class="content">
          <div class="not-on-small">
            <VLayout column>
              <VSlider
                :always-dirty="!!currentTrack"
                :max="currentTrack ? currentTrack.length : 1"
                :value="seekTime"
                v-on:input="seek"
              />
            </VLayout>
          </div>
          <VLayout class="play-time" column>
            <span>
              {{ seekTime | length }} /
              {{ currentTrack ? currentTrack.length : 0 | length }}
            </span>
          </VLayout>
        </div>
      </div>
      <div class="flex right">
        <div class="content">
          <VBtn :color="repeatModeColor" @click="nextRepeatMode" flat icon>
            <VIcon>{{ repeatModeIcon }}</VIcon>
          </VBtn>
          <VBtn @click="shuffle" icon>
            <VIcon>mdi-shuffle</VIcon>
          </VBtn>
          <VSlider
            :readonly="muted"
            :prepend-icon="audioIcon"
            v-model="volume"
            class="not-on-small"
            id="volumeSlider"
            v-on:click:prepend="muted = !muted"
          />
          <VBtn
            @click="open = !open"
            icon
            :disabled="this.playlistTracks.length === 0"
          >
            <VIcon>{{ open ? "mdi-chevron-down" : "mdi-chevron-up" }}</VIcon>
          </VBtn>
        </div>
      </div>
    </VLayout>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import TrackArtists from "./TrackArtists";

export default {
  name: "Player",
  components: { TrackArtists },
  data() {
    return {
      open: false,
      volume: 100,
      muted: false,
      intervalId: 0
    };
  },
  created() {
    this.intervalId = setInterval(this.checkTime, 100);
    setTimeout(() =>
      this.$refs.audio.addEventListener("ended", () => {
        this.trackEnded();
      })
    );
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
    this.setPlaying(false);
  },
  watch: {
    currentTrackURL() {
      this.$refs.audio.src = this.currentTrackURL;
      if (this.playing) {
        this.$refs.audio.play();
      }
    },
    volume() {
      this.$refs.audio.volume = this.volume / 100;
    },
    muted() {
      this.$refs.audio.muted = this.muted;
    },
    doSeek() {
      if (this.doSeek) {
        this.$store.commit("player/setDoSeek");
        this.$refs.audio.currentTime = this.seekTime;
        if (this.playing) {
          this.$refs.audio.play();
        }
      }
    },
    playing() {
      if (this.playing) {
        this.$refs.audio.play();
      } else {
        this.$refs.audio.pause();
      }
    },
    playlistTracks() {
      if (this.playlistTracks.length === 0) {
        this.open = false;
      }
    }
  },
  computed: {
    ...mapState("albums", ["albums"]),
    ...mapState("artist", ["artists"]),
    ...mapState("player", [
      "playing",
      "seekTime",
      "doSeek",
      "current",
      "repeatMode"
    ]),
    ...mapGetters("player", [
      "playlistTracks",
      "currentTrack",
      "currentTrackURL"
    ]),
    repeatModeIcon() {
      switch (this.repeatMode) {
        case "off":
        case "all":
          return "mdi-repeat";
        case "single":
          return "mdi-repeat-once";
        default:
          return "mdi-repeat";
      }
    },
    repeatModeColor() {
      switch (this.repeatMode) {
        case "off":
          return undefined;
        case "all":
        case "single":
          return "blue";
        default:
          return undefined;
      }
    },
    audioIcon() {
      if (this.muted) {
        return "mdi-volume-off";
      } else if (this.volume < 33) {
        return "mdi-volume-low";
      } else if (this.volume < 66) {
        return "mdi-volume-medium";
      }
      return "mdi-volume-high";
    }
  },
  methods: {
    ...mapMutations("player", [
      "setSeekTime",
      "seek",
      "setPlaying",
      "setCurrent",
      "removeIndex",
      "nextTrack",
      "prevTrack",
      "trackEnded",
      "nextRepeatMode",
      "shuffle"
    ]),
    checkTime() {
      const time = Math.floor(this.$refs.audio.currentTime);
      if (time !== this.seekTime) {
        this.setSeekTime(time);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.footer-container {
  width: 100%;
  border-top: solid thin rgba(0, 0, 0, 0.12);
}

.player-controls {
  .flex {
    flex: 1;
    display: flex;
    justify-content: center;

    > .content {
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }

    .not-on-small {
      @media (max-width: 750px) {
        display: none;
      }
    }
  }

  .left {
    flex-shrink: 0;
    flex-grow: 2;

    .content {
      margin-right: auto;
      padding-right: 20px;
    }
  }

  .center {
    flex-grow: 3;

    .content {
      flex-grow: 1;

      .not-on-small {
        flex: 1;
      }

      .play-time {
        width: 8rem;
        flex-grow: 0;
        padding-left: 10px;
        padding-right: 10px;
      }
    }
  }

  .right {
    flex-shrink: 0;
    flex-grow: 2;

    .content {
      margin-left: auto;
      padding-left: 20px;

      #volumeSlider {
        min-width: 100px;
      }
    }
  }
}

.tracks-list-container {
  max-height: 50vh;
  overflow-y: auto;
  border-bottom: solid thin rgba(0, 0, 0, 0.12);
  width: 100%;
  padding-right: 0.5rem;

  .tracks-list {
    width: 100%;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;

    td {
      padding: 0 24px;
    }

    .track .icon {
      width: 40px;
      max-width: 40px;
    }
  }
}
</style>
