<template>
  <VContainer fluid grid-list-xl v-if="isModerator">
    <VLayout row>
      <h2>{{ $t("library.maintenance") }}</h2>
    </VLayout>
    <VLayout row wrap>
      <MaintenanceActions />
    </VLayout>
    <VLayout row>
      <h2>{{ $t("library.rescan") }}</h2>
    </VLayout>
    <VLayout row wrap v-if="rescan">
      <VBtn @click="start" color="success">
        <VIcon left>mdi-refresh {{ rescan.running ? "mdi-spin" : "" }}</VIcon>
        {{ $t("library.start-scan") }}
      </VBtn>
    </VLayout>
    <VLayout column v-if="rescan">
      <div>
        <strong>{{ $t("library.processed") }}: </strong>
        {{ rescan.processed }}
      </div>
      <div v-if="rescan.warning_text">
        <div>
          <h3>{{ $t("library.warnings") }}</h3>
        </div>
        <pre>{{ rescan.warning_text }}</pre>
      </div>
      <div v-if="rescan.error_text">
        <div>
          <h3>{{ $t("library.errors") }}</h3>
        </div>
        <pre>{{ rescan.error_text }}</pre>
      </div>
    </VLayout>
    <VLayout row>
      <h2>{{ $t("library.codecs") }}</h2>
    </VLayout>
    <VLayout row>
      <VFlex xs12>
        <EditCodecs />
      </VFlex>
    </VLayout>
    <VLayout row>
      <h2>{{ $t("library.codec-conversions") }}</h2>
    </VLayout>
    <VLayout row>
      <VFlex xs12>
        <EditCodecConversions />
      </VFlex>
    </VLayout>
    <VLayout row>
      <h2>{{ $t("library.cover-filenames") }}</h2>
    </VLayout>
    <VLayout row>
      <VFlex xs12>
        <EditCoverFilenames />
      </VFlex>
    </VLayout>
    <VLayout row>
      <h2>
        {{ $t("library.image-types") }}
      </h2>
    </VLayout>
    <VLayout row>
      <VFlex xs12>
        <EditImageTypes />
      </VFlex>
    </VLayout>
    <VLayout row>
      <h2>{{ $t("library.locations") }}</h2>
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
