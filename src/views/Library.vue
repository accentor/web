<template>
  <VContainer fluid grid-list-xl v-if="isModerator">
    <VLayout row>
      <h2>Maintenance</h2>
    </VLayout>
    <VLayout row wrap>
      <MaintenanceActions />
    </VLayout>
    <VLayout row>
      <h2>Rescan</h2>
    </VLayout>
    <VLayout row wrap v-if="rescan">
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
    <VLayout row>
      <h2>Codecs</h2>
    </VLayout>
    <VLayout row>
      <VFlex xs12>
        <EditCodecs />
      </VFlex>
    </VLayout>
    <VLayout row>
      <h2>Codec conversions</h2>
    </VLayout>
    <VLayout row>
      <VFlex xs12>
        <EditCodecConversions />
      </VFlex>
    </VLayout>
    <VLayout row>
      <h2>Cover filenames</h2>
    </VLayout>
    <VLayout row>
      <VFlex xs12>
        <EditCoverFilenames />
      </VFlex>
    </VLayout>
    <VLayout row>
      <h2>Image types</h2>
    </VLayout>
    <VLayout row>
      <VFlex xs12>
        <EditImageTypes />
      </VFlex>
    </VLayout>
    <VLayout row>
      <h2>Locations</h2>
    </VLayout>
    <VLayout row>
      <VFlex xs12>
        <EditLocations />
      </VFlex>
    </VLayout>
  </VContainer>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import EditCodecs from "../components/EditCodecs";
import EditCodecConversions from "../components/EditCodecConversions";
import EditCoverFilenames from "../components/EditCoverFilenames";
import EditImageTypes from "../components/EditImageTypes";
import EditLocations from "../components/EditLocations";
import MaintenanceActions from "../components/MaintenanceActions";

export default {
  name: "Library",
  components: {
    EditCodecs,
    EditCodecConversions,
    EditCoverFilenames,
    EditImageTypes,
    EditLocations,
    MaintenanceActions
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
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
