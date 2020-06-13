<template>
  <VDialog
    ref="dialogMerge"
    v-model="mergeModal"
    v-if="isModerator"
    width="600px"
  >
    <template v-slot:activator="{ on }">
      <VBtn
        v-on="on"
        :disabled="disabled"
        @click.stop.prevent
        class="ma-2"
        color="edit"
        text
        icon
        small
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
                :items="sortedLabels"
                cache-items
                item-text="name"
                item-value="id"
                :label="$tc('music.labels', 1)"
                return-object
                v-model="mergeLabel"
              />
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
import { mapActions, mapGetters } from "vuex";

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
    ...mapGetters("auth", ["isModerator"]),
    sortedLabels() {
      const getter = this.$store.getters["labels/labelsByName"];
      return getter.filter((l) => {
        return l.id !== this.label.id;
      });
    },
  },
  methods: {
    ...mapActions("labels", ["merge"]),
    mergeLabels() {
      this.merge({ newID: this.mergeLabel.id, oldID: this.label.id }).finally(
        () => {
          this.mergeModal = false;
        }
      );
    },
  },
};
</script>
