<template>
  <VForm>
    <VLayout row>
      <VFlex xs5>
        <VTextField
          v-model="newLocation.path"
          label="Path"
          :disabled="location !== null"
        />
      </VFlex>
      <VFlex xs1>
        <VBtn icon outline color="green" @click="saveLocation" v-if="!location">
          <VIcon color="green">mdi-plus</VIcon>
        </VBtn>
        <VBtn icon outline v-if="location" color="red" @click="deleteLocation">
          <VIcon color="red">mdi-delete</VIcon>
        </VBtn>
      </VFlex>
    </VLayout>
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
      if (confirm("Are you sure?")) {
        this.destroy(this.location.id);
      }
    }
  }
};
</script>
