import api from "@/api";
import { PlaysScope } from "@accentor/api-client-js";
import { defineStore } from "pinia";
import { useBaseModelStore } from "./base";
import { computed } from "vue";
import { useTracksStore } from "./tracks";

export const usePlaysStore = defineStore("plays", () => {
  const tracksStore = useTracksStore();

  const {
    items: plays,
    index,
    create: baseCreate,
  } = useBaseModelStore(api.plays, "plays.plays", "play", {
    baseScope: new PlaysScope(),
  });
  const allPlays = computed(() => Object.values(plays.value));
  const playStatsByTrack = computed(() => {
    const result = {};
    for (let play of allPlays.value) {
      if (!(play.track_id in result)) {
        result[play.track_id] = {
          count: 1,
          last_played_at: new Date(play.played_at),
        };
      } else {
        result[play.track_id].count++;

        if (result[play.track_id].last_played_at < new Date(play.played_at)) {
          result[play.track_id].last_played_at = new Date(play.played_at);
        }
      }
    }
    return result;
  });

  const playStatsByAlbum = computed(() => {
    const result = {};
    for (let track_id in playStatsByTrack.value) {
      // If this track is not (yet) loaded, we need to skip it
      if (!tracksStore.tracks[track_id]) {
        continue;
      }

      const album_id = tracksStore.tracks[track_id].album_id;
      if (!(album_id in result)) {
        result[album_id] = {
          last_played_at: playStatsByTrack.value[track_id].last_played_at,
        };
      } else if (
        result[album_id].last_played_at <
        playStatsByTrack.value[track_id].last_played_at
      ) {
        result[album_id].last_played_at =
          playStatsByTrack.value[track_id].last_played_at;
      }
    }
    return result;
  });

  const playStatsByArtist = computed(() => {
    const result = {};
    for (let track_id in playStatsByTrack.value) {
      // If this track is not (yet) loaded, we need to skip it
      if (!tracksStore.tracks[track_id]) {
        continue;
      }

      for (let ta of tracksStore.tracks[track_id].track_artists) {
        if (!(ta.artist_id in result)) {
          result[ta.artist_id] = {
            count: playStatsByTrack.value[track_id].count,
            last_played_at: playStatsByTrack.value[track_id].last_played_at,
          };
        } else {
          result[ta.artist_id].count += playStatsByTrack.value[track_id].count;
          if (
            result[ta.artist_id].last_played_at <
            playStatsByTrack.value[track_id].last_played_at
          ) {
            result[ta.artist_id].last_played_at =
              playStatsByTrack.value[track_id].last_played_at;
          }
        }
      }
    }
    return result;
  });

  async function create(trackId) {
    return await baseCreate({ track_id: trackId, played_at: new Date() });
  }

  return {
    plays,
    allPlays,
    index,
    create,
    playStatsByAlbum,
    playStatsByArtist,
    playStatsByTrack,
  };
});
