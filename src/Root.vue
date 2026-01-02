<template>
  <VApp>
    <router-view />
  </VApp>
</template>

<script>
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

// Component styles with global scope
.actions {
  .actions__button {
    margin: 4px 8px 4px 0;
  }
}

.button-group {
  border-radius: 4px;
  overflow: hidden;
  box-shadow:
    0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14),
    0px 1px 10px 0px rgba(0, 0, 0, 0.12);

  &__button {
    margin: 0;
    border-radius: 0;
  }
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
