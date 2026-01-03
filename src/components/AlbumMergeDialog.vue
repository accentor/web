<template>
  <VDialog v-if="isModerator" v-model="mergeModal" width="600px">
    <template #activator="{ props: dialogProps }">
      <VListItem :disabled="disabled" v-bind="dialogProps">
        <template #prepend>
          <VIcon color="warning">mdi-merge</VIcon>
        </template>

        <VListItemTitle>{{ $t("music.album.merge") }}</VListItemTitle>
      </VListItem>
    </template>
    <VCard>
      <VCardTitle>
        <span class="text-h5">
          {{ $t("music.album.merge-into", { obj: album.title }) }}
        </span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol cols="12">
              <VCombobox
                v-model="mergeAlbum"
                :items="sortedAlbums"
                :custom-filter="filterTitle"
                item-title="title"
                item-value="id"
                :label="$tc('music.albums', 1)"
              >
                <template #item="{ item, props: listItemProps }">
                  <VListItem v-bind="listItemProps">
                    <template #append>
                      <span class="text-grey pl-2 text-body-2">
                        {{ item.value }}
                      </span>
                    </template>
                  </VListItem>
                </template>
              </VCombobox>
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>
      <VDivider></VDivider>
      <VCardActions>
        <VSpacer></VSpacer>
        <VBtn color="primary" class="ma-2" type="submit" @click="mergeAlbums">
          {{ $t("music.album.merge") }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "../store/auth";
import { useAlbumsStore } from "../store/albums";
import type { Album } from "@accentor/api-client-js";
import { computed, ref } from "vue";
import type { InternalItem } from "vuetify/framework";

const authStore = useAuthStore();
const albumsStore = useAlbumsStore();

interface Props {
  disabled: boolean;
  album: Album;
}

const props = defineProps<Props>();

const mergeAlbum = ref<Album | null>(null);
const mergeModal = ref<boolean>(false);

const { isModerator } = storeToRefs(authStore);
const sortedAlbums = computed<Album[]>(() =>
  albumsStore.albumsByTitle.filter((a) => a.id !== props.album.id),
);

function filterTitle(
  _value: string,
  queryText: string,
  item: InternalItem<Album> | undefined,
): boolean {
  if (item === undefined) {
    return false;
  }

  const search = queryText.toLowerCase();
  return (
    item.raw.title.toLowerCase().indexOf(search) > -1 ||
    item.raw.normalized_title.indexOf(search) > -1
  );
}

async function mergeAlbums(): Promise<void> {
  if (mergeAlbum.value === null) {
    return;
  }

  try {
    await albumsStore.merge(mergeAlbum.value.id, props.album.id);
  } finally {
    mergeModal.value = false;
  }
}
</script>
