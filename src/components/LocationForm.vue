<template>
  <VForm>
    <VRow>
      <VCol cols="5">
        <VTextField
          v-model="newLocation.path"
          :label="$t('library.path')"
          :disabled="location !== null"
        />
      </VCol>
      <VCol cols="2" sm="1">
        <VBtn
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
import { mapActions } from "vuex";

export default {
  name: "LocationForm",
  props: { location: { default: null, type: Object } },
  data() {
    return {
      newLocation: {
        path: ""
      }
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
    album: function() {
      if (this.location) {
        this.fillValues();
      }
    }
  },
  methods: {
    fillValues() {
      this.newLocation.path = this.location.path;
    },
    ...mapActions("locations", ["destroy", "update", "create"]),
    saveLocation() {
      this.create(this.newLocation).then(id => {
        if (id) {
          this.newLocation.path = "";
        }
      });
    },
    deleteLocation() {
      if (confirm(this.$t("common.are-you-sure"))) {
        this.destroy(this.location.id);
      }
    }
  }
};
</script>
