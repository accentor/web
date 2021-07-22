<template>
  <VApp>
    <router-view />
  </VApp>
</template>

<script>
export default {
  name: "Main",
  metaInfo: {
    title: "Main",
    titleTemplate: "%s | Accentor",
  },
};
</script>

<style lang="scss">
@import "~vuetify/src/styles/styles.sass";

a {
  text-decoration: none;
}

.actions {
  .actions__button {
    margin: 4px 8px 4px 0;
  }
}
.actions--wide {
  .actions__button {
    margin: 8px 16px 8px 0;
  }
}

@media (min-width: map-get($grid-breakpoints, "sm")) {
  .actions--sm-wide {
    .actions__button {
      margin: 8px 16px 8px 0;
    }
  }
}
</style>
