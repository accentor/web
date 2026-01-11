<template>
  <template v-if="isModerator">
    <VTooltip location="bottom" :disabled="!waitingForReload">
      <template #activator="{ props: tooltipProps }">
        <span v-bind="tooltipProps">
          <VBtn
            :to="{
              name: 'edit-label',
              params: { id: label.id },
              query: { redirect: $route.fullPath },
            }"
            :disabled="waitingForReload"
            color="warning"
            variant="text"
            icon
            size="small"
          >
            <VIcon size="x-large">mdi-pencil</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ $t("common.disabled-while-loading") }}</span>
    </VTooltip>
    <VTooltip location="bottom" :disabled="!waitingForReload">
      <template #activator="{ props: tooltipProps }">
        <span v-bind="tooltipProps">
          <LabelMergeDialog :label="label" :disabled="waitingForReload" />
        </span>
      </template>
      <span>{{ $t("common.disabled-while-loading") }}</span>
    </VTooltip>
    <VTooltip location="bottom" :disabled="!waitingForReload">
      <template #activator="{ props: tooltipProps }">
        <span v-bind="tooltipProps">
          <VBtn
            :disabled="waitingForReload"
            color="error"
            class="mr-0"
            href="#"
            variant="text"
            icon
            size="small"
            @click.stop.prevent="deleteLabel"
          >
            <VIcon size="x-large">mdi-delete</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ $t("common.disabled-while-loading") }}</span>
    </VTooltip>
  </template>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import LabelMergeDialog from "./LabelMergeDialog.vue";
import { useAuthStore } from "@/store/auth";
import { useLabelsStore } from "@/store/labels";
import type { Label } from "@accentor/api-client-js";
import { computed } from "vue";
import i18n from "@/i18n";

const labelsStore = useLabelsStore();
const props = defineProps<{ label: Label & { loaded: Date } }>();
const { isModerator } = storeToRefs(useAuthStore());

const waitingForReload = computed(
  () => labelsStore.startLoading > props.label.loaded,
);

async function deleteLabel(): Promise<void> {
  if (confirm(i18n.global.t("common.are-you-sure"))) {
    await labelsStore.destroy(props.label.id);
  }
}
</script>
