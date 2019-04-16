import baseURL from "../api/base_url";

export default {
  namespaced: true,
  state: {
    playlist: [],
    current: -1,
    playing: false,
    doSeek: false,
    seekTime: 0
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
    addTrack(state, id) {
      state.playlist.push(id);
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
    pausePlay(state) {
      state.playing = !state.playing;
    }
  },
  getters: {
    playlistTracks(state, getters, rootState) {
      return state.playlist.map(id => rootState.tracks.tracks[id]);
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
    }
  }
};
