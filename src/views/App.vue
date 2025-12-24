<template>
  <div>
    <VAppBar app clipped-left color="primary" dark>
      <VAppBarNavIcon @click.stop="drawer = !drawer" />
      <VToolbarTitle class="font-weight-medium">Accentor</VToolbarTitle>
      <VSpacer />
      <VBtn :disabled="loading" @click="loadData" text icon>
        <VIcon>mdi-refresh {{ loading ? "mdi-spin" : "" }}</VIcon>
      </VBtn>
      <VBtn @click="logout" text icon>
        <VIcon>mdi-logout-variant</VIcon>
      </VBtn>
    </VAppBar>

    <VNavigationDrawer
      :mobile-breakpoint="1500"
      app
      clipped
      left
      v-model="drawer"
    >
      <VList>
        <VListItem :to="{ name: 'home' }" exact>
          <VListItemAction>
            <VIcon>mdi-home</VIcon>
          </VListItemAction>
          <VListItemContent>
            <VListItemTitle>
              {{ $t("common.home") }}
            </VListItemTitle>
          </VListItemContent>
        </VListItem>
        <VDivider />
        <VListItem :to="{ name: 'artists' }">
          <VListItemAction>
            <VIcon>mdi-account-music</VIcon>
          </VListItemAction>
          <VListItemContent>
            <VListItemTitle>
              {{ $tc("music.artists", 2) }}
            </VListItemTitle>
          </VListItemContent>
        </VListItem>
        <VListItem :to="{ name: 'albums' }">
          <VListItemAction>
            <VIcon>mdi-album</VIcon>
          </VListItemAction>
          <VListItemContent>
            <VListItemTitle>
              {{ $tc("music.albums", 2) }}
            </VListItemTitle>
          </VListItemContent>
        </VListItem>
        <VListItem :to="{ name: 'tracks' }">
          <VListItemAction>
            <VIcon>mdi-music</VIcon>
          </VListItemAction>
          <VListItemContent>
            <VListItemTitle>
              {{ $tc("music.tracks", 2) }}
            </VListItemTitle>
          </VListItemContent>
        </VListItem>
        <VListItem :to="{ name: 'genres' }">
          <VListItemAction>
            <VIcon>mdi-guitar-acoustic</VIcon>
          </VListItemAction>
          <VListItemContent>
            <VListItemTitle>
              {{ $tc("music.genres", 2) }}
            </VListItemTitle>
          </VListItemContent>
        </VListItem>
        <VListItem :to="{ name: 'labels' }">
          <VListItemAction>
            <VIcon>mdi-label</VIcon>
          </VListItemAction>
          <VListItemContent>
            <VListItemTitle>
              {{ $tc("music.labels", 2) }}
            </VListItemTitle>
          </VListItemContent>
        </VListItem>
        <VListItem :to="{ name: 'playlists' }">
          <VListItemAction>
            <VIcon>mdi-playlist-music</VIcon>
          </VListItemAction>
          <VListItemContent>
            <VListItemTitle>
              {{ $tc("music.playlists", 2) }}
            </VListItemTitle>
          </VListItemContent>
        </VListItem>
        <VListItem :to="{ name: 'stats' }">
          <VListItemAction>
            <VIcon>mdi-chart-bar</VIcon>
          </VListItemAction>
          <VListItemContent>
            <VListItemTitle>
              {{ $tc("common.stats", 2) }}
            </VListItemTitle>
          </VListItemContent>
        </VListItem>
        <VListItem :to="{ name: 'library' }" v-if="isModerator">
          <VListItemAction>
            <VIcon>mdi-tune</VIcon>
          </VListItemAction>
          <VListItemContent>
            <VListItemTitle>
              {{ $t("library-settings") }}
            </VListItemTitle>
          </VListItemContent>
        </VListItem>
        <VDivider />
        <VListItem :to="{ name: 'flags' }" v-if="isModerator">
          <VListItemAction>
            <VIcon>mdi-flag</VIcon>
          </VListItemAction>
          <VListItemContent>
            <VListItemTitle>
              {{ $tc("music.flags", 2) }}
            </VListItemTitle>
          </VListItemContent>
          <VListItemAction v-if="numberOfFlaggedItems > 0">
            <VBtn
              rounded
              x-small
              dark
              color="primary"
              outlined
              class="text-caption font-weight-medium"
            >
              {{ numberOfFlaggedItems }}
            </VBtn>
          </VListItemAction>
        </VListItem>
        <VListItem :to="{ name: 'users' }" exact>
          <VListItemAction>
            <VIcon>mdi-account-multiple</VIcon>
          </VListItemAction>
          <VListItemContent>
            <VListItemTitle>
              {{ $tc("users.users", 2) }}
            </VListItemTitle>
          </VListItemContent>
        </VListItem>
        <VListItem
          :to="{
            name: 'settings',
            query: { redirect: $route.fullPath },
          }"
        >
          <VListItemAction>
            <VIcon>mdi-cog</VIcon>
          </VListItemAction>
          <VListItemContent>
            <VListItemTitle>
              {{ $t("common.settings") }}
            </VListItemTitle>
          </VListItemContent>
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

    <VFooter app color="white" inset fixed height="auto" class="pa-0">
      <Player />
    </VFooter>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { mapActions, mapState as mapPiniaState } from "pinia";
import { useAuthStore } from "@/store/auth";
import { useUsersStore } from "@/store/users";
import { useAuthTokensStore } from "@/store/auth_tokens";
import { useCodecConversionsStore } from "@/store/codec_conversions";
import Errors from "../components/Errors.vue";
import Player from "../components/Player.vue";

export default {
  name: "app",
  components: { Errors, Player },
  metaInfo: { title: "Accentor" },
  data() {
    return {
      drawer: null,
      loading: false,
    };
  },
  created() {
    this.loadData();
    this.$options.interval = setInterval(() => {
      this.$store.commit("updateCurrentDay");
    }, 60000);
  },
  beforeDestroy() {
    clearInterval(this.$options.interval);
  },
  watch: {
    locale() {
      this.$i18n.locale = this.locale;
    },
    finishedAt(newValue, oldValue) {
      if (
        !this.loading &&
        oldValue !== null &&
        oldValue.getTime() !== newValue.getTime()
      ) {
        this.loadData();
      }
    },
  },
  computed: {
    ...mapPiniaState(useAuthStore, ["isModerator"]),
    ...mapGetters(["numberOfFlaggedItems"]),
    ...mapGetters("rescan", ["finishedAt"]),
    ...mapState("userSettings", ["locale"]),
  },
  methods: {
    ...mapActions(useAuthStore, ["logout"]),
    ...mapActions(useAuthTokensStore, { authTokensIndex: "index" }),
    ...mapActions(useUsersStore, { usersIndex: "index" }),
    ...mapActions(useCodecConversionsStore, { codecConversionsIndex: "index" }),
    async loadData() {
      this.loading = true;
      let pendingResults = [];
      pendingResults.push(this.authTokensIndex());
      pendingResults.push(this.$store.dispatch("albums/index"));
      pendingResults.push(this.$store.dispatch("artists/index"));
      pendingResults.push(this.codecConversionsIndex());
      pendingResults.push(this.$store.dispatch("genres/index"));
      pendingResults.push(this.$store.dispatch("labels/index"));
      pendingResults.push(this.$store.dispatch("playlists/index"));
      pendingResults.push(this.$store.dispatch("plays/index"));
      pendingResults.push(this.$store.dispatch("tracks/index"));
      pendingResults.push(this.usersIndex());
      try {
        await Promise.all(pendingResults);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
