<template>
  <VContainer v-if="genre" fluid>
    <VRow>
      <VCol cols="12">
        <div>
          <h2 class="text-h4">{{ genre.name }}</h2>
        </div>
        <div>
          <GenreActions :genre="genre" />
        </div>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <TracksTable :tracks="tracks" :show-search="true" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useHead } from "@unhead/vue";
import { useRouter } from "vue-router";
import { type Genre, type Track, TracksScope } from "@accentor/api-client-js";
import GenreActions from "@/components/GenreActions.vue";
import TracksTable from "@/components/TracksTable.vue";
import { useGenresStore } from "@/store/genres";
import { useTracksStore } from "@/store/tracks";
import type { Loaded } from "@/store/base.ts";

const router = useRouter();
const props = defineProps<{ id: string }>();
const tracksStore = useTracksStore();
const genresStore = useGenresStore();

const genre = computed<Loaded<Genre> | undefined>(
  () => genresStore.genres[props.id],
);
const genreName = computed(() => genre.value?.name || "");
const tracks = computed<Loaded<Track>[]>(() =>
  genre.value ? tracksStore.tracksFilterByGenre(genre.value.id) : [],
);
useHead({ title: genreName });

async function fetchContent(): Promise<void> {
  const genrePromise = genresStore.read(parseInt(props.id));
  const tracksPromise = tracksStore.index(new TracksScope().genre(props.id));
  await Promise.all([genrePromise, tracksPromise]);

  if (!genre.value) {
    router.go(-1);
  }
}

onMounted(fetchContent);
</script>
