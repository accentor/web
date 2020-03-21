<template>
  <VContainer fluid v-if="isModerator">
    <vue-headful :title="$t('library-settings') + ' | Accentor'" />
    <VRow>
      <h2 class="headline">{{ $t("library.maintenance") }}</h2>
    </VRow>
    <VRow>
      <MaintenanceActions />
    </VRow>
    <VRow>
      <h2 class="headline">{{ $t("library.rescan") }}</h2>
    </VRow>
    <VRow v-if="rescan">
      <VBtn @click="start" color="success" class="ma-2">
        <VIcon left
          >mdi-refresh
          {{ rescan.last_click > rescan.last_scan ? "mdi-spin" : "" }}</VIcon
        >
        {{ $t("library.start-scan") }}
      </VBtn>
    </VRow>
    <VRow class="flex-column" v-if="rescan">
      <div>
        <strong>{{ $t("library.last-scan") }}: </strong>
        {{ new Date(rescan.last_scan).toLocaleString() }}
      </div>
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
    </VRow>
    <VRow>
      <h2 class="headline">{{ $t("library.codecs") }}</h2>
    </VRow>
    <VRow>
      <VCol cols="12">
        <EditCodecs />
      </VCol>
    </VRow>
    <VRow>
      <h2 class="headline">{{ $t("library.codec-conversions") }}</h2>
    </VRow>
    <VRow>
      <VCol cols="12">
        <EditCodecConversions />
      </VCol>
    </VRow>
    <VRow>
      <h2 class="headline">{{ $t("library.cover-filenames") }}</h2>
    </VRow>
    <VRow>
      <VCol cols="12">
        <EditCoverFilenames />
      </VCol>
    </VRow>
    <VRow>
      <h2 class="headline">
        {{ $t("library.image-types") }}
      </h2>
    </VRow>
    <VRow>
      <VCol cols="12">
        <EditImageTypes />
      </VCol>
    </VRow>
    <VRow>
      <h2 class="headline">{{ $t("library.locations") }}</h2>
    </VRow>
    <VRow>
      <VCol cols="12">
        <EditLocations />
      </VCol>
    </VRow>
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
