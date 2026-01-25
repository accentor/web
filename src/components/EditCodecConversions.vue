<template>
  <div v-if="isModerator">
    <CodecConversionForm
      v-for="c of codecConversions"
      :key="c.id"
      :codec-conversion="c"
    />
    <CodecConversionForm />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import CodecConversionForm from "./CodecConversionForm.vue";
import { useAuthStore } from "@/store/auth";
import { useCodecConversionsStore } from "@/store/codec_conversions";

const { isModerator } = storeToRefs(useAuthStore());
const { allCodecConversions: codecConversions } = storeToRefs(
  useCodecConversionsStore(),
);
</script>
