<template>
  <VAlert
    :value="errors.length > 0"
    closable
    type="error"
    @update:model-value="clearErrors"
  >
    <div v-for="(error, index) in errors" :key="index">
      <div v-for="(value, key) in error" :key="key">
        <div v-for="(e, index) in value" :key="index">
          <strong>{{ $t(`errors.${key}`) }}:</strong>
          {{ $t(`errors.${e}`) }}
        </div>
      </div>
    </div>
  </VAlert>
</template>
<script>
import { mapMutations, mapState } from "vuex";

export default {
  name: "Errors",
  computed: {
    ...mapState(["errors"]),
  },
  methods: {
    ...mapMutations(["clearErrors"]),
  },
};
</script>
