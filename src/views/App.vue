<template>
  <div>
    <VToolbar app clipped-left dark color="primary">
      <VToolbarSideIcon @click.stop="drawer = !drawer" />
      <VToolbarTitle>Accentor</VToolbarTitle>
      <VSpacer />
      <VBtn icon flat @click="loadData" :disabled="loading">
        <VIcon>mdi-refresh {{ (loading && "mdi-spin") || "" }}</VIcon>
      </VBtn>
      <VBtn icon flat @click="logout">
        <VIcon>mdi-logout-variant</VIcon>
      </VBtn>
    </VToolbar>

    <VNavigationDrawer v-model="drawer" left clipped app>
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
  </div>
</template>

<script>
import Errors from "../components/Errors";

export default {
  name: "app",
  components: { Errors },
  data() {
    return {
      drawer: null,
      loading: false
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.loading = true;
      Promise.all([
        this.$store.dispatch("artists/index"),
        this.$store.dispatch("users/index"),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]).finally(() => {
        this.loading = false;
      });
    },
    logout: function() {
      this.$store.dispatch("auth/logout").then(() => {
        this.$router.push({ path: "/login" });
      });
    }
  }
};
</script>
