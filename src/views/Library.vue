<template>
  <VContainer v-if="isModerator" fluid>
    <VRow class="mb-2">
      <h2 class="text-h5">
        {{ $t("library.maintenance") }}
      </h2>
    </VRow>
    <VRow class="mb-4">
      <MaintenanceActions />
    </VRow>
    <VRow class="mb-2">
      <h2 class="text-h5">
        {{ $t("library.rescan") }}
      </h2>
    </VRow>
    <VRow v-if="combinedRescans" class="mb-2">
      <div class="button-group ma-2">
        <VBtn
          :disabled="rescans.length === 0 || rescanRunning"
          color="success"
          class="button-group__button"
          variant="flat"
          @click="startAll"
        >
          <VIcon start class="text-white">
            mdi-refresh
            {{ rescanRunning ? "mdi-spin" : "" }}
          </VIcon>
          {{ $t("library.start-scan") }}
        </VBtn>
        <VMenu
          v-if="rescans.length > 1"
          location="bottom left"
          :persistent="false"
        >
          <template #activator="{ props }">
            <VBtn
              color="success"
              variant="flat"
              v-bind="props"
              min-width="0"
              class="button-group__button px-2"
            >
              <VIcon class="text-white"> mdi-menu-down </VIcon>
            </VBtn>
          </template>
          <VList>
            <VListItem
              v-for="(rescan, index) in rescans"
              :key="index"
              @click="start(rescan.id)"
            >
              <VListItemTitle :disabled="rescan.running">
                Rescan {{ locations[rescan.location_id].path }}
              </VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>
      </div>
    </VRow>
    <VRow v-if="combinedRescans" class="flex-column mb-4">
      <div>
        <strong>{{ $t("library.finished-at") }}: </strong>
        {{
          rescanRunning
            ? $t("library.currently-running")
            : $d(new Date(combinedRescans.finished_at), "long")
        }}
      </div>
      <div>
        <strong>{{ $t("library.processed") }}: </strong>
        {{ combinedRescans.processed }}
      </div>
      <div v-if="combinedRescans.warning_text">
        <div>
          <h3 class="text-h6">
            {{ $t("library.warnings") }}
          </h3>
        </div>
        <pre class="text-body-2">{{ combinedRescans.warning_text }}</pre>
      </div>
      <div v-if="combinedRescans.error_text">
        <div>
          <h3 class="text-h6">
            {{ $t("library.errors") }}
          </h3>
        </div>
        <pre class="text-body-2">{{ combinedRescans.error_text }}</pre>
      </div>
      <div
        v-if="
          !rescanRunning &&
          !combinedRescans.error_text &&
          !combinedRescans.warning_text
        "
      >
        <h3 class="text-h6">
          {{ $t("library.no-errors-warnings") }}
        </h3>
      </div>
    </VRow>
    <VRow class="mb-2">
      <h2 class="text-h5">
        {{ $t("library.codecs") }}
      </h2>
    </VRow>
    <VRow>
      <VCol cols="12">
        <EditCodecs />
      </VCol>
    </VRow>
    <VRow class="mb-2">
      <h2 class="text-h5">
        {{ $t("library.codec-conversions") }}
      </h2>
    </VRow>
    <VRow>
      <VCol cols="12">
        <EditCodecConversions />
      </VCol>
    </VRow>
    <VRow class="mb-2">
      <h2 class="text-h5">
        {{ $t("library.cover-filenames") }}
      </h2>
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
      <h2 class="text-h5">
        {{ $t("library.locations") }}
      </h2>
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
import EditCodecs from "../components/EditCodecs.vue";
import EditCodecConversions from "../components/EditCodecConversions.vue";
import EditCoverFilenames from "../components/EditCoverFilenames.vue";
import EditImageTypes from "../components/EditImageTypes.vue";
import EditLocations from "../components/EditLocations.vue";
import MaintenanceActions from "../components/MaintenanceActions.vue";

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
  metaInfo() {
    return { title: this.$t("librarySettings") };
  },
  computed: {
    ...mapGetters("auth", ["isModerator"]),
    ...mapGetters("rescan", ["rescans"]),
    ...mapGetters("rescan", ["combinedRescans"]),
    ...mapState("locations", ["locations"]),
    ...mapState("rescan", ["lastClick"]),
    rescanRunning() {
      return this.combinedRescans.running ||
        this.lastClick > new Date(this.combinedRescans.finished_at)
        ? true
        : false;
    },
  },
  created() {
    this.loadData();
  },
  methods: {
    ...mapActions("rescan", ["start", "startAll"]),
    async loadData() {
      let pendingResults = [];
      if (this.isModerator) {
        pendingResults.push(this.$store.dispatch("rescan/index"));
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
