<template>
  <VCard :to="{ name: 'label', params: { id: label.id } }">
    <VCardTitle primary-title>
      <h3>{{ label.name }}</h3>
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
