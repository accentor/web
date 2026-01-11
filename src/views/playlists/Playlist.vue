<template>
  <VContainer v-if="playlist" fluid>
    <VRow class="mb-2" justify="space-between" align="baseline">
      <VCol cols="12" sm="4" md="6" lg="8" xl="10">
        <div>
          <h2 class="text-h4">{{ playlist.name }}</h2>
          <p class="text-grey mb-1">
            {{ users[playlist.user_id]?.name }} &bull;
            {{ $t(`music.playlist.access_options.${playlist.access}`) }}
          </p>
          <p class="text-grey mb-1">
            {{
              $tc(
                `music.playlist.item_counts.${playlist.playlist_type}`,
                playlist.item_ids.length,
              )
            }}
          </p>
          <p class="text-grey mb-1">{{ playlist.description }}</p>
        </div>
        <PlaylistActions :playlist="playlist" />
      </VCol>
      <VCol cols="12" sm="8" md="6" lg="4" xl="2"> </VCol>
    </VRow>
    <VRow v-if="playlist.playlist_type === 'track'" no-gutters>
      <VCol>
        <TracksTable
          :tracks="tracks"
          :show-search="true"
          :show-mass-edit="false"
        />
      </VCol>
    </VRow>
    <ArtistsRow
      v-else-if="playlist.playlist_type === 'artist'"
      :artists="artists"
    />
    <AlbumsRow
      v-else-if="playlist.playlist_type === 'album'"
      :albums="albums"
    />
  </VContainer>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useHead } from "@unhead/vue";
import { storeToRefs } from "pinia";
import AlbumsRow from "@/components/AlbumsRow.vue";
import TracksTable from "@/components/TracksTable.vue";
import PlaylistActions from "@/components/PlaylistActions.vue";
import { usePlaylistsStore } from "@/store/playlists";
import { useUsersStore } from "@/store/users";
import { useArtistsStore } from "@/store/artists";
import { useAlbumsStore } from "@/store/albums";
import { useTracksStore } from "@/store/tracks";
import type { Album, Artist, Track } from "@accentor/api-client-js";
import ArtistsRow from "@/components/ArtistsRow.vue";

const albumsStore = useAlbumsStore();
const artistsStore = useArtistsStore();
const tracksStore = useTracksStore();
const playlistsStore = usePlaylistsStore();

const props = defineProps<{ id: string }>();
const playlist = computed(() => playlistsStore.playlists[props.id]);
const title = computed(() => playlist.value?.name);

useHead({ title });

const tracks = computed<(Track & { loaded: Date })[]>(() => {
  if (playlist.value?.playlist_type === "track") {
    return playlist.value.item_ids.map((id) => tracksStore.tracks[`${id}`]!);
  }
  return [];
});

const albums = computed<(Album & { loaded: Date })[]>(() => {
  if (playlist.value?.playlist_type === "album") {
    return playlist.value.item_ids.map((id) => albumsStore.albums[`${id}`]!);
  }
  return [];
});

const artists = computed<(Artist & { loaded: Date })[]>(() => {
  if (playlist.value?.playlist_type === "artist") {
    return playlist.value.item_ids.map((id) => artistsStore.artists[`${id}`]!);
  }
  return [];
});

const { users } = storeToRefs(useUsersStore());

onMounted(async () => await playlistsStore.read(Number(props.id)));
</script>
