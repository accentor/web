<template>
  <VApp>
    <router-view />
  </VApp>
</template>

<script>
// @ts-nocheck
export default {
  name: "Root",
  head() {
    return { title: "Main" };
  },
};
</script>

<style lang="scss">
@use "sass:map";
@use "vuetify/settings";

// Additional resets
a {
  text-decoration: none;
  color: rgb(var(--v-theme-primary));
}

// Additional utility classes
.break-word {
  word-break: break-word;
}

.no-break-word {
  word-break: keep-all;
}

.white-space-nowrap {
  white-space: nowrap;
}
</style>
