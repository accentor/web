<template>
  <VContainer fluid grid-list-xl>
    <VLayout justify-end row wrap>
      <VBtn @click="start" color="success">
        <VIcon left>mdi-refresh {{ rescan.running ? "mdi-spin" : "" }}</VIcon>
        Start scan
      </VBtn>
    </VLayout>
    <VLayout column v-if="rescan">
      <div><strong>Processed: </strong> {{ rescan.processed }}</div>
      <div v-if="rescan.warning_text">
        <div><h3>Warnings</h3></div>
        <pre>{{ rescan.warning_text }}</pre>
      </div>
      <div v-if="rescan.error_text">
        <div><h3>Errors</h3></div>
        <pre>{{ rescan.error_text }}</pre>
      </div>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Rescan",
  computed: {
    ...mapState("rescan", ["rescan"])
  },
  methods: {
    ...mapActions("rescan", ["start"])
  }
};
</script>

<style scoped>
pre {
  overflow-x: auto;
}
</style>
