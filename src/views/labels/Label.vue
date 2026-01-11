<template>
  <VContainer v-if="label" fluid>
    <AlbumsRow v-if="albums.length > 0" :albums="filteredAlbums">
      <template #header>
        <VRow class="mb-2" justify="space-between" align="baseline">
          <VCol cols="12" sm="4" md="6" lg="8" xl="10">
            <div>
              <h2 class="text-h4">{{ label.name }}</h2>
            </div>
            <div>
              <LabelActions :label="label" />
            </div>
          </VCol>
          <VCol cols="12" sm="8" md="6" lg="4" xl="2">
            <VTextField
              v-if="albums.length > 12"
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              :label="$t('common.search')"
              single-line
              hide-details
            />
          </VCol>
        </VRow>
      </template>
      <template #album-card="{ album }">
        <AlbumCard :album="album" :label-for-cat-nr="label" />
      </template>
    </AlbumsRow>
  </VContainer>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useHead } from "@unhead/vue";
import { useRouter } from "vue-router";
import { type Album, AlbumsScope } from "@accentor/api-client-js";
import AlbumCard from "@/components/AlbumCard.vue";
import LabelActions from "@/components/LabelActions.vue";
import { useLabelsStore } from "@/store/labels";
import { useAlbumsStore } from "@/store/albums";
import AlbumsRow from "@/components/AlbumsRow.vue";
import { useSearch } from "@/composables/search";

const router = useRouter();
const labelsStore = useLabelsStore();
const albumsStore = useAlbumsStore();

const props = defineProps<{ id: string }>();

const { search } = useSearch();

const label = computed(() => labelsStore.labels[props.id]);
const labelName = computed(() => label.value?.name);
const albums = computed(() =>
  label.value ? albumsStore.albumsFilterByLabel(label.value?.id) : [],
);
const filteredAlbums = computed(() => {
  const lookup = search.value.toLowerCase();
  return albums.value.filter(
    (item: Album) =>
      !lookup ||
      item.title.toLowerCase().indexOf(lookup) >= 0 ||
      item.normalized_title.toLowerCase().indexOf(lookup) >= 0,
  );
});
useHead({ title: labelName });

onMounted(fetchContent);

async function fetchContent(): Promise<void> {
  const labelPromise = labelsStore.read(parseInt(props.id));
  const albumsPromise = albumsStore.index(new AlbumsScope().label(props.id));
  await Promise.all([labelPromise, albumsPromise]);

  // If the label is undefined after loading, we assume that it doesn't exist.
  if (!label.value) {
    router.go(-1);
  }
}
</script>
