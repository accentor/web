<template>
  <VContainer class="fill-height" fluid v-if="label">
    <vue-headful
      :title="$t('page-titles.edit', { obj: label.name }) + ' | Accentor'"
    />
    <VRow no-gutters align="center" justify="center">
      <VCol md="4" sm="8" cols="12">
        <VForm v-model="isValid" @submit.prevent="submit">
          <VTextField
            :label="$t('common.name')"
            v-model="newLabel.name"
            :rules="[(v) => !!v || $t('errors.label.name-blank')]"
            required
            aria-required="true"
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
      isValid: true,
    };
  },
  created() {
    this.$nextTick(() => {
      if (this.label) {
        this.fillValues();
      }
    });
  },
  watch: {
    label: function () {
      if (this.label) {
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
    ...mapActions("labels", ["update"]),
    fillValues() {
      this.newLabel.name = this.label.name;
    },
    submit() {
      this.update({ id: this.label.id, newLabel: this.newLabel }).then(
        (succeeded) => {
          if (succeeded) {
            this.$router.push(this.$route.query.redirect || { name: "labels" });
          }
        }
      );
    },
  },
};
</script>
