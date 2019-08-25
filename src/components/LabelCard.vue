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
import LabelActions from "./LabelActions";

export default {
  name: "LabelCard",
  components: { LabelActions },
  props: {
    label: { type: Object }
  }
};
</script>
