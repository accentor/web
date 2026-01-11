<template>
  <VRow no-gutters align="center" justify="center">
    <VCol cols="12" @change.once="isDirty = true">
      <VForm v-model="isValid" @submit.prevent="submit">
        <VRow no-gutters align="center" justify="center">
          <VCol md="6" sm="8" cols="12" @change.once="isDirty = true">
            <VTextField
              v-model="newPlaylist.name"
              :label="I18n.t('common.name')"
              :rules="[(v) => !!v || I18n.t('errors.playlists.name-blank')]"
              required
            />
            <VTextarea
              v-model="newPlaylist.description"
              :label="I18n.t('common.description')"
              rows="3"
            />
            <VAutocomplete
              v-model="newPlaylist.playlist_type"
              :items="playlistTypes"
              :label="I18n.t('music.playlist.playlist_type')"
              :disabled="hasItems"
            />
            <VAutocomplete
              v-model="newPlaylist.access"
              :items="accessOptions"
              :label="I18n.t('music.playlist.access')"
            />
            <VBtn
              :disabled="!isValid"
              color="primary"
              class="ma-2"
              type="submit"
            >
              {{
                playlist
                  ? I18n.t("music.playlist.update")
                  : I18n.t("music.playlist.create")
              }}
            </VBtn>
          </VCol>
        </VRow>
        <VRow
          v-if="newPlaylist.item_ids.length"
          no-gutters
          align="center"
          justify="center"
        >
          <VCol
            md="9"
            sm="10"
            cols="12"
            @change.once="
              isDirty = true;
              itemsDirty = true;
            "
          >
            <h4 class="text-h6 mt-6 ml-4">
              {{ I18n.t("music.playlist.items", 2) }}
            </h4>
            <VTable>
              <thead>
                <tr>
                  <th style="width: 1px" class="text-center">Sort</th>
                  <th>{{ mainPropName }}</th>
                  <th></th>
                </tr>
              </thead>
              <Draggable
                v-model="newPlaylist.item_ids"
                :item-key="(id: number) => id"
                tag="tbody"
                handle=".handle"
              >
                <template #item="{ element: itemId, index }">
                  <tr>
                    <td class="text-no-wrap">
                      <VBtn size="small" icon variant="text" class="handle">
                        <VIcon>mdi-drag-horizontal-variant</VIcon>
                      </VBtn>
                      {{ index + 1 }}
                    </td>
                    <td class="play-queue__cell">
                      {{ textForItemId(itemId) }}
                    </td>
                    <td class="text-right">
                      <VBtn
                        size="small"
                        icon
                        variant="text"
                        class="ma-2 text-red"
                        @click="() => removeItem(index)"
                      >
                        <VIcon>mdi-close</VIcon>
                      </VBtn>
                    </td>
                  </tr>
                </template>
              </Draggable>
            </VTable>
          </VCol>
        </VRow>
      </VForm>
    </VCol>
  </VRow>
</template>

<script setup lang="ts">
import Draggable from "vuedraggable";
import { usePlaylistsStore } from "@/store/playlists";
import { useArtistsStore } from "@/store/artists";
import { useAlbumsStore } from "@/store/albums";
import { useTracksStore } from "@/store/tracks";
import {
  type Playlist,
  type PlaylistAccess,
  type PlaylistType,
} from "@accentor/api-client-js";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const I18n = useI18n();
const albumsStore = useAlbumsStore();
const artistsStore = useArtistsStore();
const playlistsStore = usePlaylistsStore();
const tracksStore = useTracksStore();
const route = useRoute();
const router = useRouter();

const props = withDefaults(defineProps<{ playlist?: Playlist | null }>(), {
  playlist: null,
});

const newPlaylist = ref({
  name: "",
  description: "" as string,
  access: "shared" as PlaylistAccess,
  playlist_type: "track" as PlaylistType,
  item_ids: [] as number[],
});
const isDirty = ref(false);
const itemsDirty = ref(false);
const isValid = ref(true);

const hasItems = computed(() => newPlaylist.value.item_ids.length > 0);

function textForItemId(itemId: number): string {
  switch (props.playlist?.playlist_type) {
    case "album":
      return albumsStore.albums[`${itemId}`]?.title ?? "";
    case "artist":
      return artistsStore.artists[`${itemId}`]?.name ?? "";
    case "track":
      return tracksStore.tracks[`${itemId}`]?.title ?? "";
  }
  return "";
}

const mainPropName = computed(() => {
  switch (newPlaylist.value.playlist_type) {
    case "artist":
      return I18n.t("common.name");
    case "album":
    case "track":
      return I18n.t("music.title");
  }
  return "";
});

const playlistTypes = [
  {
    value: "track",
    title: I18n.t("music.playlist.playlist_types.track"),
  },
  {
    value: "album",
    title: I18n.t("music.playlist.playlist_types.album"),
  },
  {
    value: "artist",
    title: I18n.t("music.playlist.playlist_types.artist"),
  },
];
const accessOptions = [
  {
    value: "shared",
    title: I18n.t("music.playlist.access_options.shared"),
  },
  {
    value: "personal",
    title: I18n.t("music.playlist.access_options.personal"),
  },
  {
    value: "secret",
    title: I18n.t("music.playlist.access_options.secret"),
  },
];

onMounted(async () => {
  if (props.playlist) {
    await playlistsStore.read(props.playlist.id);
    fillValues();
  }
});

function fillValues(): void {
  if (!props.playlist) {
    return;
  }
  newPlaylist.value.name = props.playlist.name;
  newPlaylist.value.description = props.playlist.description ?? "";
  newPlaylist.value.access = props.playlist.access;
  newPlaylist.value.playlist_type = props.playlist.playlist_type;
  newPlaylist.value.item_ids = [...props.playlist.item_ids];
}

function removeItem(index: number): void {
  isDirty.value = true;
  itemsDirty.value = true;
  newPlaylist.value.item_ids.splice(index, 1);
}

async function submit(): Promise<void> {
  let pendingResult;
  if (props.playlist) {
    const toSubmit: Omit<typeof newPlaylist.value, "item_ids"> & {
      item_ids?: number[];
    } = { ...newPlaylist.value };
    if (!itemsDirty.value) {
      delete toSubmit.item_ids;
    }

    pendingResult = playlistsStore.update(props.playlist.id, toSubmit);
  } else {
    pendingResult = playlistsStore.create(newPlaylist.value);
  }
  const succeeded = await pendingResult;
  if (succeeded) {
    await router.push(
      (route.query.redirect as string | undefined) || { name: "playlists" },
    );
  }
}
</script>
