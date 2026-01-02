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

<script>
// @ts-nocheck
import LabelActions from "./LabelActions.vue";

export default {
  name: "LabelCard",
  components: { LabelActions },
  props: {
    label: { type: Object, required: true },
  },
};
</script>
