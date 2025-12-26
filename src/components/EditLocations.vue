<template>
  <div v-if="isModerator">
    <LocationForm v-for="l of locations" :key="l.id" :location="l" />
    <LocationForm />
  </div>
</template>

<script>
import { mapState } from "pinia";
import LocationForm from "./LocationForm.vue";
import { useAuthStore } from "../store/auth";
import { useLocationsStore } from "../store/locations";

export default {
  name: "EditLocations",
  components: { LocationForm },
  data() {
    return {};
  },
  computed: {
    ...mapState(useLocationsStore, { locations: "allLocations" }),
    ...mapState(useAuthStore, ["isModerator"]),
  },
};
</script>
