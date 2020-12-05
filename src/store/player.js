import baseURL from "../api/base_url";

const repeatModes = ["off", "all", "single"];

export default {
  namespaced: true,
  state: {
    playlist: [],
    current: -1,
    playing: false,
    doSeek: false,
    repeatMode: "off",
    seekTime: 0,
  },
  mutations: {
    setSeekTime(state, time) {
      state.seekTime = time;
    },
    playTrack(state, id) {
      state.playlist.length = 0;
      state.playlist.push(id);
      state.current = 0;
      state.seekTime = 0;
      state.doSeek = true;
      state.playing = true;
    },
    playTracks(state, ids) {
      state.playlist = ids;
      state.current = 0;
      state.seekTime = 0;
      state.doSeek = true;
      state.playing = true;
    },
    addTrack(state, id) {
      state.playlist.push(id);
    },
    addTracks(state, ids) {
      state.playlist.push(...ids);
    },
    updatePlaylist(state, { newIndex, oldIndex }) {
      if (state.current === oldIndex) {
        state.current = newIndex;
      } else if (state.current > oldIndex && state.current <= newIndex) {
        state.current -= 1;
      } else if (state.current < oldIndex && state.current >= newIndex) {
        state.current += 1;
      }
      state.playlist.splice(newIndex, 0, state.playlist.splice(oldIndex, 1)[0]);
    },
    setDoSeek(state) {
      state.doSeek = false;
    },
    setCurrent(state, index) {
      state.current = index;
      state.seekTime = 0;
      state.playing = true;
      state.doSeek = true;
    },
    removeIndex(state, index) {
      if (index === state.current) {
        state.current = -1;
        state.playing = false;
        state.seekTime = 0;
      } else if (index < state.current) {
        state.current -= 1;
      }
      state.playlist.splice(index, 1);
    },
    seek(state, val) {
      state.seekTime = val;
      state.doSeek = true;
    },
    setPlaying(state, val) {
      if (state.current === -1 && state.playlist.length) {
        state.current = 0;
      }
      state.playing = val;
    },
    nextTrack(state) {
      state.current += 1;
      if (state.current >= state.playlist.length) {
        if (state.repeatMode === "all") {
          state.current = 0;
          state.seekTime = 0;
          state.doSeek = true;
        } else {
          state.current = -1;
          state.playing = false;
          state.seekTime = 0;
        }
      } else {
        state.seekTime = 0;
        state.doSeek = true;
      }
    },
    prevTrack(state) {
      if (state.seekTime > 5) {
        state.seekTime = 0;
        state.doSeek = true;
      } else {
        state.current -= 1;
        if (state.current < 0) {
          if (state.repeatMode === "all") {
            state.current = state.playlist.length - 1;
            state.seekTime = 0;
            state.doSeek = true;
          } else {
            state.current = 0;
            state.seekTime = 0;
            state.doSeek = true;
          }
        } else {
          state.seekTime = 0;
          state.doSeek = true;
        }
      }
    },
    trackEnded(state) {
      if (state.repeatMode === "single") {
        state.seekTime = 0;
        state.doSeek = true;
      } else {
        this.commit("player/nextTrack");
      }
    },
    nextRepeatMode(state) {
      const currentIndex = repeatModes.indexOf(state.repeatMode);
      state.repeatMode = repeatModes[(currentIndex + 1) % repeatModes.length];
    },
    shuffle(state) {
      const newPlaylist = [];
      if (state.current >= 0) {
        newPlaylist.push(state.playlist[state.current]);
        state.playlist.splice(state.current, 1);
        state.current = 0;
      }
      while (state.playlist.length > 0) {
        const index = Math.floor(Math.random() * state.playlist.length);
        newPlaylist.push(state.playlist[index]);
        state.playlist.splice(index, 1);
      }
      state.playlist = newPlaylist;
    },
  },
  getters: {
    playlistTracks(state, getters, rootState) {
      return state.playlist
        .map((id) => rootState.tracks.tracks[id])
        .filter((t) => t);
    },
    currentTrack(state, getters) {
      return state.current >= 0 ? getters.playlistTracks[state.current] : null;
    },
    currentTrackURL(state, getters, rootState) {
      const secret = rootState.auth.secret;
      const device_id = rootState.auth.device_id;
      const params = `/audio?secret=${secret}&device_id=${device_id}`;
      const tracks = `${baseURL}/tracks/`;
      return (
        getters.currentTrack && `${tracks}${getters.currentTrack.id}${params}`
      );
    },
  },
};
