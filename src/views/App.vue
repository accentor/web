<template>
  <div>
    <vue-headful title="Accentor" />
    <VAppBar app clipped-left color="primary" dark>
      <VAppBarNavIcon @click.stop="drawer = !drawer" />
      <VToolbarTitle>Accentor</VToolbarTitle>
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
              class="btn-caption"
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
import Errors from "../components/Errors";
import Player from "../components/Player";

export default {
  name: "app",
  components: { Errors, Player },
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
    finishedAt() {
      if (!this.loading) {
        this.loadData();
      }
    },
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapGetters(["numberOfFlaggedItems"]),
    ...mapGetters("rescan", ["finishedAt"]),
    ...mapState("userSettings", ["locale"]),
  },
  methods: {
    async loadData() {
      this.loading = true;
      const auth = this.$store.dispatch("auth/index");
      const albums = this.$store.dispatch("albums/index");
      const artists = this.$store.dispatch("artists/index");
      const genres = this.$store.dispatch("genres/index");
      const labels = this.$store.dispatch("labels/index");
      const tracks = this.$store.dispatch("tracks/index");
      const users = this.$store.dispatch("users/index");
      const promises = [auth, albums, artists, genres, labels, tracks, users];
      await users;
      if (this.isModerator) {
        promises.push(this.$store.dispatch("rescan/show"));
        promises.push(this.$store.dispatch("codecs/index"));
        promises.push(this.$store.dispatch("codecConversions/index"));
        promises.push(this.$store.dispatch("coverFilenames/index"));
        promises.push(this.$store.dispatch("imageTypes/index"));
        promises.push(this.$store.dispatch("locations/index"));
      }
      try {
        await Promise.all(promises);
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

<style lang="scss" scoped>
.btn-caption {
  font-size: 0.75rem;
}
.v-toolbar__title {
  font-weight: 500;
}
</style>
