<template>
  <div>
    <VToolbar>
      <VToolbarTitle>Accentor</VToolbarTitle>
      <VSpacer />
      <VBtn flat @click="logout">Logout</VBtn>
    </VToolbar>
    <router-view />
  </div>
</template>

<script>
export default {
  methods: {
    logout: function() {
      this.$store.commit("logout");
      this.$router.push({ path: "/login" });
    }
  }
};
</script>
