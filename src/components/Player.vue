<template>
  <div class="footer-container">
    <audio ref="audio" />
    <div class="tracks-list-container" v-if="open">
      <table class="tracks-list">
        <Draggable tag="tbody" @end="updatePlaylist">
          <tr
            v-for="(track, index) of playlistTracks"
            :key="track.id"
            class="track"
          >
            <td class="icon">
              <VBtn small icon text class="ma-2" @click="removeIndex(index)">
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
              <RouterLink
                :to="{ name: 'album', params: { id: track.album_id } }"
                >{{ albums[track.album_id].title }}</RouterLink
              >
            </td>
            <td class="text-right">{{ track.length | length }}</td>
            <td>
              <TrackArtists :track="track" />
            </td>
            <td>{{ albums[track.album_id].release }}</td>
          </tr>
        </Draggable>
      </table>
    </div>

    <VRow class="player-controls" align="center">
      <div class="flex player-left">
        <div class="content">
          <VBtn @click="prevTrack" class="not-on-small ma-2" icon small>
            <VIcon>mdi-skip-previous</VIcon>
          </VBtn>
          <VBtn @click="setPlaying(!playing)" icon class="ma-2">
            <VIcon large>{{ playing ? "mdi-pause" : "mdi-play" }}</VIcon>
          </VBtn>
          <VBtn @click="nextTrack" class="not-on-small ma-2" icon small>
            <VIcon>mdi-skip-next</VIcon>
          </VBtn>
        </div>
      </div>
      <div class="flex center">
        <div class="content">
          <div class="not-on-small">
            <VRow class="flex-column">
              <VSlider
                :always-dirty="!!currentTrack"
                :max="currentTrack ? currentTrack.length : 1"
                :value="seekTime"
                v-on:input="seek"
                hide-details
              />
            </VRow>
          </div>
          <VRow class="play-time flex-column">
            <span>
              {{ seekTime | length }} /
              {{ currentTrack ? currentTrack.length : 0 | length }}
            </span>
          </VRow>
        </div>
      </div>
      <div class="flex player-right">
        <div class="content">
          <VBtn
            @click="open = !open"
            icon
            :disabled="this.playlistTracks.length === 0"
            class="ma-2"
          >
            <VIcon>{{ open ? "mdi-chevron-down" : "mdi-chevron-up" }}</VIcon>
          </VBtn>
          <VSlider
            :readonly="muted"
            :prepend-icon="audioIcon"
            hide-details
            v-model="volume"
            class="not-on-small volume-slider ma-2"
            v-on:click:prepend="muted = !muted"
          />
          <VBtn @click="shuffle" icon class="ma-2">
            <VIcon>mdi-shuffle</VIcon>
          </VBtn>
          <VBtn
            :color="repeatModeColor"
            @click="nextRepeatMode"
            text
            icon
            class="ma-2"
          >
            <VIcon>{{ repeatModeIcon }}</VIcon>
          </VBtn>
        </div>
      </div>
    </VRow>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import Draggable from "vuedraggable";
import TrackArtists from "./TrackArtists";

export default {
  name: "Player",
  components: { Draggable, TrackArtists },
  data() {
    return {
      open: false,
      volume: 100,
      muted: false,
      intervalId: 0,
    };
  },
  created() {
    this.intervalId = setInterval(this.checkTime, 100);
    this.$nextTick(() =>
      this.$refs.audio.addEventListener("ended", () => {
        this.trackEnded();
      })
    );
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        this.prevTrack();
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        this.nextTrack();
      });
      navigator.mediaSession.setActionHandler("play", () => {
        this.setPlaying(true);
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        this.setPlaying(false);
      });
    }
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
    this.setPlaying(false);
  },
  watch: {
    currentTrackURL() {
      this.$refs.audio.src = this.currentTrackURL;
      if (this.playing) {
        this.$refs.audio
          .play()
          .then(() => {
            if ("mediaSession" in navigator) {
              navigator.mediaSession.metadata = new window.MediaMetadata({
                title: this.currentTrack.title,
                artist: this.currentTrack.track_artists
                  .map((a) => a.name)
                  .join(" / "),
                album: this.albums[this.currentTrack.album_id].title,
                artwork: [
                  {
                    src: this.albums[this.currentTrack.album_id].image100,
                    sizes: "100x100",
                    type: this.albums[this.currentTrack.album_id].image_type,
                  },
                  {
                    src: this.albums[this.currentTrack.album_id].image250,
                    sizes: "250x250",
                    type: this.albums[this.currentTrack.album_id].image_type,
                  },
                  {
                    src: this.albums[this.currentTrack.album_id].image500,
                    sizes: "500x500",
                    type: this.albums[this.currentTrack.album_id].image_type,
                  },
                ],
              });
            }
          })
          .catch((error) => {
            this.commit("addError", error);
          });
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
        this.$refs.audio
          .play()
          .then(() => {
            if ("mediaSession" in navigator) {
              navigator.mediaSession.playbackState = "playing";
            }
          })
          .catch((error) => {
            new Error(error);
          });
      } else {
        this.$refs.audio.pause();
        if ("mediaSession" in navigator) {
          navigator.mediaSession.playbackState = "paused";
        }
      }
    },
    playlistTracks() {
      if (this.playlistTracks.length === 0) {
        this.open = false;
      }
    },
  },
  computed: {
    ...mapState("albums", ["albums"]),
    ...mapState("artist", ["artists"]),
    ...mapState("player", [
      "playing",
      "seekTime",
      "doSeek",
      "current",
      "repeatMode",
    ]),
    ...mapGetters("player", [
      "playlistTracks",
      "currentTrack",
      "currentTrackURL",
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
          return "info";
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
    },
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
      "shuffle",
    ]),
    checkTime() {
      const time = Math.floor(this.$refs.audio.currentTime);
      if (time !== this.seekTime) {
        this.setSeekTime(time);
      }
    },
    updatePlaylist({ newIndex, oldIndex }) {
      this.$store.commit("player/updatePlaylist", { newIndex, oldIndex });
    },
  },
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

  .player-left {
    flex-shrink: 0;
    flex-grow: 2;

    .content {
      margin-right: auto;
      padding-left: 10px;
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
        width: 12rem;
        flex-grow: 0;
        padding-left: 30px;
        padding-right: 30px;
      }
    }
  }

  .player-right {
    flex-shrink: 0;
    flex-grow: 2;

    .content {
      margin-left: auto;
      padding-left: 20px;
      padding-right: 10px;
      justify-content: end;
      flex-direction: row-reverse;
      flex-grow: 1;

      .volume-slider {
        min-width: 100px;
        max-width: 250px;
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
