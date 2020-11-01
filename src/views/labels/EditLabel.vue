<template>
  <VContainer class="fill-height" fluid v-if="label">
    <vue-headful
      :title="$t('page-titles.edit', { obj: label.name }) + ' | Accentor'"
    />
    <VRow no-gutters align="center" justify="center">
      <VCol md="4" sm="8" cols="12" @change.once="isDirty = true">
        <VForm v-model="isValid" @submit.prevent="submit">
          <VTextField
            :label="$t('common.name')"
            v-model="newLabel.name"
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
import { mapActions, mapState } from "vuex";

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
  async created() {
    await this.read(this.$route.params.id);
    this.fillValues();
  },
  watch: {
    label: function () {
      if (this.label && !this.isDirty) {
        this.fillValues();
      }
    },
  },
  computed: {
    ...mapState("labels", ["labels"]),
    label: function () {
      return this.labels[this.$route.params.id];
    },
  },
  methods: {
    ...mapActions("labels", ["read", "update"]),
    fillValues() {
      this.newLabel.name = this.label.name;
    },
    async submit() {
      const succeeded = await this.update({
        id: this.label.id,
        newLabel: this.newLabel,
      });
      if (succeeded) {
        this.$router.push(this.$route.query.redirect || { name: "labels" });
      }
    },
  },
};
</script>
