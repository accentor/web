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

// Additional resets
a {
  text-decoration: none;
}

// Component styles with global scope
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

.button-group {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);

  &__button {
    margin: 0;
    border-radius: 0;
  }
}

// Additional utility classes
.white-space-nowrap {
  white-space: nowrap;
}

// Temporary fix until https://github.com/vuetifyjs/vuetify/issues/13678 is resolved
.v-data-footer {
  justify-content: flex-end;
}
</style>
