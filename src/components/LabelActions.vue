<template>
  <template v-if="isModerator">
    <VTooltip location="bottom" :disabled="!waitingForReload">
      <template #activator="{ props }">
        <span v-bind="props">
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
      <template #activator="{ props }">
        <span v-bind="props">
          <LabelMergeDialog :label="label" :disabled="waitingForReload" />
        </span>
      </template>
      <span>{{ $t("common.disabled-while-loading") }}</span>
    </VTooltip>
    <VTooltip location="bottom" :disabled="!waitingForReload">
      <template #activator="{ props }">
        <span v-bind="props">
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

<script>
// @ts-nocheck
import { mapActions, mapState } from "pinia";
import LabelMergeDialog from "./LabelMergeDialog.vue";
import { useAuthStore } from "../store/auth";
import { useLabelsStore } from "../store/labels";

export default {
  name: "LabelActions",
  components: {
    LabelMergeDialog,
  },
  props: {
    label: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(useAuthStore, ["isModerator"]),
    ...mapState(useLabelsStore, ["startLoading"]),
    waitingForReload() {
      return this.startLoading > this.label.loaded;
    },
  },
  methods: {
    ...mapActions(useLabelsStore, ["destroy"]),
    deleteLabel: function () {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.label.id);
      }
    },
  },
};
</script>
