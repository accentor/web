<template>
  <VContainer fluid grid-list-xl v-if="isModerator">
    <VLayout>
      <h2 class="headline">{{ $t("library.maintenance") }}</h2>
    </VLayout>
    <VLayout wrap>
      <MaintenanceActions />
    </VLayout>
    <VLayout>
      <h2 class="headline">{{ $t("library.rescan") }}</h2>
    </VLayout>
    <VLayout wrap v-if="rescan">
      <VBtn @click="start" color="success" class="ma-2">
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
          <h3 class="title">{{ $t("library.warnings") }}</h3>
        </div>
        <pre class="body-2">{{ rescan.warning_text }}</pre>
      </div>
      <div v-if="rescan.error_text">
        <div>
          <h3 class="title">{{ $t("library.errors") }}</h3>
        </div>
        <pre class="body-2">{{ rescan.error_text }}</pre>
      </div>
    </VLayout>
    <VLayout>
      <h2 class="headline">{{ $t("library.codecs") }}</h2>
    </VLayout>
    <VLayout>
      <VFlex xs12>
        <EditCodecs />
      </VFlex>
    </VLayout>
    <VLayout>
      <h2 class="headline">{{ $t("library.codec-conversions") }}</h2>
    </VLayout>
    <VLayout>
      <VFlex xs12>
        <EditCodecConversions />
      </VFlex>
    </VLayout>
    <VLayout>
      <h2 class="headline">{{ $t("library.cover-filenames") }}</h2>
    </VLayout>
    <VLayout>
      <VFlex xs12>
        <EditCoverFilenames />
      </VFlex>
    </VLayout>
    <VLayout>
      <h2 class="headline">
        {{ $t("library.image-types") }}
      </h2>
    </VLayout>
    <VLayout>
      <VFlex xs12>
        <EditImageTypes />
      </VFlex>
    </VLayout>
    <VLayout>
      <h2 class="headline">{{ $t("library.locations") }}</h2>
    </VLayout>
    <VLayout>
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
