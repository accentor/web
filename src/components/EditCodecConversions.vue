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

<script>
// @ts-nocheck
import { mapState } from "pinia";
import CodecConversionForm from "./CodecConversionForm.vue";
import { useAuthStore } from "../store/auth";
import { useCodecConversionsStore } from "../store/codec_conversions";

export default {
  name: "EditCodecConversions",
  components: { CodecConversionForm },
  data() {
    return {};
  },
  computed: {
    ...mapState(useCodecConversionsStore, {
      codecConversions: "allCodecConversions",
    }),
    ...mapState(useAuthStore, ["isModerator"]),
  },
};
</script>
