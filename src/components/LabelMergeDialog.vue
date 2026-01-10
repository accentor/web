<template>
  <VDialog
    v-if="isModerator"
    ref="dialogMerge"
    v-model="mergeModal"
    width="600px"
  >
    <template #activator="{ props: dialogProps }">
      <VBtn
        :disabled="disabled"
        color="warning"
        variant="text"
        icon
        size="small"
        v-bind="dialogProps"
        @click.stop.prevent
      >
        <VIcon size="x-large">mdi-merge</VIcon>
      </VBtn>
    </template>
    <VCard>
      <VCardTitle>
        <span class="text-h5">
          {{ $t("music.label.merge-into", { obj: label.name }) }}
        </span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol cols="12">
              <VCombobox
                v-model="mergeLabel"
                :items="sortedLabels"
                :custom-filter="filterName"
                item-title="name"
                item-value="id"
                :label="$tc('music.labels', 1)"
                return-object
              >
                <template #item="{ item, props: listItemProps }">
                  <VListItem v-bind="listItemProps">
                    <template #append>
                      <span class="text-grey pl-2 text-body-2">
                        {{ item.value }}
                      </span>
                    </template>
                  </VListItem>
                </template>
              </VCombobox>
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>
      <VDivider></VDivider>
      <VCardActions>
        <VSpacer></VSpacer>
        <VBtn color="primary" class="ma-2" type="submit" @click="mergeLabels">
          {{ $t("music.label.merge") }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "../store/auth";
import { useLabelsStore } from "../store/labels";
import type { Label } from "@accentor/api-client-js";
import { computed, ref } from "vue";
import type { InternalItem } from "vuetify/framework";

const labelsStore = useLabelsStore();
const props = defineProps<{ disabled: boolean; label: Label }>();
const mergeLabel = ref<Label | null>(null);
const mergeModal = ref(false);
const { isModerator } = storeToRefs(useAuthStore());

const sortedLabels = computed(() =>
  labelsStore.labelsByName.filter((l) => l.id !== props.label.id),
);

function filterName(
  _value: string,
  queryText: string,
  item?: InternalItem<Label>,
): boolean {
  if (!item) {
    return false;
  }
  const search = queryText.toLowerCase();
  return (
    item.raw.name.toLowerCase().indexOf(search) >= 0 ||
    item.raw.normalized_name.indexOf(search) >= 0
  );
}

async function mergeLabels(): Promise<void> {
  if (!mergeLabel.value) {
    return;
  }
  try {
    await labelsStore.merge(mergeLabel.value.id, props.label.id);
  } finally {
    mergeModal.value = false;
  }
}
</script>
