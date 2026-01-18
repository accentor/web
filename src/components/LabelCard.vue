<template>
  <VCard :to="{ name: 'label', params: { id: label.id } }">
    <VCardTitle class="pt-5">
      {{ label.name }}
    </VCardTitle>
    <VCardActions>
      <LabelActions :label="label" />
    </VCardActions>
  </VCard>
</template>

<script setup lang="ts">
import type { Label } from "@accentor/api-client-js";
import LabelActions from "./LabelActions.vue";

defineProps<{ label: Label & { loaded: Date } }>();
</script>
