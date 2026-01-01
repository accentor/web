<template>
  <div v-click-outside="clickOutside" class="player">
    <GlobalEvents
      :filter="(event) => !['INPUT', 'TEXTAREA'].includes(event.target.tagName)"
      @keydown.space.prevent="togglePlaying"
    />
    <audio ref="audio" @error="onAudioError" />
    <div v-if="open" class="play-queue">
      <table class="play-queue__table">
        <Draggable
          :model-value="playlistTracks"
          tag="tbody"
          handle=".handle"
          item-key="id"
          @end="({ newIndex, oldIndex }) => updatePlaylist(newIndex, oldIndex)"
        >
          <template #item="{ element: track, index }">
            <tr>
              <td class="play-queue__cell play-queue__cell--icon">
                <VBtn size="small" icon variant="text" class="ma-2 handle">
                  <VIcon>mdi-drag-horizontal-variant</VIcon>
                </VBtn>
              </td>
              <td class="play-queue__cell play-queue__cell--icon-small">
                <VIcon v-if="index === current">mdi-volume-high</VIcon>
              </td>
              <td class="pl-3 play-queue__cell">
                <a @click.stop.prevent="setCurrent(index)">{{ track.title }}</a>
              </td>
              <td class="play-queue__cell">
                <RouterLink
                  :to="{ name: 'album', params: { id: track.album_id } }"
                >
                  {{ albums[track.album_id].title }}
                </RouterLink>
              </td>
              <td class="play-queue__cell text-right">
                {{ $filters.length(track.length) }}
              </td>
              <td class="play-queue__cell">
                <TrackArtists :track="track" />
              </td>
              <td class="play-queue__cell">
                {{ albums[track.album_id].release }}
              </td>
              <td class="play-queue__cell play-queue__cell--icon">
                <VBtn
                  size="small"
                  icon
                  variant="text"
                  class="ma-2"
                  @click.stop.prevent="removeIndex(index)"
                >
                  <VIcon>mdi-close</VIcon>
                </VBtn>
              </td>
            </tr>
          </template>
        </Draggable>
      </table>
    </div>

    <VRow class="controls" align="center">
      <div class="controls__left">
        <VBtn
          :disabled="!playlistTracks.length || current === -1"
          class="controls__button controls__button--sm-and-up"
          icon
          size="small"
          variant="text"
          @click="prevTrack"
        >
          <VIcon>mdi-skip-previous</VIcon>
        </VBtn>
        <VBtn
          :disabled="!playlistTracks.length"
          icon
          variant="text"
          class="controls__button"
          @click="togglePlaying"
        >
          <VIcon size="large">{{ playing ? "mdi-pause" : "mdi-play" }}</VIcon>
        </VBtn>
        <VBtn
          :disabled="
            !playlistTracks.length ||
            current === playlistTracks.length - 1 ||
            current === -1
          "
          class="controls__button controls__button--sm-and-up"
          icon
          size="small"
          variant="text"
          @click="nextTrack"
        >
          <VIcon>mdi-skip-next</VIcon>
        </VBtn>
      </div>
      <div class="controls__time">
        <VSlider
          class="controls__time-slider"
          :always-dirty="!!currentTrack"
          :max="currentTrack ? currentTrack.length : 1"
          :disabled="!currentTrack || currentTrack.length === null"
          :model-value="seekTime"
          :step="1"
          hide-details
          @update:model-value="seek"
        />
        <span class="controls__time-display">
          {{ $filters.length(seekTime) }} /
          {{ $filters.length(currentTrack ? currentTrack.length : 0) }}
        </span>
      </div>
      <div class="controls__right">
        <VBtn
          :color="repeatModeColor"
          variant="text"
          icon
          class="controls__button"
          @click="nextRepeatMode"
        >
          <VIcon>{{ repeatModeIcon }}</VIcon>
        </VBtn>
        <VBtn icon variant="text" class="controls__button" @click="shuffle">
          <VIcon>mdi-shuffle</VIcon>
        </VBtn>
        <VSlider
          v-model="volume"
          :readonly="muted"
          :prepend-icon="audioIcon"
          hide-details
          class="controls__volume-slider"
          @click:prepend="muted = !muted"
        />
        <VBtn
          icon
          variant="text"
          :disabled="playlistTracks.length === 0"
          class="controls__button"
          @click="open = !open"
        >
          <VIcon>{{ open ? "mdi-chevron-down" : "mdi-chevron-up" }}</VIcon>
        </VBtn>
      </div>
    </VRow>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import Draggable from "vuedraggable";
import { GlobalEvents } from "vue-global-events";
import TrackArtists from "./TrackArtists.vue";
import { useArtistsStore } from "../store/artists";
import { useAlbumsStore } from "../store/albums";
import { usePlaysStore } from "../store/plays";
import { usePlayerStore } from "../store/player";
import { useErrorsStore } from "../store/errors";

