<template>
  <div>
    <VToolbar>
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
    <router-view />
  </div>
</template>

<script>
export default {
  data: function() {
    return {
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
