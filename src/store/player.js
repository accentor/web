import { defineStore } from "pinia";
import { baseURL } from "@/api";
import { useAuthStore } from "./auth";
import { useUserSettingsStore } from "./user_settings";
import { useTracksStore } from "./tracks";
import { computed, ref } from "vue";

const repeatModes = ["off", "all", "single"];

export const usePlayerStore = defineStore("player", () => {
  const authStore = useAuthStore();
  const tracksStore = useTracksStore();
  const userSettingsStore = useUserSettingsStore();

  const playlist = ref([]);
  const playlistTracks = computed(() =>
    playlist.value.map((id) => tracksStore.tracks[id]).filter((t) => t),
  );
  const current = ref(-1);
  const currentTrack = computed(() =>
    current.value >= 0 ? playlistTracks.value[current.value] : null,
  );
  const currentTrackURL = computed(() => {
    const apiToken = authStore.apiToken;
    const codecConversion = userSettingsStore.codecConversion?.id ?? "";
    const params = `/audio?token=${apiToken}&codec_conversion_id=${codecConversion}`;
    const tracks = `${baseURL}/tracks/`;
    return currentTrack.value && `${tracks}${currentTrack.value.id}${params}`;
  });
  const playing = ref(false);
  const doSeek = ref(false);
  const repeatMode = ref("off");
  const seekTime = ref(0);

  function setSeekTime(time) {
    seekTime.value = time;
  }

  function playTrack(id) {
    playlist.value.length = 0;
    playlist.value.push(id);
    current.value = 0;
    seekTime.value = 0;
    doSeek.value = true;
    playing.value = true;
  }

  function playTracks(ids) {
    playlist.value = ids;
    current.value = 0;
    seekTime.value = 0;
    doSeek.value = true;
    playing.value = true;
  }

  function addTrack(id) {
    playlist.value.push(id);
  }

  function addTracks(ids) {
    playlist.value.push(...ids);
  }

  function updatePlaylist(newIndex, oldIndex) {
    if (current.value === oldIndex) {
      current.value = newIndex;
    } else if (current.value > oldIndex && current.value <= newIndex) {
      current.value -= 1;
    } else if (current.value < oldIndex && current.value >= newIndex) {
      current.value += 1;
    }
    playlist.value.splice(newIndex, 0, playlist.value.splice(oldIndex, 1)[0]);
  }

  function setDoSeek() {
    doSeek.value = false;
  }

  function setCurrent(index) {
    current.value = index;
    seekTime.value = 0;
    playing.value = true;
    doSeek.value = true;
  }

  function removeIndex(index) {
    if (index === current.value) {
      current.value = -1;
      playing.value = false;
      seekTime.value = 0;
    } else if (index < current.value) {
      current.value -= 1;
    }
    playlist.value.splice(index, 1);
  }

  function seek(time) {
    seekTime.value = time;
    doSeek.value = true;
  }

  function setPlaying(val) {
    if (playlist.value.length) {
      if (current.value === -1) {
        current.value = 0;
      }
      playing.value = val;
    }
  }

  function togglePlaying() {
    setPlaying(!playing.value);
  }

  function nextTrack() {
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

  function prevTrack() {
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

  function trackEnded() {
    if (repeatMode.value === "single") {
      seekTime.value = 0;
      doSeek.value = true;
    } else {
      nextTrack();
    }
  }

  function nextRepeatMode() {
    const currentIndex = repeatModes.indexOf(repeatMode.value);
    repeatMode.value = repeatModes[(currentIndex + 1) % repeatModes.length];
  }

  function shuffle() {
    const newPlaylist = [];
    if (current.value >= 0) {
      newPlaylist.push(playlist.value[current.value]);
      playlist.value.splice(current.value, 1);
      current.value = 0;
    }
    while (playlist.value.length > 0) {
      const index = Math.floor(Math.random() * playlist.value.length);
      newPlaylist.push(playlist.value[index]);
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
