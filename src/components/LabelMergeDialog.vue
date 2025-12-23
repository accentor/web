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
        class="actions__button"
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
                :filter="filterName"
                cache-items
                item-text="name"
                item-value="id"
                :label="$tc('music.labels', 1)"
                return-object
                v-model="mergeLabel"
              >
                <template v-slot:item="{ item }">
                  {{ item.name }}
                  <span class="grey--text pl-2 ml-auto text-body-2">
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
import { mapActions } from "vuex";
import { mapState } from "pinia";
import { useAuthStore } from "../store/auth";

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
    sortedLabels() {
      const getter = this.$store.getters["labels/labelsByName"];
      return getter.filter((l) => {
        return l.id !== this.label.id;
      });
    },
  },
  methods: {
    ...mapActions("labels", ["merge"]),
    filterName(item, queryText) {
      const search = queryText.toLowerCase();
      return (
        item.name.toLowerCase().indexOf(search) > -1 ||
        item.normalized_name.indexOf(search) > -1
      );
    },
    mergeLabels() {
      this.merge({ newID: this.mergeLabel.id, oldID: this.label.id }).finally(
        () => {
          this.mergeModal = false;
        },
      );
    },
  },
};
</script>
