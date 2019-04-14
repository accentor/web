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
          <strong>{{ key | capitalize }}:</strong>
          {{ e }}
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
    ...mapState(["errors"])
  },
  methods: {
    ...mapMutations(["clearErrors"])
  }
};
</script>
