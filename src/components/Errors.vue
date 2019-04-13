<template>
  <VAlert
    dismissible
    :value="errors.length > 0"
    v-on:input="clearErrors"
    type="error"
  >
    <div v-for="(error, index) in errors" :key="index">
      <div v-for="(value, key) in error" :key="key">
        <div v-for="(e, index) in value" :key="index">
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
  },
  filters: {
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
};
</script>
