<template>
  <VApp>
    <Suspense>
      <RouterView />
      <template #fallback>
        <VIcon>mdi-refresh mdi-spin</VIcon>
      </template>
    </Suspense>
  </VApp>
</template>

<script setup lang="ts">
import { useHead } from "@unhead/vue";

useHead({ title: "Main" });
</script>

<style lang="scss">
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

.list-none {
  list-style: none;
}
</style>
