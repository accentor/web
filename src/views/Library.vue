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
                Rescan {{ locations[rescan.location_id]?.path }}
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

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useHead } from "@unhead/vue";
import EditCodecs from "@/components/EditCodecs.vue";
import EditCodecConversions from "@/components/EditCodecConversions.vue";
import EditCoverFilenames from "@/components/EditCoverFilenames.vue";
import EditImageTypes from "@/components/EditImageTypes.vue";
import EditLocations from "@/components/EditLocations.vue";
import MaintenanceActions from "@/components/MaintenanceActions.vue";
import { useAuthStore } from "@/store/auth";
import { useCodecConversionsStore } from "@/store/codec_conversions";
import { useCodecsStore } from "@/store/codecs";
import { useCoverFilenamesStore } from "@/store/cover_filenames";
import { useImageTypesStore } from "@/store/image_types";
import { useLocationsStore } from "@/store/locations";
import { useRescansStore } from "@/store/rescan";
import i18n from "@/i18n";

useHead({ title: i18n.global.t("librarySettings") });

const codecsStore = useCodecsStore();
const codecConversionsStore = useCodecConversionsStore();
const coverFilenamesStore = useCoverFilenamesStore();
const imageTypesStore = useImageTypesStore();
const locationsStore = useLocationsStore();
const rescansStore = useRescansStore();

const { isModerator } = storeToRefs(useAuthStore());
const {
  allRescans: rescans,
  combinedRescans,
  lastClick,
} = storeToRefs(rescansStore);
const { locations } = storeToRefs(locationsStore);

const rescanRunning = computed(
  () =>
    combinedRescans.value.running ||
    lastClick.value > new Date(combinedRescans.value.finished_at),
);

async function loadData(): Promise<void> {
  const pendingResults = [];
  if (isModerator.value) {
    pendingResults.push(codecsStore.index());
    pendingResults.push(codecConversionsStore.index());
    pendingResults.push(coverFilenamesStore.index());
    pendingResults.push(imageTypesStore.index());
    pendingResults.push(locationsStore.index());
    pendingResults.push(rescansStore.index());
  }
  await Promise.all(pendingResults);
}

loadData();

async function start(id: number): Promise<void> {
  await rescansStore.start(id);
}

async function startAll(): Promise<void> {
  await rescansStore.startAll();
}
</script>

<style lang="scss" scoped>
pre {
  overflow-x: auto;
}
</style>
