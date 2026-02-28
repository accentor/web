<template>
  <VContainer v-if="album" fluid>
    <VRow>
      <VCol
        v-if="album.image500 && !imageUnavailable"
        lg="3"
        md="4"
        sm="6"
        cols="12"
      >
        <VImg
          :src="album.image500"
          class="elevation-3"
          @error="setImageUnavailable"
        />
      </VCol>
      <VCol
        v-else-if="album.image && !imageUnavailable"
        lg="3"
        md="4"
        sm="6"
        cols="12"
      >
        <VImg
          :src="album.image"
          class="elevation-3"
          @error="setImageUnavailable"
        />
      </VCol>
      <VCol lg="9" md="8" sm="6" cols="12">
        <div>
          <div class="text-h4">
            {{ album.title }}
            <span v-if="album.edition_description !== null" class="text-grey">
              ({{ album.edition_description }})
            </span>
          </div>
          <AlbumArtists :album="album" />
          <div v-if="album.edition === null" class="text-grey">
            {{ album.release }}
          </div>
          <div v-else class="text-grey">
            <div>
              {{ album.release }} ({{ I18n.t("music.album.original") }})
            </div>
            <div>{{ album.edition }} ({{ I18n.t("music.album.edition") }})</div>
          </div>
          <div
            v-for="al of album_labels"
            :key="`${al.label_id} ${al.catalogue_number}`"
            class="text-grey"
          >
            <RouterLink :to="{ name: 'label', params: { id: al.label_id } }">
              {{ labels[al.label_id]?.name }}
            </RouterLink>
            -
            {{
              al.catalogue_number || I18n.t("music.label.catalogue-number-none")
            }}
          </div>
          <div v-if="playlists.length" class="text-grey mt-4 mb-4">
            {{ I18n.t("music.album.in-playlists", playlists.length) }}
            <ul class="list-none">
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
            <AlbumActions :album="album" />
          </div>
        </div>
      </VCol>
      <VRow>
        <VCol>
          <TracksTable :tracks="tracks" :show-album="false" />
        </VCol>
      </VRow>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useHead } from "@unhead/vue";
import AlbumActions from "@/components/AlbumActions.vue";
import TracksTable from "@/components/TracksTable.vue";
import AlbumArtists from "@/components/AlbumArtists.vue";
import { PlaysScope, TracksScope } from "@accentor/api-client-js";
import { usePlaylistsStore } from "@/store/playlists";
import { useLabelsStore } from "@/store/labels";
import { useAlbumsStore } from "@/store/albums";
import { useTracksStore } from "@/store/tracks";
import { usePlaysStore } from "@/store/plays";
import { useI18n } from "vue-i18n";

const I18n = useI18n();
const albumsStore = useAlbumsStore();
const labelsStore = useLabelsStore();
const playlistsStore = usePlaylistsStore();
const playsStore = usePlaysStore();
const tracksStore = useTracksStore();
const router = useRouter();

const props = defineProps<{ id: string }>();

const imageUnavailable = ref(false);
function setImageUnavailable(): void {
  imageUnavailable.value = true;
}

const album = computed(() => albumsStore.albums[props.id]);
const albumTitle = computed(() => album.value?.title ?? "");
useHead({ title: albumTitle });

const { labels } = storeToRefs(labelsStore);
const tracks = computed(() =>
  album.value ? tracksStore.tracksFilterByAlbum(album.value.id) : [],
);
const album_labels = computed(
  () =>
    album.value?.album_labels?.filter(
      (al) => `${al.label_id}` in labels.value,
    ) || [],
);
const playlists = computed(() =>
  album.value
    ? playlistsStore.albumPlaylists.filter((p) =>
        p.item_ids.includes(album.value!.id),
      )
    : [],
);

onMounted(fetchContent);

async function fetchContent(): Promise<void> {
  const albumPromise = albumsStore.read(parseInt(props.id));
  const playsPromise = playsStore.index(new PlaysScope().album(props.id));
  const tracksPromise = tracksStore.index(new TracksScope().album(props.id));
  await Promise.all([albumPromise, playsPromise, tracksPromise]);

  if (album.value === undefined) {
    router.go(-1);
  }
}
</script>
