import { computed } from "vue";
import api from "@/api";
import { compareTracks } from "../comparators";
import { TracksScope } from "@accentor/api-client-js";
import { useAlbumsStore } from "./albums";
import { defineStore } from "pinia";
import {
  destroy as baseDestroy,
  index as baseIndex,
  merge as baseMerge,
  read as baseRead,
  update as baseUpdate,
  useBaseModelStore,
} from "./base";
import { useAuthStore } from "@/store/auth";
import { useErrorsStore } from "@/store/errors";

export const useTracksStore = defineStore("tracks", () => {
  const albumsStore = useAlbumsStore();
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();

  const {
    items: tracks,
    addItems,
    removeItem,
    removeOld,
    restored,
    setItem,
    setItems,
    startLoading,
    setStartLoading,
  } = useBaseModelStore("tracks.tracks");
  const allTracks = computed(() => Object.values(tracks.value));
  const tracksByAlbumAndNumber = computed(() =>
    [...allTracks.value].sort(compareTracks(albumsStore.albums)),
  );
  const tracksEmpty = computed(() =>
    tracksByAlbumAndNumber.value.filter((t) => t.length === null),
  );
  const tracksFlagged = computed(() =>
    tracksByAlbumAndNumber.value.filter((t) => t.review_comment !== null),
  );
  const tracksBinnedByAlbum = computed(() => {
    const result = {};
    for (let track of allTracks.value) {
      if (!(track.album_id in result)) {
        result[track.album_id] = [];
      }
      result[track.album_id].push(track);
    }
    return result;
  });
  const tracksBinnedByGenre = computed(() => {
    const result = {};
    for (let track of allTracks.value) {
      for (let genreId of track.genre_ids) {
        if (!(genreId in result)) {
          result[genreId] = [];
        }
        result[genreId].push(track);
      }
    }
    return result;
  });
  const tracksBinnedByArtist = computed(() => {
    const result = {};
    for (let track of allTracks.value) {
      for (let ta of track.track_artists) {
        if (!(ta.artist_id in result)) {
          result[ta.artist_id] = [];
        }
        if (!result[ta.artist_id].includes(track)) {
          result[ta.artist_id].push(track);
        }
      }
    }
    return result;
  });

  function tracksFilterByAlbum(id) {
    return [...(tracksBinnedByAlbum.value[id] || [])].sort(
      (t1, t2) => t1.number - t2.number,
    );
  }

  function tracksFilterByGenre(id) {
    return (tracksBinnedByGenre.value[id] || []).sort(
      compareTracks(albumsStore.albums),
    );
  }

  function tracksFilterByArtist(id) {
    return (tracksBinnedByArtist.value[id] || []).sort(
      compareTracks(albumsStore.albums),
    );
  }

  function updateAlbumOccurence(newID, oldID) {
    const newTracks = {};
    for (const track of allTracks.value) {
      if (`${track.album_id}` === `${oldID}`) {
        track.album_id = newID;
      }
      newTracks[track.id] = track;
    }
    setItems(newTracks);
  }

  function removeArtistOccurence(oldID) {
    const newTracks = {};
    for (let track of allTracks.value) {
      if (track.track_artists.some((ta) => `${ta.artist_id}` === `${oldID}`)) {
        track.track_artists = track.track_artists.filter(
          (ta) => `${ta.artist_id}` !== `${oldID}`,
        );
      }
      newTracks[track.id] = track;
    }
    setItems(newTracks);
  }

  function updateArtistOccurence(newID, oldID) {
    const newTracks = {};
    for (let track of allTracks.value) {
      if (track.track_artists.some((ta) => `${ta.artist_id}` === `${oldID}`)) {
        track.track_artists.forEach((ta) => {
          if (`${ta.artist_id}` === `${oldID}`) {
            ta.artist_id = newID;
          }
        });
      }
    }
    setItems(newTracks);
  }

  function removeGenreOccurence(oldID) {
    const newTracks = {};
    for (let track of allTracks.value) {
      const i = track.genre_ids.findIndex((gId) => `${gId}` === `${oldID}`);
      if (i >= 0) {
        track.genre_ids.splice(i, 1);
      }
      newTracks[track.id] = track;
    }
    setItems(newTracks);
  }

  function updateGenreOccurence(newID, oldID) {
    const newTracks = {};
    for (let track of allTracks.value) {
      const i = track.genre_ids.findIndex((gId) => `${gId}` === `${oldID}`);
      if (i >= 0) {
        track.genre_ids.splice(i, 1);
        if (!track.genre_ids.includes(newID)) {
          track.genre_ids.push(newID);
        }
      }
      newTracks[track.id] = track;
    }
  }

  const index = baseIndex(
    api.tracks,
    authStore,
    errorsStore,
    restored,
    addItems,
    setStartLoading,
    removeOld,
    new TracksScope(),
  );
  const read = baseRead(api.tracks, authStore, errorsStore, restored, setItem);
  const update = baseUpdate(
    api.tracks,
    authStore,
    errorsStore,
    setItem,
    (val) => ({ track: val }),
  );
  const destroy = baseDestroy(api.tracks, authStore, errorsStore, removeItem);
  const merge = baseMerge(api.tracks, authStore, errorsStore, removeItem);

  return {
    tracks,
    index,
    read,
    update,
    destroy,
    merge,
    startLoading,
    allTracks,
    tracksByAlbumAndNumber,
    tracksEmpty,
    tracksFlagged,
    tracksFilterByAlbum,
    tracksFilterByGenre,
    tracksFilterByArtist,
    updateAlbumOccurence,
    removeArtistOccurence,
    updateArtistOccurence,
    removeGenreOccurence,
    updateGenreOccurence,
  };
});
