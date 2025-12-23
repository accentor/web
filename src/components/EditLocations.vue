<template>
  <div v-if="isModerator">
    <LocationForm v-for="l of locations" :key="l.id" :location="l" />
    <LocationForm />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import LocationForm from "./LocationForm.vue";
import { useAuthStore } from "../store/auth";
import { mapState } from "pinia";

export default {
  name: "EditLocations",
  components: { LocationForm },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("locations", ["locations"]),
    ...mapState(useAuthStore, ["isModerator"]),
  },
};
</script>
