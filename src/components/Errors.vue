<template>
  <VAlert
    :model-value="errors.length > 0"
    closable
    type="error"
    @update:model-value="clearErrors"
  >
    <div v-for="(error, index) in errors" :key="index">
      <div v-for="(value, key) in error" :key="key">
        <div v-for="(e, innerIndex) in value" :key="innerIndex">
          <strong>{{ $t(`errors.${key}`) }}:</strong>
          {{ $t(`errors.${e}`) }}
        </div>
      </div>
    </div>
  </VAlert>
</template>
<script>
// @ts-nocheck
import { useErrorsStore } from "../store/errors";
import { mapState, mapActions } from "pinia";

export default {
  name: "Errors",
  computed: {
    ...mapState(useErrorsStore, ["errors"]),
  },
  methods: {
    ...mapActions(useErrorsStore, ["clearErrors"]),
  },
};
</script>
