import api from "@/api";
import { PlaysScope } from "@accentor/api-client-js";
import { defineStore } from "pinia";
import {
  create as baseCreate,
  index as baseIndex,
  useBaseModelStore,
} from "./base";
import { computed } from "vue";
import { useTracksStore } from "./tracks";
import { useAuthStore } from "@/store/auth";
import { useErrorsStore } from "@/store/errors";

export const usePlaysStore = defineStore("plays", () => {
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();
  const tracksStore = useTracksStore();

  const {
    items: plays,
    addItems,
    removeOld,
    restored,
    setItem,
    setStartLoading,
  } = useBaseModelStore("plays.plays");
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

  const index = baseIndex(
    api.plays,
    authStore,
    errorsStore,
    restored,
    addItems,
    setStartLoading,
    removeOld,
    new PlaysScope(),
  );

  const underlyingCreate = baseCreate(
    api.plays,
    authStore,
    errorsStore,
    setItem,
    (val) => ({ play: val }),
  );

  async function create(trackId) {
    return await underlyingCreate({ track_id: trackId, played_at: new Date() });
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
