<template>
  <VForm v-model="isValid" ref="form" lazy-validation>
    <VRow>
      <VCol cols="5">
        <VTextField
          v-model="newLocation.path"
          :label="$t('library.path')"
          :disabled="location !== null"
          required
          :rules="rules.path"
        />
      </VCol>
      <VCol cols="2" sm="1">
        <VBtn
          :disabled="!isValid"
          icon
          outlined
          color="success"
          class="ma-2"
          @click="saveLocation"
          v-if="!location"
        >
          <VIcon color="success">mdi-plus</VIcon>
        </VBtn>
        <VBtn
          icon
          outlined
          v-if="location"
          color="danger"
          class="ma-2"
          @click="deleteLocation"
        >
          <VIcon color="danger">mdi-delete</VIcon>
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "LocationForm",
  props: { location: { default: null, type: Object } },
  data() {
    return {
      newLocation: {
        path: "",
      },
      isValid: true,
    };
  },
  created() {
    this.$nextTick(() => {
      if (this.location) {
        this.fillValues();
      }
    });
  },
  watch: {
    album: function () {
      if (this.location) {
        this.fillValues();
      }
    },
  },
  computed: {
    ...mapGetters("locations", ["locations"]),
    rules() {
      const rules = {
        path: [(v) => !!v || this.$t("errors.location.path-blank")],
      };
      if (this.location === null) {
        const pathTaken = (v) => {
          const double = this.locations.some((l) => l.path === v);
          return !double || this.$t("errors.location.path-taken");
        };
        rules.path.push(pathTaken);
      }

      return rules;
    },
  },
  methods: {
    fillValues() {
      this.newLocation.path = this.location.path;
    },
    ...mapActions("locations", ["destroy", "update", "create"]),
    async saveLocation() {
      if (this.$refs.form.validate()) {
        const id = await this.create(this.newLocation);
        if (id) {
          this.newLocation.path = "";
        }
      }
    },
    deleteLocation() {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.location.id);
      }
    },
  },
};
</script>
