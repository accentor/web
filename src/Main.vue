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
a {
  text-decoration: none;
}
</style>
