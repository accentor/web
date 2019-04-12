<template>
  <div>
    <VToolbar app clipped-left dark color="primary">
      <VToolbarSideIcon @click.stop="drawer = !drawer" />
      <VToolbarTitle>Accentor</VToolbarTitle>
      <VSpacer />
      <VBtn flat @click="logout">Logout</VBtn>
    </VToolbar>
    <VAlert :value="Object.keys(error).length > 0" color="error">
      <div v-for="(value, key) in error" :key="key">
        <strong>{{ key | capitalize }}:</strong>
        {{ value }}
      </div>
    </VAlert>

    <VNavigationDrawer v-model="drawer" left clipped app>
      <VList>
        <VListTile :to="{ name: 'home' }">
          <VListTileAction>
            <VIcon>fas fa-home</VIcon>
          </VListTileAction>
          <VListTileContent>
            <VListTileTitle>Home</VListTileTitle>
          </VListTileContent>
        </VListTile>
      </VList>
    </VNavigationDrawer>

    <VContent>
      <router-view />
    </VContent>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      drawer: null,
      error: {}
    };
  },
  methods: {
    logout: function() {
      this.$store
        .dispatch("logout")
        .then(() => {
          this.$router.push({ path: "/login" });
        })
        .catch(error => {
          this.error = error.error;
        });
    }
  }
};
</script>
