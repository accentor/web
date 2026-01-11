<template>
  <div v-if="isModerator">
    <LocationForm v-for="l of locations" :key="l.id" :location="l" />
    <LocationForm />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import LocationForm from "./LocationForm.vue";
import { useAuthStore } from "@/store/auth";
import { useLocationsStore } from "@/store/locations";

const { allLocations: locations } = storeToRefs(useLocationsStore());
const { isModerator } = storeToRefs(useAuthStore());
</script>
