<template>
  <div>
    <VToolbar app clipped-left color="primary" dark>
      <VToolbarSideIcon @click.stop="drawer = !drawer" />
      <VToolbarTitle>Accentor</VToolbarTitle>
      <VSpacer />
      <VBtn :disabled="loading" @click="loadData" flat icon>
        <VIcon>mdi-refresh {{ loading ? "mdi-spin" : "" }}</VIcon>
      </VBtn>
      <VBtn @click="logout" flat icon>
        <VIcon>mdi-logout-variant</VIcon>
      </VBtn>
    </VToolbar>

    <VNavigationDrawer :mobile-break-point="1500" app clipped left v-model="drawer">
      <VList>
        <VListTile :to="{ name: 'home' }" exact>
          <VListTileAction>
            <VIcon>mdi-home</VIcon>
          </VListTileAction>
          <VListTileContent>
            <VListTileTitle>Home</VListTileTitle>
          </VListTileContent>
        </VListTile>
        <VDivider />
        <VListTile :to="{ name: 'artists' }" exact>
          <VListTileAction>
            <VIcon>mdi-artist</VIcon>
          </VListTileAction>
          <VListTileContent>
            <VListTileTitle>Artists</VListTileTitle>
          </VListTileContent>
        </VListTile>
        <VListTile :to="{ name: 'albums' }" exact>
          <VListTileAction>
            <VIcon>mdi-album</VIcon>
          </VListTileAction>
          <VListTileContent>
            <VListTileTitle>Albums</VListTileTitle>
          </VListTileContent>
        </VListTile>
        <VListTile :to="{ name: 'tracks' }" exact>
          <VListTileAction>
            <VIcon>mdi-music</VIcon>
          </VListTileAction>
          <VListTileContent>
            <VListTileTitle>Tracks</VListTileTitle>
          </VListTileContent>
        </VListTile>
        <VListTile :to="{ name: 'rescan' }" exact v-if="isModerator">
          <VListTileAction>
            <VIcon>mdi-refresh</VIcon>
          </VListTileAction>
          <VListTileContent>
            <VListTileTitle>Rescan</VListTileTitle>
          </VListTileContent>
        </VListTile>
        <VDivider />
        <VListTile :to="{ name: 'users' }" exact>
          <VListTileAction>
            <VIcon>mdi-account-multiple</VIcon>
          </VListTileAction>
          <VListTileContent>
            <VListTileTitle>Users</VListTileTitle>
          </VListTileContent>
        </VListTile>
      </VList>
    </VNavigationDrawer>

    <VContent>
      <VContainer>
        <Errors />
        <VLayout row wrap>
          <VFlex xs12>
            <router-view />
          </VFlex>
        </VLayout>
      </VContainer>
    </VContent>

    <VFooter app color="white" inset fixed height="auto">
      <Player />
    </VFooter>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Errors from "../components/Errors";
import Player from "../components/Player";

export default {
  name: "app",
  components: { Errors, Player },
  data() {
    return {
      drawer: null,
      loading: false
    };
  },
  created() {
    this.loadData();
  },
  computed: {
    ...mapGetters("auth", ["isModerator"])
  },
  methods: {
    loadData() {
      this.loading = true;
      Promise.all([
        this.$store.dispatch("albums/index"),
        this.$store.dispatch("artists/index"),
        this.$store.dispatch("genres/index"),
        this.$store.dispatch("labels/index"),
        this.$store.dispatch("tracks/index"),
        this.$store.dispatch("users/index").then(() => {
          const promises = [];
          if (this.isModerator) {
            promises.push(this.$store.dispatch("rescan/show"));
          }
          return Promise.all(promises);
        }),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]).finally(() => {
        this.loading = false;
      });
    },
    logout: function() {
      this.$store.dispatch("auth/logout").then(() => {
        this.$router.push({ name: "login" });
      });
    }
  }
};
</script>
