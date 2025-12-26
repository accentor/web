<template>
  <VAlert
    :value="errors.length > 0"
    dismissible
    type="error"
    v-on:input="clearErrors"
  >
    <div :key="index" v-for="(error, index) in errors">
      <div :key="key" v-for="(value, key) in error">
        <div :key="index" v-for="(e, index) in value">
          <strong>{{ $t(`errors.${key}`) }}:</strong>
          {{ $t(`errors.${e}`) }}
        </div>
      </div>
    </div>
  </VAlert>
</template>
<script>
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
