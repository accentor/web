<template>
  <VDialog v-if="playlistOptions.length" v-model="dialog" width="600px">
    <template #activator="{ props: dialogProps }">
      <VBtn
        color="primary"
        variant="text"
        icon
        size="small"
        v-bind="dialogProps"
        @click.stop.prevent
      >
        <VIcon size="x-large">mdi-playlist-plus</VIcon>
      </VBtn>
    </template>
    <VCard>
      <VCardTitle>
        <span class="text-h5">
          {{ I18n.t("music.playlist.add-item", { obj: cardTitleName }) }}
        </span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol cols="12">
              <VCombobox
                v-model="selectedPlaylist"
                :items="playlistOptions"
                :custom-filter="filterName"
                item-title="name"
                item-value="id"
                :label="I18n.t('music.playlists', 1)"
                return-object
              >
                <template #item="{ item: innerItem, props: listItemProps }">
                  <VListItem
                    :disabled="innerItem.raw.disabled"
                    v-bind="listItemProps"
                  >
                    <template v-if="innerItem.raw.disabled" #append>
                      ({{ I18n.t("music.playlist.item-already-present") }})
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
        <VBtn
          color="primary"
          class="ma-2"
          type="submit"
          :disabled="selectedPlaylist === null"
          @click="addItemToPlaylist"
        >
          {{ I18n.t("music.playlist.add") }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { computed, type ComputedRef, ref, type Ref } from "vue";
import { usePlaylistsStore } from "@/store/playlists";
import type { Album, Artist, Playlist, Track } from "@accentor/api-client-js";
import { useI18n } from "vue-i18n";

const I18n = useI18n();
const playlistsStore = usePlaylistsStore();

interface Props {
  item: Track | Album | Artist;
  type: "track" | "album" | "artist";
}

const props = defineProps<Props>();
const item = computed(() => props.item);

const cardTitleName = computed(() => {
  if ("name" in item.value) {
    return item.value.name;
  }
  return item.value.title;
});

const dialog: Ref<boolean> = ref(false);
const selectedPlaylist: Ref<Playlist | null> = ref(null);

const playlistOptions: ComputedRef<(Playlist & { disabled: boolean })[]> =
  computed(() =>
    playlistsStore.editablePlaylists
      .filter((p) => p.playlist_type === props.type)
      .map((p) => ({
        ...p,
        disabled: p.item_ids.includes(item.value.id),
      })),
  );

function filterName(value: string, queryText: string): boolean {
  const search = queryText.toLowerCase();
  return value.toLowerCase().indexOf(search) > -1;
}

async function addItemToPlaylist(): Promise<void> {
  if (selectedPlaylist.value === null) {
    return;
  }

  const item_type = (props.type.charAt(0).toUpperCase() +
    props.type.slice(1)) as "Album" | "Artist" | "Track";
  try {
    await playlistsStore.addItem(selectedPlaylist.value.id, {
      item_id: item.value.id,
      item_type,
    });
  } finally {
    dialog.value = false;
  }
}
</script>
