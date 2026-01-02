<template>
  <VContainer v-if="label" class="fill-height" fluid>
    <VRow no-gutters align="center" justify="center">
      <VCol md="4" sm="8" cols="12" @change.once="isDirty = true">
        <VForm v-model="isValid" @submit.prevent="submit">
          <VTextField
            v-model="newLabel.name"
            :label="$t('common.name')"
            :rules="[(v) => !!v || $t('errors.label.name-blank')]"
            required
          />
          <VBtn :disabled="!isValid" color="primary" class="ma-2" type="submit">
            {{ $t("music.label.update") }}
          </VBtn>
        </VForm>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
// @ts-nocheck
import { useLabelsStore } from "../../store/labels";
import { mapActions, mapState } from "pinia";

export default {
  name: "EditLabel",
  data() {
    return {
      newLabel: {
        name: "",
      },
      isDirty: false,
      isValid: true,
    };
  },
  head() {
    return { title: this.$t("page-titles.edit", { obj: this.label.name }) };
  },
  computed: {
    ...mapState(useLabelsStore, ["labels"]),
    label: function () {
      return this.labels[this.$route.params.id];
    },
  },
  watch: {
    label: function () {
      if (this.label && !this.isDirty) {
        this.fillValues();
      }
    },
  },
  async created() {
    await this.read(this.$route.params.id);
    this.fillValues();
  },
  methods: {
    ...mapActions(useLabelsStore, ["read", "update"]),
    fillValues() {
      this.newLabel.name = this.label.name;
    },
    async submit() {
      const succeeded = await this.update(this.label.id, this.newLabel);
      if (succeeded) {
        this.$router.push(this.$route.query.redirect || { name: "labels" });
      }
    },
  },
};
</script>
