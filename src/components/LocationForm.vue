<template>
  <VForm ref="form" v-model="isValid">
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
          v-if="!location"
          :disabled="!isValid"
          icon
          variant="outlined"
          color="success"
          class="ma-2"
          @click="saveLocation"
        >
          <VIcon color="success">mdi-plus</VIcon>
        </VBtn>
        <VBtn
          v-if="location"
          icon
          variant="outlined"
          color="error"
          class="ma-2"
          @click="deleteLocation"
        >
          <VIcon color="error">mdi-delete</VIcon>
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>

<script>
// @ts-nocheck
import { mapActions, mapState } from "pinia";
import { useLocationsStore } from "../store/locations";

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
  computed: {
    ...mapState(useLocationsStore, { locations: "allLocations" }),
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
  watch: {
    album: function () {
      if (this.location) {
        this.fillValues();
      }
    },
  },
  created() {
    this.$nextTick(() => {
      if (this.location) {
        this.fillValues();
      }
    });
  },
  methods: {
    fillValues() {
      this.newLocation.path = this.location.path;
    },
    ...mapActions(useLocationsStore, ["destroy", "create"]),
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
