<template>
  <VContainer fluid v-if="isModerator">
    <vue-headful :title="$t('library-settings') + ' | Accentor'" />
    <VRow class="mb-2">
      <h2 class="text-h5">{{ $t("library.maintenance") }}</h2>
    </VRow>
    <VRow class="mb-4">
      <MaintenanceActions />
    </VRow>
    <VRow class="mb-2">
      <h2 class="text-h5">{{ $t("library.rescan") }}</h2>
    </VRow>
    <VRow v-if="rescan" class="mb-2">
      <VBtn
        @click="start"
        :disabled="rescanRunning"
        color="success"
        class="ma-2"
      >
        <VIcon left>
          mdi-refresh
          {{ rescanRunning ? "mdi-spin" : "" }}
        </VIcon>
        {{ $t("library.start-scan") }}
      </VBtn>
    </VRow>
    <VRow class="flex-column mb-4" v-if="rescan">
      <div>
        <strong>{{ $t("library.finished-at") }}: </strong>
        {{
          rescanRunning
            ? $t("library.currently-running")
            : $d(new Date(rescan.finished_at), "long")
        }}
      </div>
      <div>
        <strong>{{ $t("library.processed") }}: </strong>
        {{ rescan.processed }}
      </div>
      <div v-if="rescan.warning_text">
        <div>
          <h3 class="title">{{ $t("library.warnings") }}</h3>
        </div>
        <pre class="text-body-2">{{ rescan.warning_text }}</pre>
      </div>
      <div v-if="rescan.error_text">
        <div>
          <h3 class="title">{{ $t("library.errors") }}</h3>
        </div>
        <pre class="text-body-2">{{ rescan.error_text }}</pre>
      </div>
    </VRow>
    <VRow class="mb-2">
      <h2 class="text-h5">{{ $t("library.codecs") }}</h2>
    </VRow>
    <VRow>
      <VCol cols="12">
        <EditCodecs />
      </VCol>
    </VRow>
    <VRow class="mb-2">
      <h2 class="text-h5">{{ $t("library.codec-conversions") }}</h2>
    </VRow>
    <VRow>
      <VCol cols="12">
        <EditCodecConversions />
      </VCol>
    </VRow>
    <VRow class="mb-2">
      <h2 class="text-h5">{{ $t("library.cover-filenames") }}</h2>
    </VRow>
    <VRow>
      <VCol cols="12">
        <EditCoverFilenames />
      </VCol>
    </VRow>
    <VRow class="mb-2">
      <h2 class="text-h5">
        {{ $t("library.image-types") }}
      </h2>
    </VRow>
    <VRow class="mb-2">
      <VCol cols="12">
        <EditImageTypes />
      </VCol>
    </VRow>
    <VRow class="mb-2">
      <h2 class="text-h5">{{ $t("library.locations") }}</h2>
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
    MaintenanceActions,
  },
  created() {
    this.loadData();
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapState("rescan", ["rescan"]),
    ...mapState("rescan", ["lastClick"]),
    rescanRunning() {
      return this.rescan.running ||
        this.lastClick > new Date(this.rescan.finished_at)
        ? true
        : false;
    },
  },
  methods: {
    ...mapActions("rescan", ["start"]),
    async loadData() {
      let pendingResults = [];
      if (this.isModerator) {
        pendingResults.push(this.$store.dispatch("rescan/show"));
        pendingResults.push(this.$store.dispatch("codecs/index"));
        pendingResults.push(this.$store.dispatch("codecConversions/index"));
        pendingResults.push(this.$store.dispatch("coverFilenames/index"));
        pendingResults.push(this.$store.dispatch("imageTypes/index"));
        pendingResults.push(this.$store.dispatch("locations/index"));
      }
      await Promise.all(pendingResults);
    },
  },
};
</script>

<style lang="scss" scoped>
pre {
  overflow-x: auto;
}
</style>
