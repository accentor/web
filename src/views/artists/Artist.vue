<template>
  <VContainer v-if="artist" fluid>
    <VRow>
      <VCol
        v-if="artist.image500 && !imageUnavailable"
        lg="3"
        md="4"
        sm="6"
        cols="12"
      >
        <VImg
          :src="artist.image500"
          class="elevation-3"
          @error="setImageUnavailable"
        />
      </VCol>
      <VCol
        v-else-if="artist.image && !imageUnavailable"
        lg="3"
        md="4"
        sm="6"
        cols="12"
      >
        <VImg
          :src="artist.image"
          class="elevation-3"
          @error="setImageUnavailable"
        />
      </VCol>
      <VCol lg="9" md="8" sm="6" cols="12">
        <div>
          <h2 class="text-h4">{{ artist.name }}</h2>
        </div>
        <div v-if="playlists.length" class="text-grey mt-4 mb-4">
          {{ $tc("music.artist.in-playlists", playlists.length) }}
          <ul>
            <li v-for="playlist in playlists" :key="playlist.id">
              <RouterLink
                :to="{ name: 'playlist', params: { id: playlist.id } }"
              >
                {{ playlist.name }}
              </RouterLink>
            </li>
          </ul>
        </div>
        <div>
          <ArtistActions :artist="artist" :extended="true" />
        </div>
      </VCol>
    </VRow>
    <VRow>
      <VCol
        v-for="item of albums"
        :key="item.id"
        lg="3"
        md="4"
        sm="6"
        xl="2"
        cols="6"
      >
        <AlbumCard :album="item" />
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <TracksTable
          :tracks="tracks"
          :show-search="true"
          :save-search="false"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useHead } from "@unhead/vue";
import { useRouter } from "vue-router";
import AlbumCard from "@/components/AlbumCard.vue";
import ArtistActions from "@/components/ArtistActions.vue";
import TracksTable from "@/components/TracksTable.vue";
import { AlbumsScope, TracksScope } from "@accentor/api-client-js";
import { usePlaylistsStore } from "@/store/playlists";
import { useArtistsStore } from "@/store/artists";
import { useAlbumsStore } from "@/store/albums";
import { useTracksStore } from "@/store/tracks";

const albumsStore = useAlbumsStore();
const artistsStore = useArtistsStore();
const playlistsStore = usePlaylistsStore();
const tracksStore = useTracksStore();

const router = useRouter();
const props = defineProps<{ id: string }>();
const imageUnavailable = ref(false);
const artist = computed(() => artistsStore.artists[props.id]);
const artistName = computed(() => artist.value?.name);
useHead({ title: artistName });

const albums = computed(() =>
  artist.value ? albumsStore.albumsFilterByArtist(artist.value.id) : [],
);
const tracks = computed(() =>
  artist.value ? tracksStore.tracksFilterByArtist(artist.value.id) : [],
);

const playlists = computed(() => {
  if (artist.value) {
    const id = artist.value.id;
    return playlistsStore.artistPlaylists.filter((p) =>
      p.item_ids.includes(id),
    );
  } else {
    return [];
  }
});

function setImageUnavailable(): void {
  imageUnavailable.value = true;
}

onMounted(fetchContent);

async function fetchContent(): Promise<void> {
  const artistPromise = artistsStore.read(parseInt(props.id));
  const albumsPromise = albumsStore.index(new AlbumsScope().artist(props.id));
  const tracksPromise = tracksStore.index(new TracksScope().artist(props.id));

  await Promise.all([artistPromise, albumsPromise, tracksPromise]);
  // If the artist is undefined after loading, we assume that it doesn't exist.
  if (!artist.value) {
    router.go(-1);
  }
}
</script>
