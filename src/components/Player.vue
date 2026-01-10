<template>
  <div v-click-outside="clickOutside" class="player">
    <GlobalEvents
      :filter="
        (event) =>
          !['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)
      "
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
          @end="updatePlaylist"
        >
          <template #item="{ element: track, index }">
            <tr>
              <td class="play-queue__cell play-queue__cell--icon">
                <VBtn size="small" icon variant="text" class="ma-2 handle">
                  <VIcon size="x-large">mdi-drag-horizontal-variant</VIcon>
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
                  {{ albums[track.album_id]?.title }}
                </RouterLink>
              </td>
              <td class="play-queue__cell text-right">
                {{ formatLength(track.length) }}
              </td>
              <td class="play-queue__cell">
                <TrackArtists :track="track" />
              </td>
              <td class="play-queue__cell">
                {{ albums[track.album_id]?.release }}
              </td>
              <td class="play-queue__cell play-queue__cell--icon">
                <VBtn
                  size="small"
                  icon
                  variant="text"
                  class="ma-2"
                  @click.stop.prevent="removeIndex(index)"
                >
                  <VIcon size="x-large">mdi-close</VIcon>
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
          :max="currentTrack?.length ?? 1"
          :disabled="!currentTrack || currentTrack.length === null"
          :model-value="seekTime"
          :step="1"
          hide-details
          @update:model-value="seek"
        />
        <span class="controls__time-display">
          {{ formatLength(seekTime) }} /
          {{ formatLength(currentTrack?.length ?? 0) }}
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

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watch,
} from "vue";
import { storeToRefs } from "pinia";
import Draggable from "vuedraggable";
import { GlobalEvents } from "vue-global-events";
import TrackArtists from "./TrackArtists.vue";
import { useAlbumsStore } from "@/store/albums";
import { usePlaysStore } from "@/store/plays";
import { usePlayerStore } from "@/store/player";
import { type ApiError, useErrorsStore } from "@/store/errors";
import { formatLength } from "@/util";

const albumsStore = useAlbumsStore();
const errorsStore = useErrorsStore();
const playerStore = usePlayerStore();
const playsStore = usePlaysStore();

const volume = ref(100);
const muted = ref(false);
const intervalId = setInterval(checkTime, 100);
const tries = ref(0);
const audio = useTemplateRef("audio");
const {
  current,
  currentTrack,
  currentTrackURL,
  doSeek,
  playing,
  playlistTracks,
  seekTime,
} = storeToRefs(playerStore);
const { albums } = storeToRefs(albumsStore);

const open = ref(false);
function clickOutside(): void {
  open.value = false;
}

const repeatModeIcon = computed(() => {
  switch (playerStore.repeatMode) {
    case "single":
      return "mdi-repeat-once";
    case "off":
    case "all":
    default:
      return "mdi-repeat";
  }
});

const repeatModeColor = computed(() => {
  switch (playerStore.repeatMode) {
    case "single":
    case "all":
      return "info";
    case "off":
    default:
      return undefined;
  }
});

const audioIcon = computed(() => {
  if (muted.value) {
    return "mdi-volume-off";
  } else if (volume.value < 33) {
    return "mdi-volume-low";
  } else if (volume.value < 66) {
    return "mdi-volume-medium";
  }
  return "mdi-volume-high";
});

watch(
  () => currentTrackURL,
  async () => {
    tries.value = 0;
    if (!currentTrackURL.value || !audio.value) {
      return;
    }

    audio.value.src = currentTrackURL.value;
    if (playing.value) {
      try {
        await audio.value.play();
        if ("mediaSession" in navigator) {
          const track = currentTrack.value!;
          const album = albumsStore.albums[track.album_id]!;
          navigator.mediaSession.metadata = new MediaMetadata({
            title: track.title,
            artist: [...track.track_artists]
              .sort((a1, a2) => a2.order - a1.order)
              .map((a) => a.name)
              .join(" / "),
            album: album.title,
            artwork: [
              {
                src: album.image100 ?? "",
                sizes: "100x100",
                type: album.image_type ?? undefined,
              },
              {
                src: album.image250 ?? "",
                sizes: "250x250",
                type: album.image_type ?? undefined,
              },
              {
                src: album.image500 ?? "",
                sizes: "500x500",
                type: album.image_type ?? undefined,
              },
            ],
          });
        }
      } catch (error) {
        errorsStore.addError(error as ApiError);
      }
    }
  },
);

watch(volume, () => (audio.value!.volume = volume.value / 100));
watch(muted, () => (audio.value!.muted = muted.value));
watch(doSeek, () => {
  if (doSeek.value) {
    playerStore.setDoSeek();
    if (Number.isFinite(seekTime.value)) {
      audio.value!.currentTime = seekTime.value;
      if (playing.value) {
        audio.value!.play();
      }
    }
  }
});
watch(playing, async () => {
  if (playing.value) {
    try {
      await audio.value!.play();
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "playing";
      }
    } catch (error) {
      errorsStore.addError(error as ApiError);
    }
  } else {
    audio.value!.pause();
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = "paused";
    }
  }
});

watch(playlistTracks, () => {
  if (playlistTracks.value.length === 0) {
    open.value = false;
  }
});

onMounted(() => {
  audio.value!.addEventListener("ended", () => {
    playsStore.create(currentTrack.value!.id);
    playerStore.trackEnded();
  });
});

if ("mediaSession" in navigator) {
  navigator.mediaSession.setActionHandler("previoustrack", prevTrack);
  navigator.mediaSession.setActionHandler("nexttrack", nextTrack);
  navigator.mediaSession.setActionHandler("play", () =>
    playerStore.setPlaying(true),
  );
  navigator.mediaSession.setActionHandler("pause", () =>
    playerStore.setPlaying(false),
  );
}

onBeforeUnmount(() => {
  clearInterval(intervalId);
  playerStore.setPlaying(false);
});

function checkTime(): void {
  const time = Math.floor(audio.value!.currentTime);
  if (currentTrack.value && time != seekTime.value) {
    playerStore.setSeekTime(time);
  }
}

function onAudioError(): void {
  if (!playing.value || audio.value!.networkState !== 3) {
    return;
  }

  if (tries.value >= 2) {
    nextTrack();
    errorsStore.addError({ playlist: ["player.track-skipped"] });
  } else {
    tries.value += 1;
    setTimeout(() => audio.value!.play(), tries.value * 500);
  }
}

function prevTrack(): void {
  playerStore.prevTrack();
}

function nextTrack(): void {
  playerStore.nextTrack();
}

function togglePlaying(): void {
  playerStore.togglePlaying();
}

function updatePlaylist({
  newIndex,
  oldIndex,
}: {
  newIndex: number;
  oldIndex: number;
}): void {
  playerStore.updatePlaylist(newIndex, oldIndex);
}

function setCurrent(index: number): void {
  playerStore.setCurrent(index);
}

function removeIndex(index: number): void {
  playerStore.removeIndex(index);
}

function seek(newTime: number): void {
  playerStore.seek(newTime);
}

function nextRepeatMode(): void {
  playerStore.nextRepeatMode();
}

function shuffle(): void {
  playerStore.shuffle();
}
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
