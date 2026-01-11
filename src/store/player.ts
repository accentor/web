import { defineStore } from "pinia";
import { baseURL } from "@/api";
import { useAuthStore } from "./auth";
import { useUserSettingsStore } from "./user_settings";
import { useTracksStore } from "./tracks";
import { computed, type ComputedRef, ref, type Ref } from "vue";
import { type Track } from "@accentor/api-client-js";

const repeatModes: ("off" | "all" | "single")[] = ["off", "all", "single"];

export const usePlayerStore = defineStore("player", () => {
  const authStore = useAuthStore();
  const tracksStore = useTracksStore();
  const userSettingsStore = useUserSettingsStore();

  const playlist: Ref<number[]> = ref([]);
  const playlistTracks: ComputedRef<Track[]> = computed(() =>
    playlist.value
      .map((id) => tracksStore.tracks[id])
      .filter((t) => t)
      .map((t) => t!),
  );
  const current: Ref<number> = ref(-1);
  const currentTrack: ComputedRef<Track | null> = computed(() =>
    current.value >= 0 ? playlistTracks.value[current.value]! : null,
  );
  const currentTrackURL: ComputedRef<string | null> = computed(() => {
    const apiToken = authStore.apiToken;
    const codecConversion = userSettingsStore.codecConversion?.id ?? "";
    const params = `/audio?token=${apiToken}&codec_conversion_id=${codecConversion}`;
    const tracks = `${baseURL}/tracks/`;
    return currentTrack.value && `${tracks}${currentTrack.value.id}${params}`;
  });
  const playing: Ref<boolean> = ref(false);
  const doSeek: Ref<boolean> = ref(false);
  const repeatMode: Ref<"off" | "all" | "single"> = ref("off");
  const seekTime: Ref<number> = ref(0);

  function setSeekTime(time: number): void {
    seekTime.value = time;
  }

  function playTrack(id: number): void {
    playlist.value.length = 0;
    playlist.value.push(id);
    current.value = 0;
    seekTime.value = 0;
    doSeek.value = true;
    playing.value = true;
  }

  function playTracks(ids: number[]): void {
    playlist.value = ids;
    current.value = 0;
    seekTime.value = 0;
    doSeek.value = true;
    playing.value = true;
  }

  function addTrack(id: number): void {
    playlist.value.push(id);
  }

  function addTracks(ids: number[]): void {
    playlist.value.push(...ids);
  }

  function updatePlaylist(newIndex: number, oldIndex: number): void {
    if (current.value === oldIndex) {
      current.value = newIndex;
    } else if (current.value > oldIndex && current.value <= newIndex) {
      current.value -= 1;
    } else if (current.value < oldIndex && current.value >= newIndex) {
      current.value += 1;
    }
    playlist.value.splice(newIndex, 0, playlist.value.splice(oldIndex, 1)[0]!);
  }

  function setDoSeek(): void {
    doSeek.value = false;
  }

  function setCurrent(index: number): void {
    current.value = index;
    seekTime.value = 0;
    playing.value = true;
    doSeek.value = true;
  }

  function removeIndex(index: number): void {
    if (index === current.value) {
      current.value = -1;
      playing.value = false;
      seekTime.value = 0;
    } else if (index < current.value) {
      current.value -= 1;
    }
    playlist.value.splice(index, 1);
  }

  function seek(time: number): void {
    seekTime.value = time;
    doSeek.value = true;
  }

  function setPlaying(val: boolean): void {
    if (playlist.value.length) {
      if (current.value === -1) {
        current.value = 0;
      }
      playing.value = val;
    }
  }

  function togglePlaying(): void {
    setPlaying(!playing.value);
  }

  function nextTrack(): void {
    current.value += 1;
    if (current.value >= playlist.value.length) {
      if (repeatMode.value === "all") {
        current.value = 0;
        seekTime.value = 0;
        doSeek.value = true;
      } else {
        current.value = -1;
        playing.value = false;
        seekTime.value = 0;
      }
    } else {
      seekTime.value = 0;
      doSeek.value = true;
    }
  }

  function prevTrack(): void {
    if (seekTime.value > 5) {
      seekTime.value = 0;
      doSeek.value = true;
    } else {
      current.value -= 1;
      if (current.value < 0) {
        if (repeatMode.value === "all") {
          current.value = playlist.value.length - 1;
          seekTime.value = 0;
          doSeek.value = true;
        } else {
          current.value = 0;
          seekTime.value = 0;
          doSeek.value = true;
        }
      } else {
        seekTime.value = 0;
        doSeek.value = true;
      }
    }
  }

  function trackEnded(): void {
    if (repeatMode.value === "single") {
      seekTime.value = 0;
      doSeek.value = true;
    } else {
      nextTrack();
    }
  }

  function nextRepeatMode(): void {
    const currentIndex = repeatModes.indexOf(repeatMode.value);
    repeatMode.value = repeatModes[(currentIndex + 1) % repeatModes.length]!;
  }

  function shuffle(): void {
    const newPlaylist: number[] = [];
    if (current.value >= 0) {
      newPlaylist.push(playlist.value[current.value]!);
      playlist.value.splice(current.value, 1);
      current.value = 0;
    }
    while (playlist.value.length > 0) {
      const index = Math.floor(Math.random() * playlist.value.length);
      newPlaylist.push(playlist.value[index]!);
      playlist.value.splice(index, 1);
    }
    playlist.value = newPlaylist;
  }

  return {
    playlist,
    playlistTracks,
    current,
    currentTrack,
    currentTrackURL,
    playing,
    doSeek,
    repeatMode,
    seekTime,
    setSeekTime,
    playTrack,
    playTracks,
    addTrack,
    addTracks,
    updatePlaylist,
    setDoSeek,
    setCurrent,
    removeIndex,
    seek,
    setPlaying,
    togglePlaying,
    nextTrack,
    prevTrack,
    trackEnded,
    nextRepeatMode,
    shuffle,
  };
});
