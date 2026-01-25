<template>
  <div>
    <VAppBar color="primary">
      <VAppBarNavIcon @click.stop="drawer = !drawer" />
      <VToolbarTitle class="font-weight-medium">Accentor</VToolbarTitle>
      <VSpacer />
      <VBtn :disabled="loading" variant="text" icon @click="loadData">
        <VIcon>mdi-refresh {{ loading ? "mdi-spin" : "" }}</VIcon>
      </VBtn>
      <VBtn variant="text" icon @click="logout">
        <VIcon>mdi-logout-variant</VIcon>
      </VBtn>
    </VAppBar>

    <VNavigationDrawer v-model="drawer" :mobile-breakpoint="1500" left>
      <VList>
        <VListItem prepend-icon="mdi-home" :to="{ name: 'home' }" exact>
          <VListItemTitle>
            {{ I18n.t("common.home") }}
          </VListItemTitle>
        </VListItem>
        <VDivider />
        <VListItem prepend-icon="mdi-account-music" :to="{ name: 'artists' }">
          <VListItemTitle>
            {{ I18n.t("music.artists", 2) }}
          </VListItemTitle>
        </VListItem>
        <VListItem prepend-icon="mdi-album" :to="{ name: 'albums' }">
          <VListItemTitle>
            {{ I18n.t("music.albums", 2) }}
          </VListItemTitle>
        </VListItem>
        <VListItem prepend-icon="mdi-music" :to="{ name: 'tracks' }">
          <VListItemTitle>
            {{ I18n.t("music.tracks", 2) }}
          </VListItemTitle>
        </VListItem>
        <VListItem prepend-icon="mdi-guitar-acoustic" :to="{ name: 'genres' }">
          <VListItemTitle>
            {{ I18n.t("music.genres", 2) }}
          </VListItemTitle>
        </VListItem>
        <VListItem prepend-icon="mdi-label" :to="{ name: 'labels' }">
          <VListItemTitle>
            {{ I18n.t("music.labels", 2) }}
          </VListItemTitle>
        </VListItem>
        <VListItem
          prepend-icon="mdi-playlist-music"
          :to="{ name: 'playlists' }"
        >
          <VListItemTitle>
            {{ I18n.t("music.playlists", 2) }}
          </VListItemTitle>
        </VListItem>
        <VListItem prepend-icon="mdi-chart-bar" :to="{ name: 'stats' }">
          <VListItemTitle>
            {{ I18n.t("common.stats", 2) }}
          </VListItemTitle>
        </VListItem>
        <VListItem
          v-if="isModerator"
          prepend-icon="mdi-tune"
          :to="{ name: 'library' }"
        >
          <VListItemTitle>
            {{ I18n.t("librarySettings") }}
          </VListItemTitle>
        </VListItem>
        <VDivider />
        <VListItem
          v-if="isModerator"
          prepend-icon="mdi-flag"
          :to="{ name: 'flags' }"
        >
          <VListItemTitle>
            {{ I18n.t("music.flags", 2) }}
          </VListItemTitle>

          <template v-if="numberOfFlaggedItems > 0" #append>
            <VListItemAction>
              <VBtn
                rounded
                size="x-small"
                color="primary"
                variant="outlined"
                class="text-caption font-weight-medium"
              >
                {{ numberOfFlaggedItems }}
              </VBtn>
            </VListItemAction>
          </template>
        </VListItem>
        <VListItem
          prepend-icon="mdi-account-multiple"
          :to="{ name: 'users' }"
          exact
        >
          <VListItemTitle>
            {{ I18n.t("users.users", 2) }}
          </VListItemTitle>
        </VListItem>
        <VListItem
          prepend-icon="mdi-cog"
          :to="{
            name: 'settings',
            query: { redirect: route.fullPath },
          }"
        >
          <VListItemTitle>
            {{ I18n.t("common.settings") }}
          </VListItemTitle>
        </VListItem>
      </VList>
    </VNavigationDrawer>

    <VMain>
      <VContainer>
        <Errors />
        <VRow no-gutters>
          <VCol cols="12">
            <router-view />
          </VCol>
        </VRow>
      </VContainer>
    </VMain>

    <VFooter app inset height="auto" class="pa-0">
      <Player />
    </VFooter>
  </div>
</template>

<script async setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useHead } from "@unhead/vue";
import { useAuthStore } from "@/store/auth";
import { useUsersStore } from "@/store/users";
import { useAuthTokensStore } from "@/store/auth_tokens";
import { useCodecConversionsStore } from "@/store/codec_conversions";
import Errors from "@/components/Errors.vue";
import Player from "@/components/Player.vue";
import { useUserSettingsStore } from "@/store/user_settings";
import { useRescansStore } from "@/store/rescan";
import { usePlaylistsStore } from "@/store/playlists";
import { useLabelsStore } from "@/store/labels";
import { useGenresStore } from "@/store/genres";
import { useArtistsStore } from "@/store/artists";
import { useAlbumsStore } from "@/store/albums";
import { useUtilityStore } from "@/store/utility";
import { useTracksStore } from "@/store/tracks";
import { usePlaysStore } from "@/store/plays";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const I18n = useI18n();
const route = useRoute();
const albumsStore = useAlbumsStore();
const artistsStore = useArtistsStore();
const authStore = useAuthStore();
const authTokensStore = useAuthTokensStore();
const codecConversionsStore = useCodecConversionsStore();
const genresStore = useGenresStore();
const labelsStore = useLabelsStore();
const playlistsStore = usePlaylistsStore();
const playsStore = usePlaysStore();
const tracksStore = useTracksStore();
const usersStore = useUsersStore();
const utilityStore = useUtilityStore();

const drawer = ref<boolean | null>(null);
const loading = ref(false);

useHead({ title: "Accentor" });

await utilityStore.allRestored;

const { isModerator } = storeToRefs(useAuthStore());
const { numberOfFlaggedItems } = storeToRefs(utilityStore);
const { finishedAt } = storeToRefs(useRescansStore());
const { locale } = storeToRefs(useUserSettingsStore());

watch(locale, () => (I18n.locale.value = locale.value));
watch(finishedAt, async (newValue, oldValue) => {
  if (
    !loading.value &&
    oldValue !== null &&
    oldValue.getTime() !== newValue!.getTime()
  ) {
    await loadData();
  }
});

void loadData();

async function loadData(): Promise<void> {
  loading.value = true;
  const pendingResults = [];
  pendingResults.push(authTokensStore.index());
  pendingResults.push(albumsStore.index());
  pendingResults.push(artistsStore.index());
  pendingResults.push(codecConversionsStore.index());
  pendingResults.push(genresStore.index());
  pendingResults.push(labelsStore.index());
  pendingResults.push(playlistsStore.index());
  pendingResults.push(playsStore.index());
  pendingResults.push(tracksStore.index());
  pendingResults.push(usersStore.index());
  try {
    await Promise.all(pendingResults);
  } finally {
    loading.value = false;
  }
}

async function logout(): Promise<void> {
  await authStore.logout();
}

const interval = setInterval(() => utilityStore.updateCurrentDay(), 60_000);
onBeforeUnmount(() => clearInterval(interval));
</script>
