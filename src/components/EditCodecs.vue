<template>
  <div v-if="isModerator">
    <CodecForm v-for="c of codecs" :key="c.id" :codec="c" />
    <CodecForm />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import CodecForm from "./CodecForm.vue";
import { useAuthStore } from "@/store/auth";
import { useCodecsStore } from "@/store/codecs";

const { isModerator } = storeToRefs(useAuthStore());
const { allCodecs: codecs } = storeToRefs(useCodecsStore());
</script>
