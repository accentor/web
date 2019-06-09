<template>
  <div v-if="isModerator">
    <LocationForm v-for="l of locations" :key="l.id" :location="l" />
    <LocationForm />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import LocationForm from "./LocationForm";

export default {
  name: "EditLocations",
  components: { LocationForm },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("locations", ["locations"]),
    ...mapGetters("auth", ["isModerator"])
  }
};
</script>