export default {
  name: "Player",
  components: { Draggable, GlobalEvents, TrackArtists },
  data() {
    return {
      open: false,
      volume: 100,
      muted: false,
      intervalId: 0,
      tries: 0,
    };
  },
  computed: {
    ...mapState(useAlbumsStore, ["albums"]),
    ...mapState(useArtistsStore, ["artists"]),
    ...mapState(usePlayerStore, [
      "playing",
      "seekTime",
      "doSeek",
      "current",
      "repeatMode",
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
  watch: {
    async currentTrackURL() {
      this.tries = 0;
      if (this.currentTrackURL === null) {
        return;
      }

      this.$refs.audio.src = this.currentTrackURL;
      if (this.playing) {
        try {
          await this.$refs.audio.play();
          if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new window.MediaMetadata({
              title: this.currentTrack.title,
              artist: [...this.currentTrack.track_artists]
                .sort((a1, a2) => a1.order - a2.order)
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
        } catch (error) {
          this.addError(error);
        }
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
        usePlayerStore().setDoSeek();
        if (Number.isFinite(this.seekTime)) {
          this.$refs.audio.currentTime = this.seekTime;
          if (this.playing) {
            this.$refs.audio.play();
          }
        }
      }
    },
    async playing() {
      if (this.playing) {
        try {
          await this.$refs.audio.play();
          if ("mediaSession" in navigator) {
            navigator.mediaSession.playbackState = "playing";
          }
        } catch (error) {
          this.commit("addError", error);
        }
      } else {
        await this.$refs.audio.pause();
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
  created() {
    this.intervalId = setInterval(this.checkTime, 100);
    this.$nextTick(() =>
      this.$refs.audio.addEventListener("ended", () => {
        this.createPlay(this.currentTrack.id);
        this.trackEnded();
      }),
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
  beforeUnmount() {
    clearInterval(this.intervalId);
    this.setPlaying(false);
  },
  methods: {
    ...mapActions(useErrorsStore, ["addError"]),
    ...mapActions(usePlaysStore, { createPlay: "create" }),
    ...mapActions(usePlayerStore, [
      "togglePlaying",
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
      "updatePlaylist",
    ]),
    checkTime() {
      const time = Math.floor(this.$refs.audio.currentTime);
      if (this.currentTrack && time !== this.seekTime) {
        this.setSeekTime(time);
      }
    },
    onAudioError(event) {
      if (!this.playing || event.srcElement.networkState !== 3) {
        return null;
      }

      if (this.tries >= 2) {
        this.nextTrack();
        this.addError({ playlist: ["player.track-skipped"] });
      } else {
        this.tries += 1;
        setTimeout(() => this.$refs.audio.play(), this.tries * 500);
      }
    },
    clickOutside() {
      this.open = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@use "sass:map";
@use "vuetify/settings";

.player {
  width: 100%;
  border-top: solid thin rgba(0, 0, 0, 0.12);
}

.controls {
  margin-top: 0;
  margin-bottom: 0;

  &__left {
    display: flex;
    flex-shrink: 0;
    flex-grow: 1;
    justify-content: flex-start;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
    margin-right: auto;
    @media #{map.get(settings.$display-breakpoints, "md-and-up")} {
      padding-right: 20px;
    }
  }

  &__button {
    margin: 4px;

    @media #{map.get(settings.$display-breakpoints, "md-and-up")} {
      margin: 8px;
    }

    &--sm-and-up {
      display: none;
      @media #{map.get(settings.$display-breakpoints, "sm-and-up")} {
        display: unset;
      }
    }
  }

  &__time {
    display: flex;
    flex-grow: 3;
    justify-content: center;
    align-items: center;
  }

  &__time-slider {
    padding-right: 10px;

    @media #{map.get(settings.$display-breakpoints, "xs")} {
      display: none;
    }

    @media #{map.get(settings.$display-breakpoints, "md-and-up")} {
      padding-right: 20px;
    }
  }

  &__time-display {
    min-width: 6rem;
    flex-grow: 0;

    @media #{map.get(settings.$display-breakpoints, "md-and-up")} {
      width: 9rem;
    }
  }

  &__right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-grow: 1;
    flex-shrink: 0;
    margin-left: auto;
    padding-left: 10px;
    padding-right: 10px;
    @media #{map.get(settings.$display-breakpoints, "md-and-up")} {
      padding-left: 20px;
    }
  }

  &__volume-slider {
    margin: 4px;
    min-width: 50px;
    max-width: 250px;

    @media #{map.get(settings.$display-breakpoints, "xs")} {
      display: none;
    }

    @media #{map.get(settings.$display-breakpoints, "md-and-up")} {
      margin: 8px;
      min-width: 100px;
    }
  }
}

.play-queue {
  max-height: 50vh;
  overflow-y: auto;
  border-bottom: solid thin rgba(0, 0, 0, 0.12);
  width: 100%;
  padding-right: 0.5rem;

  &__table {
    width: 100%;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  &__cell {
    padding: 0 24px;

    &--icon {
      width: 44px;
      max-width: 44px;
      padding-left: 0;
      padding-right: 0;
    }
    &--icon-small {
      width: 24px;
      max-width: 24px;
      padding-left: 0;
      padding-right: 0;
    }
  }
}
</style>
