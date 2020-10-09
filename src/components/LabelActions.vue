<template>
  <span v-if="isModerator">
    <VTooltip bottom :disabled="!waitingForReload">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <VBtn
            :to="{
              name: 'edit-label',
              params: { id: label.id },
              query: { redirect: $route.fullPath },
            }"
            :disabled="waitingForReload"
            color="edit"
            class="ma-2"
            text
            icon
            small
          >
            <VIcon>mdi-pencil</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ $t("common.disabled-while-loading") }}</span>
    </VTooltip>
    <VTooltip bottom :disabled="!waitingForReload">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <LabelMergeDialog :label="label" :disabled="waitingForReload" />
        </span>
      </template>
      <span>{{ $t("common.disabled-while-loading") }}</span>
    </VTooltip>
    <VTooltip bottom :disabled="!waitingForReload">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <VBtn
            @click.stop.prevent="deleteLabel"
            :disabled="waitingForReload"
            color="danger"
            class="ma-2"
            href="#"
            text
            icon
            small
          >
            <VIcon>mdi-delete</VIcon>
          </VBtn>
        </span>
      </template>
      <span>{{ $t("common.disabled-while-loading") }}</span>
    </VTooltip>
  </span>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import LabelMergeDialog from "./LabelMergeDialog";

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
    ...mapGetters("auth", ["isModerator"]),
    ...mapState("labels", ["startLoading"]),
    waitingForReload() {
      return this.startLoading > this.label.loaded;
    },
  },
  methods: {
    ...mapActions("labels", ["destroy"]),
    deleteLabel: function () {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.label.id);
      }
    },
  },
};
</script>
