import { computed, type ComputedRef } from "vue";
import api from "@/api";
import {
  type Track,
  type TrackParams,
  TracksScope,
} from "@accentor/api-client-js";
import { useAlbumsStore } from "./albums";
import { defineStore } from "pinia";
import {
  destroy as baseDestroy,
  index as baseIndex,
  merge as baseMerge,
  type ModelItemsType,
  read as baseRead,
  update as baseUpdate,
  useBaseModelStore,
} from "./base";
import { useAuthStore } from "@/store/auth";
import { useErrorsStore } from "@/store/errors";
import { compareTracks } from "@/util";

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
  } = useBaseModelStore<Track>("tracks.tracks");
  const allTracks = computed(() => Object.values(tracks.value));
  const tracksByAlbumAndNumber: ComputedRef<(Track & { loaded: Date })[]> =
    computed(() =>
      [...allTracks.value].sort(compareTracks(albumsStore.albums)),
    );
  const tracksEmpty = computed(() =>
    tracksByAlbumAndNumber.value.filter((t: Track) => t.length === null),
  );
  const tracksFlagged = computed(() =>
    tracksByAlbumAndNumber.value.filter(
      (t: Track) => t.review_comment !== null,
    ),
  );
  const tracksBinnedByAlbum = computed(() => {
    const result: Record<string, (Track & { loaded: Date })[]> = {};
    for (const track of allTracks.value) {
      if (!(`${track.album_id}` in result)) {
        result[`${track.album_id}`] = [];
      }
      result[`${track.album_id}`]!.push(track);
    }
    return result;
  });
  const tracksBinnedByGenre = computed(() => {
    const result: Record<string, (Track & { loaded: Date })[]> = {};
    for (const track of allTracks.value) {
      for (const genreId of track.genre_ids) {
        if (!(`${genreId}` in result)) {
          result[`${genreId}`] = [];
        }
        result[`${genreId}`]!.push(track);
      }
    }
    return result;
  });
  const tracksBinnedByArtist = computed(() => {
    const result: Record<string, (Track & { loaded: Date })[]> = {};
    for (const track of allTracks.value) {
      for (const ta of track.track_artists) {
        if (!(`${ta.artist_id}` in result)) {
          result[`${ta.artist_id}`] = [];
        }
        if (!result[`${ta.artist_id}`]!.includes(track)) {
          result[`${ta.artist_id}`]!.push(track);
        }
      }
    }
    return result;
  });

  function tracksFilterByAlbum(id: number): (Track & { loaded: Date })[] {
    return [...(tracksBinnedByAlbum.value[`${id}`] || [])].sort(
      (t1, t2) => t1.number - t2.number,
    );
  }

  function tracksFilterByGenre(id: number): (Track & { loaded: Date })[] {
    return (tracksBinnedByGenre.value[`${id}`] || []).sort(
      compareTracks(albumsStore.albums),
    );
  }

  function tracksFilterByArtist(id: number): (Track & { loaded: Date })[] {
    return (tracksBinnedByArtist.value[`${id}`] || []).sort(
      compareTracks(albumsStore.albums),
    );
  }

  function updateAlbumOccurrence(newID: number, oldID: number): void {
    const newTracks: ModelItemsType<Track> = {};
    for (const track of allTracks.value) {
      if (`${track.album_id}` === `${oldID}`) {
        track.album_id = newID;
      }
      newTracks[`${track.id}`] = track;
    }
    setItems(newTracks);
  }

  function removeArtistOccurrence(oldID: number): void {
    const newTracks: ModelItemsType<Track> = {};
    for (const track of allTracks.value) {
      if (track.track_artists.some((ta) => `${ta.artist_id}` === `${oldID}`)) {
        track.track_artists = track.track_artists.filter(
          (ta) => `${ta.artist_id}` !== `${oldID}`,
        );
      }
      newTracks[`${track.id}`] = track;
    }
    setItems(newTracks);
  }

  function updateArtistOccurrence(newID: number, oldID: number): void {
    const newTracks: ModelItemsType<Track> = {};
    for (const track of allTracks.value) {
      if (track.track_artists.some((ta) => `${ta.artist_id}` === `${oldID}`)) {
        track.track_artists.forEach((ta) => {
          if (`${ta.artist_id}` === `${oldID}`) {
            ta.artist_id = newID;
          }
        });
      }
      newTracks[`${track.id}`] = track;
    }
    setItems(newTracks);
  }

  function removeGenreOccurrence(oldID: number): void {
    const newTracks: ModelItemsType<Track> = {};
    for (const track of allTracks.value) {
      const i = track.genre_ids.findIndex((gId) => `${gId}` === `${oldID}`);
      if (i >= 0) {
        track.genre_ids.splice(i, 1);
      }
      newTracks[`${track.id}`] = track;
    }
    setItems(newTracks);
  }

  function updateGenreOccurrence(newID: number, oldID: number): void {
    const newTracks: ModelItemsType<Track> = {};
    for (const track of allTracks.value) {
      const i = track.genre_ids.findIndex((gId) => `${gId}` === `${oldID}`);
      if (i >= 0) {
        track.genre_ids.splice(i, 1);
        if (!track.genre_ids.includes(newID)) {
          track.genre_ids.push(newID);
        }
      }
      newTracks[`${track.id}`] = track;
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
  const update = baseUpdate<Track, TrackParams["track"], TrackParams>(
    api.tracks,
    authStore,
    errorsStore,
    setItem,
    (val) => ({ track: val }),
  );
  const destroy = baseDestroy(api.tracks, authStore, errorsStore, removeItem);
  const merge = baseMerge(api.tracks, read, authStore, errorsStore, removeItem);

  return {
    tracks,
    restored,
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
    updateAlbumOccurrence,
    removeArtistOccurrence,
    updateArtistOccurrence,
    removeGenreOccurrence,
    updateGenreOccurrence,
  };
});
