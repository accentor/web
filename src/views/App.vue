<template>
  <div>
    <VAppBar color="primary">
      <VAppBarNavIcon @click.stop="drawer = !drawer" />
      <VToolbarTitle class="font-weight-medium"> Accentor </VToolbarTitle>
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
        <VListItem :to="{ name: 'home' }" exact>
          <VListItemAction>
            <VIcon>mdi-home</VIcon>
          </VListItemAction>

          <VListItemTitle>
            {{ $t("common.home") }}
          </VListItemTitle>
        </VListItem>
        <VDivider />
        <VListItem :to="{ name: 'artists' }">
          <VListItemAction>
            <VIcon>mdi-account-music</VIcon>
          </VListItemAction>

          <VListItemTitle>
            {{ $tc("music.artists", 2) }}
          </VListItemTitle>
        </VListItem>
        <VListItem :to="{ name: 'albums' }">
          <VListItemAction>
            <VIcon>mdi-album</VIcon>
          </VListItemAction>

          <VListItemTitle>
            {{ $tc("music.albums", 2) }}
          </VListItemTitle>
        </VListItem>
        <VListItem :to="{ name: 'tracks' }">
          <VListItemAction>
            <VIcon>mdi-music</VIcon>
          </VListItemAction>

          <VListItemTitle>
            {{ $tc("music.tracks", 2) }}
          </VListItemTitle>
        </VListItem>
        <VListItem :to="{ name: 'genres' }">
          <VListItemAction>
            <VIcon>mdi-guitar-acoustic</VIcon>
          </VListItemAction>

          <VListItemTitle>
            {{ $tc("music.genres", 2) }}
          </VListItemTitle>
        </VListItem>
        <VListItem :to="{ name: 'labels' }">
          <VListItemAction>
            <VIcon>mdi-label</VIcon>
          </VListItemAction>

          <VListItemTitle>
            {{ $tc("music.labels", 2) }}
          </VListItemTitle>
        </VListItem>
        <VListItem :to="{ name: 'playlists' }">
          <VListItemAction>
            <VIcon>mdi-playlist-music</VIcon>
          </VListItemAction>

          <VListItemTitle>
            {{ $tc("music.playlists", 2) }}
          </VListItemTitle>
        </VListItem>
        <VListItem :to="{ name: 'stats' }">
          <VListItemAction>
            <VIcon>mdi-chart-bar</VIcon>
          </VListItemAction>

          <VListItemTitle>
            {{ $tc("common.stats", 2) }}
          </VListItemTitle>
        </VListItem>
        <VListItem v-if="isModerator" :to="{ name: 'library' }">
          <VListItemAction>
            <VIcon>mdi-tune</VIcon>
          </VListItemAction>

          <VListItemTitle>
            {{ $t("library-settings") }}
          </VListItemTitle>
        </VListItem>
        <VDivider />
        <VListItem v-if="isModerator" :to="{ name: 'flags' }">
          <VListItemAction>
            <VIcon>mdi-flag</VIcon>
          </VListItemAction>

          <VListItemTitle>
            {{ $tc("music.flags", 2) }}
          </VListItemTitle>

          <VListItemAction v-if="numberOfFlaggedItems > 0">
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
        </VListItem>
        <VListItem :to="{ name: 'users' }" exact>
          <VListItemAction>
            <VIcon>mdi-account-multiple</VIcon>
          </VListItemAction>

          <VListItemTitle>
            {{ $tc("users.users", 2) }}
          </VListItemTitle>
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

          <VListItemTitle>
            {{ $t("common.settings") }}
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

    <VFooter app color="white" inset height="auto" class="pa-0">
      <Player />
    </VFooter>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Errors from "../components/Errors.vue";
import Player from "../components/Player.vue";

export default {
  name: "App",
  components: { Errors, Player },
  metaInfo: { title: "Accentor" },
  data() {
    return {
      drawer: null,
      loading: false,
    };
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapGetters(["numberOfFlaggedItems"]),
    ...mapGetters("rescan", ["finishedAt"]),
    ...mapState("userSettings", ["locale"]),
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
  created() {
    this.loadData();
    this.$options.interval = setInterval(() => {
      this.$store.commit("updateCurrentDay");
    }, 60000);
  },
  beforeUnmount() {
    clearInterval(this.$options.interval);
  },
  methods: {
    async loadData() {
      this.loading = true;
      let pendingResults = [];
      pendingResults.push(this.$store.dispatch("auth/index"));
      pendingResults.push(this.$store.dispatch("albums/index"));
      pendingResults.push(this.$store.dispatch("artists/index"));
      pendingResults.push(this.$store.dispatch("codecConversions/index"));
      pendingResults.push(this.$store.dispatch("genres/index"));
      pendingResults.push(this.$store.dispatch("labels/index"));
      pendingResults.push(this.$store.dispatch("playlists/index"));
      pendingResults.push(this.$store.dispatch("plays/index"));
      pendingResults.push(this.$store.dispatch("tracks/index"));
      pendingResults.push(this.$store.dispatch("users/index"));
      try {
        await Promise.all(pendingResults);
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      await this.$store.dispatch("auth/logout");
      this.$router.push({ name: "login" });
    },
  },
};
</script>
