<template>
  <VContainer v-if="isModerator" fluid>
    <VRow class="mb-2">
      <h2 class="text-h5">{{ $t("library.maintenance") }}</h2>
    </VRow>
    <VRow class="mb-4">
      <MaintenanceActions />
    </VRow>
    <VRow class="mb-2">
      <h2 class="text-h5">{{ $t("library.rescan") }}</h2>
    </VRow>
    <VRow v-if="combinedRescans" class="mb-2">
      <VBtnGroup density="compact">
        <VBtn
          :disabled="rescans.length === 0 || rescanRunning"
          color="success"
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
              class="px-2"
            >
              <VIcon class="text-white">mdi-menu-down</VIcon>
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
      </VBtnGroup>
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
          <h3 class="text-h6">{{ $t("library.warnings") }}</h3>
        </div>
        <pre class="text-body-2">{{ combinedRescans.warning_text }}</pre>
      </div>
      <div v-if="combinedRescans.error_text">
        <div>
          <h3 class="text-h6">{{ $t("library.errors") }}</h3>
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
        <h3 class="text-h6">{{ $t("library.no-errors-warnings") }}</h3>
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
// @ts-nocheck
import { mapState, mapActions } from "pinia";
import EditCodecs from "../components/EditCodecs.vue";
import EditCodecConversions from "../components/EditCodecConversions.vue";
import EditCoverFilenames from "../components/EditCoverFilenames.vue";
import EditImageTypes from "../components/EditImageTypes.vue";
import EditLocations from "../components/EditLocations.vue";
import MaintenanceActions from "../components/MaintenanceActions.vue";
import { useAuthStore } from "../store/auth";
import { useCodecConversionsStore } from "../store/codec_conversions";
import { useCodecsStore } from "../store/codecs";
import { useCoverFilenamesStore } from "../store/cover_filenames";
import { useImageTypesStore } from "../store/image_types";
import { useLocationsStore } from "../store/locations";
import { useRescansStore } from "../store/rescan";

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
  head() {
    return { title: this.$t("librarySettings") };
  },
  computed: {
    ...mapState(useAuthStore, ["isModerator"]),
    ...mapState(useRescansStore, {
      rescans: "allRescans",
      combinedRescans: "combinedRescans",
      lastClick: "lastClick",
    }),
    ...mapState(useLocationsStore, ["locations"]),
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
    ...mapActions(useCodecConversionsStore, {
      codecConversionsIndex: "index",
    }),
    ...mapActions(useCodecsStore, { codecsIndex: "index" }),
    ...mapActions(useCoverFilenamesStore, {
      coverFilenamesIndex: "index",
    }),
    ...mapActions(useImageTypesStore, { imageTypesIndex: "index" }),
    ...mapActions(useLocationsStore, { locationsIndex: "index" }),
    ...mapActions(useRescansStore, {
      rescansIndex: "index",
      start: "start",
      startAll: "startAll",
    }),
    async loadData() {
      const pendingResults = [];
      if (this.isModerator) {
        pendingResults.push(this.rescansIndex());
        pendingResults.push(this.codecsIndex());
        pendingResults.push(this.codecConversionsIndex());
        pendingResults.push(this.coverFilenamesIndex());
        pendingResults.push(this.imageTypesIndex());
        pendingResults.push(this.locationsIndex());
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
