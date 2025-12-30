<template>
  <VDialog
    v-if="isModerator"
    ref="dialogMerge"
    v-model="mergeModal"
    width="600px"
  >
    <template #activator="{ props }">
      <VBtn
        :disabled="disabled"
        class="actions__button"
        color="warning"
        variant="text"
        icon
        size="small"
        v-bind="props"
        @click.stop.prevent
      >
        <VIcon>mdi-merge</VIcon>
      </VBtn>
    </template>
    <VCard>
      <VCardTitle>
        <span class="text-h5">{{
          $t("music.label.merge-into", { obj: label.name })
        }}</span>
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
                <template #item="{ item }">
                  {{ item.name }}
                  <span class="text-grey pl-2 ml-auto text-body-2">
                    {{ item.id }}
                  </span>
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

<script>
import { mapActions, mapState } from "pinia";
import { useAuthStore } from "../store/auth";
import { useLabelsStore } from "../store/labels";

export default {
  name: "LabelMergeDialog",
  props: {
    disabled: {
      type: Boolean,
      required: true,
    },
    label: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      mergeLabel: null,
      mergeModal: false,
    };
  },
  computed: {
    ...mapState(useAuthStore, ["isModerator"]),
    ...mapState(useLabelsStore, ["labelsByName"]),
    sortedLabels() {
      return this.labelsByName.filter((l) => {
        return l.id !== this.label.id;
      });
    },
  },
  methods: {
    ...mapActions(useLabelsStore, ["merge"]),
    filterName(item, queryText) {
      const search = queryText.toLowerCase();
      return (
        item.name.toLowerCase().indexOf(search) > -1 ||
        item.normalized_name.indexOf(search) > -1
      );
    },
    mergeLabels() {
      this.merge(this.mergeLabel.id, this.label.id).finally(() => {
        this.mergeModal = false;
      });
    },
  },
};
</script>
